import { styled } from "styled-components"

export const AccountCardContainer = styled.div`
    display: flex;
    flex-direction: ${(props) => props.card_type == "big" ? "column;" : "row;"};
    align-items: ${(props) => props.card_type == "big" ? "normal;" : "center;"};
    width: ${(props) => props.card_type == "big" ? `450px;` : `100%;`};
    height: ${(props) => props.card_type == "big" ? "fit-content" : "80px;"}
    box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
    padding: 15px;
    margin: ${(props) => props.card_type == "big" ? "auto;" : "normal;"};
    margin-top: ${(props) => props.card_type == "big" ? "25px;" : "normal;"};
    margin-bottom: ${(props) => props.card_type == "big" ? "25px;" : "normal;"};
    gap: 10px;
    border-radius: ${(props) => props.card_type == "big" ? "15px;" : "0px"};
    background: linear-gradient(45deg, #c40000, #8b0000 30%, #c40000 90%);
    color: white;
    cursor: pointer;

    transition: all .65s cubic-bezier(0.18, 0.9, 0.58, 1);
    
    &:hover {
        transform: scale(1.02);
    }

`

export const UserContainer = styled.div`
    width: 100%;
`

export const AccountId = styled.span`
    font-size: ${(props) => props.card_type == "big" ? "1.5rem;" : "1rem;"}
    font-weight: ${(props) => props.card_type == "big" ? "bold;" : "normal;"};
    letter-spacing: ${(props) => props.card_type == "big" ? "10px;" : "1px;"};
    margin: ${(props) => props.card_type == "big" ? "auto;" : "0 auto 0 0;"};
`

export const BalanceContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: end;

    font-size: ${(props) => props.card_type == "big" ? "1.5rem;" : "1rem;"}
    font-weight: bolder;

    span:nth-child(1) {
        font-size: 0.8rem;
        font-weight: lighter;
        margin-bottom: ${(props) => props.card_type == "big" ? "-10px;" : "-5px;"}
    }
`

export const BankInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1px;
    margin-right: auto;
`

export const AgencyInfo = styled.span`
    font-size: 0.8rem;
`

export const AccountType = styled.span`
    font-size: 0.8rem;
`