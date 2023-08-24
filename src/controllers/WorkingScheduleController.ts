import { Context } from 'koa'
import { IUpdateRequest } from '../http/requests/workingSchedule/UpdateRequest';
import WorkingScheduleService from '../services/WorkingScheduleService';

export default {
    index: async (ctx: Context): Promise<any> => {
        try {
            ctx.status = 200
            ctx.body = { data: await WorkingScheduleService.get() }
        } catch (error: any) {
            ctx.status = 500
            ctx.body = { message: error.message }
        }
    },
    update: async (ctx: Context): Promise<any> => {
        try {
            const request = <IUpdateRequest>ctx.request.body
            const updateResult = await WorkingScheduleService.update(ctx.params.id, request)

            if (!updateResult.isSuccess) {
                ctx.status = updateResult.code
                ctx.body = updateResult.result
                return
            }

            ctx.status = 204
        } catch (error: any) {
            ctx.status = 500
            ctx.body = { message: error.message }
        }
    },
}