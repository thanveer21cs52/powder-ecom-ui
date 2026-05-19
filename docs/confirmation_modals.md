# Custom Confirmation Modal System

This document explains the custom confirmation modals built for high-importance admin actions.

## Overview
To provide a premium look-and-feel, all generic native dialogs (`window.confirm`) have been replaced with a styled state-driven confirmation modal (`confirmModal`).

## Component State
```typescript
const [confirmModal, setConfirmModal] = useState<{
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  icon?: string;
  confirmText?: string;
}>({
  isOpen: false,
  title: '',
  message: '',
  onConfirm: () => {},
  icon: '❓',
  confirmText: 'Confirm'
});
```

---

## Action Integrations

### 1. Order Status Updates
When updating status/carrier inside the order edit modal, the submission is routed through the confirmation check:
```typescript
setConfirmModal({
  isOpen: true,
  title: 'Update Order Details',
  message: 'Are you sure you want to update this order status and shipping tracking?',
  onConfirm: async () => { ... execute API call ... },
  icon: '📦',
  confirmText: 'Yes, Update Order'
});
```

### 2. Changing User Roles
When toggle-changing a user's role:
```typescript
setConfirmModal({
  isOpen: true,
  title: 'Change User Role',
  message: `Are you sure you want to change this user's role to Admin/Customer?`,
  onConfirm: async () => { ... execute API call ... },
  icon: '🛡️',
  confirmText: 'Yes, Change Role'
});
```

### 3. Deletion Targets (Products, Categories, Feedbacks, Reviews)
Prompts for deleting entities route through this modal, decorated with the `🗑️` delete icon and styling.
