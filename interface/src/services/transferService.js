import axios from "axios"

const baseURL = "http://localhost:8080/v1/api"
import Cookies from "js-cookie";

export async function transfer(data) {
    const account_cpf = data.account_cpf
    delete data._id
    delete data.account_cpf

    const newData = data.map(obj => {
        const { ["_id"]: _, ...rest } = obj;
        return {
          ...rest,
          amount: parseFloat(obj.amount)
        };
      });

    
    const body = {
        account_cpf: account_cpf,
        account_cnpj: "",
        bank_req_src: Cookies.get("agency"),
        transfers: [...newData]
    }

    return await axios.patch(`${baseURL}/transfers`, body)
}