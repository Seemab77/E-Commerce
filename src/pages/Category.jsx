// src/pages/Category.jsx
export default function Category({ title }) {
  return (
    <div className="section container">
      <h2>{title}</h2>
      <p>Products from {title} will appear here (filter by category/brand).</p>
    </div>
  );
}
