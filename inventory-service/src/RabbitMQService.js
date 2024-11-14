const amqp = require('amqplib');

class RabbitMQService {
    connection = null
    channel = null

    async connect() {
        try {
            if (!this.connection) {
                this.connection = await amqp.connect(process.env.RABBITMQ_URL);
                this.channel = await this.connection.createChannel();
                console.log('Подключено к RabbitMQ');
            }
        } catch (error) {
            console.error('Ошибка при подключении к RabbitMQ: ', error);
            throw new Error('Ошибка при подключении к RabbitMQ');
        }
    }

    async sendMessage(queueName, message) {
        try {
            if (!this.channel) {
                await this.connect();
            }

            await this.channel.assertQueue(queueName);
            this.channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
            console.log(`Сообщение в очереди "${queueName}": `, message);
        } catch (error) {
            console.error('Ошибка отправки сообщения: ', error);
            throw new Error('Ошибка отправки сообщения');
        }
    }
}

module.exports = new RabbitMQService();