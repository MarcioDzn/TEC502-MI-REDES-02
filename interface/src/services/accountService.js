import axios from "axios"

const baseURL = "http://localhost:8080/v1/api"

export async function getAllAccounts(id) {
    const response = await axios.get(`${baseURL}/accounts/all/${id}`)


    return response.data.data
}