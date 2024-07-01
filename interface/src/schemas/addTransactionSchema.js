import {z} from "zod";

export const addTransactionSchema = () => z.object({
    sourceAgency: z.string({ message: "Agência de origem inválida" }), // Remove caracteres não numéricos do CPF
    sourceAccount: z.string({ message: "Conta de origem inválida" }),
    destAgency: z.string().min(1, { message: "Agência de destino inválida" }),
    destAccount: z.string().min(10, { message: "Conta de destino inválida" }),
    amount: z.string().min(1, {message: "Valor a ser transferido inválido"})
})