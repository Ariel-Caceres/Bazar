import { useNavigate } from "react-router-dom"
import { Header } from "./Header"
import { useApp } from "../context/useApp"
import { useEffect } from "react"
import { useState } from "react"
import { v4 as uuidv4 } from "uuid"
import type { Product } from "./Resultados";
import { useLocation } from "react-router-dom"
import "../src/estilos/carrito.css"

export const Carrito = () => {
    const { usuario } = useApp()
    const location = useLocation();
    const navigate = useNavigate()
    const volverA = location.state?.volverA || "/items";
    const [productosEnCarrito, setProductosEnCarrito] = useState<Product[]>([])
    const fetchData = async (usuario: string) => {
        try {
            const res = await fetch(`http://localhost:3000/cart/${usuario}`)
            const data = await res.json()
            setProductosEnCarrito(data)
        } catch (error) {
            console.error("error en fetch de carrito", error)
        }

    }

    const precioTotalAPagar = productosEnCarrito.reduce((acumulado, p) => {
        return acumulado + p.price
    }, 0)

    const precioTotalAPagarDescuento = productosEnCarrito.map(p => (p.price) - (p.price * p.discountPercentage) / 100).reduce(
        (acumulador, valorActual) =>
            acumulador + valorActual,
        0)

    const borrarProducto = async (id: number) => {
        try {
            const res = await fetch(`http://localhost:3000/delete/${usuario}/${id}`, {
                method: "DELETE"
            });

            if (!res.ok) throw new Error("Error al eliminar producto");

            setProductosEnCarrito(prev =>
                prev.filter(producto => producto.id !== id)
            );
        } catch (error) {
            console.error("Error al eliminar producto:", error);
        }
    }

    useEffect(() => {
        if (usuario) {
            fetchData(usuario)
        }
    }, [usuario])

    useEffect(() => {
        if (!usuario) {
            navigate("/items")
        }
    }, [usuario])

    return (
        <>
            <Header />
            <div className="flechas">
                <div className="navigate" onClick={() => (navigate(volverA ))}>
                    <span><i className="fa-solid fa-arrow-left izq"></i></span>
                </div>
            </div>
            <h2>Tu Carrito de compras 🛒</h2>
            <article>
                <div className="productos">
                    {productosEnCarrito.length == 0 ? (
                        <h3>No tenes productos en el carrito ❌</h3>
                    ) :
                        productosEnCarrito.map(p =>
                            <div className="producto" key={uuidv4()}>
                                <div className="img">
                                    <img src={p.thumbnail} alt="" />
                                </div>
                                <div className="detalles">
                                    <span>{p.title}</span>
                                    <div className="precio">
                                        <span className="original">${p.price}</span>
                                        <span className="descuento">${Math.round((p.price) - (p.price * p.discountPercentage / 100))}</span>
                                    </div>
                                    <div className="cantidad">
                                        <span>cantidad</span>
                                        <select name="" id="">
                                            <option value="">1</option>
                                        </select>
                                    </div>
                                    <button onClick={() => (borrarProducto(p.id), console.log(p.id))}>
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
                        <span className="numero"> {productosEnCarrito.length}</span>
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
                    <button>Ir a pagar<i className="fa-solid fa-arrow-right"></i></button>
                </div>
            </article>
        </>
    )
}