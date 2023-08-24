import { Context } from 'koa'
import ReservationRepository from "../repositories/ReservationRepository";
import StoreRequest, { IStoreRequest } from "../http/requests/reservation/StoreRequest";
import apiMessages from "../utils/apiMessages";
import ReservationEnums from "../enums/reservationEnums";
import ReservationService from '../services/ReservationService';

export default {
    index: async (ctx: Context): Promise<any> => {
        try {
            const reservations = await ReservationRepository.get(ctx.request.body.status)

            ctx.status = 200
            ctx.body = { data: reservations }
        } catch (error: any) {
            ctx.status = error.statusCode || error.status || 500;
            ctx.body = { message: error.message }
        }
    },
    store: async (ctx: Context): Promise<any> => {
        try {
            const request = <IStoreRequest>ctx.request.body;
            const validationResult = StoreRequest.validate(request);

            if (validationResult.error) {
                ctx.status = 400
                ctx.body = validationResult.response
                return
            }

            const updateResponse = await ReservationService.store(request)

            if (!updateResponse.isSuccess) {
                ctx.status = updateResponse.code
                ctx.body = updateResponse.result
                return
            }

            ctx.status = 204

            ctx.status = 201
        } catch (error: any) {
            ctx.status = 500
            ctx.body = { message: error.message }
        }
    },
    update: async (ctx: Context): Promise<any> => {
        try {
            const reservation = await ReservationRepository.getById(['id', 'status'], ctx.params.id)

            if (!reservation) {
                ctx.status = 400
                ctx.body = apiMessages[1079]
                return
            }

            if (typeof ctx.request.body.status !== 'undefined'
                && !ReservationEnums.ALL_AVAILABLE_STATUSES.includes(ctx.request.body.status)) {
                ctx.status = 400
                ctx.body = apiMessages[1080]
                return
            }

            // @TODO update date --> check working day hours
            // @TODO update table --> check table availability
            // @TODO update numberOfPeople --> check table capacity

            await ReservationRepository.update(
                ctx.params.id,
                ctx.request.body.customerFirstname,
                ctx.request.body.customerLastname,
                ctx.request.body.status,
            )

            ctx.status = 204
        } catch (error: any) {
            ctx.status = 500
            ctx.body = { message: error.message }
        }
    },
    destroy: async (ctx: Context): Promise<any> => {
        try {
            const reservation = await ReservationRepository.getById(['id', 'status'], ctx.params.id)

            if (!reservation) {
                ctx.status = 400
                ctx.body = apiMessages[1079]
                return
            }

            await ReservationRepository.update(
                ctx.params.id,
                undefined,
                undefined,
                'deleted'
            )

            ctx.status = 204
        } catch (error: any) {
            ctx.status = 500
            ctx.body = { message: error.message }
        }
    },
}