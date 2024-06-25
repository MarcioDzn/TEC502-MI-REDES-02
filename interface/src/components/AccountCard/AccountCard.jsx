import { UserCard } from "../UserCard/UserCard";
import { AccountCardContainer, AccountId, AccountType, AgencyInfo, BalanceContainer, BankInfo, UserContainer } from "./AccountCardStyled";

export function AccountCard({cardType, selectTransaction, acc_type, agency, account, balance}) {
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
                        <UserCard />
                        <UserCard />
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