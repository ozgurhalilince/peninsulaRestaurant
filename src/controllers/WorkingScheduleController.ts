import { Context } from 'koa'
import WorkingScheduleRepository from "../repositories/WorkingScheduleRepository";
import apiMessages from "../utils/apiMessages";

export default {
    index: async (ctx: Context): Promise<any> => {
        try {
            const workingSchedules = await WorkingScheduleRepository.get()

            ctx.status = 200
            ctx.body = { data: workingSchedules }
        } catch (error: any) {
            ctx.status = error.statusCode || error.status || 500;
            ctx.body = { message: error.message }
        }
    },
    update: async (ctx: Context): Promise<any> => {
        try {
            const workingSchedule = await WorkingScheduleRepository
                .getById(['id', 'openingTime', 'closingTime'], ctx.params.id)

            if (!workingSchedule) {
                ctx.status = 400;
                ctx.body = apiMessages[1051]
                return
            }

            const requestBody = ctx.request.body;
            let isOpeningTimeLater = false

            if (requestBody.closingTime) {
                if (requestBody.closingTime > 24) {
                    ctx.status = 400;
                    ctx.body = apiMessages[1056]
                    return
                } else if (requestBody.closingTime < 1) {
                    ctx.status = 400;
                    ctx.body = apiMessages[1055]
                    return
                }

                if (requestBody.openingTime && requestBody.closingTime <= requestBody.openingTime) {
                    isOpeningTimeLater = true
                }

                if (requestBody.closingTime <= workingSchedule.openingTime) {
                    isOpeningTimeLater = true
                }
            }

            if (requestBody.openingTime) {
                if (requestBody.openingTime > 23) {
                    ctx.status = 400;
                    ctx.body = apiMessages[1054]
                    return
                } else if (requestBody.openingTime < 0) {
                    ctx.status = 400;
                    ctx.body = apiMessages[1053]
                    return
                }

                if (requestBody.closingTime && requestBody.closingTime <= requestBody.openingTime) {
                    isOpeningTimeLater = true
                }

                if (workingSchedule.closingTime <= requestBody.openingTime) {
                    isOpeningTimeLater = true
                }
            }

            if (isOpeningTimeLater) {
                ctx.status = 400;
                ctx.body = apiMessages[1052]
                return
            }

            // @TODO Check active reservations in new hours, if there is reservation, block updating

            await WorkingScheduleRepository.update(
                ctx.params.id,
                requestBody.openingTime,
                requestBody.closingTime,
                requestBody.isOpen
            )

            ctx.status = 204
        } catch (error: any) {
            ctx.status = error.statusCode || error.status || 500;
            ctx.body = { message: error.message }
        }
    },
}