import amqp, { Message } from 'amqplib/callback_api'
import config from "../utils/config"
import emailSenderEnums from "../enums/emailSenderEnums"

const emailSenderConsumer =  (amqpURl: string, queueName: string) => {
  console.log('Connecting to RabbitMQ...')
  return () => {
    amqp.connect(amqpURl, (errConn, conn) => {
      if (errConn) {
        throw errConn
      }

      conn.createChannel((errChan, chan) => {
        if (errChan) {
          throw errChan
        }

        console.log('Connected to RabbitMQ')
        chan.assertQueue(queueName, { durable: true })
        chan.consume(queueName, (msg: Message | null) => {
          if (msg) {
            console.log(msg)
          }
        }, { noAck: true })
      })
    })
  }
}

console.log(config.amqpUrl, emailSenderEnums.RMQ_CHANNEL)
emailSenderConsumer(config.amqpUrl, emailSenderEnums.RMQ_CHANNEL)()
