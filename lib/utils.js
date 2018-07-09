const Web3 = require('web3');

const utils = {
  toContractInput: (dataTypes, values) => {
    if (typeof dataTypes === 'string') {
      dataTypes = JSON.parse(dataTypes);
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

    dataTypes.forEach((type, index) => {
      if (typeof type.dataType !== 'string') {
        throw new Error(`dataTypes index: ${index} is missing dataType value`);
      }
    });
  },
  validate: (dataTypes, values) => {

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