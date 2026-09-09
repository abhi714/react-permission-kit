import type {
    Permission,
    PermissionMode,
} from "../types";

export function hasPermission(
    permissions: Permission[],
    permission: Permission
): boolean {
    return permissions.includes(permission);
}

export function hasAnyPermission(
    permissions: Permission[],
    requiredPermissions: Permission[]
): boolean {
    return requiredPermissions.some((permission) =>
        permissions.includes(permission)
    );
}

export function hasAllPermissions(
    permissions: Permission[],
    requiredPermissions: Permission[]
): boolean {
    return requiredPermissions.every((permission) =>
        permissions.includes(permission)
    );
}

export function checkPermissions(
    permissions: Permission[],
    requiredPermissions: Permission[],
    mode: PermissionMode = "all"
): boolean {
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