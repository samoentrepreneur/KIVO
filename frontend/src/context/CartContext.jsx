import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    const updateCart = (newCart) => {
        setCart(newCart);
    };

    const cartCount = cart.length;

    return (
        <CartContext.Provider value={{ cart, updateCart, cartCount }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
