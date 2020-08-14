var SimpleStorage = artifacts.require("../contracts/SimpleStorage.sol");
var Insurance = artifacts.require("../contracts/Insurance.sol")

module.exports = function(deployer) {
  deployer.deploy(Insurance);
};
