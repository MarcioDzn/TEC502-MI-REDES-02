import axios from "axios"

const baseURL = "http://localhost:8080"

export async function registerUser(data) {
    delete data.confirmPasword
    const body = {
        ...data,
        age: 20
    }

    return await axios.post(`${baseURL}/user/register`, body)
}

export async function getUserLogged(token) {
    const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
    };

    return await axios.get(`${baseURL}/users/-1`, config)
}