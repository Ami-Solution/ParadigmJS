const Order = require('./Order.js').Order;
const OrderStream = require('./OrderStream.js').OrderStream;
const Signature = require('./Signature.js').Signature;


class Paradigm {
  constructor(options) {
    Order.prototype.web3         = options.web3;
    Order.prototype.orderGateway = options.orderGateway;
    this.Order                   = Order;
    let endpoint                 = options.orderStreamURL || 'http://osd.paradigm.market:3000';
    this.orderStream             = new OrderStream(endpoint);
  }
}

module.exports.Paradigm = Paradigm;
