const hre = require("hardhat");

async function main() {
  const lendsContract = await hre.ethers.getContractFactory("Lends");
  const deployedContract = await lendsContract.deploy();

  await deployedContract.deployed();

  console.log("Lend contract deployed to:", deployedContract.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
