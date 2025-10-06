// src/components/Hero.jsx
export default function Hero() {
  return (
    <section className="hero">
      <div className="hero__text">
        <h1>Find clothes that matches your style</h1>
        <p>Browse our range of trending outfits, crafted for comfort and everyday style.</p>
        <div className="hero__cta">
          <button className="btn btn--primary">Shop Now</button>
          <button className="btn btn--ghost">View Catalog</button>
        </div>

        <div className="hero__stats">
          <div><strong>200+</strong><span>International Brands</span></div>
          <div><strong>2,000+</strong><span>High Quality Products</span></div>
          <div><strong>30,000+</strong><span>Happy Customers</span></div>
        </div>
      </div>

      <div className="hero__image">
        {/* use any model banner image you like */}
        <img src="https://images.unsplash.com/photo-1548142813-c348350df52b?q=80&w=1600&auto=format&fit=crop" alt="models" />
      </div>
    </section>
  );
}
