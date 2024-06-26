import { UserCard } from "../UserCard/UserCard";
import { AccountCardContainer, AccountId, AccountType, AgencyInfo, BalanceContainer, BankInfo, UserContainer } from "./AccountCardStyled";

export function AccountCard({cardType, selectTransaction, acc_type, agency, account, balance, users}) {
    if (users){
        console.log(users)
    }
    return (
        <AccountCardContainer card_type={cardType} onClick={() => {selectTransaction(agency, account)}}>
            {
                cardType == "big" ?
                <>
                    <BalanceContainer card_type={cardType}>
                        <span>Saldo</span>
                        <span>R${balance}</span>
                    </BalanceContainer>
                    <AccountId card_type={cardType}>{account}</AccountId>
                    <UserContainer card_type={cardType}>
                        {
                            !users ? <></> : 
                            <>
                                <UserCard name={users[0].name} cpf={users[0].cpf} cnpj={users[0].cnpj}/>
                                {users?.length > 1 ? <UserCard name={users[1].name} cpf={users[1].cpf} cnpj={users[1].cnpj}/> : 
                                <UserCard />}
                            </>
                        }

                        
                    </UserContainer>
                </>:
                <>
                    <BankInfo>
                        <AccountType card_type={cardType}>Conta {acc_type}</AccountType>
                        <AgencyInfo>Agência: {agency}</AgencyInfo>
                        <AccountId card_type={cardType}>Conta: {account}</AccountId>
                    </BankInfo>
                    
                    <BalanceContainer card_type={cardType}> 
                        <span>Saldo</span>
                        <span>R${balance}</span>
                    </BalanceContainer>
                </>
            }
        
        </AccountCardContainer>
    )
}