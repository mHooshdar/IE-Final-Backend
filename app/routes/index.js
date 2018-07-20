const utils = require('./utils');
const category = require('./category');
const home = require('./home');
const product = require('./product');
const profile = require('./profile');
const search = require('./search');
const bag = require('./bag');
module.exports = function(app, db) {
  utils(app, db);
  category(app, db);
  home(app, db);
  product(app, db);
  profile(app, db);
  search(app, db);
  bag(app, db);
};