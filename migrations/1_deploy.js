const StepsCounter = artifacts.require("Hobbies/StepsCounter.sol");
const BooksCounter = artifacts.require("Hobbies/BooksCounter.sol");
const CPNToken = artifacts.require("CPNToken");
const KYC = artifacts.require("KYC");

module.exports = async function (deployer) {
    await deployer.deploy(StepsCounter);
    await deployer.deploy(BooksCounter);
    await deployer.deploy(KYC);
    await deployer.deploy(CPNToken, KYC.address);
}
