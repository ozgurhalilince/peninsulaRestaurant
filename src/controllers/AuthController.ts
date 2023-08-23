import { Context } from 'koa'
import config from "../utils/config";
import RegisterRequest, { IRegisterRequest } from "../http/requests/auth/RegisterRequest";
import LoginRequest, { ILoginRequest } from "../http/requests/auth/LoginRequest";
import apiMessages from "../utils/apiMessages";
import UserRepository from "../repositories/UserRepository";
import bcrypt from 'bcryptjs'
import jsonwebtoken from 'jsonwebtoken'

export default {
    register: async (ctx: Context): Promise<any> => {
        try {
            const request = <IRegisterRequest>ctx.request.body;
            const validationResult = RegisterRequest.validate(request);

            if (validationResult.error) {
                ctx.status = 400;
                ctx.body = validationResult.response
                return
            }

            const dbUser = await UserRepository.getByEmail(request.email, ['id'])

            if (dbUser) {
                ctx.status = 400;
                ctx.body = apiMessages[1005]
                return
            }

            await UserRepository.create({
                email: request.email,
                password: bcrypt.hashSync(request.password, 5),
                firstname: request.firstname,
                lastname: request.lastname,
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
            const request = <ILoginRequest>ctx.request.body;
            const validationResult = LoginRequest.validate(request);

            if (validationResult.error) {
                ctx.status = 400;
                ctx.body = validationResult.response
                return
            }

            const dbUser = await UserRepository.getByEmail(request.email, ['password'])

            if (!dbUser || !bcrypt.compareSync(request.password, dbUser.password)) {
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