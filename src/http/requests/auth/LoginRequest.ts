import apiMessages from "../../../utils/apiMessages";

export interface ILoginRequest {
    email: string,
    password: string,
}

export default {
    validate: (requestBody: { email: string; password: string }) => {
        if (!requestBody.email) {
            return { error: true, response: apiMessages[1001] }
        }

        if (!requestBody.password) {
            return { error: true, response: apiMessages[1002] }
        }

        return { error: false }
    }
}
