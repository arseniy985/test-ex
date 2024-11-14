const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes/index');
const sequelize = require('./config/database.config');
const Queue = require('./RabbitMQService')

const app = express();
app.use(bodyParser.json());

// Маршруты
app.use('/api', routes);

sequelize.sync().then(() => {
    console.log('Database synced');
    Queue.connect().then(() => {
        app.listen(3000, () => {
            console.log('Product service running on port 3000');
        });
    })
}).catch(err => {
    console.error('Ошибка: ' + err.message)
});

module.exports = app;
