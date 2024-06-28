import axios from "axios"
import Cookies from "js-cookie";

let agency = ""

export async function registerAccount(data) {
    agency = data.agency
    delete data.agency
    delete data.confirmPasword
    const body = {
        ...data
    }

    return await axios.post(`http://${agency}/v1/api/accounts`, body)
}

export async function getUserLogged(token) {
    const response = await axios.get(`http://${Cookies.get("agency")}/v1/api/auth/account`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
    })

    return response
}