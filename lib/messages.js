const ethUtil = require('ethereumjs-util');
const solSHA3 = require('ethereumjs-abi').soliditySHA3;
const Web3 = require('web3');
let web3;

const _error = (s) => {
  throw new Error(s);
};

const messages = {
  signMessage: async (dataTypes, data, provider, signer) => {
    web3 = new Web3(provider);
    const messageHex = messages.toHash(dataTypes, data);
    const signature = await messages.generateSignature(messageHex, signer.toLowerCase());
    return [messageHex, signature];
  },
  toHash: (dataTypes, data) => {
    messages.validate(dataTypes, data);
    return ethUtil.bufferToHex(messages.generateHash(dataTypes, data));
  },
  validate: (dataTypes, data) => {
    dataTypes.forEach((type, i) => {
      switch(type) {
        case 'address':
          if(!Web3.utils.isAddress(data[i])) _error(`Data at index ${i} is not a valid address`);
      }
    })
  },
  validateSignature: (message, signature, signer) => {
    const msgBuffer = ethUtil.hashPersonalMessage(ethUtil.toBuffer(message)); //TODO: ASSUMING eth_sign message prefix atm
    try {
      const rawPub = ethUtil.ecrecover(msgBuffer, signature[0], signature[1], signature[2]);
      const calculatedPublicKey = ethUtil.bufferToHex(ethUtil.publicToAddress(rawPub));
      return calculatedPublicKey === signer;
    } catch (e) {
      return false;
    }
  },
  generateHash: (dataTypes, data) => {
    return solSHA3(dataTypes, data);
  },
  generateSignature: async (messageHex, signer) => {
    const rawSignature = await web3.eth.sign(messageHex, signer);
    const rawSignatureBuffer = ethUtil.toBuffer(rawSignature);

    let v, r, s;

    //Try V, R, S
    v = rawSignatureBuffer[0];
    r = rawSignatureBuffer.slice(1, 33);
    s = rawSignatureBuffer.slice(33, 65);
    if(v < 27) v = 27;
    if(!messages.validateSignature(messageHex, [v, r, s], signer)) {
      //TRY R, S, V
      const sig = ethUtil.fromRpcSig(rawSignature);
      v = sig.v;
      r = sig.r;
      s = sig.s;
    }
    if(!messages.validateSignature(messageHex, [v, r, s], signer)) {
      throw new Error('bad sig')
    }

    return [v, ethUtil.bufferToHex(r), ethUtil.bufferToHex(s)];
  }
};

module.exports = messages;