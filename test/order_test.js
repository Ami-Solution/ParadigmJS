const Signature = require('../lib/Signature.js');
const Paradigm = require('../index');

describe('Order', () => {
  let paradigm, Order, maker, numTypes, someNums, order;

  before(async () => {
    paradigm  = new Paradigm({ provider: web3.currentProvider, orderStream: 'os-dev.paradigm.market', networkId: await web3.eth.net.getId() });
    Order = paradigm.Order;

    maker     = accounts[7].toLowerCase();
    numTypes  = ['uint', 'uint', 'uint'];
    someNums  = [1, 2, 42];

    // accounts[9] is placeholder
    order = new Order({ subContract: accounts[9], maker: maker, dataTypes: numTypes, values: someNums });

    await order.make();
  });

  it("constructor() => receives an array of args to send to the OrderGateway", () => {
    assert.equal(order.values[0], 1);
    assert.equal(order.values[1], 2);
    assert.equal(order.values[2], 42);
  });

  it("constructor() => receives an array of data types", () => {
    assert.equal(order.dataTypes[0], 'uint');
  });

  it("constructor() => receives a SubContract address", () => {
    assert.equal(order.subContract, accounts[9]);
  });

  it("make() => signs the order details and stores the vrs", async () => {
    assert.equal(Signature.recoverAddress(order.makerSignature), maker);
    assert.equal(order.values.length, 6);
  });

  it("take() => posts the order to the OrderGateway", async () => {
    // order.take(accounts[6], [1,5,9]);
    assert.notEqual(paradigm.orderGateway.participate, undefined)
  });

  it("toJSON() => converts the order to JSON", async () => {
    console.log(order.toJSON().values[5]);
  })

  it("validateStake() => verifies the stake of the maker (or poster)", async () => {

  });

});
