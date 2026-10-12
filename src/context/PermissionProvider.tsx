import { useMemo } from "react";
import type { ReactNode } from "react";

import {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    checkPermissions,
} from "../core/permission";

import { PermissionContext } from "./PermissionContext";

import type {
    Permission,
    PermissionMode,
    PermissionContextValue,
} from "../types";

export interface PermissionProviderProps {
    permissions: Permission[];
    children: ReactNode;
}

export function PermissionProvider({
    permissions,
    children,
}: PermissionProviderProps) {
    const value = useMemo<PermissionContextValue>(() => {
        return {
            permissions,

            hasPermission: (permission: Permission) =>
                hasPermission(permissions, permission),

            hasAnyPermission: (requiredPermissions: Permission[]) =>
                hasAnyPermission(permissions, requiredPermissions),

            hasAllPermissions: (requiredPermissions: Permission[]) =>
                hasAllPermissions(permissions, requiredPermissions),

            checkPermissions: (
                requiredPermissions: Permission[],
                mode: PermissionMode = "all"
            ) =>
                checkPermissions(
                    permissions,
                    requiredPermissions,
                    mode
                ),
        };
    }, [permissions]);

    return (
        <PermissionContext.Provider value={value}>
            {children}
        </PermissionContext.Provider>
    );
}