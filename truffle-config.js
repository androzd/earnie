require('dotenv').config();
const HDWalletProvider = require("@truffle/hdwallet-provider")

module.exports = {
    networks: {
        development: {
            provider: () => new HDWalletProvider([process.env.EARNIE_PRIVATE_KEY_MAIN], "http://127.0.0.1:7545"),
            network_id: "1337",       // Any network (default: none)
        },
        sepolia: {
            provider: () => new HDWalletProvider([process.env.EARNIE_PRIVATE_KEY_MAIN], process.env.EARNIE_SEPOLIA_WEB3_ENDPOINT),
            network_id: 11155111, // Sepolia's id
            confirmations: 1, // # of confirmations to wait between deployments. (default: 0)
            timeoutBlocks: 200, // # of blocks before a deployment times out  (minimum/default: 50)
        },
    },

    mocha: {},

    compilers: {
        solc: {
            version: "0.8.20",
        }
    },
};