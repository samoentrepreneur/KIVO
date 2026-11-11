import { useEffect, useState } from "react";
import api from "../../api";
import toast from "react-hot-toast";

const AdminAdvertisement = () => {
    const [ad, setAd] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [removing, setRemoving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchAdvertisement();
    }, []);

    const fetchAdvertisement = async () => {
        try {
            const res = await api.get("/admin/advertisement");

            if (res.data.success) {
                setAd(res.data.advertisement);
            }
        } catch (err) {
            console.error(err);
            setError("Failed to load advertisement");
        } finally {
            setLoading(false);
        }
    };

    const saveAdvertisement = async () => {
        if (!ad.trim()) {
            setError("Advertisement cannot be empty");
            return;
        }

        try {
            setSaving(true);
            setError("");

            await api.post("/admin/advertisement", {
                ad,
            });
            fetchAdvertisement();

            toast.success("Advertisement saved successfully");
        } catch (err) {
            console.error(err);
            setError("Failed to save advertisement");
        } finally {
            setSaving(false);
        }
    };
    const removeAdvertisement = async () => {
        if (!ad.trim()) {
            setError("Non advertisement found to remove");
            return;
        }

        try {
            setRemoving(true);
            setError("");

            await api.post("/admin/delete-advertisement", {
                ad,
            });
            fetchAdvertisement();
            setAd("")
            toast.success("Advertisement removed successfully");
        } catch (err) {
            console.error(err);
            setError("Failed to remove advertisement");
        } finally {
            setRemoving(false);
            
        }
    };

    return (
        <div className="min-h-screen w-full bg-gray-200 flex items-center justify-center px-4">
            <div className="max-w-2xl w-full px-4 md:px-8 py-12 space-y-3 bg-white rounded-xl">
                
                {ad && (
                    <marquee className="text-black font-medium">
                        {ad}
                    </marquee>
                )}

                {loading && <p>Loading advertisement...</p>}

                {/* Input */}
                <p className="text-gray-600">Add advertisement here</p>
                <input
                    type="text"
                    value={ad}
                    onChange={(e) => setAd(e.target.value)}
                    placeholder="Enter advertisement text"
                    className="w-full px-4 py-2 rounded-md border border-gray-300 "
                />

                {error && (
                    <p className="text-red-500 text-sm">{error}</p>
                )}
                <div className="w-full flex flex-col md:flex-row gap-4 items-center mt-5">
                    <button
                        onClick={removeAdvertisement}
                        disabled={removing}
                        className="flex-1 w-full px-6 py-2 border border-gray-300 text-black rounded-md
                               hover:bg-gray-200 disabled:opacity-50"
                    >
                        {removing ? "Removing..." : "Remove"}
                    </button>

                    <button
                        onClick={saveAdvertisement}
                        disabled={saving}
                        className="flex-1 w-full px-6 py-2 bg-blue-600 text-white rounded-md
                               hover:bg-blue-700 disabled:opacity-50"
                    >
                        {saving ? "Updating..." : "Update Advertisement"}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default AdminAdvertisement;
