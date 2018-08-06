const Web3 = require('web3');
const SimpleERC20 = require('simple-erc20');
const Signature = require('./Signature');

const MAX_UINT = Web3.utils.toBN('2').pow(Web3.utils.toBN('256')).sub(Web3.utils.toBN('1'));

const bank = class {
  constructor(web3, orderGateway) {
    this.web3 = web3;
    this.orderGateway = orderGateway;
  }

  async giveMaxAllowanceFor(address, from = null) {
    await this.checkAddress();
    const token = SimpleERC20(address, await this.web3.eth.net.getId(), this.web3);
    await token.approve(this.address, MAX_UINT, from);
  }

  async giveAllowanceFor(address, value, from = null) {
    await this.checkAddress();
    const token = SimpleERC20(address, await this.web3.eth.net.getId(), this.web3);
    await token.approve(this.address, value, from);
  }

  async createSignedTransfer(transfer) {
    //msg.sender, token, from, signedTo, signedValue, nonce signed values
    const dataTypes = ['address', 'address', 'address', 'address', 'uint', 'uint'];
    const values = [transfer.transferer, transfer.tokenAddress, transfer.tokenHolder, transfer.recipient, transfer.maxAmount, transfer.nonce];
    transfer.signature = (await Signature.generate(this.web3, dataTypes, values, transfer.tokenHolder)).toJSON();
    return transfer;
  }

  createTransfer(transferer, tokenAddress, tokenHolder, recipient, maxAmount, nonce) {
    if(recipient === null) recipient = '0x0000000000000000000000000000000000000000';
    return { transferer, tokenAddress, tokenHolder, recipient, maxAmount, nonce } //TODO: perhaps here would be a good place to generate a nonce?
  }

  async checkAddress() {
    if(!this.address) {
      this.address = await this.orderGateway.paradigmBank();
    }
  }
};

module.exports = bank;
