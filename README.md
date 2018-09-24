# ParadigmJS


ParadigmJS is a javascript library designed to provide a clean integration with the Paradigm Protocol global liquidity network and underlying Ethereum contracts.

### Usage

Install ParadigmJS with your preferred node package manager:

`npm i paradigm.js`  
`yarn add paradigm.js`  

Import the object with the appropriate javascript:

`const Paradigm = require('paradigm.js')`  
`import * as Paradigm from 'paradigm.js'`  

Initialize ParadigmJS with the default configuration:

`const paradigm = new Paradigm()`

Optional configuration object:

```
{
  provider: web3.currentProvider, //web3 provider  defaults to a ropsten infura http provider
  orderStreamUrl: 'https://url.tocustom.orderstream', //base url for the OrderStream defaults to https://osd.paradigm.network
}
```

##### Key Objects Exposed

Order:

`paradigm.Order`

Used to wrap contract input for the ethereum contract system.  Provides some functionality to assist in taking Orders 
from the Order Stream and submitting them to the blockchain.


orderStream: 

`paradigm.OrderStream`

Used to post and receive orders from the Paradigm global liquidity Order Stream.
