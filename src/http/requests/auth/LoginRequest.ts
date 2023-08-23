import apiMessages from "../../../utils/apiMessages";

export interface ILoginRequest {
    email: String,
    password: string,
}

export default {
    validate: (requestBody: { email: String; password: String }) => {
        if (!requestBody.email) {
            return { error: true, response: apiMessages[1001] }
        }

        if (!requestBody.password) {
            return { error: true, response: apiMessages[1002] }
        }

        return { error: false }
    }
}
