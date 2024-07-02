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

    .reveal-text {
        opacity: 0;
        animation: reveal 1s forwards; /* Aplica a animação 'reveal' por 1 segundo */
    }

    @keyframes reveal {
        from {
            opacity: 0;
            transform: translateY(20px); /* Começa com o texto um pouco abaixo */
        }
        to {
            opacity: 1;
            transform: translateY(0); /* Termina com o texto na posição normal */
        }
    }

    .highlight {
    position: absolute; /* Posição absoluta para cobrir a palavra */
    top: 50%; /* Alinha verticalmente no meio do contêiner */
    transform: translateY(-50%); /* Ajusta para alinhar verticalmente */
    left: 0;
    height: 100%; /* Cobrir altura total */
    background-color: #c40000; /* Cor do marca texto */
    width: 0; /* Começa com largura zero para esconder o highlight */
    z-index: -1; /* Coloca o highlight abaixo do texto */
    animation: reveal-highlight 1s cubic-bezier(0.4, 0, 0.1, 1) 0.6s; /* Aplica a animação 'reveal-highlight' */
    animation-fill-mode: forwards;
    }

    .highlight-word {
    display: inline-block; /* Garante que a palavra seja tratada como um bloco */
    position: relative; /* Posição relativa para que o highlight absoluto seja posicionado corretamente */
    z-index: 2;
    animation: change-color 1s cubic-bezier(0.4, 0, 0.1, 1) 1.5s; /* Aplica a animação 'reveal-highlight' */
    animation-fill-mode: forwards;
    }

    @keyframes reveal-highlight {
    from {
        width: 0; /* Começa com largura zero para esconder o highlight */
    }
    to {
        width: 100%; /* Termina com largura total para revelar o highlight completamente */
    }
    }

    @keyframes change-color {
    from {
       color: black; /* Começa com largura zero para esconder o highlight */
    }
    to {
        color: white; /* Termina com largura total para revelar o highlight completamente */
    }
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

