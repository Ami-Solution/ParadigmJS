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

    if (utils.shouldSign(dataTypes, values)) {
      let _hex, sig;
      const signInfo = dataTypes[dataTypes.length - 1].signatureFields;
      const signatureDataTypes = signInfo.map((index) => dataTypes[index].dataType);
      const signatureDataValues = signInfo.map((index) => values[index]);
      [_hex, sig] = await messages.signMessage(signatureDataTypes, signatureDataValues, provider, address);
      values = values.concat(sig);
    }

    if(utils.validate(dataTypes, values)) {
      return values.map((value) => utils.toBytes32(value));
    } else {
      _error('Invalid values')
    }
  },
  toBytes32: (value) => {
    return Web3.utils.toTwosComplement(Web3.utils.toHex(value));
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
    if (!Array.isArray(values) || (dataTypes.length + dataTypes[dataTypes.length - 1].dataType === 'signature' ? 2 : 0) > values.length) {
      return false;
    }
    for(let i = 0; i < dataTypes.length; i++) {
      switch (dataTypes[i].dataType) {
        case 'address':
          if(!Web3.utils.isAddress(values[i])) return false;
      }
    }

    return true;
  },
  shouldSign: (dataTypes, values) => {
    const signature = dataTypes[dataTypes.length - 1].dataType === 'signature';
    return signature && dataTypes.length === values.length + 1
  }
};

module.exports = utils;