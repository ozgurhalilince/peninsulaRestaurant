import amqp, { Connection } from 'amqplib/callback_api'

export default async (amqpUrl: string, queueName: string, message: string) => {
  console.log('Connecting to RabbitMQ...')
  let ch: any
  amqp.connect(amqpUrl, (errorConnect: Error, connection: Connection) => {
    if (errorConnect) {
      console.log('Error connecting to RabbitMQ: ', errorConnect)
      return
    }

    connection.createChannel((errorChannel, channel) => {
      if (errorChannel) {
        console.log('Error creating channel: ', errorChannel)
        return
      }

      channel.sendToQueue(queueName, Buffer.from(message))
      console.log('Connected to RabbitMQ')
    })
  })
}