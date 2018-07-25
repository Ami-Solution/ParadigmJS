const Web3 = require('web3');
const assert = require('assert');

describe('The Setup', () => {
  it('connects to web3', async () => {
    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:9545"))
    let accounts = await web3.eth.personal.getAccounts();
    assert.equal(accounts.length, 10, "There should be 10 ETH accounts.")
  })
});
