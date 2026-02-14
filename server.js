// Importa express para crear el servidor
const express = require("express");
const path = require("path");

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
app.use(express.static(path.join(__dirname, "public"))); // Sirve HTML

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB conectado"))
  .catch(err => console.error(err));

// Usa las rutas
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

// Home explícito para Vercel
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Puerto
const PORT = process.env.PORT || 3000;

// En Vercel se exporta la app sin abrir puerto local
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
  });
}

// Exporta app para pruebas
module.exports = app;
