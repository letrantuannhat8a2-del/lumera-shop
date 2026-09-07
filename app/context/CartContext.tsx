"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

export type CartItem = {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;

  color: string;
  size: string;

  quantity: number;

  stock?: number;
};

type CartContextType = {
  cart: CartItem[];
  cartCount: number;
  subtotal: number;

  addToCart: (item: CartItem) => void;

  increaseQuantity: (
    id: string,
    color: string,
    size: string
  ) => void;

  clearCart: () => void;

  decreaseQuantity: (
    id: string,
    color: string,
    size: string
  ) => void;

  removeItem: (
    id: string,
    color: string,
    size: string
  ) => void;
};

const CartContext = createContext<
  CartContextType | undefined
>(undefined);

export function CartProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [cart, setCart] =
    useState<CartItem[]>([]);

  const [loaded, setLoaded] =
    useState(false);

  // ========================================
  // ĐỌC GIỎ HÀNG CŨ
  // ========================================

  useEffect(() => {
    const savedCart =
      localStorage.getItem("cart");

    if (savedCart) {
      try {
        const parsed =
          JSON.parse(savedCart);

        if (Array.isArray(parsed)) {
          const migrated =
            parsed
              .map((item) => ({
                ...item,

                // Cart cũ chưa có color
                // → dùng Ivory mặc định
                color:
                  typeof item.color ===
                  "string"
                    ? item.color
                    : "Ivory",
              }))
              .filter(
                (item) =>
                  item &&
                  typeof item.id ===
                    "string" &&
                  typeof item.size ===
                    "string"
              );

          setCart(migrated);
        } else {
          setCart([]);
        }
      } catch {
        setCart([]);
      }
    }

    setLoaded(true);
  }, []);

  // ========================================
  // LƯU GIỎ HÀNG
  // ========================================

  useEffect(() => {
    if (!loaded) {
      return;
    }

    localStorage.setItem(
      "cart",
      JSON.stringify(cart)
    );
  }, [cart, loaded]);

  // ========================================
  // ADD TO BAG
  // ========================================

  const addToCart = (
    item: CartItem
  ) => {
    setCart((currentCart) => {

      const existingItem =
        currentCart.find(
          (cartItem) =>
            cartItem.id ===
              item.id &&
            cartItem.color ===
              item.color &&
            cartItem.size ===
              item.size
        );

      // ====================================
      // ĐÃ CÓ CÙNG:
      // PRODUCT + COLOR + SIZE
      // ====================================

      if (existingItem) {
        const maxStock =
          existingItem.stock ??
          item.stock ??
          Number.POSITIVE_INFINITY;

        const requestedQuantity =
          existingItem.quantity +
          item.quantity;

        const nextQuantity =
          Math.min(
            requestedQuantity,
            maxStock
          );

        return currentCart.map(
          (cartItem) =>
            cartItem.id ===
              item.id &&
            cartItem.color ===
              item.color &&
            cartItem.size ===
              item.size
              ? {
                  ...cartItem,

                  quantity:
                    nextQuantity,

                  stock:
                    existingItem.stock ??
                    item.stock,
                }
              : cartItem
        );
      }

      // ====================================
      // SẢN PHẨM MỚI
      // ====================================

      const maxStock =
        item.stock ??
        Number.POSITIVE_INFINITY;

      const safeQuantity =
        Math.min(
          item.quantity,
          maxStock
        );

      return [
        ...currentCart,
        {
          ...item,

          quantity:
            safeQuantity,
        },
      ];
    });
  };

  // ========================================
  // TĂNG SỐ LƯỢNG
  // ========================================

  const increaseQuantity = (
    id: string,
    color: string,
    size: string
  ) => {
    setCart((current) =>
      current.map((item) => {

        if (
          item.id !== id ||
          item.color !== color ||
          item.size !== size
        ) {
          return item;
        }

        const maxStock =
          item.stock ??
          Number.POSITIVE_INFINITY;

        if (
          item.quantity >=
          maxStock
        ) {
          return item;
        }

        return {
          ...item,

          quantity:
            item.quantity + 1,
        };
      })
    );
  };

  // ========================================
  // GIẢM SỐ LƯỢNG
  // ========================================

  const decreaseQuantity = (
    id: string,
    color: string,
    size: string
  ) => {
    setCart((currentCart) =>
      currentCart.map((item) => {

        if (
          item.id !== id ||
          item.color !== color ||
          item.size !== size
        ) {
          return item;
        }

        return {
          ...item,

          quantity:
            Math.max(
              1,
              item.quantity - 1
            ),
        };
      })
    );
  };

  // ========================================
  // XÓA SẢN PHẨM
  // ========================================

  const removeItem = (
    id: string,
    color: string,
    size: string
  ) => {
    setCart((currentCart) =>
      currentCart.filter(
        (item) =>
          !(
            item.id === id &&
            item.color === color &&
            item.size === size
          )
      )
    );
  };

  // ========================================
  // CART COUNT
  // ========================================

  const cartCount =
    cart.reduce(
      (total, item) =>
        total + item.quantity,
      0
    );

  // ========================================
  // SUBTOTAL
  // ========================================

  const subtotal =
    cart.reduce(
      (total, item) =>
        total +
        item.price *
          item.quantity,
      0
    );

  // ========================================
  // CLEAR CART
  // ========================================

  const clearCart = () => {
    setCart([]);
  };

  // ========================================
  // PROVIDER
  // ========================================

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        subtotal,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// ========================================
// USE CART
// ========================================

export function useCart() {
  const context =
    useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
}