const Web3 = require('web3');
const assert = require('assert');

before(async () => {

  global.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  global.accounts = await web3.eth.personal.getAccounts();
  global.assert = assert;

  it('should connect to web3', () => {
    assert.equal(accounts.length, 10, "There should be 10 ETH accounts.")
  });

  it('should be network 50', async () => {
    assert.equal(await web3.eth.net.getId(), 50, "The Contract test rpc should be running.  TODO: should discuss moving it into a mono repo");
  })
});
