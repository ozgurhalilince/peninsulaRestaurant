import apiMessages from "../../../utils/apiMessages";

export interface IStoreRequest {
    name: string;
    seatCount: number,
    description: string,
}

export default {
    validate: (requestBody: { name: string; seatCount: number }) => {
        if (typeof requestBody === 'undefined') {
            return { error: true, response: apiMessages[1040] }
        }

        if (!requestBody.name) {
            return { error: true, response: apiMessages[1040] }
        }

        if (!requestBody.seatCount) {
            return { error: true, response: apiMessages[1041] }
        }

        return { error: false }
    }
}
