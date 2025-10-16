// src/components/Footer.jsx
export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__top">
        <div className="logo">SEEMAB</div>
        <p>Comfortable, modern and affordable clothing for everyone.</p>
      </div>
      <div className="footer__bottom">
        <span>© {new Date().getFullYear()} SEEMAB. All rights reserved.</span>
        <div className="footer__links">
          <a href="#privacy">Privacy</a>
          <a href="#terms">Terms</a>
          <a href="#support">Support</a>
        </div>
      </div>
    </footer>
  );
}
