const express = require("express");
const router = express.Router();
const auth = require("../controllers/authController");

// Registro
router.post("/register", auth.register);

// Login
router.post("/login", auth.login);

// Ultimos accesos
router.get("/access-logs", auth.getRecentAccesses);

module.exports = router;
