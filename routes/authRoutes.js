const express = require("express");
const router = express.Router();
const auth = require("../controllers/authController");

// Registro
router.post("/register", auth.register);

// Login
router.post("/login", auth.login);

module.exports = router;
