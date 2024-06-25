import axios from "axios"

const baseURL = "http://localhost:8080"

export async function auth(data) {
    delete data.confirmPasword
    const body = {
        login: data.cpf,
        password: data.password
    }

    return await axios.post(`${baseURL}/auth`, body)

}
