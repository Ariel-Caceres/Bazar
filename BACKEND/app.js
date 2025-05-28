const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { error } = require("console");
const app = express();
app.use(cors());
app.use(express.json());


const leerJson = (nombreJson) => {
  let api = fs.readFileSync(path.join(__dirname, `./data/${nombreJson}`), "utf-8")
  let products = JSON.parse(api)
  return products
}
const crearJson = (nombreJson, parametro) => {
  fs.writeFileSync(path.join(__dirname, `./data/${nombreJson}`), JSON.stringify(parametro, null, 2))
}
const categoriasTecnologia = [
  "laptops",
  "mobile-accessories",
  "smartphones",
  "tablets",
]
let productosTecnologia = []

const fetchProductosTecnologia = async () => {
  const response = await fetch("https://dummyjson.com/products?limit=0");
  const data = await response.json();
  productosTecnologia = data.products.filter(p =>
    categoriasTecnologia.includes(p.category.toLowerCase())
  );
};
fetchProductosTecnologia()

app.get('/api/productos', async (req, res) => {
  if (!productosTecnologia || productosTecnologia.length == 0) {
    return res.status(404).json({ error: `Error al obtener los productos, productos no encontrados` })
  }
  res.json(productosTecnologia)
});

app.get("/api/:search", async (req, res) => {
  const search = req.params.search.toLowerCase();
  const encontrados = productosTecnologia.filter(p =>
    p.title.toLowerCase().includes(search)
    || p.brand.toLowerCase().includes(search)
    || p.category.toLowerCase().includes(search)
    || p.tags[0].toLowerCase().includes(search)
  )
  if (!encontrados || encontrados.length == 0) {
    return res.status(404).json({ error: "No se encontraron productos" })
  }
  res.json(encontrados);
})

app.get("/producto/:id", (req, res) => {
  const idBuscado = Number(req.params.id);
  const producto = productosTecnologia.find(p => p.id === idBuscado);
  if (!producto || producto.length == 0) {
    return res.status(404).json({ error: `Producto con id ${id} no encontrado` })
  }
  res.json(producto);
});

app.get("/productos/:categoria", async (req, res) => {
  let categoriaRecibida = req.params.categoria
  if (categoriaRecibida == "mobile accessories") {
    categoriaRecibida = "mobile-accessories"
  }
  let response = await fetch(`https://dummyjson.com/products/category/${categoriaRecibida}`)
  let data = await response.json()
  if (!data || data.length == 0) {
    return res.status(404).json({ error: `La categoria ${categoriaRecibida} no existe` })
  }
  res.json(data.products)
})

app.get("/cart/:usuario", (req, res) => {
  let usuarioCarrito = req.params.usuario
  let productos = leerJson("products.json")
  if (productos) {
    let productosEncontrados = productos.find(p => p.usuario === usuarioCarrito)
    if (productosEncontrados) {
      let carritoEncontrado = productosEncontrados.productos
      res.json(carritoEncontrado)
      console.log(carritoEncontrado.length)
    }
  }else{
    res.json("no se encontreraron productos")
  }
})

app.post("/add", (req, res) => {
  let { usuario, producto } = req.body
  if (usuario && producto) {
    let listaUsuarios = leerJson("users.json")
    let usuarioExiste = listaUsuarios.find(u => u.usuario === usuario)
    if (usuarioExiste) {
      let cartProducts = leerJson("products.json")
      crearJson("products.json", cartProducts)
      cartProducts.push(producto)
    }
  }
  res.json("hola tilines")

})


let categoriasFiltradas = []

const fetchCategoriasTecnologia = async () => {
  const categoriasTecnologia = [
    "Laptops",
    "Mobile Accessories",
    "Smartphones",
    "Tablets",
  ]
  let response = await fetch("https://dummyjson.com/products/categories")
  let data = await response.json()
  categoriasFiltradas = data.filter(c => categoriasTecnologia.includes(c.name))
}
fetchCategoriasTecnologia()

app.delete("/delete/:id", (req, res) => {
  let productosEnCarrito = leerJson("products.json")
  let productoABorrar = Number(req.params.id)
  let productoEncontrado = productosEnCarrito.filter(p => p.id != productoABorrar)
  crearJson("products.json", productoEncontrado)
  res.json({ message: "Producto eliminado con éxito", productoABorrar });

})

app.post("/usuario/add", (req, res) => {
  let usuarios = leerJson("users.json")
  let { usuario, contraseña } = req.body
  if (usuario && contraseña) {
    if (usuarios.find(u => u.usuario === usuario)) {
      return res.status(409).json({ message: "Este usuario ya existe" })
    } else {
      usuarios.push(req.body)
      crearJson("users.json", usuarios)
    }
    return res.status(201).json({ message: "Usuario registrado correctamente" })
  } else {
    return res.status(400).json({ message: "faltan datos, todo mal" })
  }
})

app.get("/usuarios/:nombre", (req, res) => {
  let usuarios = leerJson("users.json")
  let usuarioNombre = req.params.nombre
  if (usuarios.find(u => u.usuario == usuarioNombre)) {
    res.json({ message: "Enicio de secion exitoso" })
  } else {
    res.status(404).json({ message: "El usuario no existe carajo" })
  }

})

app.post("/carrito/add", (req, res) => {
  let productosEnCarrito = leerJson("products.json")
  let { id, usuario, producto } = req.body
  let usuarioExiste = productosEnCarrito.find(uid => uid.id === id)
  if (usuarioExiste) {
    usuarioExiste.productos.push(producto)
  } else {
    productosEnCarrito.push({
      usuario,
      id,
      productos: [producto]
    })
  }
  crearJson("products.json", productosEnCarrito)
})


app.get("/categorias", (req, res) => {
  res.json(categoriasFiltradas)
  if (!categoriasFiltradas || categoriasFiltradas.length == 0) {
    return res.status(404).json({ error: `Categoria no encontrada` })
  }
})
app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');

});