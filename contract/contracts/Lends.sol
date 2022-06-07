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
        bool borrowerApproval;
        bool borrowerHasFunded;
        bool lenderApproval;
        bool started;
        uint256 borrowDur; // stored in days
        uint256 borrowFee;
        uint256 collateral;
        uint256 endDate;
        uint256 remainingStake; // tracks the stake that is stored in the contract
        uint256 remainingFee; // tracks the fee that is stored in the contract
    }

    event NewLend(address lender, address borrower, uint256 borrowDur);
    event LendStarted(uint256 id, address lender, address borrower, uint256 endDate);
    event FeeWithdraw(address claimant, uint256 amount);
    event StakeWithdraw(address claimant, uint256 amount);

    modifier lendAgreementExists(uint256 _lendId) {
        require(bytes(lends[_lendId]).length > 0, "Lend Agreement does not exist");
        _;
    }

    modifier lendAgreementParticipant(uint256 _lendId) {
        LendAgreement storage lend = lends[_lendId];
        bool isLender = lend.lender == msg.sender;
        bool isBorrower = lend.borrower == msg.sender;
        require((isLender) || (isBorrower), "You are not part of this Lend Agreement");
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
        emit NewLend(_lender, _borrower, _dur);
    }

    function approveLendAgreement(uint256 _lendId)
        public
        onlyWhenNotPaused
        lendAgreementExists(_lendId)
    {
        LendAgreement storage lend = lends[_lendId];

        if(lend.lender == msg.sender) {
            lend.lenderApproval = true;
        } else if(lend.borrower == msg.sender) {
            lend.borrowerApproval = true;
        }
    }

    function sendFunds(uint256 _lendId)
        public
        payable
        onlyWhenNotPaused
        lendAgreementExists(_lendId)
    {
        LendAgreement storage lend = lends[_lendId];
        require(lend.borrower == msg.sender, "You are not the borrower for this Lend Agreement");
        require(msg.value >= (lend.borrowFee + lend.collateral), "Not enough funds sent");

        lend.remainingFee = lend.borrowFee;
        lend.remainingStake = lend.collateral;
        lend.borrowerHasFunded = true;
        totalStaked += lend.collateral;
    }

    function startLend(uint256 _lendId)
        public
        onlyWhenNotPaused
        lendAgreementExists(_lendId)
    {
        LendAgreement storage lend = lends[_lendId];

        require(lend.lenderApproval, "Lender has not approved this Lend Agreement");
        require(lend.borrowerApproval, "Borrower has not approved this Lend Agreement");
        require(lend.borrowerHasFunded, "Borrower has not yet sent the agreed funds for this Lend Agreement");
        require(lend.lender == msg.sender, "Only the lender can start lending");

        lend.endDate = now + (lend.borrowDur * 1 days);
        lend.started = true;

        emit LendStarted(_lendId, lend.lender, lend.borrower, lend.endDate);
    }
    
    // Set up default functions for the contract
    receive() external payable {}
    fallback() external payable {}
}