// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./KYC.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CPNToken is ERC20, Ownable {
    mapping(address => bool) public allowedContracts;
    address[] private enabledHobbyUploaders;
    address private kycContractAddress;

    constructor(address kycContractAddress_) ERC20("CPN Token", "CPN") Ownable(msg.sender){
        kycContractAddress = kycContractAddress_;
    }

    function decimals() public pure override returns (uint8) {
        return 0;
    }

    function addAllowedContract(address _contract) public onlyOwner {
        if (!allowedContracts[_contract]) {
            allowedContracts[_contract] = true;
            enabledHobbyUploaders.push(_contract);
        }
    }

    function removeAllowedContract(address _contract) public onlyOwner {
        if (allowedContracts[_contract]) {
            allowedContracts[_contract] = false;
            removeAddress(_contract);
        }
    }

    function removeAddress(address _contract) private {
        uint length = enabledHobbyUploaders.length;
        for (uint i = 0; i < length; i++) {
            if (enabledHobbyUploaders[i] == _contract) {
                enabledHobbyUploaders[i] = enabledHobbyUploaders[length - 1];
                enabledHobbyUploaders.pop();
                break;
            }
        }
    }

    function mint(address to, uint256 amount) external {
        require(allowedContracts[msg.sender], "Caller is not authorized");
        if (!KYC(kycContractAddress).IsKYCPassed(to)) { // because
            require(amount <= 5, "You must pass KYC to get more than 5 tokens");
        }
        /*
        TODO: think about mint limiting by
            - daily limits
        */
        _mint(to, amount);
    }

    function ListOfEnabledHobbyUploaders() public view returns (address[] memory) {
        return enabledHobbyUploaders;
    }
}
