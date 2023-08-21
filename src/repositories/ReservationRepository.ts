import Reservation from "../models/Reservation";

export default {
    get: async(status?: String, date?: String) => {
        const filters: Record<string, any> = {}

        filters.status = 'active'

        if (typeof status !== 'undefined') {
            filters.status = status
        }

        if (typeof date !== 'undefined') {
            filters.date = date
        }

        return Reservation.find(filters).exec()
    },
    create: async (fields: {
        customerFirstname: String;
        customerLastname: Number;
        numberOfPeople: String;
        date: String;
        table: String;
    }) => {
        return Reservation.create(fields)
    },
    getById: async(fields: string[], id: string) => {
        return Reservation.findById(id).select(fields).exec()
    },
    update: async (
        id: String,
        customerFirstname?: String,
        customerLastname?: String,
        status?: String
    ) => {
        const updateData: Record<string, any> = {}

        if (typeof customerFirstname !== 'undefined') {
            updateData.customerFirstname = customerFirstname
        }

        if (typeof customerLastname !== 'undefined') {
            updateData.customerLastname = customerLastname
        }

        if (typeof status !== 'undefined') {
            updateData.status = status
        }

        return Reservation.updateOne({ '_id': id }, updateData).exec()
    },
}