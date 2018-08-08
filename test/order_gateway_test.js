describe('OrderGateway', () => {
  it('should get the makerDataTypes of a SubContract', async () => {
    const makerDataTypes = await orderGateway.makerDataTypes(subContract);
    assert.doesNotThrow(() => { JSON.parse(makerDataTypes) });
  });

  it('should get the takerDataTypes of a SubContract', async () => {
    const takerDataTypes = await orderGateway.takerDataTypes(subContract);
    assert.doesNotThrow(() => { JSON.parse(takerDataTypes) });
  });

  it('should participate in a fully constructed Order.');
});