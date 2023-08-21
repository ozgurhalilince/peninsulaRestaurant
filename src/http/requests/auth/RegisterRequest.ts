import apiMessages from "../../../utils/apiMessages";

export default {
    validate: (requestBody: { password: String; firstname: String; email: String; lastname: String }) => {
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
