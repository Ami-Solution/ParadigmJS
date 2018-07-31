const Order = require('./Order.js').Order;
const Signature = require('./Signature.js').Signature;


class Paradigm {
  constructor(options) {
    Order.prototype.web3         = options.web3;
    Order.prototype.orderGateway = options.orderGateway;
    this.Order                   = Order;
  }
}

module.exports.Paradigm = Paradigm;
