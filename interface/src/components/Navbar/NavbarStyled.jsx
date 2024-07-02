import {styled, keyframes} from "styled-components"

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

const shine = keyframes`
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
`;

export const LogoContainer = styled.div`
  color: #c40000;
  position: relative;
  display: inline-block;
  overflow: hidden;

  h1 {
    position: relative;
    font-size: 1.5rem;
    z-index: 1;
    cursor: pointer; 

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      height: 100%;
      width: 100%;
      background: linear-gradient(120deg, transparent, rgba(255, 255, 255, 0.5), transparent);
      transition: none; 
    }

    &:hover::before {
      animation: ${shine} 1s cubic-bezier( 0.11, 0, 0.59, -0.05 ); 
    }
  }
`;


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