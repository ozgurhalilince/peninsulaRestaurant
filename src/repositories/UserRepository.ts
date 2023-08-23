import User from '../models/User'

export default {
    get: async(fields: string[]) => {
        return User.find().select(fields)
    },
    getByEmail: async(email: string, fields: string[]) => {
        return User.findOne({ email}).select(fields)
    },
    create: async (fields: { password: string; firstname: string; email: string; lastname: string }) => {
        return User.create(fields)
    }
}