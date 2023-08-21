import { Context } from 'koa'
import TableRepository from "../repositories/TableRepository";
import apiMessages from "../utils/apiMessages";
import StoreTableRequest from "../http/requests/table/StoreRequest";

export default {
  index: async (ctx: Context): Promise<any> => {
    try {
      const tables = await TableRepository.get(['name', 'description', 'seatCount'])

      ctx.status = 200
      ctx.body = { data: tables }
    } catch (error: any) {
      ctx.status = 500;
      ctx.body = { message: error.message }
    }
  },
  store: async (ctx: Context): Promise<any> => {
    try {
      const validationResult = StoreTableRequest.validate(ctx.request.body);

      if (validationResult.error) {
        ctx.status = 400;
        ctx.body = validationResult.response
        return
      }

      const dbTable = await TableRepository.get(['id'], ctx.request.body.name)

      if (dbTable.length > 0) {
        ctx.status = 400;
        ctx.body = apiMessages[1042]
        return
      }

      const table = await TableRepository.create({
        name: ctx.request.body.name,
        seatCount: ctx.request.body.seatCount,
        description: ctx.request.body.description,
      })
      ctx.status = 201
      ctx.body = { data: table }
    } catch (error: any) {
      ctx.status = 500;
      ctx.body = { message: error.message }
    }
  },
  show: async (ctx: Context): Promise<any> => {
    try {
      const table = await TableRepository.getById(['id', 'name', 'description', 'seatCount'], ctx.params.id)

      if (!table) {
        ctx.status = 400;
        ctx.body = apiMessages[1043]
        return
      }

      ctx.status = 200
      ctx.body = { data: table }
    } catch (error: any) {
      ctx.status = 500;
      ctx.body = { message: error.message }
    }
  },
  update: async (ctx: Context): Promise<any> => {
    try {
      const table = await TableRepository.getById(['id', 'name', 'description', 'seatCount'], ctx.params.id)

      if (!table) {
        ctx.status = 400;
        ctx.body = apiMessages[1043]
        return
      }

      // @TODO Check active reservations for seat count, if higher block updating

      await TableRepository.update(ctx.params.id, ctx.request.body.seatCount, ctx.request.body.description)

      ctx.status = 204
    } catch (error: any) {
      ctx.status = error.statusCode || error.status || 500;
      ctx.body = { message: error.message }
    }
  },
  destroy: async (ctx: Context): Promise<any> => {
    try {
      const table = await TableRepository.getById(['id', 'name', 'description', 'seatCount'], ctx.params.id)

      if (!table) {
        ctx.status = 400;
        ctx.body = apiMessages[1043]
        return
      }
      // @TODO Check active reservations and block deletion

      await TableRepository.update(ctx.params.id, undefined, undefined, true)

      ctx.status = 204
    } catch (error: any) {
      ctx.status = error.statusCode || error.status || 500;
      ctx.body = { message: error.message }
    }
  },
}