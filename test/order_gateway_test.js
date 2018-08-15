describe('OrderGateway', () => {
  it('should get the makerArguments of a SubContract', async () => {
    const makerArguments = await orderGateway.makerArguments(subContract);
    assert.doesNotThrow(() => { JSON.parse(makerArguments) });
  });

  it('should get the takerArguments of a SubContract', async () => {
    const takerArguments = await orderGateway.takerArguments(subContract);
    assert.doesNotThrow(() => { JSON.parse(takerArguments) });
  });

  it('should participate in a fully constructed Order.');
});