import apiMessages from "../../../utils/apiMessages";

export default {
    validate: (requestBody: {
        date: String;
        numberOfPeople: Number,
        tableId: String,
        customerFirstname: String,
        customerLastname: String,
    }) => {
        if (!requestBody.date) {
            return { error: true, response: apiMessages[1070] }
        }

        if (!requestBody.numberOfPeople) {
            return { error: true, response: apiMessages[1071] }
        }

        if (!requestBody.tableId) {
            return { error: true, response: apiMessages[1072] }
        }

        if (!requestBody.customerFirstname) {
            return { error: true, response: apiMessages[1074] }
        }

        if (!requestBody.customerLastname) {
            return { error: true, response: apiMessages[1075] }
        }

        return { error: false }
    }
}
