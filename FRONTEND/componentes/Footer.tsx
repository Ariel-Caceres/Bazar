import "../src/estilos/footer.css";
import { useLocation } from "react-router-dom";
export const Footer = () => {
  const location= useLocation()
  return (
    <footer className="footer">
      <div className="footer-contenido">
        <p>&copy; {new Date().getFullYear()} Mercado Cautivo. Proyecto final para el curso de React Js Talento Tech.</p>
        <p className="footer-links">
          <a href={location.pathname}>Sobre nosotros</a> | <a href={location.pathname}>Contacto</a>
        </p>
      </div>
    </footer>
  );
};
