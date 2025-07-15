import { createContext, useState, ReactNode, useEffect } from "react";
import type { Product } from "./ProductosContext";
import type { Producto } from "../componentes/DetallesProducto";

interface Usuario {
  usuario: string;
  isAdmin: boolean;
}

interface AppContextType {
  usuario: string | null;
  login: (usuario: string, contraseña: string) => void;
  logout: () => void;
  id: string | null;
  setId: (id: string) => void;
  isAdmin: boolean;
  loading: boolean,
  numero: number | 0
  setNumero: (numero: number) => void
  fetchData: (usuario: string) => void

}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [idActual, setIdActual] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true)
  const [cantProductos, setCantProductos] = useState<number | 0>(0)
  // const [productoEspera, setProductoEspera] = useState<Product | null>(null)

   const fetchData = async (usuario: string) => {
    try {
      const resUsuario = await fetch(`http://localhost:3000/usuarios/${usuario}`);

      if (resUsuario.status === 404) {
        const data = await resUsuario.json();
        alert(data.message);
        localStorage.removeItem("usuario");
        setUser(null)
      }

      const resCarrito = await fetch(`http://localhost:3000/cart/${usuario}`);

      if (!resCarrito.ok) {
        throw new Error("Error al traer el carrito");
      }

      const data: Product[] = await resCarrito.json();
      setNumero(data.length);

    } catch (error) {
      console.log("Error al traer datos del carrito o del usuario:", error);
    }
  };

  const login = (usuario: string, contraseña: string) => {
    const isAdmin = usuario.toLowerCase() === "admin" && contraseña === "1234";
    const nuevoUsuario = { usuario, isAdmin };
    setUser(nuevoUsuario);
    localStorage.setItem("usuario", JSON.stringify(nuevoUsuario));
  };

  const setNumero = (numero: number) => setCantProductos(numero)

  const logout = () => {
    setUser(null);
    setIdActual(null);
    localStorage.removeItem("usuario");
    setNumero(0)
  };

  // const setProductoEnEspera = (producto:Product)=> setProductoEspera(producto)

  useEffect(() => {
    if (user?.usuario) {
      fetchData(user.usuario)
    }
  }, [user])

  useEffect(() => {
    const guardado = localStorage.getItem("usuario");
    if (guardado) {
      const usuarioGuardado: Usuario = JSON.parse(guardado);
      setUser(usuarioGuardado);
    }
    setLoading(false)
  }, []);

  const setId = (id: string) => setIdActual(id);

  return (
    <AppContext.Provider
      value={{
        usuario: user?.usuario ?? null,
        isAdmin: user?.isAdmin ?? false,
        login,
        logout,
        id: idActual,
        setId,
        loading,
        numero: cantProductos,
        setNumero,
        fetchData,
      
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
