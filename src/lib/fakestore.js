// src/lib/fakestore.js

const BASE = "https://fakestoreapi.com";

// Fetch every product
export async function getAllProducts() {
    const res = await fetch(`${BASE}/products`);
    if (!res.ok) throw new Error("Failed to fetch products");
    return res.json();
}

// Fetch all category names (e.g., "men's clothing", "jewelery", …)
export async function getCategories() {
    const res = await fetch(`${BASE}/products/categories`);
    if (!res.ok) throw new Error("Failed to fetch categories");
    return res.json();
}

// Given a *category name*, fetch all products in that category
// NOTE: The API expects the *decoded* category, so we encode it for safety.
export async function getProductsByCategorySlug(category) {
    const encoded = encodeURIComponent(category);
    const res = await fetch(`${BASE}/products/category/${encoded}`);
    if (!res.ok) throw new Error("Failed to fetch category products");
    return res.json();
}

// One product by id
export async function getProductById(id) {
    const res = await fetch(`${BASE}/products/${id}`);
    if (!res.ok) throw new Error("Failed to fetch product");
    return res.json();
}

/**
 * Utility to add a fake "old price" so you can show a crossed-out price / discount.
 * usage: withOldPrice(productOrArray)
 */
export function withOldPrice(data) {
    const addOld = (p) => {
        if (p && typeof p.price === "number") {
            const old = +(p.price * 1.17).toFixed(0); // ~17% higher
            return { ...p, oldPrice: old };
        }
        return p;
    };
    return Array.isArray(data) ? data.map(addOld) : addOld(data);
}

/** URL helper: turn category -> safe path part */
export function toSlug(category) {
    // For FakeStore categories, encodeURIComponent is perfect (handles spaces, apostrophes, etc.)
    return encodeURIComponent(category);
}

/** URL helper: turn path part -> original category */
export function fromSlug(slug) {
    return decodeURIComponent(slug);
}
