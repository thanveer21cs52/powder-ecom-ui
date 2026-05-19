# Order Tracking & Status Updates UI

This document details the tracking layout, carrier fields, and admin auditing info displayed in the orders workspace.

## Orders Workspace Layout

### Orders Table Row Columns
- **Order Number**: Reference link to view full transaction logs.
- **Customer**: Target buyer name/profile.
- **Products**: Text description of ordered items and variant weights.
- **Carrier**: Displays the `post_service` carrier (e.g., India Post, FedEx).
- **Tracking ID**: Displays the unique package delivery code.
- **Updated By**: Shows the identity of the administrator who performed the last state modification.
- **Status & Payment**: Clean, color-coded badges indicating current state.

---

## Status Update workflow

1. Admin clicks **Edit** on a row.
2. A modal overlays showing details of the order items, price details, and a form containing:
   - **Post Service** input field.
   - **Tracking ID** input field.
   - **Status** selection dropdown (e.g., Processing, Shipped, Packed, Delivered, Cancelled, Returned).
   - **Payment Status** selection dropdown (Paid, Pending).
3. Clicking **Save** triggers a state confirmation pop-up.
4. On confirmation, it executes the PUT update, passing the values and recording the modifying administrator.
