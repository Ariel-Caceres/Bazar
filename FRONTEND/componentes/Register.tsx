import "../src/estilos/login.css"
import img from "../src/assets/img.jpg"
import { useNavigate, useLocation } from "react-router-dom"
import { useApp } from "../context/useApp"
import { useEffect, useState } from "react"
import { v4 as uuidv4 } from "uuid"
import { Footer } from "./Footer"
import { Header } from "./Header"
export const Register = () => {

    const navigate = useNavigate()
    const location = useLocation();
    const { login, setId } = useApp()
    const urlAnterior = location.state?.urlAnterior || "/"
    const [usuario, setUsuario] = useState<string>("")
    const [contraseña, setContraseña] = useState<string>("")
    const [confirmarContraseña, setConfirmarContraseña] = useState<string>("")
    const [noCoincideContraseña, setNoCoincideContraseña] = useState<boolean>()
    const [idGenerado, setIdGenerado] = useState<string>("")

    const handleSumbmit = (e: React.FormEvent) => {
        e.preventDefault()
        login(usuario)
    }
    const handleChangeUser = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsuario(e.target.value)
        console.log(usuario)
    }
    const handleChangePass = (e: React.ChangeEvent<HTMLInputElement>) => {
        setContraseña(e.target.value)
    }
    const handleChangePassConfirm = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmarContraseña(e.target.value)
    }

    useEffect(() => {
        if (contraseña == "" || confirmarContraseña == "") {
            setNoCoincideContraseña(false)
        }
    }, [confirmarContraseña, contraseña])

    useEffect(() => {
        if (!idGenerado) {
            const nuevoId = uuidv4()
            setIdGenerado(nuevoId)
        }
    }, [idGenerado])

    const userAdd = async () => {
        if (!idGenerado) return;
        const res = await fetch(`http://localhost:3000/usuario/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: idGenerado,
                usuario: `${usuario}`,
                contraseña: `${contraseña}`,

            })
        })
        if (res.status === 409) {
            const data = await res.json()
            alert(data.message)
        } else if (res.ok) {
            alert("Registro exitoso")
            setId(idGenerado)
            console.log("ID guardado en contexto:", idGenerado);

            navigate("/login")
        }
    }

    return (
        <>
            <Header/>
              <div className="flechas">
                <div className="navigate" onClick={() => (navigate(urlAnterior))}>
                    <span><i className="fa-solid fa-arrow-left izq"></i></span>
                </div>
            </div>
            <div className="layout">
                <div className="container">
                    <p>Registrate con nombre de usuario y contraseña</p>
                </div>
                <div className="formulario">
                    <form action="" onSubmit={handleSumbmit}>
                        <label htmlFor="usuario">Nombre de usuario:</label>
                        <input type="text" name="usuario" id="usuario" onChange={handleChangeUser} value={usuario} required />
                        <label htmlFor="contraseña">Contraseña:</label>
                        <input type="password" name="contraseña" id="contraseña" onChange={handleChangePass} value={contraseña} required />
                        {noCoincideContraseña &&
                            <span className="alert">⬇ No coinciden las contraseñas ⬆</span>
                        }
                        <label htmlFor="contraseña2">Confirmar contraseña:</label>
                        <input type="password" name="contraseña2" id="contraseña2" onChange={handleChangePassConfirm} value={confirmarContraseña} required />
                        <button onClick={() => contraseña == confirmarContraseña
                            ? (userAdd())
                            : setNoCoincideContraseña(true)
                        }>Enviar</button>
                    </form>
                </div>
            </div >
            <Footer />

        </>
    )
}