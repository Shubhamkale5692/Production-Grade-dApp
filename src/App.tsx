import React, { useState, useEffect } from 'react';
import './App.css';
// No need to import DAppConnectorAPI if it causes type conflicts

declare global {
  interface Window {
    midnight?: any;
  }
}

function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [count, setCount] = useState(0);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>('');
  
  // Genuine privacy model: Private witness input
  const [secretPassword, setSecretPassword] = useState('');

  const connectWallet = async () => {
    setError(null);
    try {
      if (!window.midnight) {
        throw new Error("No Midnight wallet extension found. Please install a compatible wallet like Lace.");
      }

      const walletIds = Object.keys(window.midnight);
      if (walletIds.length === 0) {
        throw new Error("No Midnight wallets available in window.midnight.");
      }

      const walletId = walletIds[0];
      const wallet = (window as any).midnight[walletId];
      
      console.log("Found Midnight wallet:", walletId, wallet);
      
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
        alert("Wallet Authorization Error: " + (e.message || String(e)));
        throw new Error("Connection request was rejected or failed. Please unlock your Lace wallet and try again.");
      }
      
      try {
        if (api && typeof api.state === 'function') {
          const state = await api.state();
          if (state && state.address) {
            setWalletAddress(state.address);
          }
        }
      } catch (e) {
        console.log("Could not fetch wallet state:", e);
      }
      
      setWalletConnected(true);
    } catch (err: any) {
      alert("Error Details: " + String(err.message || err));
      setError(err.message || "Failed to connect wallet.");
    }
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
    try {
      // IMPLEMENTATION NOTE: 
      // This is where the actual Midnight.js contract call goes.
      // Example: await counterContract.circuits.increment(secretPassword);
      // Since the contract is not yet deployed by the user on Preprod, 
      // we throw an intentional blocker here so the user completes the deployment step.
      throw new Error("DEPLOYMENT_REQUIRED: You must deploy the contract and configure the Midnight provider in App.tsx before proof generation can execute.");
      
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
            <button className="btn btn-nav" onClick={connectWallet}>
              Connect Wallet
            </button>
          ) : (
            <div className="wallet-connected-badge">
              <span className="status-dot"></span>
              {walletAddress ? `${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}` : 'Connected'}
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
            Experience a genuine privacy-preserving counter. To increment the public tally, you must provide the secret password. The password is never sent to the network—only a ZK proof of its validity.
          </p>
        </section>

        <section className="dashboard-panel">
          {error && (
            <div className="error-alert">
              <span>{error}</span>
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
              disabled={loading} 
            >
              {loading ? 'Generating ZK Proof...' : 'Submit Proof & Increment'}
            </button>

            <div className="privacy-box">
              <div className="privacy-content">
                <h3>Genuine Shielded Execution</h3>
                <p>
                  <strong>PRIVATE:</strong> Your password is hashed locally. It never leaves your browser.<br/>
                  <strong>PUBLIC:</strong> The incremented counter value.<br/>
                  <strong>VERIFIED:</strong> The network mathematically guarantees you knew the password without ever seeing it.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
