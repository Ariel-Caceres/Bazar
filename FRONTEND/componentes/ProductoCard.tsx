import { useNavigate } from "react-router-dom";
import type { Product } from "../context/ProductosContext";
import { useApp } from "../context/useApp";
import {useEspera} from "../context/useEspera"
import { useState } from "react";

export const ProductoCard = ({ producto }: { producto: Product }) => {
  const [hover, setHover] = useState(false);
  const navigate = useNavigate();
  const { fetchData, usuario } = useApp()
  const { setProductoEnEspera} = useEspera()

  const añadirAlCarrito = async () => {
    if (usuario) {
      const res = await fetch(`https://bazar-gbw5.onrender.com/carrito/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          usuario: `${usuario}`,
          producto: producto,
        })
      })
      const data = await res.json()
      if (JSON.stringify(data) !== JSON.stringify(producto)) {
        fetchData(usuario)
      }

    }
    else {
      setProductoEnEspera(producto)
      navigate("/login", { state: { carritomsj: true } })
    }
  }

 
  return (

    <div className="producto" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <div className="descuento">
        <span>¡Descuento!🔥 | </span>
        <span>{producto.discountPercentage}% OFF</span>
      </div>

      <div className="imagen" onClick={() => navigate(`/producto/${producto.id}`, { state: { volverA: location.pathname + location.search } })}>
        {hover &&
          producto.images[1] ?
          <img src={producto.images[1]} alt="" /> :
          <img src={producto.thumbnail} alt="" />
        }
      </div>

      <span className="nombre">{producto.title}</span>
      <span className="rating">
        <i className="fa-solid fa-star"></i>
        {producto.rating}
      </span>
      <span className="stock">Stock {producto.stock}</span>
      <span className="precio">${producto.price}</span>

      <div className="botones">
        <button className="comprar" onClick={() => (añadirAlCarrito())}>Agregar al carrito</button>
        <button className="info" onClick={() => navigate(`/producto/${producto.id}`, { state: { volverA: location.pathname + location.search } })}> Más información</button>
      </div>
    </div>
  );
};
