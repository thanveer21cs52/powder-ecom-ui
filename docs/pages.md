# Frontend Page Components Documentation

This document describes all page components located in `frontend/src/pages/`, explaining their UI roles, states, and user interactions.

---

## 1. Landing Page (`Home.tsx`)
- **Role**: The main entry point of the website.
- **Key Sections**:
  - Hero banner with a call-to-action button.
  - Categories list cards.
  - Highlights of premium/hot podi, malt, and masala products.
  - Client testimonial slider section.

---

## 2. Product Directory (`shop/ProductList.tsx`)
- **Role**: Lists catalog items under various categories.
- **Key Sections**:
  - Category filter dropdowns (responsive 3-grid selector on mobile).
  - Search query header.
  - Interactive grid displaying product thumbnail, name, discount badges, and price modifiers.

---

## 3. Product Details (`shop/ProductDetail.tsx`)
- **Role**: Displays detailed item specifications.
- **Key Sections**:
  - High-res image display.
  - Weight selection pills (e.g., 50g, 100g, 250g) which automatically recalculate the price.
  - Star reviews list submitted by other customers.
  - Star rating and comment submission form.
  - Add-to-cart button.

---

## 4. User Login & Signup (`auth/Login.tsx`)
- **Role**: Coordinates authenticating users.
- **Key Sections**:
  - Toggle form switcher (Login mode vs. Register mode).
  - Input forms for name, email, and password.
  - Form validation and direct authentication requests to the API.

---

## 5. Checkout Workspace (`Checkout.tsx`)
- **Role**: Collects user information to place orders.
- **Key Sections**:
  - Address entry form (Street, City, State, ZIP).
  - Payment method choices (UPI, cash on delivery).
  - Order summary panel showing discounts, base prices, shipping, and totals.
  - Place Order action button.

---

## 6. Order Confirmation (`OrderSuccess.tsx`)
- **Role**: Friendly completion screen shown post-checkout.
- **Key Sections**:
  - Success message with the unique Order Number.
  - Redirect button to the home page or to track orders in user's profile.

---

## 7. Customer Profile (`Account.tsx`)
- **Role**: Allows customers to manage details and track orders.
- **Key Sections**:
  - Profile details (name, email).
  - Orders list tab: Renders order tracking statuses, carriers, dates, and order items.

---

## 8. Admin Control Center (`admin/Dashboard.tsx`)
- **Role**: Consolidated dashboard for administrator tasks.
- **Key Sections**:
  - **Sidebar Menu**: Toggle categories: *Orders, Products, Users, Categories, Inquiries, Feedbacks, and Reviews*.
  - **Orders**: Lists orders, tracking codes, editing options, and audit logs.
  - **Products**: Grid managing product updates, discounts, variants, and descriptions.
  - **Users**: Directory of role management with custom confirmation modals.
  - **Categories**: CRUD forms managing tags, emoji tags, and slugs.
  - **Reviews**: Lists client comments and ratings with delete actions.
  - **Inquiries & Feedbacks**: Support ticket reviews and message filters.
  - **Search & Filters**: Header query and rating star filters.
  - **Pagination Component**: Controls rendering 10 elements per page.
  - **Custom Modal Dialog**: Center-overlay prompt for validation.
