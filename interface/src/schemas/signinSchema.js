import {z} from "zod";

const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;

export const signinSchema = (isCnpjActive) => z.object({
    cpf: z.string().regex(cpfRegex, { message: "CPF inválido." }), // Remove caracteres não numéricos do CPF
    cnpj: isCnpjActive ? z.string().regex(cnpjRegex, { message: "CNPJ inválido." }) : z.string().optional(),
    accountId: z.string().min(10, {message: "Um ID tem pelo menos 10 caracteres"}),
    agency: z.string(),
    password: z.string().min(3, {message: "A senha precisa ter no mínimo 3 caracteres"})
})