import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Pages
import Home from "client/src/pages/Home";
import Auth from "./pages/Auth";

// Common
import Navbar from "./components/common/Navbar";
import AdminRoute from "./components/common/AdminRoute";

// User
import Cart from "./pages/Cart";
import Wishlist from "./components/user/Wishlist";
import UserOrders from "./components/user/UserOrders";
import Checkout from "client/src/pages/Checkout";


// Admin
import AddSaree from "./components/Admin/AddSaree";
import ManageProducts from "./components/Admin/ManageProducts";
import Orders from "./components/Admin/Orders";

// Context
import { useAuth } from "./context/AuthContext";

function App() {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      {/* Navbar visible on all pages */}
      <Navbar />

      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />

        {/* Customer protected */}
        <Route
          path="/cart"
          element={user ? <Cart /> : <Navigate to="/auth" />}
        />
        <Route
          path="/wishlist"
          element={user ? <Wishlist /> : <Navigate to="/auth" />}
        />

        <Route path="/Checkout" element={<Checkout />} />

        <Route
        path="/my-orders"
        element={user ? <UserOrders /> : <Navigate to="/auth" />}
        />

        {/* Seller protected */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AddSaree />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/manage"
          element={
            <AdminRoute>
              <ManageProducts />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <AdminRoute>
              <Orders />
            </AdminRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />

        <Route
        path="/wishlist"
        element={user ? <Wishlist /> : <Navigate to="/auth" />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
