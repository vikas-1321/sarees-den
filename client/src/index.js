import React from "react";
import ReactDOM from "react-dom/client";

// 🔥 THIS MUST COME FIRST
import "./output.css";

// ❌ REMOVE OR COMMENT THIS
// import "./index.css";

import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
   <React.StrictMode>
    <AuthProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>
);
