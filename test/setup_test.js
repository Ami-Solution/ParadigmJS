const Web3 = require('web3');
const assert = require('assert');

before(async () => {

  let web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:9545"));
  let accounts = await web3.eth.personal.getAccounts();

  it('connects to web3', async () => {
    assert.equal(accounts.length, 10, "There should be 10 ETH accounts.")
  })
});
