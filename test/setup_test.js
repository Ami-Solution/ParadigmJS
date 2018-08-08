const Web3 = require('web3');
const assert = require('assert');
const ganacheProvider = require('ganache-core').provider();

const Paradigm = require('../index');

// Interestingly the advice in this article to not require json was helpful in this case to infact do it.
// Great info to know!
// https://goenning.net/2016/04/14/stop-reading-json-files-with-require/
const OrderGatewayContract = require('../lib/contracts/OrderGateway');
const BasicTradeSubContract = require('../lib/contracts/BasicTradeSubContract');
const TokenContract = require('../lib/contracts/Token');

before(async () => {

  global.web3 = new Web3(ganacheProvider);
  global.accounts = await web3.eth.personal.getAccounts();
  global.assert = assert;

  const orderGatewayContract = await (new web3.eth.Contract(OrderGatewayContract.abi))
    .deploy({ data: OrderGatewayContract.bytecode }).send({ from: accounts[0], gas: 4500000 });
  OrderGatewayContract.networks[await web3.eth.net.getId()] = { address: orderGatewayContract._address };

  global.paradigm = new Paradigm({ provider: web3.currentProvider, networkId: await web3.eth.net.getId() });
  global.orderGateway = paradigm.orderGateway;

  const basicTradeSubContract = await (new web3.eth.Contract(BasicTradeSubContract.abi))
    .deploy({ data: BasicTradeSubContract.bytecode, arguments: [
        await orderGateway.paradigmBank(),
        makerDataTypes,
        takerDataTypes
      ] }).send({ from: accounts[0], gas: 4500000 });
  global.subContract = basicTradeSubContract._address;

  const TKAContract = await (new web3.eth.Contract(TokenContract.abi))
    .deploy({ data: TokenContract.bytecode , arguments: ['Token A', 'TKA'] }).send({ from: accounts[7], gas: 4500000 });

  global.TKA = TKAContract._address;

  const TKBContract = await (new web3.eth.Contract(TokenContract.abi))
    .deploy({ data: TokenContract.bytecode , arguments: ['Token B', 'TKB'] }).send({ from: accounts[8], gas: 4500000 });

  global.TKB = TKBContract._address;

  it('should connect to web3', () => {
    assert.equal(accounts.length, 10, "There should be 10 ETH accounts.")
  });
});

const makerDataTypes = JSON.stringify([
  { 'dataType': "address", 'name': "signer" },//0
  { 'dataType': "address", 'name': "signerToken" },//1
  { 'dataType': "uint", 'name': "signerTokenCount" },//2
  { 'dataType': "address", 'name': "buyer" },//3
  { 'dataType': "address", 'name': "buyerToken" },//4
  { 'dataType': "uint", 'name': "buyerTokenCount" },//5
  { 'dataType': 'signedTransfer', 'name': 'signerTransfer' },//7 -> 6 | 8 -> 7 | 9 -> 8 | 10 -> 9 | 11 -> 10 | 12 -> 11 -- recipient maxAmount v r s nonce
  { 'dataType': "signature", 'signatureFields': [0, 1, 2, 3, 4, 5]}//19 -> 12 | 20 -> 13 | 21 -> 14
]);

const takerDataTypes = JSON.stringify([
  { 'dataType': "uint", 'name': "tokensToBuy"},//6 -> 0
  { 'dataType': 'signedTransfer', 'name': 'buyerTransfer' },//13 -> 1 | 14 -> 2 | 15 -> 3 | 16 -> 4 | 17 -> 5 | 18 -> 6 | -- recipient maxAmount v r s nonce
]);