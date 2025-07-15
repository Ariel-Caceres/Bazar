import { useContext } from "react";
import { ProductosEsperaContext } from "../context/ProductoEsperaContext";

export const useEspera = () => {
  const context = useContext(ProductosEsperaContext);
  if (!context) {
    throw new Error("useEspera debe usarse dentro de un ProductoEsperaProvider");
  }
  return context;
};
