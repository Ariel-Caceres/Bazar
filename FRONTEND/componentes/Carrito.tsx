import { useNavigate } from "react-router-dom"
import { Header } from "./Header"
import { useApp } from "../context/useApp"
import { useEffect } from "react"
import { useState } from "react"
import { v4 as uuidv4 } from "uuid"
import type { Product } from "../context/ProductosContext";
import { useLocation } from "react-router-dom"
import "../src/estilos/carrito.css"

export const Carrito = () => {
    const { usuario } = useApp()
    const { loading } = useApp()
    const location = useLocation();
    const navigate = useNavigate()
    const volverA = location.state?.volverA || "/";
    const [productosEnCarrito, setProductosEnCarrito] = useState<Product[]>([])
    const { fetchData } = useApp()



    const fetchDataUserCart = async (usuario: string) => {
        try {
            const res = await fetch(`http://localhost:3000/cart/${usuario}`)
            const data = await res.json()
            setProductosEnCarrito(data)
        } catch (error) {
            console.error("error en fetch de carrito", error)
        }

    }

    const precioTotalAPagar = productosEnCarrito.reduce((acumulado, p) => {
        return acumulado + p.price * p.cantidad
    }, 0)

    const precioTotalAPagarDescuento = productosEnCarrito.map(p => {
        const descuento = (p.price - (p.price * p.discountPercentage) / 100)
        const cantidad = p.cantidad
        return descuento * cantidad
    })
        .reduce((acumulador, valorActual) => acumulador + valorActual, 0);

    const totalProductos = productosEnCarrito.map(p => {
        const total = Number(p.cantidad)
        return total
    }).reduce((acc, va) => acc + va, 0)

    const borrarProducto = async (id: number) => {
        try {
            const res = await fetch(`http://localhost:3000/delete/${usuario}/${id}`, {
                method: "DELETE"
            });

            if (!res.ok) throw new Error("Error al eliminar producto");

            setProductosEnCarrito(prev =>
                prev.filter(producto => producto.id !== id)
            );
            if (usuario) {
                fetchData(usuario)
            }
        } catch (error) {
            console.error("Error al eliminar producto:", error);
        }
    }

    const vaciarCarrito = async () => {
        if (productosEnCarrito.length !== 0) {

            try {
                const res = await fetch(`http://localhost:3000/buy/${usuario}`, {
                    method: "PUT",
                })
                if (!res.ok) throw new Error("Error al vaciar carrito")
            }
            catch (error) {
                console.error("Error al vaciar el carrito", error)
            }
            setProductosEnCarrito([])
            fetchDataUserCart(usuario ? usuario : "")
            if (usuario) {
                fetchData(usuario)
            }
            alert("Gracias por su compra")
        }else{
            alert("El carrito esta vacio")
        }

    }

    const handleChange = async (id: number, cantidad: string) => {
        try {
            const res = await fetch(`http://localhost:3000/cart/cantidad/${usuario}/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ cantidad: cantidad })
            })
            const data = await res.json()
            alert(data.message)
            if (!res.ok) throw new Error("Error al modificar la caontidad de productos")
        } catch (error) {
            console.log("Error al modificar la cantidad", error)
        }
        window.location.reload()
    }

    useEffect(() => {
        if (usuario) {
            fetchDataUserCart(usuario)
        }
    }, [usuario])

    useEffect(() => {
        if (loading == false && !usuario) {
            navigate("/")
        }
    }, [loading])

    return (
        <>
            <Header />
            <div className="flechas">
                <div className="navigate" onClick={() => (navigate(volverA))}>
                    <span><i className="fa-solid fa-arrow-left izq"></i></span>
                </div>
            </div>
            <h2>Tu Carrito de compras 🛒</h2>
            <article>
                <div className="productos">
                    {loading ? (
                        <div>Cargando...</div>
                    ) :
                        productosEnCarrito.length == 0 ? (
                            <h3>No tenés productos en el carrito ❌</h3>
                        ) :
                            productosEnCarrito.map(p =>
                                <div className="producto" key={uuidv4()}>
                                    <div className="img">
                                        <img src={p.thumbnail} alt="" />
                                    </div>
                                    <div className="detalles">
                                        <span>{p.title}</span>
                                        <div className="precio">
                                            <span className="original">${p.price * p.cantidad}</span>
                                            <span className="descuento">${Math.round((p.price) - (p.price * p.discountPercentage / 100)) * p.cantidad}</span>
                                        </div>
                                        <div className="cantidad">
                                            <span>Cantidad</span>
                                            <select name="" id="" value={p.cantidad} onChange={(e) => { handleChange(p.id, e.target.value) }}>
                                                <option value="1">1</option>
                                                <option value="2">2</option>
                                                <option value="3">3</option>
                                                <option value="4">4</option>
                                                <option value="5">5</option>
                                                <option value="6">6</option>
                                                <option value="7">7</option>
                                                <option value="8">8</option>
                                                <option value="9">9</option>
                                            </select>
                                        </div>
                                        <button onClick={() => (borrarProducto(p.id))}>
                                            <span>Quitar</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                </div>

                <div className="resumen">
                    <h3>Resumen del pedido:</h3>
                    <div className="cantidad">
                        <span className="">Total de productos: </span>
                        <span className="numero"> {totalProductos}</span>
                    </div>
                    <div className="precio">
                        <span>Precio original: </span>
                        <span className="numero">$ {precioTotalAPagar.toFixed(2)}</span>
                    </div>
                    <div className="descuento">
                        <span  >Descuento:  </span>
                        <span className="numero">$ -{(precioTotalAPagar - precioTotalAPagarDescuento).toFixed(2)}</span>
                    </div>
                    <div className="precioDescuento">
                        <span>Precio con descuento:   </span>
                        <span className="numero">$ {precioTotalAPagarDescuento.toFixed(2)}</span>
                    </div>
                    <button onClick={() => (vaciarCarrito())}>Ir a pagar<i className="fa-solid fa-arrow-right"></i></button>
                </div>
            </article>
        </>
    )
}