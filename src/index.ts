export {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    checkPermissions,
} from "./core/permission";

export {
    PermissionProvider,
} from "./context/PermissionProvider";

export {
    usePermission,
} from "./hooks/usePermission";

export {
    usePermissions,
} from "./hooks/usePermissions";

export {
    Can,
} from "./components/Can";

export type {
    Permission,
    PermissionMode,
    PermissionContextValue,
} from "./types";

export type {
    PermissionProviderProps,
} from "./context/PermissionProvider";

export type {
    CanProps,
} from "./components/Can";