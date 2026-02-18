import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Pages
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import ShopAll from "./pages/ShopAll";
import CategoryPage from './pages/CategoryPage';
import SearchPage from "./pages/SearchPage";

// Common
import Navbar from "./components/common/Navbar";
import AdminRoute from "./components/common/AdminRoute";
import Footer from './components/common/Footer';
import ScrollToTop from "./components/common/ScrollToTop";

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
    <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-grow">
          <Routes>
            {/* Public */}
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/shop-all" element={<ShopAll />} />

            {/* ADD THIS ROUTE - This is what was missing! */}
            <Route path="/category/:categoryName" element={<CategoryPage />} />
            <Route path="/search" element={<SearchPage />} />

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
              element={<AdminRoute><AddSaree /></AdminRoute>}
            />
            <Route path="/admin/add" element={<AdminRoute><AddSaree /></AdminRoute>} />
            <Route path="/admin/edit/:id" element={<AdminRoute><EditSaree /></AdminRoute>} />
            <Route
              path="/admin/manage"
              element={<AdminRoute><ManageProducts /></AdminRoute>}
            />
            <Route
              path="/admin/orders"
              element={<AdminRoute><Orders /></AdminRoute>}
            />

            {/* Fallback - MUST be the last route in the list */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
