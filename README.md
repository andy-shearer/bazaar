# Trustless Bazaar 🎪

## What is it? 🤔
The Trustless Bazaar is a platform that will allow two parties that are geographically close to one another (eg. living in the 
same town) to engage in trade with one another, without the need for a preexisting trusting relationship.

The initial vision for the platform is to make it easy to lend + borrow items within local communities. The Trustless Bazaar promotes
borrowing items locally rather than buying new items that aren't used regularly. ♻️

Users will connect their crypto wallet (non-crypto integration is later on the roadmap) and use the platform to search for an item that they want to borrow.
If the item they're looking for isn't listed on the platform, they can post a 'Request to Borrow' detailing the item they're looking for.

When they find someone on the platform that has the item they want to borrow, the two users agree on the borrow rate and the contingency value for the item.
The contingency value is staked by the borrower whilst they are borrowing the item, becoming claimable by the lender if the item is not returned or incurs any damage.

## Why 'Trustless' mean? 🤝
When we say blockchains are 'trustless', it means that there are mechanisms in place by which all parties in the system can reach a consensus on what
the canonical truth is.

The platform will be facilitated by smart contracts which run on a blockchain - executing set actions based on set conditions. The use of 'digital signatures' prove that
the two participants lending and borrowing on the platform have both agreed on the terms of the borrow (the borrow fee, borrow duration, and contingency value). The
immutability of smart contracts running on the blockchain ensures that the terms set out in the agreement are executed. 

The 'trustless' aspect of blockchain now makes it possible to reach this agreement without requiring a trusted intermediary.

If the user lending the item wants to be protected against an item that is not returned, they can set the *contingency value* to the value of the item that they are
lending. The contingency value is staked in the platform by the borrower before they can borrow the item - if the item isn't returned according to the terms of the agreement,
the lender can begin to claim the contingency value that was staked by the borrower (eventually claiming the entire contingency if the item is never returned).

## Design Notes ✏️

### Components
* Front-end
  * Account Management
    * Wallet based
    * Email based (*non-MVP?*)
  * Local search of lends, with intent to borrow
    * Search available lends
    * Request to borrow an item
  * Management of active lends / borrows
* Back-end
  * Lend Agreements
    * Staking
    * Claiming stakes
  * Dispute Resolution
  * Security
    * Label brand new accounts (both lenders and borrowers)
    * Label accounts operating across many areas (spoofed location)
  * Cross-platform interaction
    * How can those using cash accounts interact seamlessly with crypto accounts?

### Modules

* Borring & Lending “Borrow Bazaar”
* Trading Post
* Small scale services, eg:
  * Use of a printer
  * Sewing
  * Handyman bits such as painting
  * Computer support
