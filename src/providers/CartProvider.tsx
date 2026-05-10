/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { IProduct } from "@/components/modules/Seller/Product/productColumns";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  getCart,
  addToCart as apiAddToCart,
  updateCartItemQuantity as apiUpdateCartItemQuantity,
  removeFromCart as apiRemoveFromCart,
  clearCart as apiClearCart,
} from "@/services/cart.services";

interface CartItem extends IProduct {
  cartQuantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: IProduct, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCartFromDb = useCallback(async () => {
    const res = await getCart();
    if (res?.success && res?.data) {
      setIsAuthenticated(true);
      // Map DB items to frontend CartItem format
      const dbItems =
        res.data.items?.map((item: any) => ({
          ...item.product,
          cartQuantity: item.quantity,
        })) || [];
      setCartItems(dbItems);
    } else {
      setIsAuthenticated(false);
      // Fallback to local storage if not authenticated
      const storedCart = localStorage.getItem("nextbazar_cart");
      if (storedCart) {
        try {
          setCartItems(JSON.parse(storedCart));
        } catch (e) {
          console.error("Failed to parse cart data");
        }
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCartFromDb();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchCartFromDb]);

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      localStorage.setItem("nextbazar_cart", JSON.stringify(cartItems));
    }
  }, [cartItems, isAuthenticated, isLoading]);

  const addToCart = async (product: IProduct, quantity: number = 1) => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to your cart");
      router.push("/login");
      return;
    }

    // Optimistic UI update
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, cartQuantity: item.cartQuantity + quantity }
            : item,
        );
      }
      return [...prev, { ...product, cartQuantity: quantity }];
    });

    const res = await apiAddToCart(product.id, quantity);
    if (res?.success) {
      toast.success(`${product.name} added to cart`);
    } else {
      toast.error(res?.message || "Failed to add to cart");
      fetchCartFromDb(); // Revert on failure
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (!isAuthenticated) return;
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    // Optimistic UI update
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, cartQuantity: quantity } : item
      )
    );

    const res = await apiUpdateCartItemQuantity(productId, quantity);
    if (!res?.success) {
      toast.error(res?.message || "Failed to update quantity");
      fetchCartFromDb(); // Revert on failure
    }
  };

  const removeFromCart = async (productId: string) => {
    if (!isAuthenticated) return;

    // Optimistic UI update
    setCartItems((prev) => prev.filter((item) => item.id !== productId));

    const res = await apiRemoveFromCart(productId);
    if (!res?.success) {
      toast.error("Failed to remove item");
      fetchCartFromDb(); // Revert on failure
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated) return;

    setCartItems([]);
    const res = await apiClearCart();
    if (!res?.success) {
      fetchCartFromDb(); // Revert on failure
    }
  };

  const cartCount = cartItems.reduce(
    (total, item) => total + item.cartQuantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, updateQuantity, removeFromCart, clearCart, cartCount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
