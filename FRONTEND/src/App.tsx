import { BrowserRouter as Router, Routes, Route, } from "react-router-dom";
import { Resultados } from "../componentes/Resultados.tsx"
// import { DetallesProducto } from "../componentes/DetallesProducto.tsx";
import { Buscador } from "../componentes/Buscador.tsx"
import "../src/estilos/index.css"
import { DetallesProducto } from "../componentes/DetallesProducto.tsx";
import { Login } from "../componentes/Login.tsx"
import {Carrito} from "../componentes/Carrito"
import { Register } from "../componentes/Register.tsx";
import { Admin } from "../componentes/Admin.tsx";

export const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="producto/:id" element={<DetallesProducto />} />
        <Route path="/" element={<Resultados />} />
        <Route path="/buscador" element={<Buscador />} />
        <Route path="/login" element={<Login />} />
        <Route path="/carrito" element={<Carrito/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/admin" element={<Admin/>}/>
      </Routes>
    </Router>
  )
} 