const ParadigmJS = require('../index');
const BasicTradeSubContract = require('../lib/contracts/BasicTradeSubContract');


describe('OrderGateway', () => {
  let paradigm, orderGateway;
  const basicTradeSubContractAddress = BasicTradeSubContract.networks[50].address;

  before(async () => {
    paradigm = new ParadigmJS({ provider: web3.currentProvider, networkId: await web3.eth.net.getId() });
    orderGateway = paradigm.orderGateway;
  });

  it('should get the makerDataTypes of a SubContract', async () => {
    const makerDataTypes = await orderGateway.makerDataTypes(basicTradeSubContractAddress);
    assert.doesNotThrow(() => { JSON.parse(makerDataTypes) });
  });

  it('should get the takerDataTypes of a SubContract', async () => {
    const takerDataTypes = await orderGateway.takerDataTypes(basicTradeSubContractAddress);
    assert.doesNotThrow(() => { JSON.parse(takerDataTypes) });
  });

  it('should participate in a fully constructed Order.');
});