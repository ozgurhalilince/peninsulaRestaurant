import { Context } from 'koa'
import UserRepository from "../repositories/UserRepository";

export default {
  index: async (ctx: Context): Promise<any> => {
    try {
      const users = await UserRepository.get(['name', 'email'])

      ctx.status = 200
      ctx.body = { data: users }
    } catch (error: any) {
      ctx.status = 500
      ctx.body = { message: error.message }
    }
  }
}