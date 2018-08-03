const OrderGatewayContract = require('./contracts/OrderGateway');

class OrderGateway {
  constructor(web3, networkId) {
    this.web3 = web3;
    this.address = OrderGatewayContract.networks[networkId].address;
    this.contract = new web3.eth.Contract(OrderGatewayContract.abi, this.address);
  }

  participate(subContract, makerData, takerData, from) {
    return this.contract.methods.participate(subContract, makerData, takerData).send({ from });
  }

  async makerDataTypes(subContract) {
    return await this.contract.methods.makerDataTypes(subContract).call();
  }

  async takerDataTypes(subContract) {
    return await this.contract.methods.takerDataTypes(subContract).call();
  }

  async paradigmBank() {
    return await this.contract.methods.paradigmBank().call();
  }
}

module.exports = OrderGateway;