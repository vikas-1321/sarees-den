import React from 'react';
import { db } from '../firebase';
import { doc, setDoc, deleteDoc,  } from 'firebase/firestore';

const SareeCard = ({ saree, addToCart, user, isWishlisted, toggleWishlistState }) => {
  
  const handleWishlist = async () => {
    if (!user) return alert("Please login to add items to your wishlist!");
    
    const wishRef = doc(db, "wishlist", `${user.uid}_${saree.id}`);
    
    try {
      if (isWishlisted) {
        await deleteDoc(wishRef);
      } else {
        await setDoc(wishRef, {
          userId: user.uid,
          sareeId: saree.id,
          name: saree.name,
          image: saree.image,
          price: saree.price
        });
      }
      // Update local state in App.js to reflect the change immediately
      toggleWishlistState(saree.id);
    } catch (error) {
      console.error("Wishlist error:", error);
    }
  };

  return (
    <div className="saree-card">
      <div className="image-wrapper">
        <img src={saree.image} alt={saree.name} />
        {/* ❤️ Wishlist Heart Button */}
        <button 
          className={`wishlist-btn ${isWishlisted ? 'active' : ''}`} 
          onClick={handleWishlist}
          title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
        >
          {isWishlisted ? '❤️' : '🤍'}
        </button>
      </div>
      
      <div className="content">
        <h3>{saree.name}</h3>
        <p className="category">{saree.category}</p>
        
        {/* ⭐ Simple Rating Display (Static for now) */}
        <div className="rating-display">
          <span>⭐⭐⭐⭐☆</span> <small>(4.5)</small>
        </div>

        <p className="price">₹{saree.price}</p>
        
        {saree.stock > 0 ? (
          <p className={`stock-info ${saree.stock < 3 ? 'low-stock' : ''}`}>
            {saree.stock < 3 ? `⚠️ Only ${saree.stock} left!` : `In Stock: ${saree.stock}`}
          </p>
        ) : (
          <p className="out-of-stock">Sold Out</p>
        )}

        <button 
          className="btn-primary" 
          disabled={saree.stock <= 0}
          onClick={() => addToCart(saree)}
        >
          {saree.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
};

export default SareeCard;