// src/components/BrandsStrip.jsx
import { Link } from "react-router-dom";

const slug = (s) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const BRANDS = [
  "Khaadi",
  "Gul Ahmed",
  "Sapphire",
  "Alkaram",
  "J. (Junaid Jamshed)",
  "Outfitters",
  "Limelight",
  "Nishat Linen",
  "Sana Safinaz",
  "Bonanza Satrangi",
  "Bata",
  "Servis",
];

export default function BrandsStrip() {
  return (
    <nav className="brands" aria-label="Popular brands">
      <div className="brands__row">
        {BRANDS.map((b) => (
          <Link key={b} className="brand" to={`/brand/${slug(b)}`}>
            {b}
          </Link>
        ))}
      </div>
    </nav>
  );
}
