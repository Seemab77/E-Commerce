// src/components/Testimonials.jsx
const reviews = [
  { name: "Sarah L.",  text: "Great quality and fast delivery. Will buy again!", stars: 5 },
  { name: "Ali M.",    text: "Loved the fit and style. Worth it.", stars: 4 },
  { name: "Emma K.",   text: "Smooth shopping and nice packaging.", stars: 5 },
];

export default function Testimonials() {
  return (
    <section className="testimonials">
      <h2 className="section__title">Our Happy Customers</h2>
      <div className="reviews">
        {reviews.map((r, i) => (
          <div key={i} className="review">
            <div className="review__stars">{"⭐".repeat(r.stars)}</div>
            <p className="review__text">{r.text}</p>
            <div className="review__name">{r.name}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
