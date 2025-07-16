import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import "../src/estilos/resultados.css";
import { ProductoCard } from "./ProductoCard";
import { Header } from "../componentes/Header.tsx";
import { CategoriasCard } from "./CategoriasCard";
import { useProductosContext } from "../context/ProductosContext";
import { Footer } from "./Footer.tsx";

export interface categorias {
  name: string;
  url: string;
}

export const Resultados = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoria: string | null = searchParams.get("categoria");
  const buscador: string | null = searchParams.get("buscador");
  const ultimoId = location.state?.ultimoId;
  const [categorias, setCategorias] = useState<categorias[]>([]);

  const {
    productos,
    loading,
    orden,
    setOrden,
    marcasSeleccionadas,
    setMarcasSeleccionadas,
    fetchProductos,
  } = useProductosContext();
  
  const getdata = async () => {
    try {
      const res = await fetch("http://localhost:3000/categorias");
      const data = await res.json();
      setCategorias(data);
    } catch (error) {
      console.log("Error al traer las categorias", error);
    }
  };
  
  useEffect(() => {
    fetchProductos(categoria ?? undefined, buscador ?? undefined);
  }, [buscador, categoria]);

  useEffect(() => {
    getdata();
  }, []);

  const productosFiltrados = marcasSeleccionadas.length === 0
    ? productos
    : productos.filter(p => marcasSeleccionadas.includes(p.brand));

  const handleChange = (marca: string, checked: boolean) => {
    setMarcasSeleccionadas(prev=>
      checked ? [...prev, marca] : prev.filter(m => m != marca)
    );
  };

  const productosOrdenados = [...productosFiltrados].sort((a, b) =>
    orden == "menor" ? a.price - b.price :
    orden == "mayor" ? b.price - a.price :
    orden == "rating" ? b.rating - a.rating :
    0
  );

  return (
    <>
      <Header />
      <section>
        {ultimoId &&
          <div className="volver" onClick={() => (ultimoId && navigate(`/producto/${ultimoId}`, {
            state: { volverA: location.pathname + location.search }
          }))}>
            <span><i className="fa-solid fa-arrow-right derecha"></i></span>
          </div>
        }
        <div className="categorias" onClick={()=>(setMarcasSeleccionadas([]))}>
          {categorias.map(c => (<CategoriasCard categoria={c} key={c.name} />))}
        </div>
        <div className="finder-top">
          <div className="cant-resultados-filtros">
            <div className="filtros-active">
              <div className="titulo-icono">
                <i className="fa-solid fa-filter"></i>
                Filtros:
              </div>
              {buscador == null
                ? <span className="filtros">Todos</span>
                : Array.from(new Set(productos.flatMap(p => p.tags))).map(tag => (<span key={tag} className="filtros"> {tag} </span>))}
            </div>
            <div className="cant-active">| <span className="cant">{productosFiltrados.length}</span> Resultados   {buscador != null ? <span className="palabra">{buscador}</span> : null}</div>
          </div>

          <div className="ordenar">
            <span>Ordenar</span>
            <select name="select" id="select" onChange={(e) => setOrden(e.target.value)}>
              <option value="">Recomendados</option>
              <option value="menor">Precio menor ⬇</option>
              <option value="mayor">Precio mayor ⬆</option>
              <option value="rating">Rating ⭐</option>
            </select>
          </div>
        </div>

        <div className="layout">
          <aside>
            <div className="filtros">
              <div className="marcas">
                <span className="titulo">Marcas:</span>
                {marcasSeleccionadas.length !== 0 ? (
                  <span className="limpiar" onClick={() => setMarcasSeleccionadas([])}>Limpiar <i className="fa-solid fa-filter-circle-xmark" ></i></span>
                ) : ""
              }

                <ul>
                  {productos && Array.from(new Set(productos.map(p => p.brand))).map((m) => (
                    <li key={m}>
                      <input type="checkbox" name={m} checked={marcasSeleccionadas.includes(m)} onChange={(e) => handleChange(m, e.target.checked)} />
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>
          <div className="productos">
            {loading ? (
              <span>⏳Cargando productos...</span>
            ) : productosFiltrados.length != 0 ? (
              productosOrdenados.map((p) => (
                <ProductoCard key={p.id} producto={p} />
              ))
            ) : (
              <span>No se encontraron productos 👎</span>
            )}
          </div>
        </div >
      </section >
      <Footer/>
    </>
  );
};
