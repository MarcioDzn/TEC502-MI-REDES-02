import axios from "axios"

const baseURL = "http://localhost:8080/v1/api"

export async function transfer(data) {
    delete data._id

    const newData = data.map(obj => {
        const { ["_id"]: _, ...rest } = obj;
        return {
          ...rest,
          amount: parseFloat(obj.amount)
        };
      });


    const body = {
        account_cpf: "123.456.789-10",
        account_cnpj: "",
        bank_req_src: "localhost:8080",
        transfers: [...newData]
    }

    console.group(body)
    return await axios.patch(`${baseURL}/transfers`, body)
}