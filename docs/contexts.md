# React Contexts Documentation

This document explains the React Context files inside `frontend/src/context/` that manage global state across the client application.

---

## 1. Authentication Context (`AuthContext.tsx`)
Manages login sessions, administrators authentication tokens, and user credentials.

- **State Fields**:
  - `user`: Decoded user object containing user attributes (e.g., `id`, `full_name`, `email`, `is_admin`).
  - `loading`: Boolean state indicating if token validation check is in progress.
- **Key Methods**:
  - `login(token, userData)`: Stores the JWT token in browser `localStorage` and updates the `user` state.
  - `logout()`: Clears the JWT token from `localStorage` and resets the `user` state.
  - `fetchUser()`: Requests user profile details (`GET /auth/me`) using the active token.

---

## 2. Cart Context (`CartContext.tsx`)
Coordinates customer selections, quantities, and price calculations.

- **State Fields**:
  - `cart`: Array of items currently in the cart. Each item details:
    - `id` / `productId`: Catalog ID.
    - `name` / `image`: Core descriptors.
    - `weight`: Selected variant weight.
    - `price`: Price calculated based on variant price modifiers and discount settings.
    - `quantity`: Number of items selected.
- **Key Methods**:
  - `addToCart(product, weight, price, qty)`: Adds a product variant to the cart. If the matching item and weight already exist in the cart, the system increments its quantity.
  - `removeFromCart(productId, weight)`: Removes an item matching the ID and variant weight.
  - `updateQuantity(productId, weight, qty)`: Directly changes the item's count in the cart.
  - `clearCart()`: Flushes all selections.
  - `cartTotal`: Computed property representing the subtotal sum of all cart items.

---

## 3. Navigation Context (`NavigationContext.tsx`)
Coordinates page and view routing states across components.
- Handles responsive view selection.
- Synchronizes search parameter changes, category filters, and active tab transitions in the dashboard.
