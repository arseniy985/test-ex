const { DataTypes } = require('sequelize');
const sequelize  = require('../config/database.config');
const Product = require('./Product');

const Stock = sequelize.define('Stock', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        notNull: true
    },
    plu: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: Product,
            key: 'plu'
        }
    },
    shelfQuantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        notNull: true
    },
    orderQuantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        notNull: true
    },
    shopId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    },
});

Stock.belongsTo(Product, { foreignKey: 'plu' });
Product.hasMany(Stock, { foreignKey: 'plu' });

module.exports = Stock;