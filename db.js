const Sequelize = require('sequelize');
const sequelize = new Sequelize(undefined, undefined, undefined, {
    dialect: 'sqlite',
    storage: `${__dirname}/data/database.sqlite`
});

//Models
// var Table = sequelize.define('Table', {
//     column1: {
//         type: Sequelize.STRING
//     },
//     column2: {
//         type: Sequelize.STRING
//     }
// });

sequelize.sync().then(function () {
    console.log('Everything Synced');
});