import { Context } from 'koa'
import config from "../utils/config";
import RegisterRequest from "../http/requests/auth/RegisterRequest";
import LoginRequest from "../http/requests/auth/LoginRequest";
import apiMessages from "../utils/apiMessages";
import UserRepository from "../repositories/UserRepository";
import bcrypt from 'bcryptjs'
import jsonwebtoken from 'jsonwebtoken'

export default {
    register: async (ctx: Context): Promise<any> => {
        try {
            const validationResult = RegisterRequest.validate(ctx.request.body);

            if (validationResult.error) {
                ctx.status = 400;
                ctx.body = validationResult.response
                return
            }

            const dbUser = await UserRepository.getByEmail(ctx.request.body.email, ['id'])

            if (dbUser) {
                ctx.status = 400;
                ctx.body = apiMessages[1005]
                return
            }

            ctx.request.body.password = await bcrypt.hash(ctx.request.body.password, 5)

            await UserRepository.create({
                email: ctx.request.body.email,
                password: ctx.request.body.password,
                firstname: ctx.request.body.firstname,
                lastname: ctx.request.body.lastname,
            })
            ctx.status = 201
            ctx.body = apiMessages[2001]
        } catch (error: any) {
            ctx.status = 500;
            ctx.body = { message: error.message }
        }
    },
    login: async (ctx: Context): Promise<any> => {
        try {
            const validationResult = LoginRequest.validate(ctx.request.body);

            if (validationResult.error) {
                ctx.status = 400;
                ctx.body = validationResult.response
                return
            }

            const dbUser = await UserRepository.getByEmail(ctx.request.body.email, ['password'])

            if (!dbUser || !bcrypt.compareSync(ctx.request.body.password, dbUser.password)) {
                ctx.status = 400;
                ctx.body = apiMessages[1020]
                return
            }

            ctx.status = 200
            ctx.body = {
                data: {
                    token: jsonwebtoken.sign({ data: dbUser }, config.jwtSecret),
                }
            }
        } catch (error: any) {
            ctx.status = 500;
            ctx.body = { message: error.message }
        }
    },
}