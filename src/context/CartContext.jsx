import React, { createContext, useContext, useMemo, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState([]); // {id,title,price,image,qty}

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const addItem = (product, qty = 1) => {
    setItems(curr => {
      const idx = curr.findIndex(i => i.id === product.id);
      if (idx !== -1) {
        const copy = [...curr];
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + qty };
        return copy;
      }
      return [...curr, { ...product, qty }];
    });
    setIsOpen(true); // open drawer on add
  };

  const removeItem = (id) =>
    setItems(curr => curr.filter(i => i.id !== id));

  const increment = (id) =>
    setItems(curr =>
      curr.map(i => (i.id === id ? { ...i, qty: i.qty + 1 } : i))
    );

  const decrement = (id) =>
    setItems(curr =>
      curr.map(i =>
        i.id === id ? { ...i, qty: Math.max(1, i.qty - 1) } : i
      )
    );

  const clear = () => setItems([]);

  const subtotal = useMemo(
    () => items.reduce((s, i) => s + i.price * i.qty, 0),
    [items]
  );

  const value = {
    isOpen,
    items,
    subtotal,
    openCart,
    closeCart,
    addItem,
    removeItem,
    increment,
    decrement,
    clear,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
