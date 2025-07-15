import { createContext, useState } from "react";
import type { ReactNode } from "react";
import type { Product } from "../context/ProductosContext";

interface productoEsperaType {
    setProductoEnEspera: (producto: Product | null) => void
    productoEspera: Product | null
}
export const ProductosEsperaContext = createContext<productoEsperaType | undefined>(undefined);

export const ProductoEsperaProvider = ({ children }: { children: ReactNode }) => {
    const [productoEspera, setProductoEspera] = useState<Product | null>(null)
    const setProductoEnEspera = (producto: Product | null) => setProductoEspera(producto)

   return (
  <ProductosEsperaContext.Provider value={{ productoEspera, setProductoEnEspera }}>
    {children}
  </ProductosEsperaContext.Provider>
);

}