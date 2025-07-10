import "../src/estilos/login.css"
import img from "../src/assets/img.jpg"
import { useNavigate, useLocation } from "react-router-dom"
import { useApp } from "../context/useApp"
import { useState } from "react"
import { Footer } from "./Footer"

export const Login = () => {
    const navigate = useNavigate()
    const location = useLocation();
    const { login, loading } = useApp()
    const urlAnterior = location.state?.urlAnterior || "/"
    const carritomsj = location.state?.carritomsj || null
    const [usuario, setUsuario] = useState<string>("")

    const [contraseña, setContraseña] = useState<string>("")
    const [usuarioNoExiste, setUsuarioNoExiste] = useState<boolean>(false)

    const handleSumbmit = (e: React.FormEvent) => {
        e.preventDefault()
    }
    const handleUsuarioControlado = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsuario(e.target.value)
    }
    const handleContraseñaControlada = (e: React.ChangeEvent<HTMLInputElement>) => {
        setContraseña(e.target.value)
    }
    const userCheck = async (nombre: string, contraseña: string) => {
        const res = await fetch(`http://localhost:3000/usuarios/${nombre}/${contraseña}`)
        if (res.status === 404) {
            const data = await res.json()
            alert(data.message)
            setUsuarioNoExiste(true)

        } else if (res.ok) {
            login(usuario, contraseña)
            alert("Inicio de secion exitoso ")
            // if (usuario.toLowerCase() === "admin" && contraseña === "1234") {
            if (!loading) {
                navigate("/admin");
            } else {
                navigate(urlAnterior);
            }
        }
    }



    return (
        <>
            <header>
                <img src={img} alt="" />
                <span>Mercado Cautivo</span>
            </header>
            <div className="flecha">
                <span onClick={() => navigate(urlAnterior)}><i className="fa-regular fa-circle-left"></i>Volver</span>
            </div>
            <div className="layout">
                <div className="container">
                    {carritomsj != null ?
                        <p>Inicia sesión para poder usar el carrito 🛒</p>
                        :
                        <p>Ingresá tu nombre de usuario y contraseña para iniciar sesión</p>
                    }
                    <div className="registrarse">
                        <p> O registrate si no tenes una cuenta todavia</p>
                        <button onClick={() => { navigate("/register") }}>Registrarse!</button>
                    </div>
                </div>
                <div className="formulario">
                    <form action="" onSubmit={handleSumbmit}>
                        <label htmlFor="usuario">Nombre de usuario:</label>
                        {usuarioNoExiste &&
                            <span className="alert">⬇ Datos erroneos ⬇</span>
                        }
                        <input type="text" name="usuario" id="usuario" onChange={handleUsuarioControlado} value={usuario} required />
                        <label htmlFor="contraseña">Contraseña:</label>
                        <input type="password" name="contraseña" id="contraseña" onChange={handleContraseñaControlada} value={contraseña} required />
                        <button onClick={() => (userCheck(usuario, contraseña), localStorage.setItem)
                        }>Enviar</button>
                    </form>
                </div>
            </div >
            <Footer />

        </>

    )
}