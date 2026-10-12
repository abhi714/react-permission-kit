import { useContext } from "react";

import { PermissionContext } from "../context/PermissionContext";

import type {
    Permission,
    PermissionMode,
} from "../types";

export function usePermissions(
    permissions: Permission[],
    mode: PermissionMode = "all"
): boolean {
    const context = useContext(PermissionContext);

    if (!context) {
        throw new Error(
            "usePermissions must be used inside a PermissionProvider"
        );
    }

    return context.checkPermissions(permissions, mode);
}