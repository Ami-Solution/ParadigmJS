const Web3 = require('web3');

const utils = {
  toContractInput: (dataTypes, values) => {
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
    if (typeof dataTypes === 'string') {
      dataTypes = JSON.parse(dataTypes);
    }

    if (!Array.isArray(dataTypes)) {
      throw new Error('dataTypes is not an array');
    }

    dataTypes.forEach((type) => {
      if (!Array.isArray(type)) {
        throw new Error('type is not an array');
      }
    });
    return dataTypes;
  },
  validate: (dataTypes, values) => {
    dataTypes = utils.checkDataTypes(dataTypes);

    if (!Array.isArray(values) || dataTypes.length > values.length) {
      return false;
    }
    for(let i = 0; i < dataTypes.length; i++) {
      switch (dataTypes[i][0]) {
        case 'address':
          if(!Web3.utils.isAddress(values[i])) return false;
      }


    }

    return true;
  }
};

module.exports = utils;