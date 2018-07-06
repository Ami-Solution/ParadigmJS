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
      const signInfo = dataTypes[dataTypes.length - 1][1];
      const signDataTypes = signInfo.map((index) => dataTypes[index][0]);
      const signDataValues = signInfo.map((index) => values[index]);
      [_hex, sig] = await messages.signMessage(signDataTypes, signDataValues, provider, address);
      values = values.concat(sig);
    }

    if(utils.validate(dataTypes, values)) {
      return values.map((value) => utils.toBytes32(value));
    } else {
      throw new Error('Invalid values')
    }
  },
  toBytes32: (value) => {
    return Web3.utils.toTwosComplement(Web3.utils.toHex(value));
  },
  checkDataTypes: (dataTypes) => {

    if (!Array.isArray(dataTypes)) {
      throw new Error('dataTypes is not an array');
    }

    dataTypes.forEach((type) => {
      if (!Array.isArray(type)) {
        throw new Error('type is not an array');
      }
    });
  },
  validate: (dataTypes, values) => {
    utils.checkDataTypes(dataTypes);
    if (!Array.isArray(values) || (dataTypes.length + dataTypes[dataTypes.length - 1][0] === 'signature' ? 2 : 0) > values.length) {
      return false;
    }
    for(let i = 0; i < dataTypes.length; i++) {
      switch (dataTypes[i][0]) {
        case 'address':
          if(!Web3.utils.isAddress(values[i])) return false;
      }
    }

    return true;
  },
  shouldSign: (dataTypes, values) => {
    const signature = dataTypes[dataTypes.length - 1][0] === 'signature';
    return signature && dataTypes.length === values.length + 1
  }
};

module.exports = utils;