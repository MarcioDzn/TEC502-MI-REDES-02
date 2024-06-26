import { styled } from "styled-components"

export const RegisterContainer = styled.section`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
`

export const RegisterContent = styled.div`
    text-align: center;
    width: 360px;
    height: 500px;
    padding: 20px;

    h1 {
        font-size: 2rem;
        margin-bottom: 20px;
    }
`

export const TypeContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 3px;
    width: 100%;
    margin-bottom: -10px;

    input {
        cursor: pointer;
        padding-top: 5px !important;
        padding-bottom: 5px !important;

        transition: all 0.2s ease-in-out;
        &:focus {
            background-color: #c40000;
            color: white;
            outline: none !important;
        }
    }
`


export const RegisterForm = styled.form`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;

    input {
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
    }

    button {
        outline: none;
        border: none;
        border-radius: 5px;
        width: 100%;
        padding: 15px;
        color: white;
        background-color: #c40000;
        cursor: pointer;

        transition: all 0.2s ease-in-out;
        &:hover {
            background-color: #c22222;
        }
    }
`

export const InputButton = styled.button`
    cursor: pointer;
    padding-top: 5px !important;
    padding-bottom: 5px !important;
    background-color: white !important;
    border: 1px solid #ebebeb !important;
    border-radius: 5px !important;
    color: black !important;

    transition: all 0.2s ease-in-out;
    &:hover {
        border: 1px solid darkgrey !important;
    }

    background-color: ${(props) => props.highlighted == "true" ? "#c40000 !important;": "background-color: white !important;"};
    color: ${(props) => props.highlighted == "true" ? "white !important;": "background-color: black !important;"};

    &:disabled {
        background-color: #d6d6d6 !important;
        color: white !important;
        border: 1px solid #d6d6d6 !important;
    }
`