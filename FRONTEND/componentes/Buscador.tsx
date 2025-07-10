import img from "../src/assets/img.jpg"
import { useNavigate, useLocation } from "react-router-dom"
import { useState, type ChangeEvent } from "react"
import "../src/estilos/buscador.css"
import { Header } from "./Header"
import { Footer } from "./Footer"

export const Buscador = () => {
    const [buscador, setBuscador] = useState<string>("")
    const navigate = useNavigate();
    const location = useLocation()
    const volverA = location.state?.volverA
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setBuscador(e.target.value)

    }

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (buscador.trim() !== "") {
            navigate(`/?buscador=${buscador}`)
        }
    }


    return (
        <>
            <Header />
             <div className="flechas">
                <div className="navigate" onClick={() => (navigate(volverA))}>
                    <span><i className="fa-solid fa-arrow-left izq"></i></span>
                </div>
            </div>
            <div className="container">
                <h1>Mercado Cautivo</h1>
                <div className="imagen">
                    <img src={img} alt="logo" />
                </div>
                <form action="" onSubmit={handleSearch}>
                    <div className="input">
                        <input type="text" placeholder="Smartphone, laptop..." onChange={handleChange} id="buscador" />
                        <i className="fa-solid fa-magnifying-glass lupa"></i>
                    </div>

                    <button className="boton-submit">
                        <span>Buscar</span>
                    </button>
                </form>
            </div>
            <Footer />

        </>

    )
} 