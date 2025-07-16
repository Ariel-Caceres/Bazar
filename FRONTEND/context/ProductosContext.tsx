import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

export interface Product {
    id: number;
    title: string;
    description: string;
    price: number;
    discountPercentage: number;
    rating: number;
    stock: number;
    brand: string;
    category: string;
    thumbnail: string;
    images: string[];
    availabilityStatus: string;
    dimensions: {
        width: number;
        height: number;
        depth: number;
    };
    weight: number;
    minimumOrderQuantity: number;
    shippingInformation: string;
    warrantyInformation: string;
    returnPolicy: string;
    sku: string;
    tags: string[];
    meta: {
        createdAt: string;
        updatedAt: string;
        barcode: string;
        qrCode: string;
    };
    reviews: any[];
    cantidad: number
}

interface ProductosContextType {
  productos: Product[];
  loading: boolean;
  orden: string;
  setOrden: (orden: string) => void;
  marcasSeleccionadas: string[];
  setMarcasSeleccionadas: React.Dispatch<React.SetStateAction<string[]>>;
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
      url = `https://bazar-gbw5.onrender.com/api/${buscador}`;
    } else if (categoria) {
      url = `https://bazar-gbw5.onrender.com/productos/${categoria}`;
    } else {
      url = "https://bazar-gbw5.onrender.com/api/productos";
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
        if (JSON.stringify(data) !== JSON.stringify(productos)) {
          setProductos(data);
        }
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
