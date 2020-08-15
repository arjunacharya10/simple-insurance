const path = require("path");
var HDWalletProvider = require("@truffle/hdwallet-provider");
var mnemonic = "<Enter ur mnemonics>";

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    develop: {
      port: 8545
    },
    development: { 
      network_id: "*", 
      host: 'localhost', 
      port: 8545 
    },
    ropsten: {
      provider: function() { 
       return new HDWalletProvider(mnemonic, "https://ropsten.infura.io/v3/97d8c71d584f432a9500b89b6019a9a6",0,3);
      },
      network_id: 3,
      gas: 4500000,
      gasPrice: 10000000000,
  }
  },
};
