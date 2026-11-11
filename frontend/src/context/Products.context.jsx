import { createContext, useContext, useEffect, useState } from "react";
import api from "../api";

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
    const [randomProducts, setRandomProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError(null);

            const res = await api.get("/user/products/products-list");

            if (res.data?.success) {
                setRandomProducts(res.data.random || []);
                setCategories(res.data.categories || []);
                setProducts(res.data.products || []);
            } else {
                setRandomProducts([]);
                setCategories([]);
            }

        } catch (err) {
            console.log(err);
            setError("Failed to load products");
            setRandomProducts([]);
            setCategories([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <ProductContext.Provider
            value={{
                randomProducts,
                categories,
                products,
                loading,
                error,
                refresh: fetchProducts
            }}
        >
            {children}
        </ProductContext.Provider>
    );
};

export const useProducts = () => useContext(ProductContext);
