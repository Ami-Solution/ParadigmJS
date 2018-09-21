ParadigmJS
=

ParadigmJS is a javascript library designed to provide a clean integration with the Paradigm Protocol global liquidity network and underlying Ethereum contracts.

### Usage

Install ParadigmJS with your preferred node package manager:

`npm i paradigm.js`,
`yarn add paradigm.js`,
etc...

Import the object with the appropriate javascript

`const Paradigm = require('paradigm.js')`,  
`import * as Paradigm from 'paradigm.js'`,  
etc...

Initialize ParadigmJS with the default configuration.

`const paradigm = new Paradigm()`

Optional configuration object

```
{
  provider: web3.currentProvider, //web3 provider  defaults to ropsten infura
  orderStreamUrl: 'https://osd.paradigm.network', //base url for the OrderStream
}
```

Key Objects Exposed

order:
orderStream: 
