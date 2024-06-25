import { UserCPF, UserCardContainer } from "./UserCardStyled";

export function UserCard() {
    return (
        <UserCardContainer>
            <h1>John Doe</h1>
            <UserCPF>111.111.111-11</UserCPF>
        </UserCardContainer>
    )
}