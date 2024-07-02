import axios from "axios"
import Cookies from "js-cookie";

const baseURL = `http://${Cookies.get("agency")}/v1/api`

export async function getAllAccounts(id) {
    const response = await axios.get(`${baseURL}/accounts/all/${id}`)


    return response.data.data
}

export async function getUserAccount(id) {
    const response = await axios.get(`${baseURL}/accounts/${id}`)


    return response.data
}