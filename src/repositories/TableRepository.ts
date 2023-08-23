import Table from '../models/Table'

export default {
    get: async(fields: string[], name?: string) => {
        const filters: Record<string, any> = {}

        filters.isDeleted = false

        if (typeof name !== 'undefined' && name.length !== 0) {
            filters.name = name
        }

        return Table.find(filters).select(fields).exec()
    },
    getById: async(fields: string[], id: string) => {
        return Table.findById(id).select(fields).exec()
    },
    create: async (fields: { name: string; seatCount: number; description?: string }) => {
        return Table.create(fields)
    },
    update: async (id: string, seatCount?: number, description?: string, isDeleted?: Boolean) => {
        const updateData: Record<string, any> = {}

        if (typeof seatCount !== 'undefined') {
            updateData.seatCount = seatCount
        }

        if (typeof description !== 'undefined') {
            updateData.description = description
        }

        if (typeof isDeleted !== 'undefined') {
            updateData.isDeleted = isDeleted
        }

        return Table.updateOne({ '_id': id }, updateData).exec()
    },
}