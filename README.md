# Midnight Counter dApp
![CI](https://github.com/yourusername/yourrepo/actions/workflows/ci.yml/badge.svg)
> A privacy-preserving counter application built on Midnight.

## Live Demo
[Live URL]

## Contract Address
| Network  | Address                          |
|----------|----------------------------------|
| Preprod  | [PASTE CONTRACT ADDRESS]         |

## What This Does
This application demonstrates a simple counter on the Midnight network where the user's inputs are kept private while updating a public state.

## Privacy Model
- PUBLIC: The current count value.
- PRIVATE: The user's identity and any secret inputs used during the transaction.
- PROVED without revealing: That the counter was incremented according to the rules of the circuit.

## Privacy Claim
An on-chain observer sees that the counter was incremented by an authorized transaction, but cannot see who incremented it or any private inputs used to generate the zero-knowledge proof.

## Tech Stack
- Frontend: React, Vite, TypeScript
- Smart Contract: Compact
- Tests: Jest

## Prerequisites
- Node.js v22
- Midnight Compact Compiler
- A compatible Midnight Wallet

## Setup & Run Locally
```bash
# Install dependencies
npm install

# Compile contracts
npm run compile

# Run local development server
npm run dev
```

## Run Tests
```bash
npm test
```

## CI/CD
The CI/CD pipeline runs on every push and pull request to the `main` branch. It sets up Node.js v22, installs dependencies, compiles the compact contract, and runs the full test suite to ensure that all circuit logic, state transitions, and privacy checks pass.

## Product Proposal
See PROPOSAL.md
