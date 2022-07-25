const { expect } = require("chai");
const { ethers} = require("hardhat");

async function deployContract() {
  const lendsContract = await ethers.getContractFactory("Lends");
  const deployedContract = await lendsContract.deploy();
  await deployedContract.deployed();
  console.log("Lend contract deployed to:", deployedContract.address);
  return deployedContract;
}

async function getBalances(borrower, lender) {
  let borrowerBal = await ethers.provider.getBalance(borrower.address);
  borrowerBal = ethers.utils.formatEther(borrowerBal);
  console.log("Borrower address:", borrower.address, "\t Borrower balance:", borrowerBal);

  let lenderBal = await ethers.provider.getBalance(lender.address);
  lenderBal = ethers.utils.formatEther(lenderBal);
  console.log("Lender address:", lender.address, "\t Lender balance:", lenderBal);
  console.log();
}

async function createNewAgreement(from, to, dur, fee, collateral, contract, count) {
  let txn;
  await expect(txn = await contract.createLendAgreement(from, to, dur, fee, collateral)) // Create lend agreement for 48 hours between lender and borrower
    .to.emit(contract, "LendCreation")
    .withArgs(++count, from, to, dur);

  console.log("Lend Agreement", count, "was created!");
}

async function approveLendAgreement(lender, contract, id) {
  try {
    txn = await contract.connect(lender).setLendAgreementApproval(id, true);
  } catch(error){
    console.error("Could not call contract", error);
  }
  console.log("Lend Agreement", id, "was approved by the lender!");
}

async function fundLendAgreement(borrower, contract, id, val) {
  const value = {value: ethers.utils.parseEther(val.toString())};
  try {
    txn = await contract.connect(borrower).sendFunds(id, value);
  } catch(error){
    console.error("Could not call contract", error);
  }
  console.log("Lend Agreement", id, "was funded by the borrower!");
}

async function startLendAgreement(lender, contract, id) {
  try {
    txn = await contract.connect(lender).startLend(id);
  } catch(error){
    console.error("Could not start the lend agreement", error);
  }
  console.log("Lend Agreement", id, "has been started!");
}


async function getLendAgreementEndDate(contract, id) {
  txn = await contract.lends(id);
  const endDateString = txn.endDate?.toNumber();
  const endDate = new Date(endDateString*1000); // Solidity stores datetime as seconds since epoch, JS expects ms since
  console.log("Lend agreement", id, "ends at:", endDate.toLocaleString());
}

async function main() {
  console.log("Deploy contract and get accounts");
  // Deploy the contract
  const deployedContract = await deployContract();
  console.log("====================");

  const [owner, borrower, lender] = await ethers.getSigners();
  console.log("Initial account balances:");
  await getBalances(borrower, lender);

  let agreementCount = 0;

  // Create lend agreement for 48 hours between lender and borrower
  const fee = ethers.utils.parseEther('0.04');
  const collateral = ethers.utils.parseEther('0.1');
  await createNewAgreement(lender.address, borrower.address, 48, fee, collateral, deployedContract, agreementCount);

  // Set approval for the first lend agreement
  await approveLendAgreement(lender, deployedContract, 1);

  // Borrower sends the funds for the lend agreement
  await fundLendAgreement(borrower, deployedContract, 1, 0.14);

  console.log("\nNew account balances:");
  await getBalances(borrower, lender);

  // Start the lend agreement
  await startLendAgreement(lender, deployedContract, 1);

  // Get lend end date
  await getLendAgreementEndDate(deployedContract, 1);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
