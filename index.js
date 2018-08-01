const Bank = require('./lib/bank');
const Web3 = require('web3');
const OrderGateway = require('./lib/OrderGateway');
const Order = require('./lib/Order');

class Paradigm {
  constructor(options) {
    this.web3 = new Web3(options.provider || 'default_provider_code');
    this.bank = new Bank(this.web3);
    this.OrderGateway = new OrderGateway(this.web3, options.networkId);
    Order.prototype.web3 = this.web3;
    Order.prototype.OrderGateway = this.OrderGateway;
    this.Order = Order;
  }
};


Paradigm.utils = require('./lib/utils');
Paradigm.Bank = Bank;
Paradigm.messages = require('./lib/messages');

module.exports = Paradigm;