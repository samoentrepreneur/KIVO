const fs = require("fs");
const cloudinary = require("../../config/cloudinary");
const Product = require("../../models/product");


exports.createOrUpdateProduct = async (req, res) => {
    let uploadedTempPath = null;

    try {
        /* -------------------------------------------------
           1. PARSE & VALIDATE INPUT
        --------------------------------------------------*/
        const { products, category, service } = req.body;

        if (!products || !category || !service) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            });
        }

        let parsed;
        try {
            parsed = JSON.parse(products);
        } catch {
            return res.status(400).json({
                success: false,
                message: "Invalid products JSON"
            });
        }

        if (!Array.isArray(parsed) || parsed.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No product entries provided"
            });
        }

        const productId = `${category}-${service}`.replace(/\s+/g, "_");

        /* -------------------------------------------------
           2. IMAGE UPLOAD (OPTIONAL)
        --------------------------------------------------*/
        let imageUrl = null;
        let imagePublicId = null;

        if (req.file) {
            uploadedTempPath = req.file.path;

            const uploadRes = await cloudinary.uploader.upload(uploadedTempPath, {
                folder: "kivo/products"
            });

            imageUrl = uploadRes.secure_url;
            imagePublicId = uploadRes.public_id;
        }

        /* -------------------------------------------------
           3. BUILD VARIANTS (NORMALIZED)
        --------------------------------------------------*/
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

        /* -------------------------------------------------
           4. FIND PRODUCT
        --------------------------------------------------*/
        let product = await Product.findOne({ productId });

        /* -------------------------------------------------
           5. CREATE PRODUCT
        --------------------------------------------------*/
        if (!product) {
            product = await Product.create({
                productId,
                category,
                service,
                currency: parsed[0].currency,
                description: parsed[0].description,
                image: imageUrl,
                imagePublicId,
                variants: incomingVariants
            });

            return res.status(201).json({
                success: true,
                created: true,
                message: "Product created successfully",
                product
            });
        }

        /* -------------------------------------------------
           6. UPDATE IMAGE (IF NEW ONE PROVIDED)
        --------------------------------------------------*/
        if (imageUrl) {
            if (product.imagePublicId) {
                await cloudinary.uploader.destroy(product.imagePublicId);
            }
            product.image = imageUrl;
            product.imagePublicId = imagePublicId;
        }

        /* -------------------------------------------------
           7. UPDATE DESCRIPTION
        --------------------------------------------------*/
        product.description = parsed[0].description;

        /* -------------------------------------------------
           8. MERGE VARIANTS
        --------------------------------------------------*/
        incomingVariants.forEach(newVar => {
            const match = product.variants.find(v =>
                v.priceType === newVar.priceType &&
                v.price === newVar.price &&
                v.currency === newVar.currency &&
                (
                    newVar.priceType === "unit"
                        ? v.unitValue === newVar.unitValue &&
                        v.unitLabel === newVar.unitLabel
                        : v.planName === newVar.planName
                )
            );

            if (match) {
                match.stock += newVar.stock;
            } else {
                product.variants.push(newVar);
            }
        });

        await product.save();

        /* -------------------------------------------------
           9. RESPONSE
        --------------------------------------------------*/
        return res.json({
            success: true,
            created: false,
            message: "Product updated successfully",
            product
        });

    } catch (err) {
        console.error("Product save error:", err);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    } finally {
        /* -------------------------------------------------
           10. CLEAN TEMP FILE
        --------------------------------------------------*/
        if (uploadedTempPath && fs.existsSync(uploadedTempPath)) {
            fs.unlinkSync(uploadedTempPath);
        }
    }
};
