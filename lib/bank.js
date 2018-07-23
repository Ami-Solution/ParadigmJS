const Web3 = require('web3');
const SimpleERC20 = require('simple-erc20');
const messages = require('./messages');

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

  async createSignedTransfer(transfer) {
    //msg.sender, token, from, signedTo, signedValue, nonce signed values
    const dataTypes = ['address', 'address', 'address', 'address', 'uint', 'uint'];
    const signature = (await messages.signMessage(
      dataTypes,
      [transfer.transferer, transfer.tokenAddress, transfer.tokenHolder, transfer.recipient, transfer.maxAmount, transfer.nonce],
      this.web3.currentProvider,
      transfer.tokenHolder
    )).signature; //TODO: change output of signMessage?

    return { ...transfer, signature };
  }

  createTransfer(transferer, tokenAddress, tokenHolder, recipient, maxAmount, nonce) {
    if(recipient === null) recipient = '0x0000000000000000000000000000000000000000';
    return { transferer, tokenAddress, tokenHolder, recipient, maxAmount, nonce } //TODO: perhaps here would be a good place to generate a nonce?
  }
};

module.exports = bank;
