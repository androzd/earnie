# Prepare local env

## install brew (brew.sh)
```shell
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

## Install node, npm, geth (npm is installed with node)

```shell
brew install node geth
```

## Check node and npm installed
```shell
node -v
npm -v
```

## Install truffle and geth
```shell
npm i -g truffle
```
https://archive.trufflesuite.com/ganache/ - Ganache installation instructions (it's deprecated, and)

## Install metamask

> https://metamask.io - instructions here

## Install Visual Studio Code

> https://code.visualstudio.com - instructions here

## Plugins for visual studio code

> Press Shift + Cmd + X

> Name: solidity
>
> Id: JuanBlanco.solidity
>
> Description: Ethereum Solidity Language for Visual Studio Code
>
> Version: 0.0.174
>
> Publisher: Juan Blanco
>
> VS Marketplace Link: https://marketplace.visualstudio.com/items?itemName=JuanBlanco.solidity

> Name: Truffle for VS Code
>
> Id: trufflesuite-csi.truffle-vscode
>
> Description: Build, debug and deploy smart contracts on Ethereum and EVM-compatible blockchains.
>
> Version: 2.7.1
>
> Publisher: ConsenSys Software Inc.
>
> VS Marketplace Link: https://marketplace.visualstudio.com/items?itemName=trufflesuite-csi.truffle-vscode

> ✅ ✅ ✅ Installation finished


# Prepare to developing

## Create folder for developing
```shell
mkdir ~/MyDapp
cd ~/MyDapp
truffle init
```

## Write code

Open ~/MyDapp in visual studio code

Write code in contracts folder (for example MyContract.sol)

```solidity
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
contract MyContract {
    uint256 public number;

    function setNumber(uint256 _number) public {
        number = _number;
    }

    function getNumber() public view returns (uint256) {
        return number;
    }
}
```
Run 

```shell
truffle compile
```

If compilation finished with no errors create migration file:

```javascript
const MyContract = artifacts.require("MyContract");

module.exports = function (deployer) {
    deployer.deploy(MyContract);
}
```

Configure truffle-config.js as shown:

```javascript
module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 7545,            // Standard Ethereum port (default: none)
      network_id: "*",       // Any network (default: none)
    },
  },

  mocha: {
  },

  compilers: {
    solc: {
      version: "0.8.19",
    }
  },
};

```
Run ganache 

> Ganache-cli is too old, run GETH instead

Run dev environment

```shell
geth --dev --http --http.port 7545 --http.addr "127.0.0.1" --http.api personal,eth,net,web3,debug,personal --dev.period=0 --http.corsdomain "*"
```

Run migrate 

```shell
truffle migrate
```

Test contract

```shell
truffle console
```

In console:
> Run lines separately
```javascript
let instance = await MyContract.deployed();
await instance.setNumber(123);
let value = await instance.getNumber();
console.log(value.toString());
```

Setup metamask to work with geth.dev

Edit network list, and add 127.0.0.1:7545 to network
