import React, { createContext, useContext, useState, useEffect } from 'react';

interface CartItem {
  id: number;
  variant_id?: number;
  name: string;
  price: number;
  qty: number;
  weight: string;
  image: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number, variantId?: number) => void;
  updateQty: (id: number, variantId: number | undefined, delta: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  toggleCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('cart');
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      // Filter out any malformed data from previous bad states
      return Array.isArray(parsed) ? parsed.filter(item => item && typeof item === 'object' && item.id && item.price) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (newItem: CartItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === newItem.id && i.variant_id === newItem.variant_id);
      if (existing) {
        return prev.map(i => 
          (i.id === newItem.id && i.variant_id === newItem.variant_id) 
            ? { ...i, qty: i.qty + newItem.qty } 
            : i
        );
      }
      return [...prev, newItem];
    });
  };

  const removeFromCart = (id: number, variantId?: number) => {
    setCart(prev => prev.filter(i => !(i.id === id && i.variant_id === variantId)));
  };

  const updateQty = (id: number, variantId: number | undefined, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.id === id && i.variant_id === variantId) {
        const newQty = Math.max(1, i.qty + delta);
        return { ...i, qty: newQty };
      }
      return i;
    }));
  };

  const clearCart = () => setCart([]);

  const total = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const itemCount = cart.reduce((acc, item) => acc + item.qty, 0);

  const toggleCart = () => setIsCartOpen(prev => !prev);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQty, clearCart, total, itemCount, isCartOpen, setIsCartOpen, toggleCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
