import { Context } from 'koa'
import WorkingScheduleRepository from "../repositories/WorkingScheduleRepository";
import apiMessages from "../utils/apiMessages";
import { IUpdateRequest } from 'src/http/requests/workingSchedule/UpdateRequest';

export default {
    index: async (ctx: Context): Promise<any> => {
        try {
            const workingSchedules = await WorkingScheduleRepository.get()

            ctx.status = 200
            ctx.body = { data: workingSchedules }
        } catch (error: any) {
            ctx.status = 500
            ctx.body = { message: error.message }
        }
    },
    update: async (ctx: Context): Promise<any> => {
        try {
            const workingSchedule = await WorkingScheduleRepository
                .getById(['id', 'openingTime', 'closingTime'], ctx.params.id)

            if (!workingSchedule) {
                ctx.status = 400
                ctx.body = apiMessages[1051]
                return
            }

            const request = <IUpdateRequest>ctx.request.body;
            let isOpeningTimeLater = false

            if (request.closingTime) {
                if (request.closingTime > 24) {
                    ctx.status = 400
                    ctx.body = apiMessages[1056]
                    return
                } else if (request.closingTime < 1) {
                    ctx.status = 400
                    ctx.body = apiMessages[1055]
                    return
                }

                if (request.openingTime && request.closingTime <= request.openingTime) {
                    isOpeningTimeLater = true
                }

                if (request.closingTime <= workingSchedule.openingTime) {
                    isOpeningTimeLater = true
                }
            }

            if (request.openingTime) {
                if (request.openingTime > 23) {
                    ctx.status = 400
                    ctx.body = apiMessages[1054]
                    return
                } else if (request.openingTime < 0) {
                    ctx.status = 400
                    ctx.body = apiMessages[1053]
                    return
                }

                if (request.closingTime && request.closingTime <= request.openingTime) {
                    isOpeningTimeLater = true
                }

                if (workingSchedule.closingTime <= request.openingTime) {
                    isOpeningTimeLater = true
                }
            }

            if (isOpeningTimeLater) {
                ctx.status = 400
                ctx.body = apiMessages[1052]
                return
            }

            // @TODO Check active reservations in new hours, if there is reservation, block updating

            await WorkingScheduleRepository.update(
                ctx.params.id,
                request.openingTime,
                request.closingTime,
                request.isOpen
            )

            ctx.status = 204
        } catch (error: any) {
            ctx.status = 500
            ctx.body = { message: error.message }
        }
    },
}