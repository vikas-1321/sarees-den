import React from 'react';

const SareeCard = ({ saree, addToCart }) => {
  return (
    <div className="saree-card">
      <div className="image-wrapper">
        <img src={saree.image} alt={saree.name} />
      </div>
      <div className="content">
        <h3>{saree.name}</h3>
        <p className="category">{saree.category}</p>
        <p className="price">₹{saree.price}</p>
        
        {saree.stock > 0 ? (
          <p className="stock-info">In Stock: {saree.stock}</p>
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