import React from "react";
import ReactDOM from "react-dom/client";

// In Vite + Tailwind 4, import your SOURCE css, not the output
import "./index.css"; 

import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

// Ensure your index.html has <div id="root"></div>
const rootElement = document.getElementById("root");

if (!rootElement) {
  console.error("Failed to find the root element. Check your index.html!");
} else {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <AuthProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </AuthProvider>
    </React.StrictMode>
  );
}