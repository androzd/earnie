// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;
interface HobbyInterface {
    function GetName() external returns (string memory);
    function GetDescription() external returns (string memory);
}

interface HobbyErrors {
    error DelegationIsDisabled();
}

