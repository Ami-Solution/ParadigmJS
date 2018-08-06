const Signature = require('../lib/Signature.js');
const Paradigm = require('../index');
const BasicTransferSubContractDetails = require('../lib/contracts/BasicTradeSubContract');

const Token = require('../lib/Token');

describe('Order', () => {
  let paradigm, Order, orderGateway, maker, taker, order, subContract, bank, TKA, TKB;

  before(async () => {
    paradigm  = new Paradigm({ provider: web3.currentProvider, orderStream: 'os-dev.paradigm.market', networkId: await web3.eth.net.getId() });
    Order = paradigm.Order;
    orderGateway = paradigm.orderGateway;
    bank = paradigm.bank;

    maker = accounts[7].toLowerCase();
    taker = accounts[8].toLowerCase();
    subContract = BasicTransferSubContractDetails.networks[await web3.eth.net.getId()].address;
    let makerDataTypes = await orderGateway.makerDataTypes(subContract);
    let takerDataTypes = await orderGateway.takerDataTypes(subContract);
    TKA = await Token.deploy(web3, 'TokenA', 'TKA', maker);
    TKB = await Token.deploy(web3, 'TokenB', 'TKB', taker);

    await bank.giveMaxAllowanceFor(TKA.options.address, maker);
    await bank.giveMaxAllowanceFor(TKB.options.address, taker);

    const makerTransfer = bank.createTransfer(subContract, TKA.options.address, maker, taker, 1000, Date.now());
    const signedMakerTransfer = await bank.createSignedTransfer(makerTransfer);

    let makerValues = {
      signer: maker,
      signerToken: TKA.options.address,
      signerTokenCount: 1000,
      buyer: taker,
      buyerToken: TKB.options.address,
      buyerTokenCount: 1000,
      signerTransfer: signedMakerTransfer,
    };

    order = new Order({ subContract, maker: maker, makerDataTypes, takerDataTypes, makerValues });
    await order.make();
  });

  it("constructor() => receives an array of args to send to the OrderGateway", () => {
    assert.equal(order.makerValues.signer, maker);
    assert.equal(order.makerValues.signerTokenCount, 1000);
    assert.equal(order.makerValues.buyerTokenCount, 1000);
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
    const takerTransfer = bank.createTransfer(subContract, TKB.options.address, taker, maker, 1000, Date.now());
    const signedTakerTransfer = await bank.createSignedTransfer(takerTransfer);

    const takerValues = {
      tokensToBuy: 100,
      buyerTransfer: signedTakerTransfer
    };

    order.take(taker, takerValues);
  });

  it("toJSON() => converts the order to JSON", async () => {
    assert.equal(typeof JSON.stringify(order), 'string');
  });

  it("validateStake() => verifies the stake of the maker (or poster)");

});
