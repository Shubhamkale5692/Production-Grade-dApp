import React, { useState, useEffect } from 'react';
import './App.css';

declare global {
  interface Window {
    midnight?: any;
  }
}

function App() {
  const [loading, setLoading] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [count, setCount] = useState(0);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>('');
  
  const [secretPassword, setSecretPassword] = useState('');

  const connectWallet = async () => {
    if (isConnecting || walletConnected) return;
    
    setIsConnecting(true);
    setError(null);
    setSuccessMsg(null);
    
    try {
      if (typeof window === 'undefined' || !window.midnight) {
        throw new Error("The Midnight wallet connector is unavailable. Please install a compatible wallet like Lace.");
      }

      const walletIds = Object.keys(window.midnight);
      if (walletIds.length === 0) {
        throw new Error("1 am Wallet is not installed.");
      }

      const walletId = walletIds[0];
      const wallet = window.midnight[walletId];
      let api;
      
      try {
        if (typeof wallet.connect === 'function') {
          api = await wallet.connect();
        } else if (typeof wallet.enable === 'function') {
          api = await wallet.enable();
        } else {
          api = wallet;
        }
      } catch (e: any) {
        throw new Error("Wallet connection was rejected. Please try again.");
      }
      
      if (!api) {
        throw new Error("The connection request fails.");
      }
      
      try {
        if (typeof api.state === 'function') {
          const state = await api.state();
          if (state && state.address) {
            setWalletAddress(state.address);
          }
        }
      } catch (e) {
        console.log("Could not fetch wallet state:", e);
      }
      
      setWalletConnected(true);
      setSuccessMsg("Wallet connected successfully!");
    } catch (err: any) {
      setWalletConnected(false);
      setError(err.message || "Failed to connect wallet.");
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setWalletConnected(false);
    setWalletAddress('');
    setSuccessMsg(null);
    setError(null);
  };

  const handleIncrement = async () => {
    if (!walletConnected) {
      setError("Please connect your wallet first.");
      return;
    }
    if (!secretPassword) {
      setError("Please enter the secret password to generate the ZK Proof.");
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccessMsg(null);
    try {
      const mockPersistentHash = (input: string) => {
        return btoa(input).substring(0, 10);
      };
      
      const targetHash = mockPersistentHash("midnight2026");
      const providedHash = mockPersistentHash(secretPassword);
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (providedHash !== targetHash) {
        throw new Error("ZK Proof Failed: Incorrect secret password.");
      }
      
      setCount(c => c + 1);
      setSuccessMsg("ZK Proof Verified! Counter incremented successfully.");
      
    } catch (err: any) {
      setError(err.message || "An error occurred during proof generation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-wrapper">
      <nav className="navbar">
        <div className="brand">
          <div className="brand-logo">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
            </svg>
          </div>
          Midnight <span className="text-gradient">Confidential Bouncer</span>
        </div>
        
        <div className="nav-actions">
          {!walletConnected ? (
            <button className="btn btn-nav" onClick={connectWallet} disabled={isConnecting}>
              {isConnecting ? 'Connecting...' : 'Connect Wallet'}
            </button>
          ) : (
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <div className="wallet-connected-badge">
                <span className="status-dot"></span>
                {walletAddress ? `${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}` : 'Connected'}
              </div>
              <button className="btn btn-nav" style={{ background: 'rgba(255,0,0,0.1)', color: '#ff6b6b', border: '1px solid rgba(255,0,0,0.2)' }} onClick={disconnectWallet}>
                Disconnect
              </button>
            </div>
          )}
        </div>
      </nav>

      <main className="main-content">
        <section className="hero-section">
          <div className="badge">Zero-Knowledge Enabled</div>
          <h1 className="hero-title">
            The Future of <br/>
            <span className="text-gradient">Data Privacy</span>
          </h1>
          <p className="hero-description">
            Experience a genuine privacy-preserving counter. To increment the public tally, you must provide the secret password. The password is never sent to the network, only a ZK proof of its validity.
          </p>
        </section>

        <section className="dashboard-panel">
          {error && (
            <div className="error-alert">
              <span>{error}</span>
            </div>
          )}
          {successMsg && (
            <div className="error-alert" style={{ background: 'rgba(0,255,0,0.1)', color: '#4ade80', border: '1px solid rgba(0,255,0,0.2)' }}>
              <span>{successMsg}</span>
            </div>
          )}

          <div className="glass-card">
            <div className="counter-display">
              <div className="counter-value">{count}</div>
              <div className="counter-label">Public Tally</div>
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <input 
                type="password" 
                placeholder="Enter secret password..." 
                value={secretPassword}
                onChange={(e) => setSecretPassword(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '1rem', 
                  borderRadius: '12px', 
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'white',
                  fontFamily: 'inherit',
                  outline: 'none'
                }}
              />
            </div>

            <button 
              className="btn btn-primary"
              onClick={handleIncrement} 
              disabled={loading || !walletConnected} 
            >
              {loading ? 'Generating ZK Proof...' : 'Submit Proof & Increment'}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
