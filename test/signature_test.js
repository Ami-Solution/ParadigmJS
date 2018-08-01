const Signature = require('../lib/Signature.js');

describe('Signature', async () => {
  let signer;
  before(() => {
    signer   = accounts[5];
  });

  it('generates a signature given an array of data types and an array of values', async () => {
    let dataTypes = ['address', 'address', 'uint', 'uint', 'address'];
    let values    = [accounts[1], accounts[2], 42, 57, accounts[3]];
    let signature = await Signature.generate(web3, dataTypes, values, signer);
    assert.equal(Signature.validate(signature), true);
  });

});
