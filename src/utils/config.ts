import 'dotenv/config'

export default {
    nodeEnv: process.env.NODE_ENV || '',
    appPort: process.env.PORT || '',
    dbName: process.env.DB_NAME || '',
    testDbName: process.env.TEST_DB_NAME || '',
    mongoUri: process.env.MONGO_URI || '',
    jwtSecret: process.env.JWT_SECRET || '',
    amqpUrl: process.env.AMQP_URL || '',
}