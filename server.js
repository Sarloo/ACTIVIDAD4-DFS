// Importa express para crear el servidor
const express = require("express");

// Importa mongoose para conectar MongoDB
const mongoose = require("mongoose");

// Permite peticiones desde el frontend
const cors = require("cors");

// Carga variables del archivo .env
require("dotenv").config();

// Importa las rutas
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");

// Crea la app de express
const app = express();

// Middlewares globales
app.use(cors());                // Permite solicitudes externas
app.use(express.json());        // Permite leer JSON
app.use(express.static("public")); // Sirve HTML

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB conectado"))
  .catch(err => console.error(err));

// Usa las rutas
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

// Puerto
const PORT = process.env.PORT || 3000;

// Arranca el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

// Exporta app para pruebas
module.exports = app;
