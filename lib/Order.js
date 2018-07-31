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

  // TODO: Also push signature data types
  async make() {
    this.makerSignature = await Signature.generate(this.web3, this.dataTypes, this.values, this.maker);
    this.values.push(this.makerSignature.v);
    this.values.push(this.makerSignature.r);
    this.values.push(this.makerSignature.s);
  }

  async take(taker, takerValues) {
    this.orderGateway.participate(this.subContract, this.values, takerValues, { from: taker })
  }

  recoverMaker() {
    return Signature.recoverAddress(this.makerSignature);
  }

  recoverPoster() {
    return Signature.recoverAddress(this.posterSignature);
  }

  toJSON() {
    return {
      subContract: this.subContract,
      maker: this.maker,
      dataTypes: this.dataTypes,
      values: this.jsonValues(),
    }
  }

  jsonValues() {
    if (this.recoverMaker().toLowerCase() == this.maker.toLowerCase()) {
      let unbuffed = [];
      let l = this.values.length;
      let signatureIndexes = [l - 2, l - 1];
      for(var value of this.values) {
        if (signatureIndexes.includes(this.values.indexOf(value))) {
          unbuffed.push(value.toJSON());
        } else {
          unbuffed.push(value);
        }
      }
      return unbuffed;
    } else {
      return values;
    }
  }



}

module.exports.Order = Order;
