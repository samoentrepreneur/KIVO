const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env.local") });

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const { router: orderStreamRoute, clients } = require("./admin/routes/orderStream");
const adminRoutes = require("./admin/routes/admin.routes");
const uploadRoutes = require("./admin/routes/upload.routes");
const { seedDefaultAdmin } = require("./admin/seedAdmin");
const logsRoutes = require("./admin/routes/logs.routes");
const productRoutes = require("./admin/routes/product.routes");
const statsRoutes = require("./admin/routes/stats.routes");
const userAuthRoutes = require("./routes/user.routes");
const usersRoutes = require("./admin/routes/user.routes");
const giftCardRotes = require("./routes/giftcards");
const orderRoutes = require("./routes/orders.routes");
const Order = require("./models/order");
const adminOrderRoutes = require("./admin/routes/order.routes");
const rateConversionRoutes = require("./utils/usdtohtg");
const notificationRoutes = require("./admin/routes/notifications.routes");

const app = express();

app.use(express.json());
app.use(cookieParser());
app.set("trust proxy", 1);

// Configuration CORS dynamique
const allowedOrigins = [
    process.env.FRONTEND_URL,
    // Temporary compatibility for the previous deployment during the KIVO migration.
    "https://novapayht.vercel.app",
    "http://localhost:5173",
    "http://localhost:3000"
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        // Autorise les requêtes sans origine (ex: Postman, apps mobiles) ou présentes dans la liste
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Bloqué par la politique CORS"));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

let changeStream;

app.get("/api/admin/orders-stream/stream", (req, res) => {
    const origin = req.headers.origin;

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    
    if (allowedOrigins.includes(origin)) {
        res.setHeader("Access-Control-Allow-Origin", origin);
    }
    res.setHeader("Access-Control-Allow-Credentials", "true");

    res.flushHeaders();

    // Send existing change events
    const onChange = (change) => {
        res.write(`data: ${JSON.stringify(change)}\n\n`);
    };

    if (changeStream) {
        changeStream.on("change", onChange);
    }

    // Heartbeat
    const interval = setInterval(() => {
        res.write(`event: ping\ndata: "heartbeat"\n\n`);
    }, 25000);

    req.on("close", () => {
        clearInterval(interval);
        if (changeStream) {
            changeStream.removeListener("change", onChange);
        }
    });
});

// admin routes
app.use("/api/admin/orders-stream", orderStreamRoute);
app.use("/api/admin", adminRoutes);
app.use("/api/admin/add-item", uploadRoutes);
app.use("/api/admin/logs", logsRoutes);
app.use("/api/admin/product", productRoutes);
app.use("/api/admin/stats", statsRoutes);
app.use("/api/admin/users", usersRoutes);
app.use("/api/admin/orders", adminOrderRoutes);

// user routes
app.use("/api/user/products", giftCardRotes);
app.use("/api/user/order", orderRoutes);
app.use("/api/utils", rateConversionRoutes);

// notifications
app.use("/api/admin/notifications", notificationRoutes);

// user auth routes
app.use("/api/user", userAuthRoutes);

app.get("/", (req, res) => res.send("Server running "));

const PORT = Number(process.env.PORT) || 8001;

mongoose.set("strictQuery", true);

mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000
})
    .then(async () => {
        console.log(" MongoDB connected");
        await seedDefaultAdmin();
        console.log("Watching order changes...");
        changeStream = Order.watch();

        app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
    })
    .catch(err => {
        console.error("MongoDB error:", err);
        process.exit(1);
    });
