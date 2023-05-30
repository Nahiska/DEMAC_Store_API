const express = require("express");
const router = express.Router();
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct } = require("../controllers/product.controller");
// const verifyToken = require("../middlewares/jwt.middleware");
const validate = require("../validations/index.validator");
const { productValidationRules } = require("../validations/postProduct.validator");

router
    .get("/", getProducts)
    .get("/:id", getProductById)
    .post("/create", productValidationRules(), validate, createProduct)
    .put("/:id", productValidationRules(), validate, updateProduct)
    .delete("/:id", deleteProduct);

module.exports = router;
