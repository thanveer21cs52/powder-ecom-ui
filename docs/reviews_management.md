# Product Reviews Management Panel

This document details the layout, data binding, and interactions of the **Product Reviews** admin dashboard module.

## View Layout

The reviews panel is initialized via the dashboard selector:
- Key: `'reviews'`
- Component: Renders a structured list displaying:
  1. **Product Name** — The product target the rating is for.
  2. **User Name** — The reviewer's full name.
  3. **Rating Stars** — Renders the score visual from `1` to `5` stars using color-tailored glyph components:
     ```typescript
     <div style={{ display: 'flex', gap: '2px', color: 'var(--yellow)', fontSize: '16px' }}>
       {Array.from({ length: 5 }).map((_, i) => (
         <span key={i}>{i < r.rating ? '★' : '☆'}</span>
       ))}
     </div>
     ```
  4. **Comment** — Detailed text submitted by the customer.
  5. **Date** — Formatted submission timestamp.

---

## Action Handlers

- **Filtering**: Dropdowns support filtering reviews based on rating stars (`All Ratings`, `5 Stars`, `4 Stars`, etc.) and search string filtering by product name, customer name, or comment contents.
- **Deletion**: Triggering delete calls API `DELETE /api/admin/reviews/:id` wrapped in the custom confirmation modal.
