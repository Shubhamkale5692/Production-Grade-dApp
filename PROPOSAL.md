# Product Proposal

## What is the product, and who uses it?
The product is a **Confidential Bouncer (Gated Counter) System**. It allows organizations to host a public interaction (like incrementing a public tally or checking-in to an event) where users must prove they possess a private authorization key (password) to participate. It is used by DAOs, event organizers, or groups that want a verifiable tally of authorized interactions without publicly exposing the passwords or access keys.

## Why Midnight specifically?
Midnight is essential for this product because standard transparent blockchains execute all contract logic in public, meaning any password or secret key provided in a transaction would be permanently visible to all observers. By using Midnight's Zero-Knowledge (ZK) proofs, the user executes the password verification locally. The network only receives and verifies the mathematical proof, allowing the public counter to increment without ever exposing the private input.

## Data Model
| Data Point       | Type           | Disclosed To |
|------------------|----------------|--------------|
| Total Count      | Public ledger  | Everyone     |
| Secret Hash      | Public ledger  | Everyone     |
| Secret Password  | Private witness| No one       |

## Mainnet Feasibility
Yes, this is highly realistic to reach Mainnet by Level 6. The core logic relies on a basic state transition (incrementing a counter based on a verified hash comparison in a shielded transaction). This is perfectly aligned with the supported capabilities of the Compact compiler and the `@midnight-ntwrk/compact-runtime` SDK.
