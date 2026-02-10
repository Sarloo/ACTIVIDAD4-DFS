const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // Obtiene el token del header
  const token = req.headers.authorization;

  // Si no hay token
  if (!token) {
    return res.status(401).json({ mensaje: "Acceso denegado" });
  }

  try {
    // Verifica el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Guarda usuario decodificado
    req.user = decoded;

    // Continúa a la ruta
    next();
  } catch (error) {
    res.status(401).json({ mensaje: "Token inválido" });
  }
};
