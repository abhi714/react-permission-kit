# 🛡️ react-permission-kit

A lightweight, zero-dependency, type-safe permission and access-control toolkit for React applications. Manage Role-Based (RBAC) and Permission-Based (PBAC) authorization declaratively in JSX and imperatively with hooks and pure utilities.

[![npm version](https://img.shields.io/npm/v/react-permission-kit.svg)](https://www.npmjs.com/package/react-permission-kit)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178C6.svg)](https://www.typescriptlang.org/)
[![Bundle Size](https://img.shields.io/badge/bundle%20size-%3C2%20KB-success.svg)](#)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-brightgreen.svg)](#)

---

## ✨ Highlights

- 🪶 **Ultra-Lightweight & Fast**: Zero external dependencies, footprint `< 2 KB` minified.
- 🔒 **Type-Safe**: Written in 100% TypeScript with complete type definitions and autocomplete.
- 🧩 **Declarative `<Can />` Component**: Conditionally render UI elements and fallback states cleanly in JSX.
- 🪝 **Intuitive React Hooks**: `usePermission` and `usePermissions` for imperative checks, conditionals, and event handlers.
- ⚡ **Framework & Architecture Agnostic**: Works seamlessly with Next.js (App & Pages Router), Vite, Remix, React Router, Create React App, TanStack Router, etc.
- ⚙️ **Pure Utility Core**: Pure, stateless helper functions (`hasPermission`, `checkPermissions`, etc.) usable in React components, Node.js scripts, API routes, or SSR loaders.
- ⚛️ **React 18 & 19 Ready**: Built and tested against the modern React ecosystem.

---

## 📦 Installation

Install `react-permission-kit` using your package manager of choice:

```bash
# npm
npm install react-permission-kit

# pnpm
pnpm add react-permission-kit

# yarn
yarn add react-permission-kit

# bun
bun add react-permission-kit
```

> **Peer Dependencies**: Requires `react >= 18` and `react-dom >= 18`.

---

## 🚀 Quick Start

### 1. Wrap your application with `PermissionProvider`

Supply the current user's granted permissions array (e.g., fetched from your authentication context, JWT token, or API):

```tsx
// App.tsx
import React from "react";
import { PermissionProvider } from "react-permission-kit";
import { Dashboard } from "./Dashboard";

export function App() {
  // Array of permission strings for the active user
  const userPermissions = ["user.view", "user.edit", "report.download"];

  return (
    <PermissionProvider permissions={userPermissions}>
      <Dashboard />
    </PermissionProvider>
  );
}
```

### 2. Guard UI elements with `<Can />`

```tsx
// Dashboard.tsx
import React from "react";
import { Can } from "react-permission-kit";

export function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>

      {/* Render only if user has a single permission */}
      <Can permission="user.edit">
        <button onClick={() => alert("Editing user...")}>Edit User</button>
      </Can>

      {/* Render with a fallback when denied */}
      <Can 
        permission="user.delete" 
        fallback={<p className="text-muted">You do not have permission to delete users.</p>}
      >
        <button className="btn-danger">Delete User</button>
      </Can>

      {/* Match ANY permission from a list (OR) */}
      <Can permissions={["report.download", "report.export"]} mode="any">
        <button>Export Reports</button>
      </Can>

      {/* Match ALL permissions from a list (AND) */}
      <Can permissions={["user.view", "billing.manage"]} mode="all">
        <section>Billing Audit Panel</section>
      </Can>
    </div>
  );
}
```

### 3. Imperative checks with Hooks

```tsx
// UserActions.tsx
import React from "react";
import { usePermission, usePermissions } from "react-permission-kit";

export function UserActions() {
  const canDelete = usePermission("user.delete");
  const canManageReports = usePermissions(["report.create", "report.publish"], "all");

  const handleDelete = () => {
    if (!canDelete) {
      alert("Unauthorized action!");
      return;
    }
    // Delete action...
  };

  return (
    <div>
      <button onClick={handleDelete} disabled={!canDelete}>
        {canDelete ? "Delete User" : "Delete (Locked)"}
      </button>

      {canManageReports && <button>Publish Reports</button>}
    </div>
  );
}
```

---

## 📖 API Reference

### 1. `<PermissionProvider />`

The React Context provider that makes permissions available throughout your component hierarchy.

```tsx
<PermissionProvider permissions={string[]}>
  {children}
</PermissionProvider>
```

#### Props

| Prop | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| `permissions` | `Permission[]` (`string[]`) | **Yes** | Array of permission strings granted to the active user or session. |
| `children` | `ReactNode` | **Yes** | Child React components. |

---

### 2. `<Can />`

A declarative wrapper component that renders `children` if permission criteria are met; otherwise, renders `fallback` (or `null`).

```tsx
<Can
  permission="user.view"
  permissions={["user.edit", "user.delete"]}
  mode="any" // "any" | "all" (default: "all")
  fallback={<AccessDenied />}
>
  <ProtectedComponent />
</Can>
```

#### Props

| Prop | Type | Default | Description |
| :--- | :--- | :---: | :--- |
| `permission` | `Permission` (`string`) | `undefined` | A single permission string to check. Takes precedence over `permissions`. |
| `permissions` | `Permission[]` (`string[]`) | `[]` | Array of permission strings to evaluate when `permission` is not supplied. |
| `mode` | `"any"` \| `"all"` | `"all"` | Validation strategy for multiple permissions:<br>• `"all"`: User must have **every** listed permission.<br>• `"any"`: User must have **at least one** listed permission. |
| `fallback` | `ReactNode` | `null` | Element rendered when permission validation fails or when no permissions are specified. |
| `children` | `ReactNode` | — | Content to render when permission validation passes. |

> **Note**: If neither `permission` nor `permissions` are provided (or an empty array is passed), `<Can />` securely resolves `allowed` to `false` and renders the `fallback`.

---

### 3. `usePermission(permission)`

A hook that verifies if the current user possesses a specific permission.

```tsx
const canEdit = usePermission("posts.edit");
```

- **Parameters**: `permission: string`
- **Returns**: `boolean` (`true` if granted, `false` otherwise)
- **Throws**: `Error` if invoked outside of a `<PermissionProvider>`.

---

### 4. `usePermissions(permissions, mode?)`

A hook that checks multiple permissions using either `"all"` or `"any"` evaluation mode.

```tsx
// Check if user has ALL permissions (AND)
const canFullyAdmin = usePermissions(["admin.access", "users.manage"], "all");

// Check if user has AT LEAST ONE permission (OR)
const canModerate = usePermissions(["comments.delete", "posts.edit"], "any");
```

- **Parameters**:
  - `permissions: string[]`
  - `mode?: "any" | "all"` *(Default: `"all"`)*
- **Returns**: `boolean`
- **Throws**: `Error` if invoked outside of a `<PermissionProvider>`.

---

### 5. Pure Core Functions (Stateless)

`react-permission-kit` exports its pure, stateless evaluation engine. These functions require no React context and can be executed anywhere (Node.js backend, Next.js Middleware, API routes, route loaders, utility scripts).

```ts
import { 
  hasPermission, 
  hasAnyPermission, 
  hasAllPermissions, 
  checkPermissions 
} from "react-permission-kit";

const userPerms = ["posts.read", "posts.write"];

// 1. Single check
hasPermission(userPerms, "posts.read"); // true
hasPermission(userPerms, "posts.delete"); // false

// 2. Any check (OR)
hasAnyPermission(userPerms, ["posts.delete", "posts.write"]); // true
hasAnyPermission(userPerms, ["admin", "root"]); // false

// 3. All check (AND)
hasAllPermissions(userPerms, ["posts.read", "posts.write"]); // true
hasAllPermissions(userPerms, ["posts.read", "posts.delete"]); // false

// 4. Combined check
checkPermissions(userPerms, ["posts.read", "posts.write"], "all"); // true
checkPermissions(userPerms, ["posts.delete", "posts.read"], "any"); // true
```

---

## 🛠️ Real-World Recipes & Patterns

### 🔹 Recipe 1: Role-to-Permissions Mapping

Translate high-level roles (e.g. `Admin`, `Editor`, `Viewer`) into granular permissions before passing to the provider:

```tsx
const ROLE_PERMISSIONS: Record<string, string[]> = {
  admin: ["user.view", "user.create", "user.edit", "user.delete", "settings.manage"],
  editor: ["user.view", "user.edit"],
  viewer: ["user.view"],
};

export function AppRoot({ userRole }: { userRole: "admin" | "editor" | "viewer" }) {
  const permissions = ROLE_PERMISSIONS[userRole] || [];

  return (
    <PermissionProvider permissions={permissions}>
      <App />
    </PermissionProvider>
  );
}
```

---

### 🔹 Recipe 2: Protected Route Guard (React Router)

Create a reusable route wrapper for React Router v6 / v7:

```tsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { usePermissions } from "react-permission-kit";

interface ProtectedRouteProps {
  requiredPermissions: string[];
  mode?: "any" | "all";
  redirectTo?: string;
}

export function ProtectedRoute({
  requiredPermissions,
  mode = "all",
  redirectTo = "/unauthorized",
}: ProtectedRouteProps) {
  const isAllowed = usePermissions(requiredPermissions, mode);

  if (!isAllowed) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
}

// Router usage:
// <Route element={<ProtectedRoute requiredPermissions={["admin.access"]} />}>
//   <Route path="/admin" element={<AdminDashboard />} />
// </Route>
```

---

### 🔹 Recipe 3: Type-Safe Permission Literals

Ensure compile-time safety by typing your permission strings:

```tsx
// permissions.ts
export const APP_PERMISSIONS = {
  USERS_VIEW: "users.view",
  USERS_CREATE: "users.create",
  USERS_EDIT: "users.edit",
  USERS_DELETE: "users.delete",
} as const;

export type AppPermission = typeof APP_PERMISSIONS[keyof typeof APP_PERMISSIONS];

// In your component:
<Can permission={APP_PERMISSIONS.USERS_CREATE}>
  <CreateUserButton />
</Can>
```

---

## 🧪 Testing

`react-permission-kit` is designed to be easily tested with Vitest, Jest, and React Testing Library:

```tsx
import { render, screen } from "@testing-library/react";
import { PermissionProvider, Can } from "react-permission-kit";

test("renders restricted button when user has permission", () => {
  render(
    <PermissionProvider permissions={["settings.edit"]}>
      <Can permission="settings.edit">
        <button>Edit Settings</button>
      </Can>
    </PermissionProvider>
  );

  expect(screen.getByRole("button", { name: "Edit Settings" })).toBeInTheDocument();
});
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to open issues or submit pull requests.

1. Clone the repository: `git clone https://github.com/abhi714/react-permission-kit.git`
2. Install dependencies: `npm install`
3. Run tests: `npm test`
4. Build bundle: `npm run build`

---

## 📄 License

This project is licensed under the [ISC License](LICENSE).
