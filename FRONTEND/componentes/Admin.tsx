import React, { useEffect, useState } from "react";
import "../src/estilos/admin.css"
import { Header } from "./Header";
import { useApp } from "../context/useApp";
import { Navigate } from "react-router-dom";

interface Product {
  id: number;
  name: string;
  price: number;
  avatar: string,
  description: string
}

export const Admin = () => {
  const [productos, setProductos] = useState<Product[]>([])
  const [mostrarFormularioAgg, setMostrarFormularioAgg] = useState<boolean>(false)
  const [mostrarFormularioEditar, setMostrarFormularioEditar] = useState<boolean>(false)
  const [idProducto, setIdProducto] = useState<number | null>(null)
  const [nombreProducto, setNombreProducto] = useState<string>("")
  const [precioProducto, setPrecioProducto] = useState<number>()
  const [avatarProducto, setAvatarProducto] = useState<string>("")
  const [descripcionProducto, setDescripcionProducto] = useState<string>("")

  const [descripcionProductoAgg, setDescripcionProductoAgg] = useState<string>("")
  const [avatarProductoAgg, setAvatarProductoAgg] = useState<string>("")
  const [nombreProductoAgg, setNombreProductoAgg] = useState<string>("")
  const [precioProductoAgg, setPrecioProductoAgg] = useState<number | string>("")

  const [alertaPrecio, setAlertaPrecio] = useState<boolean>(false)
  const [alertaDescripcion, setAlertaDescripcion] = useState<boolean>(false)
  const [ocultar, setOcultar] = useState<boolean>(true)
  const [seModificadonDatos, setSeModificaronDatos] = useState<boolean>(false)
  const { isAdmin, loading } = useApp()

  const fetchData = async () => {
    try {
      const res = await fetch("http://localhost:3000/admin/products")
      const data = await res.json()
      setProductos(data)
    } catch (error) {
      console.error("error al traer datos", error)
    }
  }

  const eliminarProducto = async (id: number) => {
    await fetch(`https://6812b0f7129f6313e20f45cd.mockapi.io/products/${id}`, {
      method: "DELETE"
    })
    setProductos(prev => prev.filter(p => p.id !== id))
  }

  const productoEditar = (id: number) => {
    const productoEncontrado = productos.find(p => p.id == id)
    if (productoEncontrado != undefined) {
      setPrecioProducto(productoEncontrado.price)
      setAvatarProducto(productoEncontrado.avatar)
      setNombreProducto(productoEncontrado.name)
      setDescripcionProducto(productoEncontrado.description)
    }
    setIdProducto(id)
    setMostrarFormularioEditar(true)
    scrollTop()
  }

  const editarProducto = async (id: number) => {
    if (seModificadonDatos == true) {
      try {
        const res = await fetch(`https://6812b0f7129f6313e20f45cd.mockapi.io/products/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name: nombreProducto,
            price: precioProducto,
            avatar: avatarProducto,
            description: descripcionProducto
          })
        });

        if (!res.ok) {
          throw new Error("Error al editar el producto");
        } else {

          alert("Producto editado con exito")
          setSeModificaronDatos(false)
        }
      } catch (error) {
        console.error("Hubo un error al editar el producto", error);
      }
    } else {
      alert("No se realizaron modificaciones")
    }
    fetchData()
  };

  //editar productos
  const handleChangeNombre = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNombreProducto(e.target.value)
    setSeModificaronDatos(true)
  }
  const handleChangePrecio = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrecioProducto(e.target.value)
    setSeModificaronDatos(true)

  }
  const handleCHngeAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAvatarProducto(e.target.value)
    setSeModificaronDatos(true)

  }
  const handleChangeDescripcion = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescripcionProducto(e.target.value)
    setSeModificaronDatos(true)

  }
  const handleSumbmit = (e: React.FormEvent) => {
    e.preventDefault()
    fetchData()
    setMostrarFormularioEditar(!mostrarFormularioEditar)

  }
  //agregar productos
  const handleChangeNombreAgg = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNombreProductoAgg(e.target.value)
  }
  const handleChangePrecioAgg = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrecioProductoAgg(e.target.value)
  }
  const handleChangeDescripcionAgg = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescripcionProductoAgg(e.target.value)
  }
  const handleChangeAvatarAgg = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAvatarProductoAgg(e.target.value)
  }
  const handleSubmitAgg = (e: React.FormEvent) => {
    e.preventDefault()
    fetchData()

  }

  const enviarDatos = async () => {
    if (nombreProductoAgg != "" && Number(precioProductoAgg) > 0 && descripcionProductoAgg.length >= 10) {
      try {
        const res = await fetch(`https://6812b0f7129f6313e20f45cd.mockapi.io/products`, {
          method: "POST",
          headers: {
            "Content-type": "Application/json"
          },
          body: JSON.stringify({
            name: nombreProductoAgg,
            precio: precioProductoAgg,
            description: descripcionProductoAgg,
            avatar: avatarProductoAgg || "https://avatars.githubusercontent.com/u/123"
          })

        })
        if (!res.ok) {
          throw new Error("Error al agregar el producto")
        }
        else {
          alert("Producto agregado con exito")
        }
      } catch (error) {
        console.error("Error al agregar producto", error)
      }
      setAlertaPrecio(false)
      setAlertaDescripcion(false)
      setAvatarProductoAgg("")
      setNombreProductoAgg("")
      setDescripcionProductoAgg("")
      setPrecioProductoAgg("")
    } else {

      if (precioProductoAgg == 0 || null) {
        setAlertaPrecio(true)
      }
      if (descripcionProductoAgg.length < 10) {
        setAlertaDescripcion(true)
      }
    }

  }

  useEffect(() => {
    fetchData()
  }, [])

  const ocultarBotonMostrarFormulario = () => {
    setOcultar(!ocultar)
    setMostrarFormularioAgg(!mostrarFormularioAgg)
  }
  const mostrarBotonOcultarFormulario = () => {
    setOcultar(!ocultar)
    setMostrarFormularioAgg(!mostrarFormularioAgg)
  }
  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  if (loading) return <h1>Cargando... </h1>

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }
  return (
    <>
      <Header />
      <h1>Panel administrativo</h1>
      <div className="admin">

        <div className="subtitulo">
          <div className="editarEliminar">
            <h3>Agregar editar y eliminar productos🛒</h3>
          </div>
        
        </div>

        <div className="layoutAdmin">
          
          <div className="productosNuevos">
            
            {productos && productos.map(p =>
              <div className="productoNuevo" key={p.id}>
                <span className="nombreProducto">{p.name}</span>
                <p className="descripcionProducto">{p.description}</p>
                <span className="precioProducto">Precio ${p.price}</span>
                <img src={p.avatar ? p.avatar : null} alt="" />
                <div className="botones">
                  <button onClick={() => productoEditar(p.id)}>Editar</button>
                  <button onClick={() => eliminarProducto(p.id)}>Eliminar</button>
                </div>
              </div>
            )}
          </div>
          <div className="formularios">
            {ocultar &&
              <button onClick={() => ocultarBotonMostrarFormulario()}>
                <span className="agregar">Agregar un nuevo producto</span>
              </button>
            }

            {mostrarFormularioAgg &&
              <div className="formularioAgregar">
                <form action="POST" onSubmit={handleSubmitAgg}>
                  <span className="cerrar" onClick={
                    mostrarBotonOcultarFormulario}>❌</span>

                  <span>Agregar producto</span>
                  <label htmlFor="nombre">Nombre:</label>
                  <input type="text" id="nombre" value={nombreProductoAgg} onChange={handleChangeNombreAgg} required />

                  <label htmlFor="precio">Precio:</label>
                  {alertaPrecio &&
                    <span className="alerta">⬇ El pecio debe ser mayor a 0 ⬇</span>
                  }
                  <input type="number" id="precio" value={precioProductoAgg} onChange={handleChangePrecioAgg} required />

                  <label htmlFor="descripcion">Descripción:</label>
                  {alertaDescripcion &&
                    <span className="alerta">⬇ Debe taner al menos 10 caractéres ⬇</span>
                  }

                  <input type="text" id="descripcion" value={descripcionProductoAgg} onChange={handleChangeDescripcionAgg} required />

                  <label htmlFor="imagen">Imagen:</label>
                  <input type="text" id="imagen" value={avatarProductoAgg} onChange={handleChangeAvatarAgg} />
                  <button onClick={() => enviarDatos()}>Enviar</button>
                </form>
              </div>}

            {mostrarFormularioEditar &&
              <div className="formularioAgregar">
                <form action="PUT" onSubmit={handleSumbmit}>
                  <span>Editar producto</span>
                  <span className="cerrar" onClick={() => setMostrarFormularioEditar(!mostrarFormularioEditar)}>❌</span>
                  <label htmlFor="nombre">Nombre:</label>
                  <input type="text" id="nombre" value={nombreProducto} onChange={handleChangeNombre} required />

                  <label htmlFor="precio">Precio:</label>
                  <input type="text" id="precio" value={precioProducto} onChange={handleChangePrecio} />

                  <label htmlFor="descripcion">Descripción:</label>
                  <input type="text" id="descripcion" value={descripcionProducto} onChange={handleChangeDescripcion} />

                  <label htmlFor="imagen">Imagen:</label>
                  <input type="text" id="imagen" value={avatarProducto} onChange={handleCHngeAvatar} />
                  <button onClick={() => idProducto ? editarProducto(idProducto) : ""}>Enviar</button>
                </form>
              </div>
            }

          </div>
        </div>
      </div>

    </>
  )
}