import { model, Schema } from 'mongoose'

export interface ITable {
    name: string,
    description: string,
    seatCount: number,
    isDeleted: boolean
}

const tableSchema = new Schema<ITable>({
    name: { type: String, required: true },
    description: { type: String, required: false },
    seatCount: { type: Number, required: true },
    isDeleted: { type: Boolean, default: false }
}, { timestamps: true })

export default model<ITable>('Table', tableSchema)
