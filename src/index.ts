import router from './routes/api'
import Koa from 'koa'
import koaLogger from 'koa-logger'
import koaBody from 'koa-body'
import jwt from 'koa-jwt'
import cors from '@koa/cors'
import mongoose from 'mongoose'
import config from "./utils/config";

const app = new Koa()

mongoose.connect(config.mongoUri, { dbName: config.dbName })
mongoose.connection.on('error', console.error)

app.use(koaBody())
app.use(koaLogger())
app.use(cors())
app.use(jwt({ secret: `${config.jwtSecret}` }).unless({ path: [/^\/api\/v1\/auth/] }));
app.use(router.routes()).use(router.allowedMethods())

app.listen(config.appPort)
