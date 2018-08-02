const Signature = require('./Signature.js');

class Order {

  // TODO:
  //   0. Get ParadigmContracts running on TestRPC
  //   1. Work out how to make/take deals ==> Set up a dummy SubContract to pass in
  //   2. web3 and orderGateway should be instantiated in some kind of Paradigm {} class.
  //   3. Paradigm should be either passed in or accessible everywhere
  constructor(options) {
    if(options.subContract === undefined) throw new Error('subContract is required');

    this.subContract = options.subContract;
    this.maker       = options.maker;
    this.makerDataTypes = options.makerDataTypes;
    this.takerDataTypes = options.takerDataTypes;
    this.makerValues      = this.buff(options.makerValues);
  }

  async make() {
    await this.checkDataTypes();

    //TODO: decide if we tear out the signature dataType or clean up below
    if(this.makerDataTypes[this.makerDataTypes.length - 1].dataType === 'signature') {
      const dataTypes = [], values = [];
      this.makerDataTypes[this.makerDataTypes.length - 1].signatureFields.forEach((index) => {
        const dataType = this.makerDataTypes[index]; //TODO: Better name for the dataTypes array element containing the dataType and name
        dataTypes.push(dataType.dataType);
        values.push(this.makerValues[dataType.name]);
      });

      this.makerSignature = await Signature.generate(this.web3, dataTypes, values, this.maker);
      this.makerValues.signature = this.makerSignature;
    }
  }

  async take(taker, takerValues) {
    //TODO: update method signature/map values with datatypes
    this.orderGateway.participate(this.subContract, this.makerValues, takerValues, { from: taker })
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
      makerDataTypes: this.makerDataTypes,
      takerDataTypes: this.takerDataTypes,
      makerValues: this.makerValues//this.jsonValues(),
    }
  }

  jsonValues() {
    if (this.recoverMaker().toLowerCase() === this.maker.toLowerCase()) {
      let buffToJSON = [];
      let l = this.values.length;
      let signatureIndexes = [l - 2, l - 1];
      for(var value of this.values) {
        if (signatureIndexes.includes(this.values.indexOf(value))) {
          buffToJSON.push(value.toJSON());
        } else {
          buffToJSON.push(value);
        }
      }
      return buffToJSON;
    } else {
      return values;
    }
  }

  buff(values) {
    if (this.makerDataTypes[this.makerDataTypes.length - 1] === 'signature') {
      let jsonToBuff = [];
      let l = values.length;
      let signatureIndexes = [l - 2, l - 1];
      for(var value of values) {
        if (signatureIndexes.includes(values.indexOf(value))) {
          jsonToBuff.push(Buffer.from(value));
        } else {
          jsonToBuff.push(value);
        }
      }
      return jsonToBuff;
    } else {
      return values;
    }
  }

  async checkDataTypes() {
    //retrieves if missing and parses JSON strings
    if(typeof this.makerDataTypes === 'undefined') this.makerDataTypes = await orderGateway.makerDataTypes(this.subContract);
    if(typeof this.takerDataTypes === 'undefined') this.takerDataTypes = await orderGateway.takerDataTypes(this.subContract);

    if(typeof this.makerDataTypes === 'string') this.makerDataTypes = JSON.parse(this.makerDataTypes);
    if(typeof this.takerDataTypes === 'string') this.takerDataTypes = JSON.parse(this.takerDataTypes);
  }
}

module.exports = Order;
