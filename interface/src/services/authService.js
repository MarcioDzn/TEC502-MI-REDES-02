import axios from "axios"

export async function auth(data) {
    const agency = data.agency
    delete data.agency
    return await axios.post(`http://${agency}/v1/api/auth`, data)

}
