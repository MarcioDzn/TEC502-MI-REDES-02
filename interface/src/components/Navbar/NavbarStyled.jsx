import {styled} from "styled-components"

export const NavbarContainer = styled.nav`
    position: relative;
    z-index: 9;
    display: flex;
    justify-content: space-between;
    align-items: center;

    padding: 20px 250px;
    border-bottom: 1px solid gray;

    a {
        text-decoration: none;
        color: black;
    }
`

export const LogoContainer = styled.div`

`


export const Button = styled.button`
    border: ${(props) => props.btn_type === "bold" ? "1px solid black" : "1px solid white"};
    border-radius: 10px;
    color: ${(props) => props.btn_type === "bold" ? "#ffffff" : "black"};
    background-color: ${(props) => props.btn_type == "bold" ? "#c40000" : "white"};
    padding: 10px 20px;
    cursor: pointer;

    transition: ${(props) => props.btn_type == "bold" ? "border-radius .15s" : "color: 0.5s"};
    &:hover {
        ${(props) => props.btn_type == "bold" ? "border-radius: 60px" : "color: #c40000"} ;
    }
`

export const ErrorSpan = styled.span`
    color: #9e0000;
    display: flex;
    justify-content: center;
    font-size: 0.8rem;
    border-radius: 7px;
    margin-right: auto;
    margin-top: -10px;
`;

export const UserInfo = styled.span`
    display: flex;
    align-items: center;
    gap: 10px;

    i {
        cursor: pointer;
        height: 21px;
    }
`