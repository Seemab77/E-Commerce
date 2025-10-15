// src/pages/ProductPage.jsx
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getProductById, getProductsByCategorySlug } from "../lib/fakestore";
import { formatPKR } from "../utils/currency";
import { useCart } from "../context/CartContext";

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem, openCart } = useCart();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState("details");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      try {
        const p = await getProductById(id);
        if (!mounted) return;
        setProduct(p);

        if (p.category) {
          const rel = await getProductsByCategorySlug(p.category);
          if (!mounted) return;
          setRelated(rel.filter((r) => r.id !== p.id).slice(0, 5));
        } else {
          setRelated([]);
        }
      } catch (e) {
        console.error(e);
      } finally {
        mounted = false ? undefined : setLoading(false);
      }
    }

    load();
    return () => { mounted = false; };
  }, [id]);

  if (loading) return <div className="container section">Loading…</div>;
  if (!product) {
    return (
      <div className="container section">
        <p>Product not found.</p>
        <button className="btn btn--primary" onClick={() => navigate("/")}>Go Home</button>
      </div>
    );
  }

  const addToCart = () => {
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      qty,
    });
    openCart();
  };

  return (
    <div className="container section">
      {/* breadcrumb */}
      <nav className="crumbs">
        <Link to="/">Home</Link> <span>/</span>
        <span>{product.category}</span> <span>/</span>
        <span>{product.title}</span>
      </nav>

      <div className="pd">
        {/* gallery (FakeStore has one image) */}
        <div className="pd__gallery">
          <div className="pd__main">
            <img src={product.image} alt={product.title} />
          </div>
        </div>

        {/* info */}
        <div className="pd__info">
          <h1 className="pd__title">{product.title}</h1>
          {product.rating?.rate && (
            <div className="pd__rating">
              {"★".repeat(Math.round(product.rating.rate))}
              <span>{product.rating.rate.toFixed(1)}</span>
            </div>
          )}

          <div className="pd__price">
            <strong>{formatPKR(product.price)}</strong>
            {product.oldPrice && <span className="old">{formatPKR(product.oldPrice)}</span>}
          </div>

          <p className="pd__desc">{product.description}</p>

          <div className="pd__opts">
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
            <button className="btn btn--primary" onClick={addToCart}>Add to cart</button>
          </div>
        </div>
      </div>

      {/* tabs */}
      <div className="tabs">
        <button className={`tab ${tab === "details" ? "active" : ""}`} onClick={() => setTab("details")}>
          Product Details
        </button>
        <button className={`tab ${tab === "reviews" ? "active" : ""}`} onClick={() => setTab("reviews")}>
          Ratings & Reviews
        </button>
      </div>

      {tab === "details" ? (
        <div className="pd__details">
          <ul>
            <li>Category: {product.category}</li>
            <li>Price: {formatPKR(product.price)}</li>
          </ul>
        </div>
      ) : (
        <div className="pd__reviews">
          <p>No reviews yet.</p>
        </div>
      )}

      {/* related */}
      {!!related.length && (
        <>
          <h2 className="section__title" style={{ marginTop: 24 }}>
            Similar in {product.category}
          </h2>
          <div className="grid">
            {related.map((r) => (
              <article key={r.id} className="card">
                <Link to={`/product/${r.id}`} className="card__link">
                  <img src={r.image} alt={r.title} loading="lazy" />
                </Link>
                <div className="card__body">
                  <Link to={`/product/${r.id}`} className="card__title">{r.title}</Link>
                  <div className="card__price">
                    <strong>{formatPKR(r.price)}</strong>
                    {r.oldPrice && <span className="old">{formatPKR(r.oldPrice)}</span>}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
