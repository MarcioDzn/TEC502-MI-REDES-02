import { UserCNPJ, UserCPF, UserCardContainer } from "./UserCardStyled";

export function UserCard({name, cpf, cnpj}) {
    return (
        <UserCardContainer>
            <h1>{name}</h1>
            {cpf && <UserCPF><span>CPF:</span> {cpf}</UserCPF>}
            {cnpj && <UserCNPJ><span>CNPJ:</span> {cnpj}</UserCNPJ>}
        </UserCardContainer>
    )
}