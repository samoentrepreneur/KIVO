const fs = require("fs/promises");
const { randomUUID } = require("crypto");

const BUCKET = process.env.SUPABASE_STORAGE_BUCKET || "kivo-assets";
const MIME_EXTENSIONS = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
    "image/avif": "avif"
};

function getConfig() {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SECRET_KEY;

    if (!url || !key) {
        throw new Error("Supabase Storage is not configured. Set SUPABASE_URL and SUPABASE_SECRET_KEY.");
    }

    return { url: url.replace(/\/$/, ""), key };
}

async function storageRequest(endpoint, options = {}) {
    const { url, key } = getConfig();
    const response = await fetch(`${url}/storage/v1${endpoint}`, {
        ...options,
        headers: {
            apikey: key,
            Authorization: `Bearer ${key}`,
            ...(options.body && !Buffer.isBuffer(options.body) ? { "Content-Type": "application/json" } : {}),
            ...options.headers
        }
    });

    if (!response.ok) {
        const detail = await response.text().catch(() => "");
        throw new Error(`Supabase Storage request failed (${response.status}): ${detail || response.statusText}`);
    }

    if (response.status === 204) return null;
    return response.json().catch(() => null);
}

async function uploadProductImage(file, productId) {
    if (!file?.path) throw new Error("Image file is missing.");

    const extension = MIME_EXTENSIONS[file.mimetype];
    if (!extension) throw new Error("Unsupported image type.");

    const objectPath = `products/${String(productId).replace(/[^a-zA-Z0-9_-]/g, "_")}/${randomUUID()}.${extension}`;
    const fileBuffer = await fs.readFile(file.path);

    await storageRequest(`/object/${encodeURIComponent(BUCKET)}/${objectPath.split("/").map(encodeURIComponent).join("/")}`, {
        method: "POST",
        body: fileBuffer,
        headers: {
            "Content-Type": file.mimetype,
            "Cache-Control": "max-age=3600",
            "x-upsert": "false"
        }
    });

    const { url } = getConfig();
    const publicUrl = `${url}/storage/v1/object/public/${encodeURIComponent(BUCKET)}/${objectPath.split("/").map(encodeURIComponent).join("/")}`;

    return { imageUrl: publicUrl, imagePath: objectPath };
}

async function uploadOrderScreenshot(file, orderId) {
    if (!file?.path) throw new Error("Payment screenshot is missing.");

    const extension = MIME_EXTENSIONS[file.mimetype];
    if (!extension) throw new Error("Unsupported image type.");

    const objectPath = `orders/${String(orderId).replace(/[^a-zA-Z0-9_-]/g, "_")}/${randomUUID()}.${extension}`;
    const fileBuffer = await fs.readFile(file.path);

    await storageRequest(`/object/${encodeURIComponent(BUCKET)}/${objectPath.split("/").map(encodeURIComponent).join("/")}`, {
        method: "POST",
        body: fileBuffer,
        headers: {
            "Content-Type": file.mimetype,
            "Cache-Control": "max-age=3600",
            "x-upsert": "false"
        }
    });

    const { url } = getConfig();
    const publicUrl = `${url}/storage/v1/object/public/${encodeURIComponent(BUCKET)}/${objectPath.split("/").map(encodeURIComponent).join("/")}`;

    return { imageUrl: publicUrl, imagePath: objectPath };
}

async function deleteStorageImage(objectPath) {
    if (!objectPath) return;

    await storageRequest(`/object/${encodeURIComponent(BUCKET)}`, {
        method: "DELETE",
        body: JSON.stringify({ prefixes: [objectPath] })
    });
}

module.exports = { uploadProductImage, uploadOrderScreenshot, deleteStorageImage };
