// src/pages/ProductPage.jsx
import { useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { allProducts } from "../data/products";
import { formatPKR } from "../utils/currency";
import { useCart } from "../context/CartContext";

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem, openCart } = useCart();

  const product = useMemo(
    () => allProducts.find((p) => String(p.id) === String(id)),
    [id]
  );

  const [activeImg, setActiveImg] = useState(product?.images?.[0] || product?.image);
  const [size, setSize] = useState("M");
  const [color, setColor] = useState("Black");
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState("details");

  if (!product) {
    return (
      <div className="container section">
        <p>Product not found.</p>
        <button className="btn btn--primary" onClick={() => navigate("/")}>
          Go Home
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      qty,
      options: { size, color },
    });
    openCart();
  };

  const related = allProducts
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 5);

  return (
    <div className="container section">
      {/* breadcrumb */}
      <nav className="crumbs">
        <Link to="/">Home</Link> <span>/</span>
        <span>{product.category}</span> <span>/</span>
        <span>{product.title}</span>
      </nav>

      <div className="pd">
        {/* gallery */}
        <div className="pd__gallery">
          <div className="pd__thumbs">
            {[product.image, ...(product.images || [])]
              .slice(0, 4)
              .map((src, i) => (
                <button
                  key={i}
                  className={`thumb ${activeImg === src ? "active" : ""}`}
                  onClick={() => setActiveImg(src)}
                >
                  <img src={src} alt={`thumb-${i}`} loading="lazy" />
                </button>
              ))}
          </div>
          <div className="pd__main">
            <img src={activeImg} alt={product.title} />
          </div>
        </div>

        {/* info */}
        <div className="pd__info">
          <h1 className="pd__title">{product.title}</h1>
          <div className="pd__rating">
            {"★".repeat(Math.floor(product.rating))}{" "}
            <span>{product.rating.toFixed(1)}</span>
          </div>

          <div className="pd__price">
            <strong>{formatPKR(product.price)}</strong>
            {product.oldPrice && <span className="old">{formatPKR(product.oldPrice)}</span>}
            {product.discount && <span className="badge">{product.discount}% OFF</span>}
          </div>

          <p className="pd__desc">
            {product.description ||
              "Premium quality fabric from a top Pakistani brand."}
          </p>

          <div className="pd__opts">
            <div className="opt">
              <label>Choose size</label>
              <div className="opt__row">
                {["S", "M", "L", "XL"].map((s) => (
                  <button
                    key={s}
                    className={`chip ${size === s ? "chip--active" : ""}`}
                    onClick={() => setSize(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="opt">
              <label>Choose color</label>
              <div className="opt__row">
                {["Black", "Gray", "White"].map((c) => (
                  <button
                    key={c}
                    className={`chip ${color === c ? "chip--active" : ""}`}
                    onClick={() => setColor(c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="opt">
              <label>Quantity</label>
              <div className="qty">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))}>-</button>
                <span>{qty}</span>
                <button onClick={() => setQty((q) => q + 1)}>+</button>
              </div>
            </div>
          </div>

          <div className="pd__cta">
            <button className="btn btn--primary" onClick={handleAddToCart}>
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* tabs */}
      <div className="tabs">
        <button
          className={`tab ${tab === "details" ? "active" : ""}`}
          onClick={() => setTab("details")}
        >
          Product Details
        </button>
        <button
          className={`tab ${tab === "reviews" ? "active" : ""}`}
          onClick={() => setTab("reviews")}
        >
          Ratings & Reviews
        </button>
      </div>

      {tab === "details" ? (
        <div className="pd__details">
          <ul>
            <li>Material: Lawn / Cotton</li>
            <li>Fit: Regular</li>
            <li>Care: Machine wash cold</li>
          </ul>
        </div>
      ) : (
        <div className="pd__reviews">
          <div className="review">
            <div className="review__head">
              <strong>Ayesha</strong>{" "}
              <span className="review__stars">⭐⭐⭐⭐⭐</span>
            </div>
            <p className="review__text">
              Color and fabric are great, delivery was quick!
            </p>
            <small className="review__date">Aug 2025</small>
          </div>
        </div>
      )}

      {/* related products */}
      <h2 className="section__title" style={{ marginTop: 24 }}>
        Similar in {product.category}
      </h2>
      <div className="grid">
        {related.map((r) => (
          <article key={r.id} className="card">
            <Link to={`/product/${r.id}`} className="card__link">
              <img src={r.image} alt={r.title} loading="lazy" />
              <div className="card__body">
                <h4 className="card__title">{r.title}</h4>
                <div className="card__price">
                  <strong>{formatPKR(r.price)}</strong>
                  {r.oldPrice && <span className="old">{formatPKR(r.oldPrice)}</span>}
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>

      {/* newsletter */}
      <div className="nl">
        <div>Stay up to date about our latest offers</div>
        <div className="nl__row">
          <input type="email" placeholder="Enter your email" />
          <button className="btn btn--primary">Subscribe</button>
        </div>
      </div>
    </div>
  );
}
