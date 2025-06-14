import img from "../src/assets/img.jpg"
import { useNavigate } from "react-router-dom";
import "../src/estilos/header.css"
import { useApp } from "../context/useApp"
export const Header = () => {
    const navigate = useNavigate();
    const { usuario } = useApp()
    const { logout } = useApp()

    return (
        <header>
            <div className="titulo">
                <img src={img} alt="" />
                <h1>Mercado Cautivo</h1>
            </div>
            <div className="nav-var">
                <ul>
                    <li onClick={() => (navigate("/items"))} className="item"> <i className="fa-solid fa-house " ></i></li>
                    <li onClick={() => (navigate("/"))} className="item"> <i className="fa-solid fa-magnifying-glass " ></i></li>

                    <li onClick={() => usuario == undefined ? navigate("/login", {state: {carritomsj: true, volverA: location.pathname + location.search}}) : navigate("/carrito", {state: {volverA: location.pathname + location.search}}) } className="item"> <i className="fa-solid fa-cart-shopping" ></i></li>

                    {usuario ?
                        <li onClick={() => (logout(),alert("Seción cerrada"),navigate("/items"))} className="user"><i className="fa-solid fa-right-from-bracket" ></i></li>
                        :
                        <li onClick={() => (navigate("/login", { state: { urlAnterior: location.pathname + location.search } }))} className="user"><i className="fa-solid fa-user"></i></li>
                    }
                </ul>
            </div >

        </header >

    )
}