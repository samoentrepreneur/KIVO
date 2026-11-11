import React from "react";
import ReactDOM from "react-dom/client";
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./context/admin.authContext.jsx";
import { UserAuthProvider } from "./context/user.authContext.jsx";
import { ProductProvider } from "./context/Products.context.jsx";
import {OrderProvider} from "./context/OrderContext";
import { CartProvider } from "./context/CartContext.jsx";
import { NotificationProvider } from "./context/NotificationContext.jsx";
const OAUTH_CLIENT_ID = import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={OAUTH_CLIENT_ID}>
          <BrowserRouter>
            <ThemeProvider>
              <AuthProvider>
                <UserAuthProvider>
                  <ProductProvider>
                    <OrderProvider>
                      <CartProvider>
                        <NotificationProvider>
                          <App />
                        </NotificationProvider>
                      </CartProvider>
                    </OrderProvider>
                  </ProductProvider>
                </UserAuthProvider>
              </AuthProvider>
            </ThemeProvider>
          </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>
);