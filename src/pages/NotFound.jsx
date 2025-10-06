import { Link } from "react-router-dom";
export default function NotFound(){
  return (
    <div className="section container">
      <h2>404 — Page not found</h2>
      <Link className="btn btn--primary" to="/">Go Home</Link>
    </div>
  );
}
