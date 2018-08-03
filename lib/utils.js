const Web3 = require('web3');
const messages = require('./messages');

const _error = (s) => {
  throw new Error(s);
};

const utils = {
  toContractInput: async (dataTypes, values, provider = null, address = null) => {
    if (typeof dataTypes === 'string') {
      dataTypes = JSON.parse(dataTypes);
    }

    if (utils.shouldSign(dataTypes)) {
      const signatureFields = dataTypes[dataTypes.length - 1].signatureFields;
      let signatureDataTypes = [], signatureValues = [];

      signatureFields.forEach((index) => {
        signatureDataTypes.push(dataTypes[index].dataType);
        signatureValues.push(values[dataTypes[index].name]);
      });

      const signature = await messages.signMessage(signatureDataTypes, signatureValues, provider, address);
      values.signature = signature.signature;
    }

    if(utils.validate(dataTypes, values)) {
      let output = [];
      dataTypes.forEach((dataType) => {
        if(dataType.dataType === 'signature') {
          output.push(utils.toBytes32(values.signature.v));
          output.push(utils.toBytes32(values.signature.r));
          output.push(utils.toBytes32(values.signature.s));
        } else if(dataType.dataType === 'signedTransfer') {
          //TODO: Is signed? Sign if not signed?  Throw?
          output.push(utils.toBytes32(values[dataType.name].recipient));
          output.push(utils.toBytes32(values[dataType.name].maxAmount));
          output.push(utils.toBytes32(values[dataType.name].signature.v));
          output.push(utils.toBytes32(values[dataType.name].signature.r));
          output.push(utils.toBytes32(values[dataType.name].signature.s));
          output.push(utils.toBytes32(values[dataType.name].nonce));
        } else {
          output.push(utils.toBytes32(values[dataType.name]));
        }
      });

      return output;
    } else {
      _error('Invalid values')
    }
  },
  checkDataTypes: (dataTypes) => {

    if (!Array.isArray(dataTypes)) {
      _error('dataTypes is not an array');
    }

    dataTypes.forEach((type, index) => {
      if (typeof type.dataType !== 'string') {
        _error(`dataTypes index: ${index} is missing dataType value`);
      }
    });
  },
  validate: (dataTypes, values) => {
    utils.checkDataTypes(dataTypes);
    if ((dataTypes.length + dataTypes[dataTypes.length - 1].dataType === 'signature' ? 2 : 0) > Object.keys(values).length) {
      return false;
    }
    for(let i = 0; i < dataTypes.length; i++) {
      switch (dataTypes[i].dataType) {
        case 'address':
          if(!Web3.utils.isAddress(values[dataTypes[i].name])) return false;
      }
    }

    return true;
  },
  shouldSign: (dataTypes) => {
    return dataTypes[dataTypes.length - 1].dataType === 'signature';
  },
  toBytes32: (value) => {
    return Web3.utils.toTwosComplement(Web3.utils.toHex(value));
  },
  NULL_ADDRESS: '0x0000000000000000000000000000000000000000'
};

module.exports = utils;