const amqp = require('amqplib');

class RabbitMQService {
    connection = null
    channel = null

    static async connect() {
        try {
            if (!this.connection) {
                this.connection = await amqp.connect(process.env.RABBITMQ_URL);
                this.channel = await this.connection.createChannel();
                await this.channel.assertQueue('product_actions', { durable: true }); // Добавьте durable: true
                console.log('Подключено к RabbitMQ');
            }
        } catch (error) {
            console.error('Ошибка при подключении к RabbitMQ: ', error);
            throw new Error('Ошибка при подключении к RabbitMQ');
        }
    }


    static async sendMessage(queueName, message) {
        try {
            if (!this.channel) {
                await this.connect();
            }

            this.channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
        } catch (error) {
            console.error('Ошибка отправки сообщения: ', error);
            throw new Error('Ошибка отправки сообщения');
        }
    }

    static async consumeMessages(queueName, callback) {
        try {
            if (!this.channel) {
                await this.connect();
            }

            await this.channel.consume(queueName, async (message) => {
                if (message) {
                    const messageContent = message.content.toString();
                    const parsedMessage = JSON.parse(messageContent);
                    await callback(parsedMessage);

                    this.channel.ack(message);
                }
            }, {noAck: false});
        } catch (error) {
            console.error('Ошибка получения сообщений:', error);
        }
    }
}

module.exports = RabbitMQService;