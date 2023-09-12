import StorageJson from '../build/contracts/Storage.json';
import Web3 from 'web3';
var contract = require('@truffle/contract');

export const load = async () => {
    await loadWeb3();
    const addressAccount = await loadAccount();
    const { storageContract, allData } = await loadContract(addressAccount);

    return { addressAccount, storageContract, allData };
};

const loadData = async (storageContract, addressAccount) => {
    const dataCount = await storageContract.getDataCount(addressAccount);
    const allData = [];
    for (var i = 0; i < dataCount.toNumber(); i++) {
        const data = await storageContract.getData(addressAccount, i);
        allData.push(data);
    }
    return allData;
};

const loadContract = async (addressAccount) => {
    const theContract = contract(StorageJson);
    theContract.setProvider(web3.eth.currentProvider);
    const storageContract = await theContract.deployed();
    const allData = await loadData(storageContract, addressAccount);

    return { storageContract, allData };
};

const loadAccount = async () => {
    const accounts = await web3.eth.getAccounts()
    const account = accounts[0]
    return account
};

const loadWeb3 = async () => {
    // Modern dapp browsers...
    if (window.ethereum) {
        window.web3 = new Web3(ethereum);
        try {
            // Request account access if needed
            await ethereum.enable();
            // Acccounts now exposed
            web3.eth.sendTransaction({/* ... */});
        } catch (error) {
            // User denied account access...
        }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
        window.web3 = new Web3(web3.currentProvider);
        // Acccounts always exposed
        web3.eth.sendTransaction({/* ... */});
    }
    // Non-dapp browsers...
    else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
};