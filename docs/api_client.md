# API Client Wrapper Documentation

This document explains the configuration of the client-side API layer interfacing with the backend.

## Location
`frontend/src/api/client.ts`

## Client Setup
The application uses **Axios** to communicate with the backend services.

- **Base URL**: Configured to point to the backend server API root, typically `http://localhost:5000/api`.
- **Default Headers**: All requests are configured with `'Content-Type': 'application/json'` by default.

---

## Authentication Interceptor

To support role-based actions and user sessions (such as placing orders or accessing the admin dashboard), the client uses an Axios request interceptor:

```typescript
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Flow:
1. When a user logs in, the auth system stores the JWT token returned by the server into the browser's `localStorage` under the key `'token'`.
2. For all subsequent Axios requests, the interceptor automatically reads the token from `localStorage` and appends the standard `Authorization: Bearer <token>` header to the request payload.
3. If no token is found, the header is omitted (e.g. during registration or public product viewing).
