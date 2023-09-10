const Migrations = artifacts.require("Migrations");
const Storage = artifacts.require("Storage"); 

module.exports = function (deployer) {
    deployer.deploy(Migrations);
    deployer.deploy(Storage);
};