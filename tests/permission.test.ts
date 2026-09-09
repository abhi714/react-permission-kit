import { describe, expect, it } from "vitest";

import {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    checkPermissions,
} from "../src/core/permission";

describe("Permission Engine", () => {
    const permissions = [
        "user.view",
        "user.create",
        "report.view",
    ];

    describe("hasPermission", () => {
        it("returns true when permission exists", () => {
            expect(
                hasPermission(permissions, "user.view")
            ).toBe(true);
        });

        it("returns false when permission does not exist", () => {
            expect(
                hasPermission(permissions, "user.delete")
            ).toBe(false);
        });
    });

    describe("hasAnyPermission", () => {
        it("returns true when at least one permission exists", () => {
            expect(
                hasAnyPermission(
                    permissions,
                    ["user.delete", "user.create"]
                )
            ).toBe(true);
        });

        it("returns false when none of the permissions exist", () => {
            expect(
                hasAnyPermission(
                    permissions,
                    ["user.delete", "report.delete"]
                )
            ).toBe(false);
        });
    });

    describe("hasAllPermissions", () => {
        it("returns true when all permissions exist", () => {
            expect(
                hasAllPermissions(
                    permissions,
                    ["user.view", "user.create"]
                )
            ).toBe(true);
        });

        it("returns false when one permission is missing", () => {
            expect(
                hasAllPermissions(
                    permissions,
                    ["user.view", "user.delete"]
                )
            ).toBe(false);
        });
    });

    describe("checkPermissions", () => {
        it("uses all mode by default", () => {
            expect(
                checkPermissions(
                    permissions,
                    ["user.view", "user.create"]
                )
            ).toBe(true);
        });

        it("supports any mode", () => {
            expect(
                checkPermissions(
                    permissions,
                    ["user.delete", "user.create"],
                    "any"
                )
            ).toBe(true);
        });

        it("supports all mode", () => {
            expect(
                checkPermissions(
                    permissions,
                    ["user.delete", "user.create"],
                    "all"
                )
            ).toBe(false);
        });
    });
});