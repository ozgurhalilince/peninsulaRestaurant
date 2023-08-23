import { Context } from 'koa'
import TableRepository from "../repositories/TableRepository";
import apiMessages from "../utils/apiMessages";
import StoreTableRequest, { IStoreRequest} from "../http/requests/table/StoreRequest";
import { IUpdateRequest} from "../http/requests/table/UpdateRequest";

export default {
  index: async (ctx: Context): Promise<any> => {
    try {
      const tables = await TableRepository.get(['name', 'description', 'seatCount'])

      ctx.status = 200
      ctx.body = { data: tables }
    } catch (error: any) {
      ctx.status = 500
      ctx.body = { message: error.message }
    }
  },
  store: async (ctx: Context): Promise<any> => {
    try {
      const request = <IStoreRequest>ctx.request.body;
      const validationResult = StoreTableRequest.validate(request);

      if (validationResult.error) {
        ctx.status = 400
        ctx.body = validationResult.response
        return
      }

      const dbTable = await TableRepository.get(['id'], request.name)

      if (dbTable.length > 0) {
        ctx.status = 400
        ctx.body = apiMessages[1042]
        return
      }

      const table = await TableRepository.create({
        name: request.name,
        seatCount: request.seatCount,
        description: request.description,
      })
      ctx.status = 201
      ctx.body = { data: table }
    } catch (error: any) {
      ctx.status = 500
      ctx.body = { message: error.message }
    }
  },
  show: async (ctx: Context): Promise<any> => {
    try {
      const table = await TableRepository.getById(['id', 'name', 'description', 'seatCount'], ctx.params.id)

      if (!table) {
        ctx.status = 400
        ctx.body = apiMessages[1043]
        return
      }

      ctx.status = 200
      ctx.body = { data: table }
    } catch (error: any) {
      ctx.status = 500
      ctx.body = { message: error.message }
    }
  },
  update: async (ctx: Context): Promise<any> => {
    try {
      const request = <IUpdateRequest>ctx.request.body;
      const table = await TableRepository.getById(['id', 'name', 'description', 'seatCount'], ctx.params.id)

      if (!table) {
        ctx.status = 400
        ctx.body = apiMessages[1043]
        return
      }

      // @TODO Check active reservations for seat count, if higher block updating

      await TableRepository.update(ctx.params.id, request.seatCount, request.description)

      ctx.status = 204
    } catch (error: any) {
      ctx.status = 500
      ctx.body = { message: error.message }
    }
  },
  destroy: async (ctx: Context): Promise<any> => {
    try {
      const table = await TableRepository.getById(['id', 'name', 'description', 'seatCount'], ctx.params.id)

      if (!table) {
        ctx.status = 400
        ctx.body = apiMessages[1043]
        return
      }
      // @TODO Check active reservations and block deletion

      await TableRepository.update(ctx.params.id, undefined, undefined, true)

      ctx.status = 204
    } catch (error: any) {
      ctx.status = 500
      ctx.body = { message: error.message }
    }
  },
}