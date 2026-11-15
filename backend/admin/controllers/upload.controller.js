const fs = require("fs");
const Product = require("../../models/product");
const { uploadProductImage, deleteStorageImage } = require("../../services/storage.service");

exports.createOrUpdateProduct = async (req, res) => {
    let uploadedTempPath = null;
    let newImagePath = null;

    try {
        const { products, category, service } = req.body;

        if (!products || !category || !service) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        let parsed;
        try {
            parsed = JSON.parse(products);
        } catch {
            return res.status(400).json({ success: false, message: "Invalid products JSON" });
        }

        if (!Array.isArray(parsed) || parsed.length === 0) {
            return res.status(400).json({ success: false, message: "No product entries provided" });
        }

        const productId = `${category}-${service}`.replace(/\s+/g, "_");
        let imageUrl = null;
        let imagePath = null;

        if (req.file) {
            uploadedTempPath = req.file.path;
            const uploaded = await uploadProductImage(req.file, productId);
            imageUrl = uploaded.imageUrl;
            imagePath = uploaded.imagePath;
            newImagePath = imagePath;
        }

        const incomingVariants = parsed.map(v => ({
            price: Number(v.price),
            currency: v.currency,
            priceType: v.priceType,
            unitValue: v.priceType === "unit" ? v.unit : null,
            unitLabel: v.priceType === "unit" ? v.unitLabel : null,
            planName: v.priceType === "plan" ? v.planName : null,
            stock: Number(v.stock),
            reservedStock: 0
        }));

        let product = await Product.findOne({ productId });

        if (!product) {
            product = await Product.create({
                productId,
                category,
                service,
                currency: parsed[0].currency,
                description: parsed[0].description,
                image: imageUrl,
                imagePath,
                variants: incomingVariants
            });

            newImagePath = null;
            return res.status(201).json({
                success: true,
                created: true,
                message: "Product created successfully",
                product
            });
        }

        const previousImagePath = product.imagePath;
        if (imageUrl) {
            product.image = imageUrl;
            product.imagePath = imagePath;
        }

        product.description = parsed[0].description;

        incomingVariants.forEach(newVar => {
            const match = product.variants.find(v =>
                v.priceType === newVar.priceType &&
                v.price === newVar.price &&
                v.currency === newVar.currency &&
                (
                    newVar.priceType === "unit"
                        ? v.unitValue === newVar.unitValue && v.unitLabel === newVar.unitLabel
                        : v.planName === newVar.planName
                )
            );

            if (match) match.stock += newVar.stock;
            else product.variants.push(newVar);
        });

        await product.save();
        newImagePath = null;

        if (imageUrl && previousImagePath) {
            await deleteStorageImage(previousImagePath).catch(err =>
                console.error("Previous Supabase image cleanup failed:", err.message)
            );
        }

        return res.json({
            success: true,
            created: false,
            message: "Product updated successfully",
            product
        });
    } catch (err) {
        if (newImagePath) {
            await deleteStorageImage(newImagePath).catch(cleanupError =>
                console.error("Supabase image rollback failed:", cleanupError.message)
            );
        }

        console.error("Product save error:", err);
        return res.status(500).json({ success: false, message: "Server error" });
    } finally {
        if (uploadedTempPath) {
            await fs.promises.unlink(uploadedTempPath).catch(() => {});
        }
    }
};
