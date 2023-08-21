import { model, Schema } from 'mongoose'

export interface IWorkingSchedule {
    day: string,
    utcDayIndex: number,
    openingTime: number,
    closingTime: number,
    isOpen: Boolean
}

const schema = new Schema<IWorkingSchedule>({
    day: {
        type: String,
        enum: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        required: true,
    },
    utcDayIndex: Number,
    openingTime: { type: Number, required: false },
    closingTime: { type: Number, required: true },
    isOpen: { type: Boolean, default: true, required: true }
}, { timestamps: true })

export default model<IWorkingSchedule>('WorkingSchedule', schema)
