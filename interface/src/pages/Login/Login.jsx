import { ErrorSpan } from "../../components/Navbar/NavbarStyled";
import { signinSchema } from "../../schemas/signinSchema";
import { useForm } from "react-hook-form";
import { useMutation } from '@tanstack/react-query';
import { zodResolver } from "@hookform/resolvers/zod";
import { InputButton, LoginContainer, LoginContent, LoginForm, TypeContainer } from "./LoginStyled"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom";
import { useState } from "react"
import { auth } from "../../services/authService";
import Cookies from "js-cookie";

export function Login() {
    const [loginError, setLoginError] = useState(null); // Estado para armazenar o erro do CPF
    const [userType, setUserType] = useState(0); // 0 - fisica / 1 - jurídica

    const mutation = useMutation({ mutationFn: auth })

    const {
        register: registerSignin,
        handleSubmit: handleSubmitSignin,
        formState: { errors: errorsSignin }
    } = useForm({ resolver: zodResolver(signinSchema) });
    const navigate = useNavigate()


    async function inHandleSubmit(data) {
        try {
            const response = await mutation.mutateAsync(data)

            if (response.status === 200) {
                navigate("/")
                Cookies.set("token", response.data.token, {expires: 1});
                window.location.reload();
            }
        } catch (error) {
            // verifica se houve um erro de CPF e definir a mensagem de erro
            if (error.response?.status === 404) {
                setLoginError("CPF ou senha inválidos");
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
    }

    return (
        <LoginContainer>
            <LoginContent>
                <h1>Entre na sua conta</h1>
                <TypeContainer>
                    <InputButton type={"button"} onClick={() => {setUserType(0)}} highlighted={(userType == 0).toString()} name="userType" id="pessoaFisica">Pessoa Física</InputButton>
                    <InputButton type={"button"} onClick={() => {setUserType(1)}} highlighted={(userType == 1).toString()} name="userType" id="pessoaJuridica">Pessoa Jurídica</InputButton>
                </TypeContainer>
                <LoginForm onSubmit={handleSubmitSignin(inHandleSubmit)}>
                    <input type="text" placeholder="CPF" name="cpf" {...registerSignin("cpf")} onChange={handleCpfChange}/>
                    {errorsSignin.cpf && <ErrorSpan>{errorsSignin.cpf.message}</ErrorSpan>}
                    <input type="password" placeholder="Senha" name="password" {...registerSignin("password")}/>
                    {errorsSignin.password && <ErrorSpan>{errorsSignin.password.message}</ErrorSpan>}
                    {loginError && <ErrorSpan>{loginError}</ErrorSpan>}
                    <button type="submit">Entrar</button>
                </LoginForm>
                <span>Não possui uma conta? <Link to="/register">Registre-se</Link></span>
            </LoginContent>

        </LoginContainer>
    )
}