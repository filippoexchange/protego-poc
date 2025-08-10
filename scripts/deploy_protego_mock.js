// scripts/deploy_protego_mock.js
const fs = require("fs");
const path = require("path");
const hre = require("hardhat");

async function main() {
  const [deployer, attackerEOA] = await hre.ethers.getSigners();
  const attackerAddress = process.env.ATTACKER_EOA || attackerEOA.address;

  console.log("Deployer:", deployer.address);
  console.log("Attacker EOA:", attackerAddress);

  const MaliciousPause = await hre.ethers.getContractFactory("MaliciousPause", deployer);
  const pause = await MaliciousPause.deploy(attackerAddress);
  await pause.deployed();
  console.log("MaliciousPause:", pause.address);

  const ProtegoMock = await hre.ethers.getContractFactory("ProtegoMock", deployer);
  const protego = await ProtegoMock.deploy(pause.address);
  await protego.deployed();
  console.log("ProtegoMock:", protego.address);

  await (await pause.setProtego(protego.address)).wait();
  console.log("Linked pause -> protego");

  // Fondo il pause con 2 ETH per impatto economico visibile
  await (await deployer.sendTransaction({ to: pause.address, value: hre.ethers.utils.parseEther("2") })).wait();
  console.log("Funded pause with 2 ETH");

  const outDir = path.join(__dirname, "..", "logs");
  fs.mkdirSync(outDir, { recursive: true });
  const payload = {
    network: hre.network.name,
    deployer: deployer.address,
    attackerEOA: attackerAddress,
    maliciousPause: pause.address,
    protegoMock: protego.address,
    ts: new Date().toISOString(),
  };
  fs.writeFileSync(path.join(outDir, "addresses.json"), JSON.stringify(payload, null, 2));
  console.log("Saved logs/addresses.json");
}

main().catch((e) => { console.error(e); process.exitCode = 1; });