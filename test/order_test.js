describe('Order', () => {
  let maker, taker, order, bank, Signature;

  before(async () => {
    bank = paradigm.bank;
    Signature = paradigm.Signature;

    maker = accounts[7].toLowerCase();
    taker = accounts[8].toLowerCase();
    let makerDataTypes = await orderGateway.makerDataTypes(subContract);
    let takerDataTypes = await orderGateway.takerDataTypes(subContract);

    await bank.giveMaxAllowanceFor(TKA, maker);
    await bank.giveMaxAllowanceFor(TKB, taker);

    const makerTransfer = bank.createTransfer(subContract, TKA, maker, taker, 1000, Date.now());
    const signedMakerTransfer = await bank.createSignedTransfer(makerTransfer);

    let makerValues = {
      signer: maker,
      signerToken: TKA,
      signerTokenCount: 1000,
      buyer: taker,
      buyerToken: TKB,
      buyerTokenCount: 1000,
      signerTransfer: signedMakerTransfer,
    };

    order = new paradigm.Order({ subContract, maker: maker, makerDataTypes, takerDataTypes, makerValues });
    await order.make();
  });

  it('should have token balances and allowances setup for the following test', async () => {
    assert.isAbove(parseInt(await tka.balanceOf(maker)), 3000);
    assert.isAbove(parseInt(await tka.allowance(maker, bank.address)), 3000);
    assert.isAbove(parseInt(await tkb.balanceOf(taker)), 3000);
    assert.isAbove(parseInt(await tkb.allowance(taker, bank.address)), 3000);
  });

  describe('constructor()', () => {
    it("receives an array of args to send to the OrderGateway", () => {
      assert.equal(order.makerValues.signer, maker);
      assert.equal(order.makerValues.signerTokenCount, 1000);
      assert.equal(order.makerValues.buyerTokenCount, 1000);
    });

    it("receives an array of data types", async () => {
      let makerDataTypes = order.makerDataTypes;
      if(typeof makerDataTypes !== 'string') makerDataTypes = JSON.stringify(makerDataTypes);
      assert.equal(makerDataTypes, await orderGateway.makerDataTypes(subContract)); //TODO: update
    });

    it("receives a SubContract address", () => {
      assert.equal(order.subContract, subContract);
    });
  });

  describe('make()', () => {
    it('should maybe test the changes of make');

    it("signs the order details and stores the vrs", async () => {
      assert.equal(Signature.recoverAddress(order.makerSignature), maker);
    });
  });

  describe('take()', () => {
    it("posts the order to the OrderGateway", async () => {
      const takerTransfer = bank.createTransfer(subContract, TKB, taker, maker, 1000, Date.now());
      const signedTakerTransfer = await bank.createSignedTransfer(takerTransfer);

      const takerValues = {
        tokensToBuy: 100,
        buyerTransfer: signedTakerTransfer
      };

      await order.take(taker, takerValues);

      const tka = SimpleERC20(TKA, await web3.eth.net.getId(), web3);
      assert.equal(await tka.balanceOf(taker), '100')
      const tkb = SimpleERC20(TKB, await web3.eth.net.getId(), web3)
      assert.equal(await tkb.balanceOf(maker), '100')
    });
  });

  describe('recoverMaker()', () => {
    it('should result in the maker', () => {
      order.recoverMaker().should.eq(maker);
    })
  });

  describe('recoverPoster()', () => {
    it('is nyi');
  });

  describe('toJSON()', () => {
    it("converts the order to JSON", async () => {
      assert.equal(typeof JSON.stringify(order), 'string');
    });

    it('should have the required keys', () => {
      order.toJSON().should.contain.keys('subContract', 'maker', 'makerDataTypes', 'takerDataTypes', 'makerValues');
    })
  });

  describe('validateStake()', () => {
    it("NYI -- verifies the stake of the maker (or poster)");
  });

  describe('serializeData', () => {
    it('should be tested')
  });

  describe('checkDataTypes', () => {
    it('should pull data types if they are missing')
  });
});
