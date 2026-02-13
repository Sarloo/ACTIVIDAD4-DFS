const User = require("../models/User");
const AccessLog = require("../models/AccessLog");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTRO
exports.register = async (req, res) => {
  try {
    const username = (req.body.username || "").trim();
    const password = req.body.password || "";

    if (!username || !password) {
      return res.status(400).json({ mensaje: "Usuario y contraseña son obligatorios" });
    }

    // Verifica si ya existe
    const existe = await User.findOne({ username });
    if (existe) {
      return res.status(400).json({ mensaje: "El usuario ya existe" });
    }

    // Encripta contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crea usuario
    await User.create({
      username,
      password: hashedPassword
    });

    res.json({ mensaje: "Usuario registrado correctamente" });

  } catch (error) {
    res.status(500).json({ mensaje: "Error al registrar usuario" });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const username = (req.body.username || "").trim();
    const password = req.body.password || "";

    if (!username || !password) {
      return res.status(400).json({ mensaje: "Usuario y contraseña son obligatorios" });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ mensaje: "Usuario no existe" });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ mensaje: "Contraseña incorrecta" });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ mensaje: "Falta configurar JWT_SECRET en .env" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    await AccessLog.create({ username: user.username });

    res.json({ token });

  } catch (error) {
    res.status(500).json({ mensaje: "Error al iniciar sesión" });
  }
};

// ULTIMOS ACCESOS
exports.getRecentAccesses = async (req, res) => {
  try {
    const accesses = await AccessLog.find()
      .sort({ loginAt: -1 })
      .limit(8)
      .select("username loginAt -_id");

    res.json(accesses);
  } catch (error) {
    res.status(500).json({ mensaje: "No se pudieron obtener los accesos" });
  }
};
