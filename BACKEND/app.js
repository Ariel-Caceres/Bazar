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

app.get('/api/productos', (req, res) => {
  if (!productosTecnologia) {
    return res.status(500).json({ error: 'Error interno' });
  }
  res.status(200).json(productosTecnologia);
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
    }
  } else {
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

app.delete("/delete/:usuario/:id", (req, res) => {
  let usuario = req.params.usuario;
  let productosEnCarrito = leerJson("products.json");
  let carritoUsuario = productosEnCarrito.find(p => p.usuario === usuario);
  if (!carritoUsuario) {
    return res.status(404).json("No se encontró el usuario");
  }
  let productoABorrar = Number(req.params.id);
  carritoUsuario.productos = carritoUsuario.productos.filter(p => p.id !== productoABorrar);
  crearJson("products.json", productosEnCarrito);
  res.json({ message: "Producto eliminado con éxito" });
});

app.post("/usuario/add", (req, res) => {
  let usuarios = leerJson("users.json");
  let { usuario, contraseña } = req.body;

  if (!usuario || !contraseña) {
    return res.status(400).json({ message: "Faltan datos" });
  }

  if (usuario === "admin" && contraseña === "1234") {
    return res.status(403).json({ message: "No se puede registrar como admin" });
  }

  if (usuarios.find(u => u.usuario === usuario)) {
    return res.status(409).json({ message: "Este usuario ya existe" });
  }

  usuarios.push({ usuario, contraseña });
  crearJson("users.json", usuarios);

  return res.status(201).json({ message: "Usuario registrado correctamente" });
});


app.get("/usuarios/:nombre/:contraseña", (req, res) => {
  let usuarios = leerJson("users.json")
  let contraseña = req.params.contraseña
  let usuarioNombre = req.params.nombre
  if (usuarioNombre == "admin" && contraseña == "1234") {
    return res.json({ message: "Bienvenido admin" })
  }
  if (usuarios.find(u => u.usuario == usuarioNombre && u.contraseña == contraseña)) {
    res.json({ message: "Enicio de secion exitoso" })
  } else {
    res.status(404).json({ message: "Usuario o contraseña incorrectos " })
  }

})

app.post("/carrito/add", (req, res) => {
  let productosEnCarrito = leerJson("products.json");
  let { usuario, producto } = req.body;

  let usuarioExiste = productosEnCarrito.find(u => u.usuario === usuario);

  if (usuarioExiste) {
    let productoExistente = usuarioExiste.productos.find(p => p.id === producto.id);

    if (productoExistente) {
      productoExistente.cantidad = (productoExistente.cantidad || 1) + 1;
    } else {
      usuarioExiste.productos.push({ ...producto, cantidad: 1 });
    }
  } else {
    if (usuario !== "admin") {
      productosEnCarrito.push({
        usuario,
        productos: [{ ...producto, cantidad: 1 }]
      });
    }
  }

  crearJson("products.json", productosEnCarrito);
  res.status(200).json({ message: "Producto agregado al carrito con éxito" });
});


app.get("/categorias", (req, res) => {
  if (!categoriasFiltradas || categoriasFiltradas.length == 0) {
    return res.status(404).json({ error: `Categoria no encontrada` });
  }
  res.json(categoriasFiltradas);
});


app.put("/buy/:usuario", (req, res) => {
  let carrito = leerJson("products.json")
  let usuarioCarrito = req.params.usuario
  let usuarioEncontrado = carrito.find(c => c.usuario == usuarioCarrito)
  if (!usuarioEncontrado) {
    res.status(404).json({ message: "No se encontro el usuario" })
  }
  usuarioEncontrado.productos = []
  crearJson("products.json", carrito)
  res.json("carrito vaciado")

})

app.get("/admin/products", async (req, res) => {
  try {
    let response = await fetch("https://6812b0f7129f6313e20f45cd.mockapi.io/products")
    let data = await response.json()
    res.json(data)
  } catch (error) {
    res.status(404).json({ message: "Error al traer los productos", error })
  }
})

app.put("/cart/cantidad/:usuario/:id", (req,res)=>{
  let producto =  req.params.id
  let usuario = req.params.usuario
  let nuevaCantidad =  req.body.cantidad
  let carrito = leerJson("products.json")
  let carritoUsuarioEncontrado = carrito.find(u=> u.usuario == usuario)
  if(!carritoUsuarioEncontrado){
    return res.status(404).json("Usuario no encontrado")
  }
  let productoEncontrado = carritoUsuarioEncontrado.productos.find(p=>p.id == producto)
  if(!productoEncontrado){
    return res.status(404).json("Producto no encontrado")
  }
  productoEncontrado.cantidad = nuevaCantidad
  crearJson("products.json",carrito)

  res.json({message:"Cantidad editada con exito"})
})


app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');

});