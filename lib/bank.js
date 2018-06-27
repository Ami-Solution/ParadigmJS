const Web3 = require('web3');

const bank = class {
  constructor(options) {
    this.web3 = new Web3(options.provider);
  }

  giveMaxAllowanceFor(address, tempContractAddress) {//TODO: refactor when the contract data is ready to integrate into the JS project.

  }
};

module.exports = bank;