# Admin Dashboard Pagination Documentation

This document explains the client-side pagination system integrated into the Admin Dashboard (`Dashboard.tsx`).

## Core Mechanisms

### 1. State hooks & Settings
The dashboard manages the current active page state locally:
```typescript
const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 10;
```

### 2. State Reset on Tab Switch
When administrators switch categories/views on the sidebar, the system automatically resets the active page state back to `1`. This is handled inside the tab transition logic to prevent out-of-bounds page selection:
```typescript
const handleMenuClick = (menu: string) => {
  setActiveMenu(menu);
  setCurrentPage(1); // Prevents empty lists
};
```

---

## Paginated Table Integration

All list collections are sliced dynamically before rendering based on `currentPage`:

```typescript
const startIndex = (currentPage - 1) * itemsPerPage;
const paginatedItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);
```

The matching sub-collection (`paginatedItems`) is mapped in the tables, and the reusable pagination component `renderPagination` is called at the bottom:

```typescript
{renderPagination(filteredItems.length, itemsPerPage, currentPage, setCurrentPage)}
```
This is fully implemented across:
- Orders List
- Products List
- User Directory List
- Categories List
- Customer Inquiries List
- Feedbacks List
- Product Reviews List
