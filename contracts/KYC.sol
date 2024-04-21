// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract KYC is Ownable {
    mapping(address => bool) public KycList;
    constructor() Ownable(msg.sender) {}

    function IsKYCPassed(address user) public view returns(bool) {
        return KycList[user] == true;
    }

    function AddKYC(address user) public onlyOwner {
        KycList[user] = true;
    }

    function RemoveKYC(address user) public onlyOwner {
        delete KycList[user];
    }
}