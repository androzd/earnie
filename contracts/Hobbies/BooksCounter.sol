// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "./../AbstractHobby.sol";

contract BooksCounter is AbstractHobby {
    constructor() ERC20("Books Counter", "BKS") AbstractHobby(1){
    }

    function GetName() public returns (string memory) {
        return "Books Counter";
    }

    function GetDescription() public returns (string memory) {
        return "Bonus for reading books. Every finished book equal to 1 token";
    }
}

