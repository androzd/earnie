// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "./../AbstractHobby.sol";

contract StepsCounter is AbstractHobby {
    constructor() ERC20("Steps Counter", "STP") AbstractHobby(1000){
    }

    function GetName() public returns (string memory) {
        return "Steps Counter";
    }

    function GetDescription() public returns (string memory) {
        return "Bonus for steps. Every 1000 steps equal to 1 token";
    }
}

