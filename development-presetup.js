require('dotenv').config();
const {Web3} = require('web3');

if (process.env.EARNIE_NETWORK !== 'development') {
    return;
}

const web3 = new Web3(process.env.EARNIE_NETWORK === "sepolia" ? process.env.EARNIE_SEPOLIA_WEB3_ENDPOINT : 'http://127.0.0.1:7545');

web3.eth.wallet.add(process.env.EARNIE_PRIVATE_KEY_MAIN);
let OwnerAndClient1Wallet = web3.eth.wallet[0];

console.log("Client1 address", OwnerAndClient1Wallet.address);
async function prepare() {
    const accounts = await web3.eth.getAccounts();
    let coinbase = accounts[0];
    await web3.eth.sendTransaction({
        from: coinbase,
        to: OwnerAndClient1Wallet.address,
        value: web3.utils.toWei(1000, 'ether'),
        gas: '21000',
    });
}

prepare();