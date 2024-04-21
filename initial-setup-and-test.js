require('dotenv').config();
const {Web3} = require('web3');

const networkID = process.env.EARNIE_NETWORK === 'sepolia' ? "11155111" : "1337";
const web3 = new Web3(process.env.EARNIE_NETWORK === "sepolia" ? process.env.EARNIE_SEPOLIA_WEB3_ENDPOINT : 'http://127.0.0.1:7545');

const KycDATA = require('./build/contracts/KYC.json')
const StepsCounterDATA = require('./build/contracts/StepsCounter.json')
const BooksCounterDATA = require('./build/contracts/BooksCounter.json')
const CPNTokenDATA = require('./build/contracts/CPNToken.json')

web3.eth.wallet.add(process.env.EARNIE_PRIVATE_KEY_MAIN);
web3.eth.wallet.add(process.env.EARNIE_PRIVATE_KEY_N2);
web3.eth.wallet.add(process.env.EARNIE_PRIVATE_KEY_N3);
let OwnerAndClient1Wallet = web3.eth.wallet[0];
let Client2Wallet = web3.eth.wallet[1];
let Client3Wallet = web3.eth.wallet[2];

console.log("Client1 address", OwnerAndClient1Wallet.address);
console.log("Client2 address", Client2Wallet.address);
console.log("Client3 address", Client3Wallet.address);
async function prepare() {
    if (process.env.EARNIE_NETWORK === 'development') {
        const accounts = await web3.eth.getAccounts();
        let coinbase = accounts[0];
        const result = await web3.eth.sendTransaction({
            from: coinbase,
            to: OwnerAndClient1Wallet.address,
            value: web3.utils.toWei(1000, 'ether'),
            gas: '21000',
        });
    }
    console.log(OwnerAndClient1Wallet.address, 'balance is: ', web3.utils.fromWei(await web3.eth.getBalance(OwnerAndClient1Wallet.address), 'ether'));
    const KYCContract = new web3.eth.Contract(KycDATA.abi, KycDATA.networks[networkID].address);
    const StepsCounter = new web3.eth.Contract(StepsCounterDATA.abi, StepsCounterDATA.networks[networkID].address);
    const BooksCounter = new web3.eth.Contract(BooksCounterDATA.abi, BooksCounterDATA.networks[networkID].address);
    const CPNToken = new web3.eth.Contract(CPNTokenDATA.abi, CPNTokenDATA.networks[networkID].address);
    await KYCContract.methods.RemoveKYC(OwnerAndClient1Wallet.address).send({from: OwnerAndClient1Wallet.address});

    console.log('Contracts initialized');
    console.log();

    await CPNToken.methods.addAllowedContract(StepsCounterDATA.networks[networkID].address).send({from: OwnerAndClient1Wallet.address})
    await CPNToken.methods.addAllowedContract(BooksCounterDATA.networks[networkID].address).send({from: OwnerAndClient1Wallet.address})
    await StepsCounter.methods.setCPN(CPNTokenDATA.networks[networkID].address).send({from: OwnerAndClient1Wallet.address})
    await BooksCounter.methods.setCPN(CPNTokenDATA.networks[networkID].address).send({from: OwnerAndClient1Wallet.address})

    console.log('Contracts linked');
    console.log();

    await StepsCounter.methods.UploadStatistics(OwnerAndClient1Wallet.address, 1234567).send({from: OwnerAndClient1Wallet.address});
    await StepsCounter.methods.UploadStatistics(Client2Wallet.address,  1234567).send({from: OwnerAndClient1Wallet.address});
    await StepsCounter.methods.UploadStatistics(Client3Wallet.address, 1234567).send({from: OwnerAndClient1Wallet.address});
    await BooksCounter.methods.UploadStatistics(OwnerAndClient1Wallet.address, 20).send({from: OwnerAndClient1Wallet.address});
    await BooksCounter.methods.UploadStatistics(Client2Wallet.address,  20).send({from: OwnerAndClient1Wallet.address});
    await BooksCounter.methods.UploadStatistics(Client3Wallet.address, 2).send({from: OwnerAndClient1Wallet.address});

    console.log('Balances prepared');
    console.log();

    console.log("Client1 StepsCounter", await StepsCounter.methods.GetActivityCount(OwnerAndClient1Wallet.address).call());
    console.log("Client2 StepsCounter", await StepsCounter.methods.GetActivityCount(Client2Wallet.address).call());
    console.log("Client3 StepsCounter", await StepsCounter.methods.GetActivityCount(Client3Wallet.address).call());
    console.log("Client1 BooksCounter", await BooksCounter.methods.GetActivityCount(OwnerAndClient1Wallet.address).call());
    console.log("Client2 BooksCounter", await BooksCounter.methods.GetActivityCount(Client2Wallet.address).call());
    console.log("Client3 BooksCounter", await BooksCounter.methods.GetActivityCount(Client3Wallet.address).call());
    console.log("Client1 CPNToken", await CPNToken.methods.balanceOf(OwnerAndClient1Wallet.address).call());
    console.log("Client2 CPNToken", await CPNToken.methods.balanceOf(Client2Wallet.address).call());
    console.log("Client3 CPNToken", await CPNToken.methods.balanceOf(Client3Wallet.address).call());

    console.log();
    console.log('Pre transfer')
    console.log();


    try {
        await StepsCounter.methods.ConvertTokens(10000).send({from: OwnerAndClient1Wallet.address});
        console.log("🦆! KYC not passed, error must be thrown!");
    } catch {
        console.log("Tokens can't be converted (reason: KYC not passed). It's OK!");
    }

    console.log();

    try {
        await StepsCounter.methods.ConvertTokens(5000).send({from: OwnerAndClient1Wallet.address});
        console.log("Client1 StepsCounter", await StepsCounter.methods.GetActivityCount(OwnerAndClient1Wallet.address).call());
        console.log("Client2 StepsCounter", await StepsCounter.methods.GetActivityCount(Client2Wallet.address).call());
        console.log("Client3 StepsCounter", await StepsCounter.methods.GetActivityCount(Client3Wallet.address).call());
        console.log("Client1 BooksCounter", await BooksCounter.methods.GetActivityCount(OwnerAndClient1Wallet.address).call());
        console.log("Client2 BooksCounter", await BooksCounter.methods.GetActivityCount(Client2Wallet.address).call());
        console.log("Client3 BooksCounter", await BooksCounter.methods.GetActivityCount(Client3Wallet.address).call());
        console.log("Client1 CPNToken", await CPNToken.methods.balanceOf(OwnerAndClient1Wallet.address).call());
        console.log("Client2 CPNToken", await CPNToken.methods.balanceOf(Client2Wallet.address).call());
        console.log("Client3 CPNToken", await CPNToken.methods.balanceOf(Client3Wallet.address).call());
    } catch {
        console.log("🦆! All must be done fine. That's problem");
    }

    console.log();

    try {
        await KYCContract.methods.AddKYC(OwnerAndClient1Wallet.address).send({from: OwnerAndClient1Wallet.address});
        console.log("Client1 KYC PASSED:", (await KYCContract.methods.IsKYCPassed(OwnerAndClient1Wallet.address).call()) ? 'true': 'false');
        await StepsCounter.methods.ConvertTokens(10000).send({from: OwnerAndClient1Wallet.address});
        console.log("Client1 StepsCounter", await StepsCounter.methods.GetActivityCount(OwnerAndClient1Wallet.address).call());
        console.log("Client2 StepsCounter", await StepsCounter.methods.GetActivityCount(Client2Wallet.address).call());
        console.log("Client3 StepsCounter", await StepsCounter.methods.GetActivityCount(Client3Wallet.address).call());
        console.log("Client1 BooksCounter", await BooksCounter.methods.GetActivityCount(OwnerAndClient1Wallet.address).call());
        console.log("Client2 BooksCounter", await BooksCounter.methods.GetActivityCount(Client2Wallet.address).call());
        console.log("Client3 BooksCounter", await BooksCounter.methods.GetActivityCount(Client3Wallet.address).call());
        console.log("Client1 CPNToken", await CPNToken.methods.balanceOf(OwnerAndClient1Wallet.address).call());
        console.log("Client2 CPNToken", await CPNToken.methods.balanceOf(Client2Wallet.address).call());
        console.log("Client3 CPNToken", await CPNToken.methods.balanceOf(Client3Wallet.address).call());
    } catch {
        console.log("🦆! That's activity must be done fine. That's problem..");
    }

    console.log();

    console.log("Steps CONTRACT ADDRESS: ", StepsCounterDATA.networks[networkID].address);
    console.log("Books CONTRACT ADDRESS: ", BooksCounterDATA.networks[networkID].address);
    console.log("CPN   CONTRACT ADDRESS: ", CPNTokenDATA.networks[networkID].address);
}

prepare();