import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Pages
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import ShopAll from "./pages/ShopAll";

// Common
import Navbar from "./components/common/Navbar";
import AdminRoute from "./components/common/AdminRoute";
import Footer from './components/common/Footer';

// User
import Cart from "./pages/Cart";
import Wishlist from "./components/user/Wishlist";
import UserOrders from "./components/user/UserOrders";
import Checkout from "./pages/Checkout";


// Admin
import AddSaree from "./components/Admin/AddSaree";
import ManageProducts from "./components/Admin/ManageProducts";
import Orders from "./components/Admin/Orders";
import EditSaree from "./components/Admin/EditSaree";

// Context
import { useAuth } from "./context/AuthContext";

function App() {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      {/* 1. This wrapper ensures the footer sticks to the bottom */}
      <div className="flex flex-col min-h-screen">
        
        <Navbar />

        {/* 2. Main content area wraps the Routes */}
        <main className="flex-grow">
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
            <Route path="/admin/add" element={<AddSaree />} />
            <Route path="/admin/edit/:id" element={<EditSaree />} />
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

            <Route path="/shop-all" element={<ShopAll />} />
          </Routes>
        </main>

        {/* 3. Footer placed here will appear on all pages */}
        <Footer />

      </div>
    </BrowserRouter>
  );
}

export default App;
