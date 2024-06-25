import {z} from "zod";

const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;

export const signupSchema = z.object({
    name: z.string().min(3, {message: "Nome deve ter no mínimo 3 caracteres"}).transform((name) => 
        name
            .trim()
            .split(" ")
            .map((word) => word[0].toUpperCase() + word.slice(1))
            .join(" ")),
    cpf: z.string().regex(cpfRegex, { message: "CPF inválido." }), // Remove caracteres não numéricos do CPF
    password: z.string().min(3, {message: "A senha precisa ter no mínimo 3 caracteres"}),
    confirmPassword: z.string().min(3, {message: "A senha precisa ter no mínomo 3 caracteres"})
}).refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não correspondem",
    path: ["confirmPassword"]
})