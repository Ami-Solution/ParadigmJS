const Bank = require('./lib/bank');
const Web3 = require('web3');
const OrderGateway = require('./lib/OrderGateway');

const ParadigmJS = class {
  constructor(options) {
    this.web3 = new Web3(options.provider || 'default_provider_code');
    this.bank = new Bank(this.web3);
    this.OrderGateway = new OrderGateway(this.web3, options.networkId );
  }
};


ParadigmJS.utils = require('./lib/utils');
ParadigmJS.Bank = Bank;
ParadigmJS.messages = require('./lib/messages');

module.exports = ParadigmJS;