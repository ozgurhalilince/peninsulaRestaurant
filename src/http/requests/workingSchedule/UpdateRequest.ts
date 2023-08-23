import apiMessages from "../../../utils/apiMessages";

export default {
    validate: (requestBody: { name: string; seatCount: number }) => {
        if (!requestBody.name) {
            return { error: true, response: apiMessages[1040] }
        }

        if (!requestBody.seatCount) {
            return { error: true, response: apiMessages[1041] }
        }

        return { error: false }
    }
}
