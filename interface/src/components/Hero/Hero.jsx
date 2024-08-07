import { Button, HeroContainer, HeroInfo } from "./HeroStyled";
import { Link } from "react-router-dom"

export function Hero() {
    return (
        <HeroContainer>
            <HeroInfo>
                <h1 className="reveal-text"><span>Seguro</span> e <span>Descentralizado</span>. <br/><span className="highlight-word">Feito para isso.<div className="highlight"></div></span></h1>
                
                <p>Experimente um novo jeito de cuidar do seu dinheiro. Abra sua conta hoje e descubra como é simples e seguro transformar seus sonhos em realidade com o Unified Bank.</p> 
                <Link to="/register">
                    <Button type="submit" btn_type="bold">Abra a sua conta</Button>
                </Link>
            </HeroInfo>
        </HeroContainer>
    )
}