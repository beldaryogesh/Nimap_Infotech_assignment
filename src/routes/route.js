const express = require("express");
const router = express.Router();
const commonMid = require("../middlewares/commonMid")
const userController = require("../controllers/userController");
const productController = require("../controllers/productController");
const categoryController = require("../controllers/categoryControllers");

// ==> Category APIs
router.post("/createCategory", categoryController.crateCategory);


// ==> User APIs

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser); // --> login for a user

// ==> Product APIs
router.post("/createProducts",commonMid.authenticate, productController.createProduct);
router.get("/products",commonMid.authenticate, productController.getProduct);
router.put('/products/:productId', commonMid.authenticate, commonMid.authorize,productController.updateProduct)
router.delete('/products/:productId', commonMid.authenticate,commonMid.authorize, productController.deleteProductById)

module.exports = router; // --> exporting the functions