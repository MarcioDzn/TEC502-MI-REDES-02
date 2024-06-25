import { useState } from "react"; // Importe o useState
import { RegisterContainer, RegisterContent, RegisterForm, TypeContainer } from "./RegisterStyled";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { signupSchema } from "../../schemas/signupSchema";
import { ErrorSpan } from "../../components/Navbar/NavbarStyled";
import { useMutation } from '@tanstack/react-query';
import { registerUser } from "../../services/userService";
import { useNavigate } from "react-router-dom";

export function Register() {
    const [cpfError, setCpfError] = useState(null);
    const [userType, setUserType] = useState(0); // 0 - fisica / 1 - jurídica
    const [cccountType, setAccountType] = useState(0); // 0 - normal / 1 - conjunta

    const mutation = useMutation({ mutationFn: registerUser })
    const {
        register: registerSignup,
        handleSubmit: handleSubmitSignup,
        formState: { errors: errorsSignup }
    } = useForm({ resolver: zodResolver(signupSchema) });
    const navigate = useNavigate()

    async function upHandleSubmit(data) {
        try {
            const response = await mutation.mutateAsync(data)

            if (response.status === 201) {
                navigate("/")
            }
        } catch (error) {
            // verifica se houve um erro de CPF e definir a mensagem de erro
            if (error.response?.status === 403) {
                setCpfError("CPF já cadastrado.");
            }
        }
    }

    function formatCPF(value) {
        const cleanedValue = value.replace(/\D/g, "");

        return cleanedValue
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d{1,2})/, "$1-$2")
            .replace(/(-\d{2})\d+?$/, "$1");
    }

    function handleCpfChange(event) {
        event.target.value = formatCPF(event.target.value);
        setCpfError(null); // limpa a mensagem de erro do CPF
    }

    return (
        <RegisterContainer>
            <RegisterContent>
                <h1>Registre-se</h1>
                <RegisterForm onSubmit={handleSubmitSignup(upHandleSubmit)}>
                    <TypeContainer>
                        <input type="button" name="userType" id="pessoaFisica" value="Pessoa Física"/>
                        <input type="button" name="userType" id="pessoaJuridica" value="Pessoa Jurídica"/>
                    </TypeContainer>

                    <TypeContainer>
                        <input type="button" name="accountType" id="contaNormal" value="Conta normal"/>
                        <input type="button" name="accountType" id="contaConjunta" value="Conta Conjunta"/>
                    </TypeContainer>

                    <input type="text" placeholder="Nome" {...registerSignup("name")} />
                    {errorsSignup.name && <ErrorSpan>{errorsSignup.name.message}</ErrorSpan>}
                    <input
                        type="text"
                        placeholder="CPF"
                        {...registerSignup("cpf")}
                        onChange={handleCpfChange} 
                    />
                    {errorsSignup.cpf && <ErrorSpan>{errorsSignup.cpf.message}</ErrorSpan>}
                    {cpfError && <ErrorSpan>{cpfError}</ErrorSpan>} 
                    <input type="password" placeholder="Senha" name="password" {...registerSignup("password")} />
                    {errorsSignup.password && <ErrorSpan>{errorsSignup.password.message}</ErrorSpan>}
                    <input type="password" placeholder="Confirmar senha" name="confirmPassword" {...registerSignup("confirmPassword")} />
                    {errorsSignup.confirmPassword && <ErrorSpan>{errorsSignup.confirmPassword.message}</ErrorSpan>}
                    <button type="submit">Crie sua conta</button>
                </RegisterForm>
            </RegisterContent>
        </RegisterContainer>
    )
}
