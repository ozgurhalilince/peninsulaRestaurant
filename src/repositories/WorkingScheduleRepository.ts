import WorkingSchedule from "../models/WorkingSchedule";

export default {
    get: async() => {
        return WorkingSchedule.find().exec()
    },
    getById: async(fields: string[], id: string) => {
        return WorkingSchedule.findById(id).select(fields).exec()
    },
    getByDayIndex: async(utcDayIndex: number) => {
        return WorkingSchedule.findOne({ utcDayIndex: utcDayIndex }).exec()
    },
    update: async (id: string, openingTime?: number, closingTime?: number, isOpen?: boolean) => {
        const updateData: Record<string, any> = {}

        if (typeof openingTime !== 'undefined') {
            updateData.openingTime = openingTime
        }

        if (typeof closingTime !== 'undefined') {
            updateData.closingTime = closingTime
        }

        if (typeof isOpen !== 'undefined') {
            updateData.isOpen = isOpen
        }

        return WorkingSchedule.updateOne({ '_id': id }, updateData).exec()
    },
}