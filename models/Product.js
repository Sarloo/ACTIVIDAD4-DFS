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

  // Fecha de creación automática
  fechaCreacion: {
    type: Date,         // Tipo fecha
    default: Date.now   // Se asigna automáticamente
  },

  // Usuario que creó el producto
  creadoPor: {
    type: mongoose.Schema.Types.ObjectId, // ID de usuario
    ref: "User",                          // Referencia al modelo User
    required: true
  }

});

// Exporta el modelo Product
module.exports = mongoose.model("Product", productSchema);
