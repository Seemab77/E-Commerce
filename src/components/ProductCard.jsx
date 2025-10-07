import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { addItem, openCart } = useCart();

  const handleAdd = (e) => {
    e.preventDefault(); // prevent Link wrapping the card from navigating
    // minimal payload -> your reducer can enrich/merge
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      qty: 1,
      options: {},
    });
    openCart(); // slide the cart drawer open
  };

  return (
    <div className="card">
      <Link to={`/product/${product.id}`} className="card__link" aria-label={product.title}>
        <img src={product.image} alt={product.title} />
      </Link>

      <div className="card__body">
        <Link to={`/product/${product.id}`} className="card__title">
          {product.title}
        </Link>

        {/* rating if you have it */}
        {product.rating && (
          <div className="stars">
            {"★".repeat(Math.round(product.rating))}
            {"☆".repeat(5 - Math.round(product.rating))}
            <span className="stars__num">({product.rating.toFixed(1)})</span>
          </div>
        )}

        <div className="card__price">
          <strong>Rs {product.price.toLocaleString()}</strong>
          {product.compareAt && (
            <span className="old">Rs {product.compareAt.toLocaleString()}</span>
          )}
        </div>

        <button className="btn btn--primary" onClick={handleAdd}>
          Add to Cart
        </button>
      </div>
    </div>
  );
}
