import { useState } from "react"; // Importe o useState
import { InputButton, RegisterContainer, RegisterContent, RegisterForm, TypeContainer } from "./RegisterStyled";
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
    const [accountType, setAccountType] = useState(0); // -1 - nada / 0 - normal / 1 - conjunta

    const mutation = useMutation({ mutationFn: registerUser })
    const {
        register: registerSignup,
        handleSubmit: handleSubmitSignup,
        formState: { errors: errorsSignup }
    } = useForm({ resolver: zodResolver(signupSchema(userType === 1)) });
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
                        <InputButton type={"button"} onClick={() => {setUserType(0); setAccountType(0)}} highlighted={(userType == 0).toString()} name="userType" id="pessoaFisica">Pessoa Física</InputButton>
                        <InputButton type={"button"} onClick={() => {setUserType(1); setAccountType(-1)}} highlighted={(userType == 1).toString()} name="userType" id="pessoaJuridica">Pessoa Jurídica</InputButton>
                    </TypeContainer>

                    <TypeContainer>
                        <InputButton type={"button"} onClick={() => {setAccountType(0)}} highlighted={(accountType == 0 && userType == 0).toString()} name="userType" id="contaNormal" disabled={userType == 1}>Conta Normal</InputButton>
                        <InputButton type={"button"} onClick={() => {setAccountType(1)}} highlighted={(accountType == 1 && userType == 0).toString()} name="userType" id="contaConjunta" disabled={userType == 1}>Conta Conjunta</InputButton>
                    </TypeContainer>

                    <input type="text" placeholder="Nome" {...registerSignup("name")} />
                    {errorsSignup.name && <ErrorSpan>{errorsSignup.name.message}</ErrorSpan>}

                    {
                        userType == 0 &&
                        <>
                            <input
                                type="text"
                                placeholder="CPF"
                                {...registerSignup("cpf")}
                                onChange={handleCpfChange} 
                            />
                            {errorsSignup.cpf && <ErrorSpan>{errorsSignup.cpf.message}</ErrorSpan>}
                        </>
                    }


                    {userType == 1 &&
                        <>
                            <input
                                type="text"
                                placeholder="CNPJ"
                                {...registerSignup("cnpj")} 
                            />
                            {errorsSignup.cnpj && <ErrorSpan>{errorsSignup.cnpj.message}</ErrorSpan>}
                        </>

                    }
                    
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
