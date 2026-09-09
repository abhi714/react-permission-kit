export type Permission = string;

export type PermissionMode = "any" | "all";

export interface PermissionContextValue {
    permissions: Permission[];

    hasPermission: (permission: Permission) => boolean;

    hasAnyPermission: (permissions: Permission[]) => boolean;

    hasAllPermissions: (permissions: Permission[]) => boolean;

    checkPermissions: (
        permissions: Permission[],
        mode?: PermissionMode
    ) => boolean;
}