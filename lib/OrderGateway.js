const OrderGatewayContract = require('./contracts/OrderGateway');

class OrderGateway {
  constructor(web3, networkId) {
    this.web3 = web3;
    this.address = OrderGatewayContract.networks[networkId].address;
    this.contract = new web3.eth.Contract(OrderGatewayContract.abi, this.address);
  }

  async participate(subContract, makerData, takerData, from) {
    const transaction = this.contract.methods.participate(subContract, makerData, takerData)
    return await transaction.send({ from, gas: 4500000 });
  }

  async makerArguments(subContract) {
    return await this.contract.methods.makerDataTypes(subContract).call();
  }

  async takerArguments(subContract) {
    return await this.contract.methods.takerDataTypes(subContract).call();
  }

  async paradigmBank() {
    return await this.contract.methods.paradigmBank().call();
  }
}

module.exports = OrderGateway;
