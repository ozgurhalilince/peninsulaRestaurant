import WorkingScheduleRepository from "../repositories/WorkingScheduleRepository"
import { IUpdateRequest } from "../http/requests/workingSchedule/UpdateRequest"
import apiMessages from "../utils/apiMessages"
import ManualResponse, { IManualResponse } from "../valueObjects/ManualResponse"

export default {
    get: async () => {
        return await WorkingScheduleRepository.get()
    },
    update: async(requestedId: string, request: IUpdateRequest): Promise<IManualResponse> => {
        const workingSchedule = await WorkingScheduleRepository
                .getById(['id', 'openingTime', 'closingTime'], requestedId)

        if (!workingSchedule) {
            return new ManualResponse(false, 400, apiMessages[1051])
        }

        if (request.closingTime) {
            if (request.closingTime > 24) {
                return new ManualResponse(false, 400, apiMessages[1056])
            } else if (request.closingTime < 1) {
                return new ManualResponse(false, 400, apiMessages[1055])
            }

            if (request.openingTime && request.closingTime <= request.openingTime) {
                return new ManualResponse(false, 400, apiMessages[1052])
            }

            if (request.closingTime <= workingSchedule.openingTime) {
                return new ManualResponse(false, 400, apiMessages[1052])
            }
        }

        if (request.openingTime) {
            if (request.openingTime > 23) {
                return new ManualResponse(false, 400, apiMessages[1054])
            } else if (request.openingTime < 0) {
                return new ManualResponse(false, 400, apiMessages[1053])
            }

            if (request.closingTime && request.closingTime <= request.openingTime) {
                return new ManualResponse(false, 400, apiMessages[1052])
            }

            if (workingSchedule.closingTime <= request.openingTime) {
                return new ManualResponse(false, 400, apiMessages[1052])
            }
        }

        // @TODO Check active reservations in new hours, if there is reservation, block updating

        await WorkingScheduleRepository.update(
            requestedId,
            request.openingTime,
            request.closingTime,
            request.isOpen
        )

        return new ManualResponse(true, 204)       
    }
}