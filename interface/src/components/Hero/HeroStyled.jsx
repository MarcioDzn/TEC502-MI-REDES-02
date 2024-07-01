import {styled} from "styled-components"

export const HeroContainer = styled.section`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 100%;
    padding: 100px 250px;
    border-bottom: 1px solid gray;
`

export const HeroInfo = styled.span`
    display: block;
    height: 300px;
    width: 100%;
    text-align: center;

    h1 {
        font-weight: 700;
        font-size: 4rem;
        line-height: 4rem;

    }

    p {
        width: 510px;
        font-size: 1.2rem;
        margin: auto;
        margin-top: 25px;
    }
`

export const Button = styled.button`
    border: ${(props) => props.btn_type === "bold" ? "1px solid black" : "1px solid white"};
    border-radius: 10px;
    color: ${(props) => props.btn_type === "bold" ? "#ffffff" : "black"};
    background-color: ${(props) => props.btn_type == "bold" ? "#c40000" : "white"};
    padding: 10px 20px;
    cursor: pointer;
    margin-top: 40px;

    transition: ${(props) => props.btn_type == "bold" ? "border-radius .15s" : "color: 0.5s"};
    &:hover {
        ${(props) => props.btn_type == "bold" ? "border-radius: 60px" : "color: #c40000"} ;
    }
`