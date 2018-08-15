const Signature = require('../lib/Signature.js');

describe('Signature', () => {
  describe('generate()', () => {

  });

  describe('validate()', () => {

  });

  describe('sign()', () => {

  });

  describe('', () => {

  });

  describe('', () => {

  });

  describe('', () => {

  });

  describe('', () => {

  });
  it('generates a signature given an array of data types and an array of values', async () => {
    const dataTypes = ['address', 'address', 'uint', 'uint', 'address'];
    const values = [accounts[1], accounts[2], 42, 57, accounts[3]];
    const signer = accounts[5];

    let signature = await Signature.generate(web3, dataTypes, values, signer);
    assert.equal(Signature.validate(signature), true);
  });

});
