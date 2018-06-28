const Bank = require('./lib/bank');

const ParadigmJS = class {
  constructor() {

  }
};


ParadigmJS.utils = require('./lib/utils');
ParadigmJS.Bank = Bank;
ParadigmJS.messages = require('./lib/messages');

module.exports = ParadigmJS;