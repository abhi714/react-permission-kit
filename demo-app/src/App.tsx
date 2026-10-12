import { useState, useTransition } from "react";
import {
  PermissionProvider,
  Can,
  usePermission,
  usePermissions,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
} from "react-permission-kit";

import usersData from "./data/users.json";
import type { User } from "./types";
import "./App.css";

const ALL_AVAILABLE_PERMISSIONS = [
  "users.view",
  "users.create",
  "users.edit",
  "users.delete",
  "reports.view",
  "reports.export",
  "billing.manage",
  "settings.edit",
];

// Inner component that exercises usePermission and usePermissions hooks
function PermissionsHooksDemo() {
  const [feedback, setFeedback] = useState<string | null>(null);

  const canDeleteUser = usePermission("users.delete");
  const canExportOrBill = usePermissions(["reports.export", "billing.manage"], "any");
  const canFullAdmin = usePermissions(["settings.edit", "billing.manage"], "all");

  const handleDeleteClick = () => {
    if (!canDeleteUser) {
      setFeedback("❌ Blocked: You do not have 'users.delete' permission!");
      return;
    }
    setFeedback("✅ Allowed: User deletion procedure executed!");
  };

  const handleExportClick = () => {
    if (!canExportOrBill) {
      setFeedback("❌ Blocked: Requires 'reports.export' OR 'billing.manage'!");
      return;
    }
    setFeedback("✅ Allowed: Export data generation completed!");
  };

  return (
    <div className="test-card">
      <span className="card-badge badge-hook">Imperative Hooks</span>
      <h3>Hooks: usePermission & usePermissions</h3>
      <p className="description">
        Tests procedural checks in event handlers and conditional button disabling.
      </p>

      <div className="card-content">
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "12px" }}>
          <button
            className="action-btn btn-danger"
            onClick={handleDeleteClick}
            disabled={!canDeleteUser}
          >
            {canDeleteUser ? "🗑️ Delete Record (Active)" : "🔒 Delete (Disabled)"}
          </button>

          <button
            className="action-btn btn-secondary"
            onClick={handleExportClick}
            disabled={!canExportOrBill}
          >
            {canExportOrBill ? "📊 Export (Active)" : "🔒 Export (Disabled)"}
          </button>
        </div>

        <div style={{ fontSize: "0.82rem", color: "#94a3b8" }}>
          Admin Status (<code>settings.edit</code> &amp; <code>billing.manage</code>):{" "}
          <strong style={{ color: canFullAdmin ? "#4ade80" : "#f87171" }}>
            {canFullAdmin ? "Full Admin Granted" : "Restricted"}
          </strong>
        </div>

        {feedback && <div className="toast">{feedback}</div>}
      </div>
    </div>
  );
}

// Inner component testing pure core functions
function PureUtilitiesTable({ permissions }: { permissions: string[] }) {
  const testCases = [
    {
      name: "hasPermission('users.view')",
      result: hasPermission(permissions, "users.view"),
    },
    {
      name: "hasPermission('users.delete')",
      result: hasPermission(permissions, "users.delete"),
    },
    {
      name: "hasAnyPermission(['reports.export', 'billing.manage'])",
      result: hasAnyPermission(permissions, ["reports.export", "billing.manage"]),
    },
    {
      name: "hasAllPermissions(['settings.edit', 'billing.manage'])",
      result: hasAllPermissions(permissions, ["settings.edit", "billing.manage"]),
    },
  ];

  return (
    <div className="test-card">
      <span className="card-badge badge-util">Stateless Core</span>
      <h3>Pure Helper Functions</h3>
      <p className="description">
        Evaluated outside React context (usable in server loaders, API routes, or middleware).
      </p>

      <div className="card-content">
        <table className="eval-table">
          <thead>
            <tr>
              <th>Pure Utility Call</th>
              <th>Evaluation</th>
            </tr>
          </thead>
          <tbody>
            {testCases.map((tc, idx) => (
              <tr key={idx}>
                <td><code>{tc.name}</code></td>
                <td>
                  <span className={tc.result ? "status-true" : "status-false"}>
                    {tc.result ? "true" : "false"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function App() {
  const users = usersData as User[];
  const [currentUser, setCurrentUser] = useState<User | null>(users[0]);
  const [permissions, setPermissions] = useState<string[]>(users[0].permissions);
  const [, startTransition] = useTransition();
  const [simulatedApiDelay, setSimulatedApiDelay] = useState(false);

  // Simulates an API call when selecting a user
  const handleSelectUser = (user: User | null) => {
    setSimulatedApiDelay(true);
    setTimeout(() => {
      startTransition(() => {
        setCurrentUser(user);
        setPermissions(user ? [...user.permissions] : []);
        setSimulatedApiDelay(false);
      });
    }, 200);
  };

  // Live toggle of individual permissions to test reactivity
  const handleTogglePermission = (perm: string) => {
    setPermissions((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    );
  };

  return (
    <div className="demo-container">
      {/* Header */}
      <header className="header">
        <h1>🛡️ react-permission-kit Playground</h1>
        <p>
          Testing role-based access control with live credentials, dynamic API response simulation, &amp; interactive guards.
        </p>
      </header>

      {/* User Switcher Bar */}
      <div className="user-switcher-card">
        <div className="user-switcher-title">
          <span>👥 Switch Authenticated User (From users.json)</span>
          {simulatedApiDelay && <span style={{ color: "#38bdf8" }}>⏳ Simulating API fetch...</span>}
        </div>

        <div className="user-buttons">
          {users.map((u) => {
            const isSelected = currentUser?.id === u.id;
            return (
              <button
                key={u.id}
                className={`user-btn ${isSelected ? "active" : ""}`}
                onClick={() => handleSelectUser(u)}
              >
                <span>{u.avatar}</span>
                <span>{u.name}</span>
                <span style={{ opacity: 0.7, fontSize: "0.78rem" }}>({u.role})</span>
              </button>
            );
          })}

          <button
            className="user-btn logout-btn"
            onClick={() => handleSelectUser(null)}
          >
            🚪 Logout (Empty Perms)
          </button>
        </div>
      </div>

      {/* Active User Information Banner */}
      <div className="active-user-banner">
        <div className="user-avatar">{currentUser ? currentUser.avatar : "🔒"}</div>
        <div className="user-meta">
          <h3>
            {currentUser ? currentUser.name : "Logged Out / Anonymous Guest"}
          </h3>
          <p>
            {currentUser
              ? `Email: ${currentUser.email} | Role: ${currentUser.role}`
              : "No user authenticated. Permissions array is empty: []"}
          </p>
          <div className="permissions-pills">
            <strong style={{ fontSize: "0.82rem", marginRight: "4px" }}>
              Active Permissions:
            </strong>
            {permissions.length > 0 ? (
              permissions.map((p) => (
                <span key={p} className="perm-pill">
                  {p}
                </span>
              ))
            ) : (
              <span className="perm-pill empty">None (Empty Array [])</span>
            )}
          </div>
        </div>
      </div>

      {/* Real-time Permission Toggler */}
      <div className="live-permission-toggle">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <strong style={{ fontSize: "0.92rem", color: "#e2e8f0" }}>
            ⚡ Live Permission Matrix (Toggle checkboxes to see instant UI reactivity):
          </strong>
          <span style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
            {permissions.length} of {ALL_AVAILABLE_PERMISSIONS.length} granted
          </span>
        </div>

        <div className="live-toggle-grid">
          {ALL_AVAILABLE_PERMISSIONS.map((perm) => (
            <label key={perm} className="toggle-label">
              <input
                type="checkbox"
                checked={permissions.includes(perm)}
                onChange={() => handleTogglePermission(perm)}
              />
              <span>{perm}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Main Testing Grid wrapped in PermissionProvider */}
      <PermissionProvider permissions={permissions}>
        <div className="testing-grid">
          {/* Card 1: Single Permission Check */}
          <div className="test-card">
            <span className="card-badge badge-single">Single Permission</span>
            <h3>&lt;Can permission="users.edit"&gt;</h3>
            <p className="description">
              Renders content if the user has <code>users.edit</code>. Hides without fallback if missing.
            </p>

            <div className="card-content">
              <Can permission="users.edit">
                <div className="granted-box">
                  ✅ <strong>Allowed:</strong> You can edit user profiles and update information.
                  <div style={{ marginTop: "8px" }}>
                    <button className="action-btn btn-primary">✏️ Edit Profile</button>
                  </div>
                </div>
              </Can>

              <Can
                permission="users.edit"
                fallback={
                  <div className="fallback-box">
                    🔒 <strong>Hidden:</strong> User edit form is not accessible.
                  </div>
                }
              >
                {null}
              </Can>
            </div>
          </div>

          {/* Card 2: Single Permission with Explicit Fallback */}
          <div className="test-card">
            <span className="card-badge badge-single">With Fallback</span>
            <h3>&lt;Can permission="users.delete" fallback=...&gt;</h3>
            <p className="description">
              Tests dangerous action with a custom <code>fallback</code> element shown when access is denied.
            </p>

            <div className="card-content">
              <Can
                permission="users.delete"
                fallback={
                  <div className="fallback-box">
                    ⛔ <strong>Access Denied:</strong> Requires <code>users.delete</code> permission.
                  </div>
                }
              >
                <div className="granted-box">
                  ✅ <strong>Allowed:</strong> You have permission to delete records.
                  <div style={{ marginTop: "8px" }}>
                    <button className="action-btn btn-danger">🗑️ Delete User</button>
                  </div>
                </div>
              </Can>
            </div>
          </div>

          {/* Card 3: Multi-permission with mode="any" */}
          <div className="test-card">
            <span className="card-badge badge-any">Mode: Any (OR)</span>
            <h3>&lt;Can permissions=[...] mode="any"&gt;</h3>
            <p className="description">
              Requires <strong>at least one</strong> of: <code>reports.export</code> OR <code>billing.manage</code>.
            </p>

            <div className="card-content">
              <Can
                permissions={["reports.export", "billing.manage"]}
                mode="any"
                fallback={
                  <div className="fallback-box">
                    🔒 <strong>Locked:</strong> You need either reports export OR billing manage.
                  </div>
                }
              >
                <div className="granted-box">
                  ✅ <strong>Access Granted (OR Match):</strong> Reports or Billing portal accessible.
                  <div style={{ marginTop: "8px" }}>
                    <button className="action-btn btn-secondary">📈 Open Analytics Portal</button>
                  </div>
                </div>
              </Can>
            </div>
          </div>

          {/* Card 4: Multi-permission with mode="all" */}
          <div className="test-card">
            <span className="card-badge badge-all">Mode: All (AND)</span>
            <h3>&lt;Can permissions=[...] mode="all"&gt;</h3>
            <p className="description">
              Requires <strong>ALL</strong> of: <code>settings.edit</code> AND <code>billing.manage</code>.
            </p>

            <div className="card-content">
              <Can
                permissions={["settings.edit", "billing.manage"]}
                mode="all"
                fallback={
                  <div className="fallback-box">
                    🔒 <strong>Locked:</strong> Missing one or both required admin permissions.
                  </div>
                }
              >
                <div className="granted-box">
                  ✅ <strong>Super Admin Granted (AND Match):</strong> Full billing &amp; system settings console.
                  <div style={{ marginTop: "8px" }}>
                    <button className="action-btn btn-primary">⚙️ System Console</button>
                  </div>
                </div>
              </Can>
            </div>
          </div>

          {/* Card 5: Imperative Hooks Demo */}
          <PermissionsHooksDemo />

          {/* Card 6: Pure Core Utilities Demo */}
          <PureUtilitiesTable permissions={permissions} />
        </div>
      </PermissionProvider>
    </div>
  );
}

export default App;
