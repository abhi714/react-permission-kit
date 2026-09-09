export type Permission = string;

export type PermissionMode = "any" | "all";

export interface PermissionCheckOptions {
    mode?: PermissionMode;
}