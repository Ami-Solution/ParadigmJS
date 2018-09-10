# Paradigm Full Order Execution (0x)
> This document was specifically written to be used in a web browser with Metamask enabled, and the required scripts from paradigm.js loaded. However, it gives you an idea of the function calls needed to make and fill orders. More documentation will be coming soon.

To get started, navigate to [http://paradigm-dev.us-east-1.elasticbeanstalk.com/allowances](http://paradigm-dev.us-east-1.elasticbeanstalk.com/allowances) and acquire the following tokens via MetaMask.

```
TKA: "0xc8001ac8faed38171bd8960e2a177b2b80f1e9b0";
TKB: "0x77ae4cded8c197b4c503895368f077ef6288462b";
TKC: "0xb55b454e5f040d4c6f148d0590e767ba0dcbc615";
```

_To get tokens simply send ETH to the address_ **_on Ropsten_**_. The ETH will be returned back to you._

Once you&#39;ve received the tokens, provide allowances to each on the screen that you navigated to.

Finally, copy the following into the Javascript console.

```
const paradigm = new Paradigm({ provider: web3.currentProvider, networkId: await web3.eth.net.getId() });
const zeroEx = new ZeroEx(web3.currentProvider, { networkId: await web3.eth.net.getId() });

const Order = paradigm.Order;
const EXCHANGE_ADDRESS = zeroEx.exchange.getContractAddress();
const PROXY = zeroEx.proxy.getContractAddress();
const coinbase = await web3.eth.getCoinbase();

// Test token addresses
const TKA = "0xc8001ac8faed38171bd8960e2a177b2b80f1e9b0";
const TKB = "0x77ae4cded8c197b4c503895368f077ef6288462b";

const TKC = "0xb55b454e5f040d4c6f148d0590e767ba0dcbc615";
const subContract = '0x832d280ba9c92a3d84f015a7cd8cf5ca72bf2a95';
```



Create a valid Zero Ex Order.

```
const zeroExOrder = {
  maker: coinbase,
  taker: ZeroEx.NULL_ADDRESS,
  feeRecipient: ZeroEx.NULL_ADDRESS,
  makerTokenAddress: TKA,
  takerTokenAddress: TKB,
  exchangeContractAddress: EXCHANGE_ADDRESS,
  salt: ZeroEx.generatePseudoRandomSalt(),
  makerFee: new BigNumber(0),
  takerFee: new BigNumber(0),
  makerTokenAmount: ZeroEx.toBaseUnitAmount(new BigNumber(1), 60), // Base 18 decimals
  takerTokenAmount: ZeroEx.toBaseUnitAmount(new BigNumber(1), 60), // Base 18 decimals
  expirationUnixTimestampSec: new BigNumber(Date.now() + 3600000)
};
```

Wait for the  following to process. Once this is finished, the resulting orderStream transaction id will be displayed:

```
let toMakerValues = {};

Object.keys(zeroExOrder).forEach((key) => {
  toMakerValues[`order${key.replace(/^\w/, c => c.toUpperCase())}`] = zeroExOrder[key];
});

const ecSignature = await zeroEx.signOrderHashAsync(ZeroEx.getOrderHashHex(zeroExOrder), coinbase, true);

const makerValues = {
  ...toMakerValues,
  signatureV: ecSignature.v,
  signatureR: ecSignature.r,
  signatureS: ecSignature.s
};

const order = new Order({ subContract, maker: coinbase, makerValues });

await zeroEx.token.setUnlimitedAllowanceAsync(TKA, coinbase, PROXY);

await order.make();
paradigm.orderStream.add(order).then(res => console.log(res));
```

## 

## Taking an Order from the OrderStream

Setup the page&#39;s console with the following.

```
const paradigm = new Paradigm({ provider: web3.currentProvider, networkId: await web3.eth.net.getId() });
const zeroEx = new ZeroEx(web3.currentProvider, { networkId: await web3.eth.net.getId() });

const coinbase = await web3.eth.getCoinbase();

// Test token addresses
const TKA = "0xc8001ac8faed38171bd8960e2a177b2b80f1e9b0";
const TKB = "0x77ae4cded8c197b4c503895368f077ef6288462b";
const TKC = "0xb55b454e5f040d4c6f148d0590e767ba0dcbc615";
```

The following needs to be configured with the correct txid for the OrderStream order you are wanting to take and the number of the maker&#39;s tokens you wish to trade for:

```
const orderId = 'a6421eb9575ba94f3119e91c66696667defb14c1729d529e0d3026d31318e9e1';

const order = await paradigm.orderStream.find(orderId);

await zeroEx.token.setUnlimitedAllowanceAsync(TKB, coinbase, order.subContract);

const takerValues = {
  tokensToTake: 500,
  throwOnError: false,
  makerTokenReceiver: coinbase
};
```

The following should result in an ethereum transaction.  When mining has been completed the funds should be transferred.

```
await order.take(coinbase, takerValues);
```
