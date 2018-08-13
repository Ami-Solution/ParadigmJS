const Bank = require('./lib/bank');
const Web3 = require('web3');
const OrderGateway = require('./lib/OrderGateway');
const OrderStream = require('./lib/OrderStream.js');
const Order = require('./lib/Order');
const Signature = require('./lib/Signature');
const utils = require('./lib/utils');

module.exports = class Paradigm {
  constructor(options) {
    this.web3 = new Web3(options.provider || 'default_provider_code');
    let endpoint                 = options.orderStreamURL || 'http://osd.paradigm.market:3000';
    this.orderStream             = new OrderStream(endpoint);
    this.orderGateway = new OrderGateway(this.web3, options.networkId);
    this.bank = new Bank(this.web3, this.orderGateway);
    Order.prototype.web3 = this.web3;
    Order.prototype.orderGateway = this.orderGateway;
    this.Order = Order;
    this.utils = utils;
    this.Signature = Signature;
  }
};