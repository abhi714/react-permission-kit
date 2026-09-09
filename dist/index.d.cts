type Permission = string;
type PermissionMode = "any" | "all";
interface PermissionCheckOptions {
    mode?: PermissionMode;
}

declare function hasPermission(permissions: Permission[], permission: Permission): boolean;
declare function hasAnyPermission(permissions: Permission[], requiredPermissions: Permission[]): boolean;
declare function hasAllPermissions(permissions: Permission[], requiredPermissions: Permission[]): boolean;
declare function checkPermissions(permissions: Permission[], requiredPermissions: Permission[], mode?: PermissionMode): boolean;

export { type Permission, type PermissionCheckOptions, type PermissionMode, checkPermissions, hasAllPermissions, hasAnyPermission, hasPermission };
