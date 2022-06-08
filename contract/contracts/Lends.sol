// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract Lends is Ownable, Pausable {
    uint256 public agreementCount;
    uint256 public totalStaked; // make private?
    mapping(uint256 => LendAgreement) public lends;

    struct LendAgreement {
        address lender;
        address borrower;
        bool borrowerHasFunded;
        bool lenderApproval;
        bool started;
        uint256 borrowDur; // stored in hours
        uint256 borrowFee;
        uint256 collateral;
        uint256 endDate;
        uint256 remainingStake; // tracks the stake that is stored in the contract
        uint256 remainingFee; // tracks the fee that is stored in the contract
    }

    event LendCreation(address lender, address borrower, uint256 borrowDur);
    event LendStarted(uint256 id, address lender, address borrower, uint256 endDate);
    event FeeWithdraw(address claimant, uint256 amount);
    event CollateralWithdraw(address claimant, uint256 amount);

    modifier lendAgreementExists(uint256 _lendId) {
        require(bytes(lends[_lendId]).length > 0, "Lend Agreement does not exist");
        _;
    }

    constructor() {
        agreementCount = 0;
        totalStaked = 0;
    }

    function createLendAgreement(
        address _lender,
        address _borrower,
        uint256 _dur,
        uint256 _fee,
        uint256 _collateral
    )
        public
        onlyWhenNotPaused
        returns (uint256 newLendId)
    {
        require(_lender != address(0), "Invalid lender address");
        require(_borrower != address(0), "Invalid borrower address");

        newLendId = ++agreementCount;
        LendAgreement storage lend = lends[newLendId];
        lend.lender = _lender;
        lend.borrower = _borrower;
        lend.borrowDur = _dur;
        lend.borrowFee = _fee;
        lend.collateral = _collateral;
        emit LendCreation(_lender, _borrower, _dur);
    }

    function setLendAgreementApproval(uint256 _lendId, bool _state)
        public
        onlyWhenNotPaused
        lendAgreementExists(_lendId)
    {
        LendAgreement storage lend = lends[_lendId];
        require(lend.lender == msg.sender, "Only the Lender can change approval of this lend agreement");
        lend.lenderApproval = _state;
    }

    function sendFunds(uint256 _lendId)
        public
        payable
        onlyWhenNotPaused
        lendAgreementExists(_lendId)
    {
        LendAgreement storage lend = lends[_lendId];
        require(lend.borrower == msg.sender, "You are not the Borrower for this Lend Agreement");
        require(msg.value >= (lend.borrowFee + lend.collateral), "Not enough funds sent");

        lend.remainingFee = lend.borrowFee;
        lend.remainingStake = lend.collateral;
        lend.borrowerHasFunded = true;
        totalStaked += lend.collateral;
    }

    function claimFee(uint256 _lendId, uint256 _claimVal)
        public
        view
        onlyWhenNotPaused
        lendAgreementExists(_lendId)
    {
        LendAgreement storage lend = lends[_lendId];
        require(lend.lender == msg.sender, "You are not the Lender for this Lend Agreement");
        require(block.timestamp > lend.endDate, "Borrow period has not yet ended");
        require(_claimVal <= lend.remainingFee, "Claim value too high");

        lend.remainingFee -= _claimVal;
        payable(msg.sender).transfer({value: _claimVal});
        emit FeeWithdraw(msg.sender, _claimVal);
    }

    function reclaimCollateral(uint256 _lendId)
        public
        onlyWhenNotPaused
        lendAgreementExists(_lendId)
    {
        LendAgreement storage lend = lends[_lendId];
        require(lend.borrower == msg.sender, "You are not the Borrower for this Lend Agreement");
        if(lend.started) {
            require(block.timestamp > lend.endDate, "Borrow period has not yet ended");
            // TODO: Confirm the item has been returned to the Lender, and no claim is being made on the stake
        }

        uint256 stake = lend.remainingStake;
        lend.remainingStake = 0;
        lend.borrowerHasFunded = false;
        totalStaked -= stake;
        // TODO: Sanity check the smart contract balance exceeds the value of 'totalStaked'?

        payable(msg.sender).transfer({value: stake});
        emit CollateralWithdraw(msg.sender, stake);
    }

    function startLend(uint256 _lendId)
        public
        onlyWhenNotPaused
        lendAgreementExists(_lendId)
    {
        LendAgreement storage lend = lends[_lendId];

        require(lend.lenderApproval, "Lender has not approved this Lend Agreement");
        require(lend.borrowerHasFunded, "Borrower has not sent the agreed funds for this Lend Agreement");
        require(lend.lender == msg.sender, "You are not the Lender for this Lend Agreement");

        lend.endDate = block.timestamp + (lend.borrowDur * 1 hours);
        lend.started = true;

        emit LendStarted(_lendId, lend.lender, lend.borrower, lend.endDate);
    }

    // Calculate how much of the borrower's fee can be claimed by the lender. This is based off how much of the borrow period is remaining, and
    // how much the lender has already claimed.
    //    function getFeeClaimable(uint256 _lendId)
    //        internal
    //        view
    //        onlyWhenNotPaused
    //        returns (uint256 claimable)
    //    {
    //        LendAgreement storage lend = lends[_lendId];
    //        uint256 current = block.timestamp;
    //        if(current < lend.endDate) {
    //            uint256 diffHrs = (lend.endDate - current) / 3600;
    //            uint256 portionPassed = ( (lend.borrowDur - diffHrs) / lend.borrowDur ) * 100; // %age of the agreed lend period that has passed
    //            uint256 totalClaimableVal = lend.borrowFee * (portionPassed / 100);
    //            uint256 requiredRemaining = lend.borrowFee - totalClaimableVal;
    //            if(lend.remainingFee > requiredRemaining) {
    //                claimable = lend.remainingFee - requiredRemaining;
    //            } else {
    //                claimable = 0;
    //            }
    //        } else {
    //            claimable = lend.remainingFee;
    //        }
    //    }

    // Set up default functions for the contract
    receive() external payable {}
    fallback() external payable {}
}