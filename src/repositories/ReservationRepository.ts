import Reservation from "../models/Reservation";

export default {
    get: async(status?: string, date?: string) => {
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
        numberOfPeople: number;
        date: string;
        table: string;
        customerFirstname: string;
        customerLastname: string;
        customerEmail?: string;
    }) => {
        return Reservation.create(fields)
    },
    getById: async(fields: string[], id: string) => {
        return Reservation.findById(id).select(fields).exec()
    },
    update: async (
        id: string,
        customerFirstname?: string,
        customerLastname?: string,
        customerEmail?: string,
        status?: string
    ) => {
        const updateData: Record<string, any> = {}

        if (typeof customerFirstname !== 'undefined') {
            updateData.customerFirstname = customerFirstname
        }

        if (typeof customerLastname !== 'undefined') {
            updateData.customerLastname = customerLastname
        }

        if (typeof customerEmail !== 'undefined') {
            updateData.customerEmail = customerEmail
        }

        if (typeof status !== 'undefined') {
            updateData.status = status
        }

        return Reservation.updateOne({ '_id': id }, updateData).exec()
    },
}