import { IStoreRequest } from "../http/requests/reservation/StoreRequest"
import TableRepository from "../repositories/TableRepository"
import apiMessages from "../utils/apiMessages"
import ManualResponse, { IManualResponse } from "../valueObjects/ManualResponse"
import WorkingScheduleRepository from "../repositories/WorkingScheduleRepository"
import ReservationRepository from "../repositories/ReservationRepository"


export default {
    store: async (request:IStoreRequest): Promise<IManualResponse> => {
        const table = await TableRepository.getById(['id', 'seatCount'], request.tableId)

        if (!table) {
            return new ManualResponse(false, 400, apiMessages[1043])
        } else if (table.seatCount < request.numberOfPeople) {
            return new ManualResponse(false, 400, apiMessages[1073])
        }

        const date = new Date(request.date)
        const requestedDayIndex = date.getUTCDay()
        const requestedHour = date.getHours()
        const workingScheduleDay = await WorkingScheduleRepository.getByDayIndex(requestedDayIndex);

        if (!workingScheduleDay) {
            return new ManualResponse(false, 400, apiMessages[1077])
        }

        if (!workingScheduleDay.isOpen) {
            return new ManualResponse(false, 400, apiMessages[1076])
        }

        if (workingScheduleDay.openingTime > requestedHour) {
            return new ManualResponse(false, 400, apiMessages[1076])
        } else if (workingScheduleDay.closingTime < requestedHour) {
            return new ManualResponse(false, 400, apiMessages[1076])
        }

        const activeReservation = await ReservationRepository.get('active', request.date)

        if (activeReservation.length > 0) {
            return new ManualResponse(false, 400, apiMessages[1078])
        }

        await ReservationRepository.create({
            customerFirstname: request.customerFirstname,
            customerLastname: request.customerLastname,
            customerEmail: request.customerEmail,
            numberOfPeople: request.numberOfPeople,
            date: request.date,
            table: request.tableId,
        })

        return new ManualResponse(true, 204)     
    }
}