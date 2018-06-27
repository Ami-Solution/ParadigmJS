const Bank = require('./lib/bank');

const ParadigmJS = class {
  constructor() {

  }
};


ParadigmJS.utils = require('./lib/utils');
ParadigmJS.Bank = Bank;

module.exports = ParadigmJS;