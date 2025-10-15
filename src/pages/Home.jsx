// src/pages/Home.jsx
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Hero from "../components/Hero";
import RandomProducts from "../components/RandomProduct";
import ProductGrid from "../components/ProductGrid";


export default function Home() {
  const location = useLocation();

  useEffect(() => {
    const id = location.state?.scrollTo;
    if (id) {
      // give the DOM a tick to render before scrolling
      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount

  return (
    <>
      <Hero />
      {/* Random picks from Fake Store */}
      <RandomProducts title="Random picks for you" count={8} />

    </>
  );
}