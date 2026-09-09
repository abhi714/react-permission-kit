import { createContext } from "react";
import type {
    Permission,
    PermissionContextValue,
} from "../types";

export const PermissionContext =
    createContext<PermissionContextValue | undefined>(undefined);

export interface PermissionProviderProps {
    permissions: Permission[];
    children: React.ReactNode;
}