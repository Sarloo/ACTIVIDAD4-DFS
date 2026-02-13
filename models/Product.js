const mongoose = require("mongoose"); 
// Importa mongoose para definir el esquema del producto

const productSchema = new mongoose.Schema({

  // Nombre del producto
  nombre: {
    type: String,       // Texto
    required: true      // Obligatorio
  },

  // Precio del producto
  precio: {
    type: Number,       // Número
    required: true      // Obligatorio
  },

  // Stock del producto
  stock: {
    type: Number,       // Número
    required: true,
    default: 0,
    min: 0
  },

  // Usuario que creó el producto
  creadoPor: {
    type: mongoose.Schema.Types.ObjectId, // ID de usuario
    ref: "User",                          // Referencia al modelo User
    required: true
  }
}, {
  timestamps: true // Agrega createdAt y updatedAt automáticamente
});

// Exporta el modelo Product
module.exports = mongoose.model("Product", productSchema);
