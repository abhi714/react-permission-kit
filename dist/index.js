// src/core/permission.ts
function hasPermission(permissions, permission) {
  return permissions.includes(permission);
}
function hasAnyPermission(permissions, requiredPermissions) {
  return requiredPermissions.some(
    (permission) => permissions.includes(permission)
  );
}
function hasAllPermissions(permissions, requiredPermissions) {
  return requiredPermissions.every(
    (permission) => permissions.includes(permission)
  );
}
function checkPermissions(permissions, requiredPermissions, mode = "all") {
  if (requiredPermissions.length === 0) {
    return true;
  }
  if (mode === "any") {
    return hasAnyPermission(
      permissions,
      requiredPermissions
    );
  }
  return hasAllPermissions(
    permissions,
    requiredPermissions
  );
}
export {
  checkPermissions,
  hasAllPermissions,
  hasAnyPermission,
  hasPermission
};
//# sourceMappingURL=index.js.map