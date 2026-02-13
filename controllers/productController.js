const Product = require("../models/Product"); 
// Importa el modelo Product

// Obtener productos
exports.getProducts = async (req, res) => {

  // Busca productos y trae info del usuario que los creó
  const products = await Product.find()
    .populate("creadoPor", "username"); 
    // populate permite mostrar el nombre del usuario

  res.json(products);
};

// Crear producto
exports.createProduct = async (req, res) => {

  // Crea el producto con los datos enviados
  const product = await Product.create({
    nombre: req.body.nombre,   // Nombre enviado desde frontend
    precio: req.body.precio,   // Precio enviado
    stock: req.body.stock,     // Stock enviado
    creadoPor: req.user.id     // ID del usuario (del JWT)
  });

  res.status(201).json(product);
};

// Actualizar producto
exports.updateProduct = async (req, res) => {

  const updated = await Product.findByIdAndUpdate(
    req.params.id,     // ID del producto
    req.body,          // Nuevos datos
    { new: true }      // Devuelve el actualizado
  );

  res.json(updated);
};

// Eliminar producto
exports.deleteProduct = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ mensaje: "Producto eliminado" });
};
