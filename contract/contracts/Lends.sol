// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract Lends is Ownable, Pausable {
    uint256 public agreementCount;
    mapping(uint256 => LendAgreement) public lends;

    struct LendAgreement {
        address lender;
        address borrower;
        bool borrowerApproval;
        bool lenderApproval;
        bool started;
        uint256 borrowDur; // Stored in days
        uint256 borrowFee;
        uint256 collateral;
        uint256 endDate;
    }

    event NewLend(LendAgreement agreement);

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
        newLendId = ++agreementCount;
        LendAgreement storage lend = lends[newLendId];
        lend.lender = _lender;
        lend.borrower = _borrower;
        lend.borrowDur = _dur;
        lend.borrowFee = _fee;
        lend.collateral = _collateral;
    }

    function approveLendAgreement(uint256 _lendId)
        public
        onlyWhenNotPaused
        lendAgreementExists(_lendId)
    {
        LendAgreement storage lend = lends[_lendId];

        if(isLender) {
            lend.lenderApproval = true;
        } else if(isBorrower) {
            lend.borrowerApproval = true;
        }
    }

    function startLend(uint256 _lendId)
        public
        onlyWhenNotPaused
        lendAgreementExists(_lendId)
    {
        LendAgreement storage lend = lends[_lendId];

        require(lend.lenderApproval, "Lender has not approved this Lend Agreement");
        require(lend.borrowerApproval, "Borrower has not approved this Lend Agreement");
        require(lend.lender == msg.sender, "Only the lender can start lending");

        lend.endDate = now + (lend.borrowDur * 1 days);
        lend.started = true;
    }
}