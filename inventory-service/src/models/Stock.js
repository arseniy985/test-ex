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
        unique: true,
        allowNull: false
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
        allowNull: false
    },
    productId: {
        type: DataTypes.INTEGER,
        references: {
            model: Product,
            key: 'id'
        },
        allowNull: false
    }
});

Stock.belongsTo(Product, { foreignKey: 'productId' });
Product.hasMany(Stock, { foreignKey: 'productId' });

module.exports = Stock;