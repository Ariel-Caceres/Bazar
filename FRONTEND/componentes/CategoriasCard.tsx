
import "../src/estilos/categoriasCard.css"
import accesorios from "../src/assets/imgsCategorias/accesorios.jpg"
import laptop from "../src/assets/imgsCategorias/laptop.jpg"
import tablet from "../src/assets/imgsCategorias/tablet.png"
import smartphone from "../src/assets/imgsCategorias/smartphone.png"
import { useNavigate } from 'react-router-dom';

export interface categorias {
    name: string;
    url: string;
}
export const CategoriasCard = ({ categoria }: { categoria: categorias }) => {
    const navigate = useNavigate();

    const categoriasTecnologia = {
        Laptops: laptop,
        "Mobile Accessories": accesorios,
        Smartphones: smartphone,
        Tablets: tablet,
    }
    return (
        <div className="categoria" onClick={() => navigate(`/?categoria=${categoria.name.toLocaleLowerCase()}`)}>
            <span>{categoria.name}</span>
            <div className="img-categoria">
                <img src={categoriasTecnologia[categoria.name]} alt="" />
            </div>
        </div>

    )

}