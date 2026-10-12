import { useContext } from "react";

import { PermissionContext } from "../context/PermissionContext";

import type { Permission } from "../types";

export function usePermission(permission: Permission): boolean {
    const context = useContext(PermissionContext);

    if (!context) {
        throw new Error(
            "usePermission must be used inside a PermissionProvider"
        );
    }

    return context.hasPermission(permission);
}