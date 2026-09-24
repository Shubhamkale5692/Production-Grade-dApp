# Product Proposal

## What is the product, and who uses it?
The product is a **Confidential Polling System**. It allows communities, DAOs, or organizations to create public polls where users can cast a vote without revealing their identity or their specific choice to the public. 

## Why Midnight specifically?
Midnight is essential for this product because standard transparent blockchains expose both the voter's address and the vote they cast. Midnight allows us to leverage Zero-Knowledge (ZK) proofs to increment a public counter (the poll tally) while keeping the user's wallet address and their specific voting input completely private.

## Data Model
| Data Point       | Type           | Disclosed To |
|------------------|----------------|--------------|
| Total Vote Count | Public ledger  | Everyone     |
| Voter Identity   | Private witness| No one       |
| Individual Vote  | Private witness| No one       |

## Mainnet Feasibility
Yes, this is highly realistic to reach Mainnet by Level 6. The core logic relies on a simple state transition (incrementing a counter based on a shielded transaction), which perfectly aligns with the current capabilities of the Compact compiler and the Midnight network.
