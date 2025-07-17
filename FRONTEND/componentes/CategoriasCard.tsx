
import "../src/estilos/categoriasCard.css"
import accesorios from "../src/assets/imgsCategorias/accesorios.jpg"
import laptop from "../src/assets/imgsCategorias/laptop.jpg"
import tablet from "../src/assets/imgsCategorias/tablet.png"
import smartphone from "../src/assets/imgsCategorias/smartphone.png"
import { useNavigate } from 'react-router-dom';
import { useSearchParams } from "react-router-dom"
export interface categorias {
    name: string;
    url: string;
}
export const CategoriasCard = ({ categoria }: { categoria: categorias }) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const categoriaUrl = searchParams.get("categoria")?.toLowerCase() || "";

   
    const navigateCat = (cat:string)=>{
        if(categoriaUrl !== cat){
            navigate(`/?categoria=${cat}`)

        }else{
            navigate("/")
        }
    }

    const categoriasTecnologia: Record<string, string> = {
        Laptops: laptop,
        "Mobile Accessories": accesorios,
        Smartphones: smartphone,
        Tablets: tablet,
    }

    return (
        <div className={categoria.name.toLocaleLowerCase() === categoriaUrl? "categoriaElegida" : "categoria"} onClick={() => navigateCat(categoria.name.toLocaleLowerCase())}>
            <span>{categoria.name}</span>
            <div className="img-categoria">
                <img src={categoriasTecnologia[categoria.name]} alt="" />
            </div>
        </div>

    )

}