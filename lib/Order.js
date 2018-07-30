const Signature = require('./Signature.js').Signature;

class Order {

  // TODO:
  //   0. Get ParadigmContracts running on TestRPC
  //   1. Work out how to make/take deals ==> Set up a dummy SubContract to pass in
  //   2. web3 and orderGateway should be instantiated in some kind of Paradigm {} class.
  //   3. Paradigm should be either passed in or accessible everywhere
  constructor(options) {
    this.subContract = options.subContract;
    this.maker       = options.maker;
    this.dataTypes   = options.dataTypes;
    this.values      = options.values;
  }

  async make() {
    this.makerSignature = await Signature.generate(this.web3, this.dataTypes, this.values, this.maker);
    this.values.push(this.makerSignature.v);
    this.values.push(this.makerSignature.r);
    this.values.push(this.makerSignature.s);
  }

  async take(taker, takerValues) {
    this.orderGateway.participate(this.subContract, this.values, takerValues, { from: taker })
  }

}

module.exports.Order = Order;
