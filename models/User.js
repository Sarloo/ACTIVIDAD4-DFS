const mongoose = require("mongoose");

// Esquema del usuario
const userSchema = new mongoose.Schema({
  username: {
    type: String,       // Tipo texto
    required: true,     // Obligatorio
    unique: true        // No se repite
  },
  password: {
    type: String,       // Contraseña encriptada
    required: true
  }
});

// Exporta el modelo
module.exports = mongoose.model("User", userSchema);
