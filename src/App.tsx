import React, { useState, useEffect } from 'react';
import './App.css';

// Type definitions for window.midnight
declare global {
  interface Window {
    midnight?: Record<string, any>;
  }
}

function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [count, setCount] = useState(0);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>('');

  const connectWallet = async () => {
    setError(null);
    try {
      if (!window.midnight) {
        throw new Error("No Midnight wallet extension found. Please install a compatible wallet like Lace.");
      }

      // Find the first available Midnight wallet
      const walletIds = Object.keys(window.midnight);
      if (walletIds.length === 0) {
        throw new Error("No Midnight wallets available in window.midnight.");
      }

      const walletId = walletIds[0];
      const wallet = window.midnight[walletId];
      
      // Attempt connection to the wallet
      const api = await wallet.connect(); // You can pass a network string if needed, e.g. 'preprod'
      console.log("Connected to wallet API:", api);
      
      try {
        // Try to fetch state/address if the API supports it
        const state = await api.state();
        if (state && state.address) {
          setWalletAddress(state.address);
        }
      } catch (e) {
        console.log("Could not fetch wallet state:", e);
      }
      
      setWalletConnected(true);
    } catch (err: any) {
      setError(err.message || "Failed to connect wallet.");
    }
  };

  const handleIncrement = async () => {
    if (!walletConnected) {
      setError("Please connect your wallet first.");
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      // Simulate proof generation and contract call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setCount(c => c + 1);
    } catch (err: any) {
      setError(err.message || "An error occurred during proof generation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-wrapper">
      {/* Navbar */}
      <nav className="navbar">
        <div className="brand">
          <div className="brand-logo">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
              <line x1="12" y1="22" x2="12" y2="15.5" />
              <polyline points="22 8.5 12 15.5 2 8.5" />
              <polyline points="2 15.5 12 8.5 22 15.5" />
              <line x1="12" y1="2" x2="12" y2="8.5" />
            </svg>
          </div>
          Midnight <span className="text-gradient">dApp</span>
        </div>
        
        <div className="nav-actions">
          {!walletConnected ? (
            <button className="btn btn-nav" onClick={connectWallet}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px', verticalAlign: 'text-bottom'}}>
                <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
                <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
                <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
              </svg>
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

      {/* Main Layout */}
      <main className="main-content">
        
        {/* Left Side: Hero Info */}
        <section className="hero-section">
          <div className="badge">Zero-Knowledge Enabled</div>
          <h1 className="hero-title">
            The Future of <br/>
            <span className="text-gradient">Data Privacy</span>
          </h1>
          <p className="hero-description">
            Experience next-generation smart contracts on the Midnight Network. Increment the public counter while keeping your transaction identity entirely private through zk-SNARKs.
          </p>
          
          <div className="feature-grid">
            <div className="feature-card">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <h4>Private Inputs</h4>
              <p>Your wallet data never touches the public ledger.</p>
            </div>
            <div className="feature-card">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <h4>Fast Finality</h4>
              <p>Experience rapid proof generation and on-chain verification.</p>
            </div>
          </div>
        </section>

        {/* Right Side: Interactive Dashboard */}
        <section className="dashboard-panel">
          
          {error && (
            <div className="error-alert">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          <div className="glass-card">
            <div className="counter-display">
              <div className="counter-value">{count}</div>
              <div className="counter-label">Public State Value</div>
            </div>
            
            <button 
              className="btn btn-primary"
              onClick={handleIncrement} 
              disabled={loading} 
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Generating ZK Proof...
                </>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                  Increment Counter Securely
                </>
              )}
            </button>

            <div className="privacy-box">
              <div className="privacy-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <div className="privacy-content">
                <h3>Shielded Execution</h3>
                <p>This transaction executes locally in your browser to generate a proof. The network only verifies the proof, ensuring absolute privacy.</p>
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}

export default App;
