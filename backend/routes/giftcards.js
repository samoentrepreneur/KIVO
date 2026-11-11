const express = require("express");
const { getProducts, getProductById, searchProducts } = require("../controllers/giftcard.controller");
const verifyUser = require("../middlewares/user.middlerware");

const router = express.Router();

router.get("/products-list", getProducts); 
router.get("/product-details/:id", getProductById);
router.get("/search", searchProducts);

module.exports = router;