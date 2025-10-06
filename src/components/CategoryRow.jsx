// src/components/CategoryRow.jsx
const categories = [
  { name: "Casual", img: "https://images.unsplash.com/photo-1551024709-8f23befc6cf7?q=80&w=1200&auto=format&fit=crop" },
  { name: "Formal", img: "https://images.unsplash.com/photo-1520975931861-c0c6bddf51b1?q=80&w=1200&auto=format&fit=crop" },
  { name: "Party",  img: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop" },
  { name: "Gym",    img: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1200&auto=format&fit=crop" },
];

export default function CategoryRow() {
  return (
    <section className="cats">
      <h2 className="section__title">Browse by Dress Style</h2>
      <div className="cats__row">
        {categories.map((c) => (
          <div key={c.name} className="cats__card">
            <img src={c.img} alt={c.name} />
            <span>{c.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
