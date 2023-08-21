import 'dotenv/config'

export default {
    appPort: process.env.APP_PORT || '',
    dbName: process.env.DB_NAME || '',
    mongoUri: process.env.MONGO_URI || '',
    jwtSecret: process.env.JWT_SECRET || '',
}