const Product = require("../../models/product");
const fs = require("fs");
const { uploadProductImage, deleteStorageImage } = require("../../services/storage.service");


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

        if (product.imagePath) {
            await deleteStorageImage(product.imagePath).catch(err =>
                console.error("Supabase image cleanup failed:", err.message)
            );
        }

        await Product.findByIdAndDelete(id);

        return res.status(200).json({ success: true, message: "Product deleted successfully" });

    } catch (error) {
        console.error("Delete Error:", error);
        return res.status(500).json({ success: false, message: "Failed to delete product" });
    }
};


exports.updateProductImage = async (req, res) => {
    let uploadedTempPath = null;
    let newImagePath = null;

    try {
        const { productId } = req.body;

        if (!req.file) {
            return res.status(400).json({ success: false, message: "Image is required" });
        }

        uploadedTempPath = req.file.path;
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        const uploaded = await uploadProductImage(req.file, productId);
        newImagePath = uploaded.imagePath;

        const previousImagePath = product.imagePath;
        product.image = uploaded.imageUrl;
        product.imagePath = uploaded.imagePath;
        await product.save();

        newImagePath = null;

        if (previousImagePath) {
            await deleteStorageImage(previousImagePath).catch(err =>
                console.error("Previous Supabase image cleanup failed:", err.message)
            );
        }

        return res.status(200).json({
            success: true,
            message: "Product image updated successfully",
            imageUrl: product.image,
            product
        });
    } catch (error) {
        if (newImagePath) {
            await deleteStorageImage(newImagePath).catch(cleanupError =>
                console.error("Supabase image rollback failed:", cleanupError.message)
            );
        }

        console.error("Image Update Error:", error);
        return res.status(500).json({ success: false, message: "Failed to update product image" });
    } finally {
        if (uploadedTempPath) {
            await fs.promises.unlink(uploadedTempPath).catch(() => {});
        }
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
