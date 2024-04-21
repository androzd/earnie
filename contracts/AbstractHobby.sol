// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "./HobbyInterface.sol";
import "./CPNToken.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

abstract contract AbstractHobby is Ownable, ERC20 {
    address private cpnAddress;
    uint256 private _totalSupply;
    uint256 private _rate;
    mapping (address => uint256) _totalActivities;

    constructor(uint256 rate_) Ownable(msg.sender) {
        _rate = rate_;
    }

    function decimals() public pure override returns (uint8) {
        return 0;
    }

    function GetRate() public returns (uint256) {
        return _rate;
    }

    function UpdateRate(uint256 value) public onlyOwner {
        _rate = value;
    }

    function UploadStatistics(address hobbyist, uint256 activity) public onlyOwner {
        _mint(hobbyist, activity);
        _totalActivities[hobbyist] += activity;
    }

    function ConvertTokens(uint256 amount) public {
        require(amount % this.GetRate() == 0, "Amount must be a multiple of set Rate");
        require(balanceOf(msg.sender) >= amount, "You must have more activity than you request");
        uint256 cpnAmount = amount / this.GetRate();

        _burn(msg.sender, amount);
        CPNToken(cpnAddress).mint(msg.sender, cpnAmount);
    }

//    function SendTokens(address to, uint256 value) public onlyOwner returns(bool) {
//        require(members[msg.sender].tokens >= value, "You must have enough token to transfer");
//        members[msg.sender].tokens -= value;
//        members[to].tokens += value;
//        return true;
//    }
//
//    function GetTokensCount(address hobbyist) public view returns (uint256) {
//        return members[hobbyist].tokens;
//    }

    function GetActivityCount(address hobbyist) public view returns (uint256) {
        return balanceOf(hobbyist);
    }

    function GetTotalActivityCount(address hobbyist) public view returns (uint256) {
        return _totalActivities[hobbyist];
    }

    function totalSupply() public override view returns (uint256) {
        return _totalSupply;
    }

//    function balanceOf(address account) public override view returns (uint256) {
//        return this.GetTokensCount(account);
//    }

//    function transfer(address to, uint256 value) public override {
//        _transfer(msg.sender, to, value);
//    }

    function setCPN(address address_) public onlyOwner {
        cpnAddress = address_;
    }
}

