import { Button, LogoContainer, NavbarContainer, UserInfo} from "./NavbarStyled";
import { Outlet, Link, useLocation } from "react-router-dom"
import { useContext, useEffect } from "react";
import { UserContext } from "../../context/UserContext";
import Cookies from "js-cookie";
import { useQuery } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom";

export function Navbar() {
    const location = useLocation();
    const {user, setUser} = useContext(UserContext);

    // async function findUserLogged(token) {
    //     try {
    //         const response = await getUserLogged(token);
    //         console.log("a")
    //         setUser(response.data)
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

    useEffect(() => {
        const token = Cookies.get("token")
        console.log(token)
        if (token) {
            // findUserLogged(token);
        }
    }, [])

    const navigate = useNavigate()

    function signout() {
        Cookies.remove("token");
        setUser(undefined);
        navigate("/");
    }

    return (
        <>
            <NavbarContainer>
                <Link to="/">
                    <LogoContainer>
                        <h1>UnifiedBank</h1>
                    </LogoContainer>
                </Link>


                <form onSubmit={(e)=> {
                    e.preventDefault()
                }}>
                    {
                        user ? <UserInfo><span onClick={signout}>{user.name}</span><i className="bi bi-box-arrow-right" onClick={signout}></i></UserInfo> :
                        location.pathname === "/register" ? 
                        <Link to="/login">
                            <Button type="submit">Login</Button>
                        </Link> : location.pathname === "/login" ?
                            
                        <Link to="/register">
                            <Button type="submit" btn_type="bold">Registrar</Button>
                        </Link> : 
                        <>
                            <Link to="/login">
                                <Button type="submit">Login</Button>
                            </Link>

                            <Link to="/register">
                                <Button type="submit" btn_type="bold">Registrar</Button>
                            </Link>
                        </>
                    }


                </form>

            </NavbarContainer>

            <Outlet />
        </>

    )
}