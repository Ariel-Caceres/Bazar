import { createContext, useContext, useState, ReactNode, useEffect } from "react";

export interface Product {
  id: number;
  title: string;
  cantidad: number,
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

interface ProductosContextType {
  productos: Product[];
  loading: boolean;
  orden: string;
  setOrden: (orden: string) => void;
  marcasSeleccionadas: string[];
  setMarcasSeleccionadas: (marcas: string[]) => void;
  fetchProductos: (categoria?: string, buscador?: string) => void;
}

const ProductosContext = createContext<ProductosContextType | undefined>(undefined);

export const ProductosProvider = ({ children }: { children: ReactNode }) => {
  const [productos, setProductos] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [orden, setOrden] = useState<string>("");
  const [marcasSeleccionadas, setMarcasSeleccionadas] = useState<string[]>([]);

const fetchProductos = async (categoria?: string, buscador?: string) => {
  setLoading(true);
  try {
    let url = "";
    if (buscador && buscador.trim() !== "") {
      url = `http://localhost:3000/api/${buscador}`;
    } else if (categoria) {
      url = `http://localhost:3000/productos/${categoria}`;
    } else {
      url = "http://localhost:3000/api/productos";
    }

    const res = await fetch(url);
    if (!res.ok) {
      const errorData = await res.json();
      console.warn("Exploto el server:", errorData.error);
      setProductos([]);
    } else {
      const data = await res.json();
      if (!Array.isArray(data)) {
        console.log("No se encontraron productos");
        setProductos([]);
      } else {
        setProductos(data);
      }
    }
  } catch (error) {
    console.error("Error al traer los productos", error);
    setProductos([]);
  } finally {
    setLoading(false); 
  }
};





  return (
    <ProductosContext.Provider
      value={{ productos, loading, orden, setOrden, marcasSeleccionadas, setMarcasSeleccionadas, fetchProductos }}>
      {children}
    </ProductosContext.Provider>
  );
};

export const useProductosContext = () => {
  const context = useContext(ProductosContext);
  if (!context) {
    throw new Error("useProductosContext debe usarse dentro de un ProductosProvider");
  }
  return context;
}
