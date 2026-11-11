const Product = require("../../models/product");
const { v2: cloudinary } = require("cloudinary");
const fs = require("fs");
const product = require("../../models/product");


exports.getProductsByCategory = async (req, res) => {
    try {
        const categories = await Product.distinct("category");
        const formatted = [];

        for (const cat of categories) {
            const services = await Product.find({ category: cat }).select(
                "_id service image currency variants description"
            );

            if (!services.length) continue;

            const totalStock = services.reduce((sum, s) =>
                sum + s.variants.reduce((a, v) => a + (Number(v.stock) || 0), 0), 0);

            const cleanServices = services
                .map(service => ({
                    _id: service._id,
                    service: service.service,
                    image: service.image,
                    currency: service.currency,
                    description: service.description,
                    variants: service.variants
                        .filter(v =>
                            v.price !== null &&
                            v.price !== undefined &&
                            !isNaN(Number(v.price)) &&
                            Number(v.price) >= 0 &&
                            Number(v.stock ?? 0) >= 0
                        )
                        .map(v => ({
                            price: Number(v.price),
                            stock: Number(v.stock ?? 0),
                            unitValue: v.unitValue ?? null,
                            unitLabel: v.unitLabel ?? null,
                            priceType: v.priceType,
                            planName: v.planName ?? null

                        }))

                }))
            // .filter(s => s.variants.length)/;

            if (!cleanServices.length) continue;

            formatted.push({
                category: cat,
                totalStock,
                servicesCount: cleanServices.length,
                services: cleanServices,
            });
        }

        return res.status(200).json({
            success: true,
            data: formatted.length ? formatted : null,
        });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// ---------------- UPDATE VARIANTS ----------------
exports.updateProductVariants = async (req, res) => {
    try {
        const { id } = req.params;
        const { variants } = req.body;

        if (!Array.isArray(variants)) {
            return res.status(400).json({ success: false, message: "Variants must be an array" });
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { variants },
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        res.status(200).json({
            success: true,
            message: "Variants updated successfully",
            product: updatedProduct,
        });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// ---------------- DELETE PRODUCT ----------------
exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        if (product.imagePublicId) {
            await cloudinary.uploader.destroy(product.imagePublicId).catch(() => { });
        }

        await Product.findByIdAndDelete(id);

        return res.status(200).json({ success: true, message: "Product deleted successfully" });

    } catch (error) {
        console.error("Delete Error:", error);
        return res.status(500).json({ success: false, message: "Failed to delete product" });
    }
};


exports.updateProductImage = async (req, res) => {
    try {
        const { productId } = req.body;

        if (!req.file) {
            return res.status(400).json({ success: false, message: "Image is required" });
        }

        const product = await Product.findById(productId);
        if (!product) {
            fs.unlinkSync(req.file.path);
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        // upload file PATH (string ✅)
        const uploadResponse = await cloudinary.uploader.upload(req.file.path, {
            folder: "easypay/products",
        });

        // delete old image
        if (product.imagePublicId) {
            await cloudinary.uploader.destroy(product.imagePublicId);
        }

        product.image = uploadResponse.secure_url;
        product.imagePublicId = uploadResponse.public_id;
        await product.save();

        // remove temp file
        fs.unlinkSync(req.file.path);

        return res.status(200).json({
            success: true,
            message: "Product image updated successfully",
            imageUrl: product.image,
            product: product,
        });
    } catch (error) {
        console.error("Image Update Error:", error);
        return res.status(500).json({ success: false, message: "Failed to update product image" });
    }
};


exports.updateProductDescription = async (req, res) => {
    try {
        const { productId, description } = req.body;

        if (!productId || !description?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Product ID and description are required",
            });
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            { description: description.trim() },
            { new: true } // return updated document
        );

        if (!updatedProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        return res.status(200).json({
            success: true,
            product: updatedProduct,
            message: "Description updated successfully",
        });
    } catch (err) {
        console.error("Update description error:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to update description",
        });
    }
};
