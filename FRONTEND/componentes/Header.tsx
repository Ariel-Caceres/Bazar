import img from "../src/assets/img.jpg"
import { useNavigate, useLocation } from "react-router-dom";
import "../src/estilos/header.css"
import { useApp } from "../context/useApp"
export const Header = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { usuario } = useApp()
    const { logout } = useApp()
    const { isAdmin } = useApp()
    const { numero } = useApp()


    return (
        <header>
            <div className="titulo">
                <img src={img} alt="" />
                <h1>Mercado Cautivo</h1>
            </div>
            <div className="nav-var">
                <ul>
                    <li onClick={() => (navigate("/"))} className={location.pathname === "/" ? "itemElegido" : "item"}> <i className="fa-solid fa-house " ></i></li>
                    <li onClick={() => (navigate("/buscador", {state: {volverA: location.pathname + location.search}}))} className={location.pathname === "/buscador" ? "itemElegido" : "item"} > <i className="fa-solid fa-magnifying-glass " ></i></li>
                    {isAdmin ?
                        <li onClick={() => navigate("/admin", { state: { carritomsj: true, volverA: location.pathname + location.search } })} className={location.pathname === "/admin" ? "itemElegido" : "item"}> <i className="fa-solid fa-user-gear"></i></li>
                        :
                        <li onClick={() => usuario == undefined ? navigate("/login", { state: { carritomsj: true, volverA: location.pathname + location.search } }) : navigate("/carrito", { state: { volverA: location.pathname + location.search } })} className={location.pathname === "/carrito" ? "itemElegido" : "item"}> <i className="fa-solid fa-cart-shopping" ></i>{numero == 0 ? null : numero}</li>

                    }

                    {usuario ?
                        <li onClick={() => (logout(), alert("Seción cerrada"), navigate("/"))} className="user"><i className="fa-solid fa-right-from-bracket" ></i></li>
                        :
                        <li onClick={() => (navigate("/login", { state: { urlAnterior: location.pathname + location.search } }))} className="user"><i className="fa-solid fa-user"></i></li>
                    }
                </ul>
            </div >

        </header >

    )
}