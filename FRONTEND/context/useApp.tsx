import { useContext } from "react";
import { AppContext } from "../context/contexto";

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp debe usarse dentro de un AppProvider");
  }
  return context;
};
