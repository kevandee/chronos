const Sequelize = require('sequelize');
const initModels = require('./sequelize/init-models');

const sequelize = new Sequelize("chronos_api", "root", "f1wn661r222", {
    dialect: "mysql",
    host: "localhost",
    define: {
        timestamps: false
    }
});

module.exports = initModels(sequelize);