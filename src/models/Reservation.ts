import mongoose, { Schema } from 'mongoose'
import { ITable } from './Table'
import Table from "./Table";

export interface ReservationInterface {
    _id: string,
    customerFirstname: string,
    customerLastname: string,
    numberOfPeople: number,
    date: string,
    status: string,
    table: ITable
}

// To fix https://github.com/Automattic/mongoose/issues/4291
mongoose.Promise = global.Promise;

const ReservationSchema = new Schema({
    customerFirstname: { type: String, required: true },
    customerLastname: { type: String, required: true },
    numberOfPeople: { type: Number, required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ['active', 'deleted', 'cancelled', 'completed'], default: 'active' },
    table: { type: Schema.Types.ObjectId, ref: 'Table' }
})

export default mongoose.model('Reservation', ReservationSchema)