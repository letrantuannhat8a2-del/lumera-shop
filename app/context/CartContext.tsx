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
  price: number;
  image: string;
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
    size: string
  ) => void;
  clearCart: () => void;

  decreaseQuantity: (
    id: string,
    size: string
  ) => void;

  removeItem: (
    id: string,
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
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Đọc giỏ hàng cũ
  useEffect(() => {
    const savedCart =
      localStorage.getItem("cart");

    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch {
        setCart([]);
      }
    }

    setLoaded(true);
  }, []);

  // Lưu giỏ hàng
  useEffect(() => {
    if (!loaded) return;

    localStorage.setItem(
      "cart",
      JSON.stringify(cart)
    );
  }, [cart, loaded]);

  // ADD TO BAG
  const addToCart = (item: CartItem) => {
    setCart((currentCart) => {
      const existingItem =
        currentCart.find(
          (cartItem) =>
            cartItem.id === item.id &&
            cartItem.size === item.size
        );

      if (existingItem) {
        return currentCart.map(
          (cartItem) =>
            cartItem.id === item.id &&
            cartItem.size === item.size
              ? {
                  ...cartItem,
                  quantity:
                    cartItem.quantity +
                    item.quantity,
                }
              : cartItem
        );
      }

      return [...currentCart, item];
    });
  };

  // TĂNG SỐ LƯỢNG
 const increaseQuantity = (
  id: string,
  size: string
) => {
  setCart((current) =>
    current.map((item) => {
      if (
        item.id !== id ||
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

  // GIẢM SỐ LƯỢNG
  const decreaseQuantity = (
    id: string,
    size: string
  ) => {
    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === id &&
        item.size === size
          ? {
              ...item,
              quantity: Math.max(
                1,
                item.quantity - 1
              ),
            }
          : item
      )
    );
  };

  // XÓA SẢN PHẨM
  const removeItem = (
    id: string,
    size: string
  ) => {
    setCart((currentCart) =>
      currentCart.filter(
        (item) =>
          !(
            item.id === id &&
            item.size === size
          )
      )
    );
  };

  const cartCount = cart.reduce(
    (total, item) =>
      total + item.quantity,
    0
  );

  const subtotal = cart.reduce(
    (total, item) =>
      total +
      item.price * item.quantity,
    0
  );
  const clearCart = () => {
  setCart([]);
};

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