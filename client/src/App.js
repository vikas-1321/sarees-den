import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import axios from 'axios';

// 1. Import your local instances (the ones you initialized)
import { db, auth } from './firebase'; 

// 2. Import the FUNCTIONS from the official firebase library (this is the fix!)
import { collection, onSnapshot, doc, getDoc,query,where } from 'firebase/firestore'; 

// 3. Your Components
import SareeCard from './components/SareeCard';
import AddSaree from './components/Admin/AddSaree';
import AuthPage from './components/Auth';
import ManageProducts from './components/Admin/ManageProducts';
import Orders from './components/Admin/Orders';
import UserOrders from './components/UserOrders';
import Wishlist from './components/Wishlist';

function App() {
  const [sarees, setSarees] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [maxPrice, setMaxPrice] = useState(10000);
  // const [user, setUser] = useState(null);
const [wishlist, setWishlist] = useState([]); // Add this line

  // Backend URL (matches your node server)
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

  // 1. Fetching Products from Firestore (Real-time)
  useEffect(() => {
  // 1. Fetch Sarees (This runs for everyone)
  const unsubscribeSarees = onSnapshot(collection(db, "sarees"), (snapshot) => {
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setSarees(data);
    setLoading(false);
  });

  // 2. Fetch User Role (This runs when someone logs in)
  const unsubscribeAuth = auth.onAuthStateChanged(async (firebaseUser) => {
    if (firebaseUser) {
      const userRef = doc(db, "users", firebaseUser.uid); // 'doc' is now defined
      const userSnap = await getDoc(userRef); // 'getDoc' is now defined
      
      if (userSnap.exists()) {
        setUser({ uid: firebaseUser.uid, ...userSnap.data() });
      } else {
        // If no doc exists yet, set a basic user object
        setUser({ uid: firebaseUser.uid, role: 'user' });
      }
    } else {
      setUser(null);
    }
  });

  return () => {
    unsubscribeSarees();
    unsubscribeAuth();
  };
}, []);

  // 2. Cart Management
  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    
    // Check if we are trying to add more than what's in stock
    const currentQtyInCart = existing ? existing.quantity : 0;
    if (currentQtyInCart >= product.stock) {
      alert("Cannot add more! Out of stock.");
      return;
    }

    if (existing) {
      setCart(cart.map(item => item.id === product.id ? { ...existing, quantity: existing.quantity + 1 } : item));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (id) => setCart(cart.filter(item => item.id !== id));

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // 3. Simulated Checkout with Inventory Update
  const handleCheckout = async () => {
    if (!user) return alert("Please login to checkout!");
    
    try {
        // 1. Reduce Stock on Server
        const res = await axios.post(`${API_URL}/checkout`, { 
            cart: cart.map(item => ({ id: item.id, quantity: item.quantity })) 
        });

        if (res.data.success) {
            // 2. Save Order Details to Firestore
            const { addDoc, collection } = await import('firebase/firestore');
            await addDoc(collection(db, "orders"), {
                cart: cart,
                totalAmount: total,
                userId: user.uid,
                customerName: user.fullName || "Guest",
                customerPhone: user.phone || "N/A",
                customerAddress: user.address || "N/A",
                date: new Date(),
                status: "confirmed"
            });

            alert("Order Success!");
            setCart([]);
        }
    } catch (err) {
        console.error("Checkout Error:", err);
        alert(`Checkout failed: ${err.response?.data?.error || "Server is offline"}`);
    }
};

useEffect(() => {
  if (user) {
    const q = query(collection(db, "wishlist"), where("userId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ids = snapshot.docs.map(doc => doc.data().sareeId);
      setWishlist(ids);
    });
    return () => unsubscribe();
  } else {
    setWishlist([]);
  }
}, [user]);

const filteredSarees = sarees.filter(s => {
  const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
  const matchesCategory = filterCategory === 'All' || s.category === filterCategory;
  const matchesPrice = Number(s.price) <= maxPrice;
  return matchesSearch && matchesCategory && matchesPrice;
});
 return (
    <Router>
      <div className="min-h-screen">
        {/* Navigation Bar */}
        <nav className="nav-bar">
          <Link to="/" className="logo">SAREES DEN</Link>
          <div className="nav-links">
            <Link to="/">Shop Collection</Link>
            
            {/* User History Link */}
            {user && user.role === 'user' && (
              <Link to="/my-orders">My Orders</Link>
            )}

            {/* Admin Links - Only visible to Admins */}
            {user?.role === 'admin' && (
              <>
                <Link to="/admin" className="admin-btn">Add Saree</Link>
                <Link to="/admin/manage" className="admin-btn">Manage Inventory</Link>
                <Link to="/admin/orders" className="admin-btn">Customer Orders</Link>
              </>
            )}
            {/* User Links */}
{user && user.role === 'user' && (
  <>
    <Link to="/my-orders">My Orders</Link>
    <Link to="/wishlist" style={{marginLeft: '10px'}}>Wishlist ❤️</Link>
  </>
)}

            {/* Auth Toggle */}
            {!user ? (
              <Link to="/auth" className="login-btn">Login / Register</Link>
            ) : (
              <div className="user-info">
                <span className="user-role-tag">{user.role}</span>
                <button className="logout-btn" onClick={() => { auth.signOut(); setUser(null); }}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </nav>

        <Routes>
          {/* Main Shop Route with Filters */}
          <Route path="/" element={
            <div className="shop-container">
              <div className="content-wrapper">
                {/* 🔍 Filter Bar Section */}
                <div className="filter-bar">
                  <input 
                    type="text" 
                    placeholder="Search by name..." 
                    className="search-input"
                    onChange={(e) => setSearchTerm(e.target.value)} 
                  />
                  
                  <select className="filter-select" onChange={(e) => setFilterCategory(e.target.value)}>
                    <option value="All">All Types</option>
                    <option value="Banarasi Silk">Banarasi Silk</option>
                    <option value="Kanjeevaram">Kanjeevaram</option>
                    <option value="Chanderi">Chanderi</option>
                    <option value="Mangalore">Mangalore</option>
                  </select>

                  <div className="price-slider">
                    <span>Max: ₹{maxPrice}</span>
                    <input 
                      type="range" min="500" max="20000" step="500" 
                      value={maxPrice} 
                      onChange={(e) => setMaxPrice(e.target.value)} 
                    />
                  </div>
                </div>

                <main className="product-grid">
                  {loading ? (
                    <div className="loader">Loading Premium Collection...</div>
                  ) : (
                    // FIXED: Now passing user and wishlist props to SareeCard
                    filteredSarees.map(s => (
                      <SareeCard 
                        key={s.id} 
                        saree={s} 
                        addToCart={addToCart} 
                        user={user}
                        isWishlisted={wishlist.includes(s.id)}
                        toggleWishlistState={(id) => {
                          setWishlist(prev => 
                            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
                          )
                        }}
                      />
                    ))
                  )}
                  {filteredSarees.length === 0 && !loading && (
                    <div className="no-products">
                      <p>No sarees match your search or filters.</p>
                    </div>
                  )}
                </main>
              </div>
              
              {/* Shopping Cart Sidebar */}
              <aside className="cart-sidebar">
                <h2 className="text-maroon">Your Shopping Bag</h2>
                <div className="cart-items-list">
                  {cart.length === 0 ? (
                    <p className="empty-msg">Your bag is empty.</p>
                  ) : (
                    cart.map(item => (
                      <div key={item.id} className="cart-item">
                        <div className="cart-item-info">
                          <p className="item-name">{item.name}</p>
                          <p className="item-qty">Qty: {item.quantity}</p>
                        </div>
                        <div className="cart-item-price">
                          <span>₹{item.price * item.quantity}</span>
                          <button className="remove-btn" onClick={() => removeFromCart(item.id)}>×</button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {cart.length > 0 && (
                  <div className="cart-footer">
                    <div className="total-row">
                      <span>Total:</span>
                      <span>₹{total}</span>
                    </div>
                    <button className="btn-primary w-full checkout-btn" onClick={handleCheckout}>
                      Confirm Order & Pay
                    </button>
                  </div>
                )}
              </aside>
            </div>
          } />
          
          {/* Auth Route */}
          <Route path="/auth" element={<AuthPage setUser={setUser} />} />

          {/* User History Route */}
          <Route path="/my-orders" element={user ? <UserOrders user={user} /> : <Navigate to="/auth" />} />
          <Route 
  path="/wishlist" 
  element={
    user ? 
    <Wishlist 
      user={user} 
      addToCart={addToCart} 
      wishlist={wishlist} 
      setWishlist={setWishlist} 
    /> : 
    <Navigate to="/auth" />
  } 
/>

          {/* Protected Admin Routes */}
          <Route path="/admin" element={user?.role === 'admin' ? <AddSaree /> : <Navigate to="/auth" />} />
          <Route path="/admin/manage" element={user?.role === 'admin' ? <ManageProducts /> : <Navigate to="/auth" />} />
          <Route path="/admin/orders" element={user?.role === 'admin' ? <Orders /> : <Navigate to="/auth" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;