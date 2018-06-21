const Web3 = require('web3');

exports.utils = {
  toBytes32: (value) => {
    return Web3.utils.toTwosComplement(Web3.utils.toHex(value));
  }
}