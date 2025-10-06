// src/components/ProductGrid.jsx
import { Link } from "react-router-dom";
import { newArrivals, topSelling } from "../data/products";
import { formatPKR } from "../utils/currency";

function Card({ p }) {
  return (
    <article className="card">
      <Link to={`/product/${p.id}`} className="card__link">
        <img src={p.image} alt={p.title} loading="lazy" />
        <div className="card__body">
          <h4 className="card__title">{p.title}</h4>
          <div className="stars">
            {"★".repeat(Math.floor(p.rating))}<span className="stars__num"> {p.rating.toFixed(1)}</span>
          </div>
          <div className="card__price">
            <strong>{formatPKR(p.price)}</strong>
            {p.oldPrice && <span className="old">{formatPKR(p.oldPrice)}</span>}
          </div>
        </div>
      </Link>
    </article>
  );
}

function Section({ title, products }) {
  return (
    <section className="section">
      <h2 className="section__title">{title}</h2>
      <div className="grid">
        {products.map((p) => <Card key={p.id} p={p} />)}
      </div>
    </section>
  );
}

export default function ProductGrid() {
  return (
    <>
      <Section title="New Arrivals" products={newArrivals} />
      <Section title="Top Selling" products={topSelling} />
    </>
  );
}
