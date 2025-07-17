import "../src/estilos/login.css"
import { useNavigate, useLocation } from "react-router-dom"
import { useApp } from "../context/useApp"
import { useEffect, useState } from "react"
import { Footer } from "./Footer"
import { Header } from "./Header"
import { useEspera } from "../context/useEspera"
export const Login = () => {
    const navigate = useNavigate()
    const location = useLocation();
    const { login, loading, isAdmin } = useApp()
    const volverA = location.state?.volverA || "/"
    const carritomsj = location.state?.carritomsj || null
    const [usuario, setUsuario] = useState<string>("")
    const [contraseña, setContraseña] = useState<string>("")
    const [logueadoRecienAhora, setLogueadoRecienAhora] = useState(false);
    const {productoEspera, setProductoEnEspera}=  useEspera()
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
        const res = await fetch(`https://bazar-gbw5.onrender.com/usuarios/login`, {
            method: "POST",
            headers: {
                "Content-type": "Application/json"

            },
            body: JSON.stringify({nombre, contraseña})
        }
        )
        const data = await res.json()

        if (res.status === 404) {
            alert(data.message)
            setUsuarioNoExiste(true)

        } else if (res.ok) {
            login(usuario, contraseña)
            setLogueadoRecienAhora(true);
            alert(data.message)
              if (productoEspera) {
                try {
                    await fetch(`https://bazar-gbw5.onrender.com/carrito/add`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            usuario: `${nombre}`,
                            producto: productoEspera,
                        })
                    })
                    setProductoEnEspera(null)
                } catch (error) {
                    console.log("no se pudo agregar el producto en espera", error)
                }
            }
        }
    }

    useEffect(() => {
        if (!loading && usuario && logueadoRecienAhora) {
            if (isAdmin) {
                navigate("/admin");
            } else if (carritomsj && !isAdmin) {
                navigate("/carrito");
            } else {
                navigate("/");
            }
            setLogueadoRecienAhora(false);
        }
    }, [usuario, isAdmin, loading, logueadoRecienAhora]);

    return (
        <>
            <Header/>
        
            <div className="flechas">
                <div className="navigate" onClick={() => (navigate(volverA))}>
                    <span><i className="fa-solid fa-arrow-left izq"></i></span>
                </div>
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