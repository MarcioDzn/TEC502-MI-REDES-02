import {z} from "zod";

const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;

export const signinSchema = z.object({
    cpf: z.string().regex(cpfRegex, { message: "CPF inválido." }), // Remove caracteres não numéricos do CPF
    password: z.string().min(3, {message: "A senha precisa ter no mínimo 3 caracteres"})
})