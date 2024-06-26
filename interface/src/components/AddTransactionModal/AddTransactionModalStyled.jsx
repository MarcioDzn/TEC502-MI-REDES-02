import { styled } from "styled-components"

export const Background = styled.section`
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 9;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100vh;

    background-color: #c5c5c561;
`


export const AddTransactionModalContainer = styled.section`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 10;
    transform: translate(-50%, -50%);

    height: 500px;
    padding: 15px;

    border-radius: 20px;
    background-color: white;
`

export const TransactionInfos = styled.div`
    display: flex;
    flex-direction: column;
    gap: 37px;
    width: 390px;
    height: 100%;
`

export const TransactionList = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    button {
        outline: none;
        border: none;
        border-radius: 5px;
        width: 100%;
        padding: 15px;
        margin-top: 59px;
        color: white;
        background-color: #c40000;
        cursor: pointer;

        transition: all 0.2s ease-in-out;
        &:hover {
            background-color: #c22222;
        }
    }
`

export const BankInfos = styled.div`
    display: flex;
    flex-direction: column;
    gap: 13px;
`

export const TransactionForm = styled.form`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;

    div {
        position: relative;
        width: 100%;
    }
    
    div input {
        border: 1px solid #ebebeb;
        border-radius: 5px;
        outline: 3px solid white;
        padding: 15px;
        width: 100%;

        transition: all 0.2s ease-in-out;
        &:hover {
            border: 1px solid darkgrey;
        }   

        &:focus {
            outline: 3px solid lightgrey;
        }

        &:invalid {
            border: 1px solid #c40000;
        }
    }

    button {
        outline: none;
        border: none;
        border-radius: 5px;
        width: 100%;
        padding: 15px;
        margin-top: 17px;
        color: white;
        background-color: #c40000;
        cursor: pointer;

        transition: all 0.2s ease-in-out;
        &:hover {
            background-color: #c22222;
        }
    }
`

export const TransactionPendingContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 550px;
    height: 360px;
    border-radius: 10px;

    overflow: scroll;
    overflow-x: hidden;
    padding: 5px 5px 5px 5px;

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
    height: 360px;
    border: 5px dashed #ececec;
    border-radius: 10px;

    background-color: linear-gradient(45deg, #c40000, #8b0000 30%, #c40000 90%);

    h2 {
        color: #dfdfdf;
    }
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
    padding: 5px 5px 5px 5px;

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

export const CloseModal = styled.div`
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 35px;
    height: 35px;
    border-radius: 50%;
    background-color: #c40000;
    color: white;
    font-weight: bolder;
    right: -15px;
    top: -15px;
    cursor: pointer;
`

export const ErrorSpan = styled.span`
    position: absolute;
    right: 20px;
    top: 27px;
    color: #9e0000;
    display: flex;
    justify-content: center;
    font-size: 0.8rem;
    border-radius: 7px;
    margin-right: auto;
    margin-top: -10px;
    cursor: default;

    &:hover::after {
        position: absolute;
        background-color: white;
        box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
        color: #9e0000;
        padding: 5px;
        border-radius: 5px;
        width: max-content; /* Ajusta a largura ao conteúdo */
        white-space: nowrap; /* Impede quebra de linha */
        z-index: 20;
        content: "${(props) => props.error_info}";
        top: 100%; /* Posiciona abaixo do elemento */
        left: 50%; /* Centraliza horizontalmente */
        transform: translateX(-50%); /* Ajusta para que a centralização seja precisa */
    }
`;