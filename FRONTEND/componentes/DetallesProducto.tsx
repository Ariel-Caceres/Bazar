
import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import "../src/estilos/derallesProdiucto.css"
import { Header } from "./Header";
import { useApp } from "../context/useApp";
import { useRef } from "react";

export interface Producto {
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
}

export const DetallesProducto = () => {
    const navigate = useNavigate()
    const [producto, setProducto] = useState<Producto | null>(null)
    const [imagenGrande, setImagenGrande] = useState<string | null>(null)
    const { id } = useParams()
    const location = useLocation();
    const volverA = location.state?.volverA || "/items";
    const [imagenHover, setImagenHover] = useState<string | null>(null);
    const [fade, setFade] = useState(false);
    const [recomendados, setRecomendados] = useState<Producto[]>([])
    const [categoria, setCategoria] = useState<string>("")
    const { usuario } = useApp()
    const idNumero = id ? parseInt(id) : null
    const carouselRef = useRef<HTMLDivElement>(null);


    const fetchAccesorios = async () => {
        try {
            const res = await fetch(`http://localhost:3000/api/productos`)
            const data: Producto[] = await res.json()
            const noRecomandar = data.filter(p => p.id !== idNumero)
            setRecomendados(noRecomandar)
        } catch {
            console.error("no anda");

        }
    }

    const añadirAlCarrito = () => {
        if (usuario) {
            fetch(`http://localhost:3000/carrito/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    usuario: `${usuario}`,
                    producto: producto,
                })
            })

        }
        else {
            navigate("/login", { state: { carritomsj: true } })
        }

    }

    const ProductoRecomendadoScroll = () => {
        const { id } = useParams()
        useEffect(() => {
            window.scrollTo({ top: 0, behavior: "smooth" })
        }, [id])
        return null
    }

    const scrollLeft = () => {
        if (carouselRef.current) {
            carouselRef.current.scrollBy({ left: -500, behavior: "smooth" });
        }
    };

    const scrollRight = () => {
        if (carouselRef.current) {
            carouselRef.current.scrollBy({ left: 300, behavior: "smooth" });
        }
    };


    useEffect(() => {
        const fetchProducto = async () => {
            const res = await fetch(`http://localhost:3000/producto/${id}`);
            const data = await res.json();
            setProducto(data);
            setCategoria(data.category)
        };
        fetchProducto();
        fetchAccesorios()

    }, [id]);

    useEffect(() => {
        if (producto && producto.images && producto.images.length > 0) {
            setImagenGrande(producto.images[0]);
        }
    }, [producto])

    useEffect(() => {
        setFade(true);
        const timeout = setTimeout(() => setFade(false), 300);
        return () => clearTimeout(timeout);
    }, [imagenHover, imagenGrande]);
    if (!producto) return <div>Cargando...</div>;


    return (
        <>
            <ProductoRecomendadoScroll />
            <Header />
            <div className="flechas">
                <div className="navigate" onClick={() => (navigate(volverA, { state: { ultimoId: id } }))}>
                    <span><i className="fa-solid fa-arrow-left izq"></i></span>
                </div>
            </div>
            <div className="producto-detalles">
                <div className="imgs">
                    {producto.images.map((img, index) => (
                        <img src={img}
                            alt="" key={index}
                            onClick={() => {
                                setImagenGrande(img)
                            }}
                            onMouseEnter={() => setImagenHover(img)}
                            onMouseLeave={() => setImagenHover(null)}
                            className={imagenGrande == img ? "focus" : ""} />

                    ))}
                </div>
                <div className="img-grande">
                    {imagenGrande && (
                        <img src={imagenHover || imagenGrande} alt="" className={fade ? 'fade-out' : ''} />
                    )}

                </div>
                <div className="info">
                    <div className="tit-desc">
                        <h1> {producto.title}</h1>
                        <p>{producto.description}</p>
                    </div>
                    <div className="rat-precio">
                        <div className="rat">
                            {Array.from({ length: Math.floor(producto.rating) }, (_, index) => (
                                <i className="fa-solid fa-star" key={index}></i>
                            ))}

                            <span className="rat"> {producto.rating}</span>
                        </div>
                        <span className="precio">${producto.price}</span>
                        <div className="descuento">
                            <span className="precio-con-descuento">${Math.round((producto.price) - (producto.price * producto.discountPercentage / 100))} </span>
                            <span className="off">{producto.discountPercentage} % OFF </span>
                        </div>
                    </div>
                    <div className="dimensions">
                        <div className="titulo">
                            <span>Dimensiones:</span>
                        </div>
                        <div className="w-h-d">
                            <span>Ancho: {producto.dimensions.width} </span>
                            <span>Largo: {producto.dimensions.height} </span>
                            <span>Grosor: {producto.dimensions.depth} </span>
                            <span>Peso: {producto.weight}</span>
                        </div>
                    </div>
                    <div className="viaje-retorno">
                        <div className="llega-en">
                            <span>🚢 {producto.shippingInformation}</span>
                        </div>
                        <div className="retorno">
                            <span>🔁 {producto.returnPolicy}</span>
                        </div>
                        <div className="warranty">
                            <span>✅ {producto.warrantyInformation}</span>
                        </div>
                    </div>

                    <div className="botones">
                        <button className="comprar">
                            <span>Comprar ahora</span>
                        </button>
                        <button className="agregar" onClick={() => (añadirAlCarrito())}>
                            <span>Agregar al carrito</span>
                        </button>
                    </div>
                </div>
            </div>
            <div className="recomendados">
                {producto.category?.toLowerCase() === "smartphones" &&
                    <h2>¡Accesorios para tu smartphone!</h2>
                }
                <div className="recomendados-celu">
                    {producto.category?.toLowerCase() === "smartphones" &&
                        recomendados
                            .filter(p => p.category.toLowerCase() === "mobile-accessories")
                            .map(p => (
                                <div className="accesorio-celu" key={p.id} onClick={() => (navigate(`/producto/${p.id}`))}>
                                    <span className="nombre">{p.title}</span>
                                    <div className="img">
                                        <img src={p.thumbnail} alt="" />
                                    </div>
                                    <span className="precio">$ {p.price}</span>
                                </div>
                            ))
                    }
                </div >
                <h2>Te puede interesar</h2>
                <div className="conflechas">
                    <button className="scroll left" onClick={() => (scrollLeft())}><i className="fa-solid fa-arrow-left der"></i></button>

                    <div className="accesorios" ref={carouselRef}>
                        {recomendados.map(r => r.category == categoria &&
                            <div className="accesorio" key={r.id} onClick={() => (navigate(`/producto/${r.id}`))}>
                                <span className="nombre">
                                    {r.title}
                                </span>
                                <div className="img">
                                    <img src={r.thumbnail} alt="" />
                                </div>
                                <span className="precio">
                                    $ {r.price}
                                </span>
                            </div>
                        )}
                        <button className="scroll right" onClick={() => (scrollRight())}><i className="fa-solid fa-arrow-right izq"></i></button>
                    </div>
                </div>
            </div>

            <div className="reviews">
                <span className="titulo">Reviews {producto.reviews.length} </span>
                {producto.reviews.map(r => (
                    <div className="review" key={r.reviewerName}>
                        <div className="rating" >
                            <span className="nombre">{r.reviewerName} </span>
                            {Array.from({ length: r.rating }, (_, index) => (
                                <i className="fa-solid fa-star" key={index}></i>
                            ))}
                        </div>
                        <div className="comentario">
                            <span> {r.comment}</span>
                            <span className="date"> {r.date}</span>
                        </div>


                    </div>
                ))}
            </div>

        </>
    )
}