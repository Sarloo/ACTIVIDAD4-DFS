const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const product = require("../controllers/productController");

// Rutas protegidas
router.get("/", auth, product.getProducts);
router.post("/", auth, product.createProduct);
router.put("/:id", auth, product.updateProduct);
router.delete("/:id", auth, product.deleteProduct);

module.exports = router;
