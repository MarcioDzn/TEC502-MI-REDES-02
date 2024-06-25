import { styled } from "styled-components"

export const MainPageContainer = styled.section`
    display: flex;
    flex-direction: column;
`

export const AccountCardInfo = styled.div`
    width: 100%;
    height: fit-content;
    background: rgb(238,238,238);
    background: linear-gradient(180deg, rgba(238,238,238,1) 0%, rgba(255,255,255,1) 88%, rgba(255,255,255,1) 100%);
    padding: 20px 0px 20px 0px;
`

export const BankInfoWrapper = styled.section`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0px 30px;
`

export const BankAccountsContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 500px;
    height: 420px;
    border-radius: 10px;

    overflow: scroll;
    overflow-x: hidden;
    padding: 5px 5px 5px 0px;

    /* Personalizar a barra de rolagem vertical */
    &::-webkit-scrollbar {
        width: 6px; 
    }

    &::-webkit-scrollbar-track {
        background: white; 
    }

    &::-webkit-scrollbar-thumb {
        background: #c40000; 
        border-radius: 3px; 
    }

`

export const TransactionHistoryContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 550px;
    height: 420px;
    border-radius: 10px;

    overflow: scroll;
    overflow-x: hidden;
    padding: 5px 5px 5px 3px;

    /* Personalizar a barra de rolagem vertical */
    &::-webkit-scrollbar {
        width: 6px; 
    }

    &::-webkit-scrollbar-track {
        background: white; 
    }

    &::-webkit-scrollbar-thumb {
        background: #c40000; 
        border-radius: 3px; 
    }
`

export const TransactionPendingContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 550px;
    height: 350px;
    border-radius: 10px;

    overflow: scroll;
    overflow-x: hidden;
    padding: 5px 5px 5px 0px;

    background-color: linear-gradient(45deg, #c40000, #8b0000 30%, #c40000 90%);

    /* Personalizar a barra de rolagem vertical */
    &::-webkit-scrollbar {
        width: 6px; 
    }

    &::-webkit-scrollbar-track {
        background: white; 
    }

    &::-webkit-scrollbar-thumb {
        background: #c40000; 
        border-radius: 3px; 
    }
`

export const TransactionPendingContainerEmpty = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 8px;
    width: 550px;
    height: 350px;
    border: 5px dashed #ececec;
    border-radius: 10px;

    background-color: linear-gradient(45deg, #c40000, #8b0000 30%, #c40000 90%);

    h2 {
        color: #dfdfdf;
    }

    button {
        outline: none;
        border: none;
        border-radius: 5px;
        width: 200px;
        padding: 10px;
        color: white;
        background-color: #c40000;
        cursor: pointer;

        transition: all 0.2s ease-in-out;
        &:hover {
            background-color: #c22222;
        }
    }
`

export const TransactionPendingContainerInfo = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;

    margin-bottom: -35px;
    button {
        outline: none;
        border: none;
        border-radius: 5px;
        width: 160px;
        padding: 10px;
        color: white;
        background-color: #c40000;
        cursor: pointer;

        transition: all 0.2s ease-in-out;
        &:hover {
            background-color: #c22222;
        }
    }
`

export const AddTransaction = styled.button`
    outline: none;
    border: none;
    border-radius: 5px;
    width: 180px;
    padding: 10px;
    color: white;
    background-color: #c40000;
    cursor: pointer;

    transition: all 0.2s ease-in-out;
    &:hover {
        background-color: #c22222;
    }

    &:disabled {
        background-color: gray;
    }
`

export const TransactionPendingContent = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 460px;
`
