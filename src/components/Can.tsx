import type { ReactNode } from "react";

import { usePermissions } from "../hooks/usePermissions";

import type {
    Permission,
    PermissionMode,
} from "../types";

export interface CanProps {
    permission?: Permission;
    permissions?: Permission[];
    mode?: PermissionMode;
    children: ReactNode;
    fallback?: ReactNode;
}

export function Can({
    permission,
    permissions = [],
    mode = "all",
    children,
    fallback = null,
}: CanProps) {
    const requiredPermissions = permission
        ? [permission]
        : permissions;

    const allowed =
        requiredPermissions.length > 0 &&
        usePermissions(requiredPermissions, mode);

    return allowed ? children : fallback;
}