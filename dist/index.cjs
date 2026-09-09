"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  checkPermissions: () => checkPermissions,
  hasAllPermissions: () => hasAllPermissions,
  hasAnyPermission: () => hasAnyPermission,
  hasPermission: () => hasPermission
});
module.exports = __toCommonJS(index_exports);

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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  checkPermissions,
  hasAllPermissions,
  hasAnyPermission,
  hasPermission
});
//# sourceMappingURL=index.cjs.map