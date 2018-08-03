//TODO:THIS IS TEMP FOR TESTS
const TOKEN = require('./contracts/Token');

const Token = {
  abi: TOKEN.abi,
  bytecode: TOKEN.bytecode,
  deploy: async (web3, name, symbol, from) => {
    const transaction = new web3.eth.Contract(Token.abi).deploy({ data: Token.bytecode , arguments: [name, symbol] });
    return await transaction.send({ from, gas: await transaction.estimateGas({ from }) });
  }
};

module.exports = Token;