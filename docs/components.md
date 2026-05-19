# Frontend Components Documentation

This document describes the shared UI components used across the frontend client application (`frontend/src/components/`).

---

## 1. Global Navigation Bar (`Navbar.tsx`)
- **Role**: Handles responsive navigation, category shortcuts, search integration, and user authentication indicators.
- **Key Features**:
  - **Inline Search Bar**: Features a responsive inline search bar that filters products instantly as the user types, replacing intrusive full-page search overlays.
  - **Category Hover Dropdown**: Responsive dropdown menus showing category collections and weight price selectors.
  - **Authentication Badges**: Displays a login button if the user is anonymous, or a profile dropdown menu (with Order History, Admin Dashboard link, and Logout) when logged in.
  - **Cart Count Indicator**: Renders current cart item count with badge micro-animations.

---

## 2. Sliding Cart Drawer (`CartDrawer.tsx`)
- **Role**: Side overlay panel showing items currently selected by the customer.
- **Key Features**:
  - Slides in from the right edge smoothly.
  - Renders image, selected weight variant, and price for each item.
  - Quantity controls (add, subtract, remove).
  - Subtotal calculator displaying total cost before checkout.
  - Link to go to checkout page.

---

## 3. Product Display Card (`ProductCard.tsx`)
- **Role**: Grid card showing catalog items.
- **Key Features**:
  - Displays main image, name, and star ratings.
  - Highlights pricing details: active base price, original price, and computed discount percentage.
  - Wishlist toggle icon (synchronized with user profile).
  - Navigation link leading to product details page.

---

## 4. Search overlay (`SearchModal.tsx`)
- **Role**: Interactive search overlay.
- **Key Features**:
  - Supports quick searches when clicking the navigation search trigger.
  - Instantly lists matches matching names or descriptions.

---

## 5. UI Skeletons (`SkeletonProduct.tsx` / `SkeletonDetail.tsx`)
- **Role**: Placeholder boxes rendered during API loading states.
- **Key Features**:
  - Simulates the visual structure of catalog cards and details layouts.
  - Uses CSS pulse animations to improve perceived loading speeds.

---

## 6. Footer Layout (`Footer.tsx`)
- **Role**: Branding and informational layout.
- **Key Features**:
  - Dynamic category links.
  - Contact information and support addresses.
  - Social media icon shortcuts.
