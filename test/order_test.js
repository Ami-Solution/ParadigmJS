const Signature = require('../lib/Signature.js');
const Paradigm = require('../index');
const BasicTransferSubContractDetails = require('../lib/contracts/BasicTradeSubContract');

describe('Order', () => {
  let paradigm, Order, orderGateway, maker, order, subContract;

  before(async () => {
    paradigm  = new Paradigm({ provider: web3.currentProvider, orderStream: 'os-dev.paradigm.market', networkId: await web3.eth.net.getId() });
    Order = paradigm.Order;
    orderGateway = paradigm.orderGateway;

    maker     = accounts[7].toLowerCase();
    subContract = BasicTransferSubContractDetails.networks[await web3.eth.net.getId()].address;
    let makerDataTypes = await orderGateway.makerDataTypes(subContract);
    let takerDataTypes = await orderGateway.takerDataTypes(subContract);

    let makerValues = {
      signer: maker,
      signerToken: accounts[9],
      signerTokenCount: 20,
      buyer: accounts[9],
      buyerToken: accounts[9],
      buyerTokenCount: 10,
      signerTransfer: {},
    };

    order = new Order({ subContract, maker: maker, makerDataTypes, takerDataTypes, makerValues });

    await order.make();
  });

  it("constructor() => receives an array of args to send to the OrderGateway", () => {
    assert.equal(order.makerValues.signer, maker);
    assert.equal(order.makerValues.signerTokenCount, 20);
    assert.equal(order.makerValues.buyerTokenCount, 10);
  });

  it("constructor() => receives an array of data types", async () => {
    let makerDataTypes = order.makerDataTypes;
    if(typeof makerDataTypes !== 'string') makerDataTypes = JSON.stringify(makerDataTypes);
    assert.equal(makerDataTypes, await orderGateway.makerDataTypes(subContract)); //TODO: update
  });

  it("constructor() => receives a SubContract address", () => {
    assert.equal(order.subContract, subContract);
  });

  it("make() => signs the order details and stores the vrs", async () => {
    assert.equal(Signature.recoverAddress(order.makerSignature), maker);
  });

  it("take() => posts the order to the OrderGateway", async () => {
    // order.take(accounts[6], [1,5,9]);
    assert.notEqual(paradigm.orderGateway.participate, undefined) //TODO rewrite test with
  });

  it("toJSON() => converts the order to JSON", async () => {
    assert.equal(typeof JSON.stringify(order), 'string');
  });

  it("validateStake() => verifies the stake of the maker (or poster)");

});
