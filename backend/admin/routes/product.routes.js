const express = require("express");
const router = express.Router();
const {
    getProductsByCategory,
    updateProductVariants,
    deleteProduct,
    updateProductImage,
    updateProductDescription
} = require("../controllers/product.controller");
const { verifyAdmin } = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload");

router.get("/by-category", verifyAdmin, getProductsByCategory);
router.delete("/delete/:id", verifyAdmin, deleteProduct);
router.put("/:id/variants", verifyAdmin, updateProductVariants);
router.put("/update-description", verifyAdmin, updateProductDescription);
router.post(
    "/upload-product-image",
    verifyAdmin,
    upload.single("image"),
    updateProductImage
);




module.exports = router;
