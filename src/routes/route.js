const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const productController = require("../controllers/productController");

// ==> User APIs

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser); // --> login for a user

// ==> Product APIs
router.post("/createProducts", productController.createProduct);

router.get("/products", productController.getProduct);

module.exports = router; // --> exporting the functions
