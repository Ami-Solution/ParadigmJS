const Web3 = require('web3');
const SimpleERC20 = require('simple-erc20');

const MAX_UINT = Web3.utils.toBN('2').pow(Web3.utils.toBN('256')).sub(Web3.utils.toBN('1'));

const bank = class {
  constructor(options) {
    this.web3 = new Web3(options.provider);
  }

  async giveMaxAllowanceFor(address, tempBankContractAddress, from = null) {
    const token = SimpleERC20(address, await this.web3.eth.net.getId(), this.web3);
    await token.approve(tempBankContractAddress, MAX_UINT, from);
  }

  async giveAllowanceFor(address, value, tempBankContractAddress, from = null) {
    const token = SimpleERC20(address, await this.web3.eth.net.getId(), this.web3);
    await token.approve(tempBankContractAddress, value, from);
  }
};

module.exports = bank;
