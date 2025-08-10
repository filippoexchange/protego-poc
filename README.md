# 🛡️ MegaExploitVault - Immunefi Whitehat PoC

Demonstrates a reentrancy exploit on Arbitrum using Hardhat.# protego-poc

Protego – Logical Reentrancy Vulnerability PoC

This repository contains an advanced Proof-of-Concept demonstrating a Logical Reentrancy vulnerability in a simulated implementation of the Protego contract, identified within the Sky bug bounty scope.

The PoC exploits an external call before internal state updates, enabling a malicious contract to logically re-enter the vulnerable function and perform multiple privileged actions within a single transaction.

Key Features:

Fully functional Hardhat environment
Test contracts (ProtegoMock.sol, MaliciousPause.sol) replicating the vulnerability
Fully automated deploy and attack scripts
Demonstration of real impact (ETH drain to attacker)
Event logging and trace for post-execution verification
Repository Structure:

/contracts → Vulnerable and malicious contracts
/scripts → Deployment and exploit scripts
/logs → JSON output with deployed addresses
Quickstart:

npm install
npx hardhat compile

# Terminal 1
npx hardhat node

# Terminal 2
npm run deploy:mock
npm run attack
Expected Output:

pause.called() >= 2
Duplicate Drop events
Increased ETH balance in attacker wallet
Severity: Critical
Vulnerability Type: Logical Reentrancy
Impact: Unauthorized privileged function access + fund transfers




