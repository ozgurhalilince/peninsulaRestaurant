import apiMessages from "../../../utils/apiMessages";

export interface IRegisterRequest {
    email: string,
    password: string,
    firstname: string,
    lastname: string,
}

export default {
    validate: (requestBody: { email: string; password: string; firstname: string; lastname: string }) => {
        if (typeof requestBody === 'undefined') {
            return { error: true, response: apiMessages[1001] }
        }

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
