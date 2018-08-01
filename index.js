const Bank = require('./lib/bank');
const Web3 = require('web3');

const ParadigmJS = class {
  constructor(options) {
    this.web3 = new Web3(options.provider || 'default_provider_code');
    this.bank = new Bank(this.web3);
  }
};


ParadigmJS.utils = require('./lib/utils');
ParadigmJS.Bank = Bank;
ParadigmJS.messages = require('./lib/messages');

module.exports = ParadigmJS;