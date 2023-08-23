import apiMessages from "../../../utils/apiMessages";

export interface IRegisterRequest {
    email: String,
    password: string,
    firstname: String,
    lastname: String,
}

export default {
    validate: (requestBody: { email: String; password: String; firstname: String; lastname: String }) => {
        if (!requestBody.email) {
            return { error: true, response: apiMessages[1001] }
        }

        if (!requestBody.password) {
            return { error: true, response: apiMessages[1002] }
        }

        if (!requestBody.firstname) {
            return { error: true, response: apiMessages[1003] }
        }

        if (!requestBody.lastname) {
            return { error: true, response: apiMessages[1004] }
        }

        return { error: false }
    }
}
