const Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
    dialect: 'sqlite',
    storage: `${__dirname}/data/database.sqlite`
});

var db = {};

db.book = sequelize.import(`${__dirname}/models/book.js`);
db.author = sequelize.import(`${__dirname}/models/author.js`);
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;