const sequelize = require('../config/database.config')
const {DataTypes} = require('sequelize')

const History = sequelize.define('Hystory', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        notNull: true
    },
    shop_id: {
        type: DataTypes.INTEGER,
        notNull: true
    },
    plu: {
        type: DataTypes.STRING,
        notNull: true,
    },
    action: {
        type: DataTypes.STRING,
        notNull: true
    }
})



module.exports = History
