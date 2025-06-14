import { createContext, useState, ReactNode } from "react";

interface AppContextType {
  usuario: string | null;
  login: (usuario: string) => void;
  logout: () => void;
  id: string | null;
  setId: (id: string) => void
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<string | null>(null);
  const [idActual, setIdActual] = useState<string | null>(null)
  const login = (usuario: string) => setUser(usuario);
  const logout = () =>{

    setUser(null)
    setIdActual(null);
  }
  const setId = (id: string) => setIdActual(id)
  return (
    <AppContext.Provider value={{ usuario: user, login, logout, id: idActual, setId }}>
      {children}
    </AppContext.Provider>
  );
};
