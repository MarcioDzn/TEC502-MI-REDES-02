import axios from "axios"

const baseURL = "http://localhost:8080"

export async function registerAccount(data) {
    delete data.confirmPasword
    const body = {
        ...data
    }

    return await axios.post(`${baseURL}/v1/api/accounts`, body)
}
