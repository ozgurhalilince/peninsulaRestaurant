import { Context } from 'koa'
import ReservationRepository from "../repositories/ReservationRepository";
import StoreRequest, { IStoreRequest } from "../http/requests/reservation/StoreRequest";
import TableRepository from "../repositories/TableRepository";
import apiMessages from "../utils/apiMessages";
import WorkingScheduleRepository from "../repositories/WorkingScheduleRepository";
import ReservationEnums from "../enums/reservationEnums";

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

            const table = await TableRepository.getById(['id', 'seatCount'], request.tableId)

            if (!table) {
                ctx.status = 400
                ctx.body = apiMessages[1043]
                return
            } else if (table.seatCount < request.numberOfPeople) {
                ctx.status = 400
                ctx.body = apiMessages[1073]
                return
            }

            const date = new Date(request.date)
            const requestedDayIndex = date.getUTCDay()
            const requestedHour = date.getHours()
            const workingScheduleDay = await WorkingScheduleRepository.getByDayIndex(requestedDayIndex);

            if (!workingScheduleDay) {
                ctx.status = 400
                ctx.body = apiMessages[1077]
                return
            }

            if (!workingScheduleDay.isOpen) {
                ctx.status = 400
                ctx.body = apiMessages[1076]
                return
            }

            if (workingScheduleDay.openingTime > requestedHour) {
                ctx.status = 400
                ctx.body = apiMessages[1076]
                return
            } else if (workingScheduleDay.closingTime < requestedHour) {
                ctx.status = 400
                ctx.body = apiMessages[1076]
                return
            }

            const activeReservation = await ReservationRepository.get('active', request.date)

            if (activeReservation.length > 0) {
                ctx.status = 400
                ctx.body = apiMessages[1078]
                return
            }

            const reservation = await ReservationRepository.create({
                customerFirstname: request.customerFirstname,
                customerLastname: request.customerLastname,
                numberOfPeople: request.numberOfPeople,
                date: request.date,
                table: request.tableId,
            })
            ctx.status = 201
            ctx.body = { data: reservation }
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