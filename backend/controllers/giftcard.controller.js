
const Product = require("../models/product");

exports.getProducts = async (req, res) => {
    try {

        const randomProducts = await Product.aggregate([
            { $sort: { createdAt: -1 } }, 
            { $sample: { size: 20 } }       
        ]);

        const categorizedProducts = await Product.aggregate([
            { $sort: { createdAt: -1 } },
            {
                $group: {
                    _id: "$category",
                    products: { $push: "$$ROOT" }
                }
            },
            {
                $project: {
                    _id: 1,
                    products: { $slice: ["$products", 10] }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        const products = await Product.find({});


        if (!randomProducts.length && !categorizedProducts.length) {
            return res.status(404).json({
                success: false,
                message: "No products available"
            });
        }

        res.status(200).json({
            success: true,
            message: "Products fetched successfully",
            random: randomProducts,
            categories: categorizedProducts,
            products

        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Failed to fetch products",
            error: err.message
        });
    }
};


exports.getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Product ID is required",
            });
        }

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Product fetched successfully",
            product,
        });

    } catch (error) {
        console.error("Get product error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

exports.searchProducts = async (req, res) => {
    try {
        const { q } = req.query;

        if (!q || !q.trim()) {
            return res.json({
                success: true,
                count: 0,
                products: []
            });
        }

        const filter = {
            status: "active",
            $or: [
                { category: { $regex: q.trim(), $options: "i" } },
                { service: { $regex: q.trim(), $options: "i" } }
            ]
        };

        const products = await Product.find(filter).sort({ createdAt: -1 });

        res.json({
            success: true,
            count: products.length,
            products
        });

    } catch (error) {
        console.error("Search Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to search products"
        });
    }
};

