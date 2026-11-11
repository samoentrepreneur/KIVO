const axios = require("axios");

let cachedRate = null;
let lastFetchTime = 0;

async function getUsdToHtgRate() {
    const now = Date.now();

    // Cache rate for 1 hour
    if (cachedRate && now - lastFetchTime < 60 * 60 * 1000) {
        return cachedRate;
    }

    try {
        const response = await axios.get(`${process.env.EXCHANGE_API_URL}`);

        const rate = response.data?.conversion_rates?.HTG;

        if (!rate) throw new Error("HTG rate missing");

        cachedRate = Number(rate);
        lastFetchTime = now;

        return cachedRate;

    } catch (err) {
        console.error("❌ Currency fetch failed:", err.message);

        // Fallback to last known
        if (cachedRate) return cachedRate;

        // Permanent fallback if nothing cached
        return 135; // manually editable safety value
    }
}

module.exports = { getUsdToHtgRate };
