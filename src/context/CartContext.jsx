// src/context/CartContext.jsx
import React, {
  createContext,
  useContext,
  useReducer,
  useMemo,
  useCallback,
} from "react";

const CartContext = createContext(null);

const initialState = {
  items: [], // { id, title, price, image, qty, options }
  isOpen: false,
};

function sameOptions(a = {}, b = {}) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function reducer(state, action) {
  switch (action.type) {
    case "OPEN":
      return { ...state, isOpen: true };

    case "CLOSE":
      return { ...state, isOpen: false };

    case "ADD": {
      const item = action.payload;
      const addQty = Math.max(1, Number(item.qty) || 1);

      const idx = state.items.findIndex(
        (it) => it.id === item.id && sameOptions(it.options, item.options)
      );

      let items;
      if (idx >= 0) {
        items = state.items.map((it, i) =>
          i === idx ? { ...it, qty: (Number(it.qty) || 0) + addQty } : it
        );
      } else {
        items = [...state.items, { ...item, qty: addQty }];
      }

      return { ...state, items };
    }

    case "SET_QTY": {
      const { id, options, qty } = action.payload;
      const newQty = Math.max(1, Number(qty) || 1);
      const items = state.items.map((it) =>
        it.id === id && sameOptions(it.options, options)
          ? { ...it, qty: newQty }
          : it
      );
      return { ...state, items };
    }

    case "REMOVE": {
      const { id, options } = action.payload;
      const items = state.items.filter(
        (it) => !(it.id === id && sameOptions(it.options, options))
      );
      return { ...state, items };
    }

    case "CLEAR":
      return { ...state, items: [] };

    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const openCart = useCallback(() => dispatch({ type: "OPEN" }), []);
  const closeCart = useCallback(() => dispatch({ type: "CLOSE" }), []);
  const addItem = useCallback(
    (item) => dispatch({ type: "ADD", payload: item }),
    []
  );
  const setQty = useCallback(
    (id, options, qty) =>
      dispatch({ type: "SET_QTY", payload: { id, options, qty } }),
    []
  );
  const removeItem = useCallback(
    (id, options) => dispatch({ type: "REMOVE", payload: { id, options } }),
    []
  );
  const clear = useCallback(() => dispatch({ type: "CLEAR" }), []);

  const items = state.items;
  const count = useMemo(
    () => items.reduce((s, it) => s + (Number(it.qty) || 0), 0),
    [items]
  );
  const subtotal = useMemo(
    () =>
      items.reduce(
        (s, it) => s + (Number(it.price) || 0) * (Number(it.qty) || 0),
        0
      ),
    [items]
  );

  const value = {
    items,
    isOpen: state.isOpen,
    openCart,
    closeCart,
    addItem, // respects payload qty
    setQty,
    removeItem,
    clear,
    count,
    subtotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
