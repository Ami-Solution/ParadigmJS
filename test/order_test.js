const assert = require('assert');
const simple = require('simple-mock');
const Signature = require('../lib/Signature.js').Signature;
const Paradigm = require('../lib/Paradigm.js').Paradigm;
// const Order = require('../lib/Order.js').Order;
const Web3 = require('web3');

describe('Order', () => {

  before(async () => {
    web3      = new Web3(new Web3.providers.HttpProvider("http://localhost:9545"));
    accounts  = await web3.eth.personal.getAccounts();


    gateway = {}
    gateway.participate = simple.mock();

    paradigm  = new Paradigm({ web3: web3, orderStream: 'os-dev.paradigm.market', orderGateway: gateway });
    Order = paradigm.Order;

    maker     = accounts[7].toLowerCase();
    numTypes  = ['uint', 'uint', 'uint'];
    someNums  = [1, 2, 42];

    // accounts[9] is placeholder
    order = new Order({ subContract: accounts[9], maker: maker, dataTypes: numTypes, values: someNums });
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
    await order.make();
    assert.equal(Signature.recoverAddress(order.makerSignature), maker);
    assert.equal(order.values.length, 6);
  });

  it("take() => posts the order to the OrderGateway", async () => {
    order.take(accounts[6], [1,5,9]);
    assert.equal(gateway.participate.callCount, 1)
  });

  it("validateStake() => verifies the stake of the maker (or poster)", async () => {

  });

});
