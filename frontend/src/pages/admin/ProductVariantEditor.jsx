import { useState } from "react";
import axios from "axios";

const SERVICE_RULES = {
    "Garena Free Fire": { type: "game", unitLabel: "Diamonds", allowPlans: true },
    "PUBG Mobile": { type: "game", unitLabel: "UC", allowPlans: true },
    "Call of Duty": { type: "game", unitLabel: "CP", allowPlans: true },
    "Blood Strike": { type: "game", unitLabel: "Coins", allowPlans: true },
    "Roblox": { type: "game", unitLabel: "Robux", allowPlans: false },
    "Minecraft": { type: "game", unitLabel: "Minecoins", allowPlans: false },

    "Netflix": { type: "plan-only" },
    "Prime Video": { type: "plan-only" },
    "Spotify": { type: "plan-only" },
    "Disney+": { type: "plan-only" },
};

export default function ProductVariantEditor({ product, refresh }) {
    const [variants, setVariants] = useState(product.variants);
    const [saving, setSaving] = useState(false);

    const rule = SERVICE_RULES[product.service] || {};
    const isGame = rule.type === "game";
    const isPlanOnly = rule.type === "plan-only";

    const handleChange = (index, key, value) => {
        const list = [...variants];
        list[index][key] = value;
        setVariants(list);
    };

    const deleteVariant = (index) => {
        setVariants(variants.filter((_, i) => i !== index));
    };

    const addVariant = () => {
        setVariants([
            ...variants,
            {
                priceType: isGame ? "unit" : "plan",
                unitValue: null,
                unitLabel: rule.unitLabel || null,
                planName: null,
                price: 0,
                stock: 0,
            }
        ]);
    };

    const update = async () => {
        setSaving(true);
        await axios.put(`/api/products/update-variants/${product._id}`, { variants });
        setSaving(false);
        refresh();
    };

    return (
        <div className="border rounded p-4 bg-white space-y-4">
            <div className="flex items-center gap-4">
                <img src={product.image} className="w-14 h-14 rounded" />
                <h3 className="font-semibold">{product.service}</h3>
            </div>

            <table className="w-full border text-sm">
                <thead className="bg-gray-100">
                    <tr>
                        {(isGame && rule.allowPlans) && <th className="p-2">Type</th>}
                        {isGame && <th className="p-2">{rule.unitLabel}</th>}
                        {(isGame || isPlanOnly) && <th className="p-2">Plan</th>}
                        <th className="p-2">Price</th>
                        <th className="p-2">Stock</th>
                        <th className="p-2">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {variants.map((v, index) => (
                        <tr key={index} className="border">

                            {/* Type Selector (Games only) */}
                            {(isGame && rule.allowPlans) && (
                                <td className="p-2">
                                    <select
                                        className="border p-1 rounded"
                                        value={v.priceType}
                                        onChange={(e) =>
                                            handleChange(index, "priceType", e.target.value)
                                        }
                                    >
                                        <option value="unit">Unit</option>
                                        <option value="plan">Plan</option>
                                    </select>
                                </td>
                            )}

                            {/* Unit Value */}
                            {isGame && (
                                <td className="p-2">
                                    {v.priceType === "unit" ? (
                                        <input
                                            type="text"
                                            className="border p-1 rounded"
                                            value={v.unitValue || ""}
                                            onChange={(e) =>
                                                handleChange(index, "unitValue", e.target.value)
                                            }
                                        />
                                    ) : "—"}
                                </td>
                            )}

                            {/* Plan Name */}
                            {(isGame || isPlanOnly) && (
                                <td className="p-2">
                                    {v.priceType === "plan" ? (
                                        <input
                                            type="text"
                                            className="border p-1 rounded"
                                            value={v.planName || ""}
                                            onChange={(e) =>
                                                handleChange(index, "planName", e.target.value)
                                            }
                                        />
                                    ) : "—"}
                                </td>
                            )}

                            {/* Price */}
                            <td className="p-2">
                                <input
                                    type="number"
                                    className="border p-1 rounded"
                                    value={v.price}
                                    onChange={(e) =>
                                        handleChange(index, "price", e.target.value)
                                    }
                                />
                            </td>

                            {/* Stock */}
                            <td className="p-2">
                                <input
                                    type="number"
                                    className="border p-1 rounded"
                                    value={v.stock}
                                    onChange={(e) =>
                                        handleChange(index, "stock", e.target.value)
                                    }
                                />
                            </td>

                            {/* Delete */}
                            <td
                                className="p-2 text-red-500 cursor-pointer"
                                onClick={() => deleteVariant(index)}
                            >
                                ❌
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <button className="bg-gray-200 px-3 py-1 rounded" onClick={addVariant}>
                ➕ Add Variant
            </button>

            <button
                className="bg-blue-600 text-white px-4 py-2 rounded"
                disabled={saving}
                onClick={update}
            >
                {saving ? "Saving..." : "Save Changes"}
            </button>
        </div>
    );
}
