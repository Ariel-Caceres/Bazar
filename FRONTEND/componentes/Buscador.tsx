import img from "../src/assets/img.jpg"
import { useNavigate } from "react-router-dom"
import { useState, type ChangeEvent } from "react"
import "../src/estilos/buscador.css"

export const Buscador = () => {
    const [buscador, setBuscador] = useState<string>("")
    const navigate = useNavigate();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setBuscador(e.target.value)

    }

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (buscador.trim() !== "") {
            navigate(`/items?buscador=${buscador}`)
        }
    }


    return (
        <div className="container">
            <h1>Mercado Cautivo</h1>
            <div className="imagen">
                <img src={img} alt="logo" />
            </div>
            <form action="" onSubmit={handleSearch}>
                <div className="input">
                    <input type="text" placeholder="Smartphone, laptop..." onChange={handleChange} />
                    <i className="fa-solid fa-magnifying-glass lupa"></i>
                </div>

                <button className="boton-submit">
                    <span>Buscar</span>
                </button>
            </form>
        </div>
    )
} 