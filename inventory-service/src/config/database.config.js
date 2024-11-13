import {Sequelize} from "sequelize";

const sequelize = new Sequelize(
    process.env.DATABASE_NAME,
    process.env.DATABASE_USER,
    process.env.DATABASE_PASSWORD,
    {
        host: 'db',
        dialect: 'postgres',
        port: 5432,
        logging: false
    }
)

module.exports = sequelize