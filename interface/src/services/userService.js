import axios from "axios"

export async function registerAccount(data) {
    const agency = data.agency
    delete data.agency
    delete data.confirmPasword
    const body = {
        ...data
    }

    return await axios.post(`http://${agency}/v1/api/accounts`, body)
}
