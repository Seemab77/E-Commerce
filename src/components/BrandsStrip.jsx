// src/components/BrandsStrip.jsx
export default function BrandsStrip() {
  const brands = [
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
  return (
    <div className="brands">
      <div className="brands__row">
        {brands.map((b) => (
          <span key={b} className="brand">{b}</span>
        ))}
      </div>
    </div>
  );
}
