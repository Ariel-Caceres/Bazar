import { useNavigate } from "react-router-dom";
import type { Product } from "./Resultados";
import {  useState } from "react";
import { useApp } from "./useApp";
export const ProductoCard = ({ producto }: { producto: Product }) => {
  const [hover, setHover] = useState(false);
  const navigate = useNavigate();
  const {usuario} = useApp()
  const {id} = useApp()
      const añadirAlCarrito = () => {
        fetch(`http://localhost:3000/carrito/add`, {
            method: "POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
              id:`${id}`,
              usuario: `${usuario}`,
              producto:producto,
            })
        })
    }
  return (
    
    <div className="producto" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <div className="descuento">
        <span>¡Descuento!🔥 | </span>
        <span>{producto.discountPercentage}% OFF</span>
      </div>

      <div className="imagen"onClick={() => navigate(`/producto/${producto.id}`,{ state: { volverA: location.pathname + location.search } })}>
        {hover &&
         producto.images[1]? 
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
        <button className="comprar" onClick={()=>(añadirAlCarrito())}>Agregar al carrito</button>
        <button className="info"onClick={()=> navigate(`/producto/${producto.id}`,{ state: { volverA: location.pathname + location.search } })}> Más información</button>
      </div>
    </div>
  );
};
