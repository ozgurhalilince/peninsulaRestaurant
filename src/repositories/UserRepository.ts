import User from '../models/User'

export default {
    get: async(fields: string[]) => {
        return User.find().select(fields)
    },
    getByEmail: async(email: String, fields: string[]) => {
        return User.findOne({ email}).select(fields)
    },
    create: async (fields: { password: String; firstname: String; email: String; lastname: String }) => {
        return User.create(fields)
    }
}