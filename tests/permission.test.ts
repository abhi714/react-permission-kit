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
        "user.edit",
    ];

    describe("hasPermission", () => {
        it("returns true when the user has the permission", () => {
            expect(
                hasPermission(permissions, "user.view")
            ).toBe(true);
        });

        it("returns false when the user does not have the permission", () => {
            expect(
                hasPermission(permissions, "user.delete")
            ).toBe(false);
        });
    });

    describe("hasAnyPermission", () => {
        it("returns true when the user has at least one required permission", () => {
            expect(
                hasAnyPermission(permissions, [
                    "user.delete",
                    "user.edit",
                ])
            ).toBe(true);
        });

        it("returns false when the user has none of the required permissions", () => {
            expect(
                hasAnyPermission(permissions, [
                    "user.delete",
                    "user.export",
                ])
            ).toBe(false);
        });

        it("returns true for an empty required permission list", () => {
            expect(
                hasAnyPermission(permissions, [])
            ).toBe(false);
        });
    });

    describe("hasAllPermissions", () => {
        it("returns true when the user has all required permissions", () => {
            expect(
                hasAllPermissions(permissions, [
                    "user.view",
                    "user.edit",
                ])
            ).toBe(true);
        });

        it("returns false when the user is missing a required permission", () => {
            expect(
                hasAllPermissions(permissions, [
                    "user.view",
                    "user.delete",
                ])
            ).toBe(false);
        });

        it("returns true for an empty required permission list", () => {
            expect(
                hasAllPermissions(permissions, [])
            ).toBe(true);
        });
    });

    describe("checkPermissions", () => {
        it("uses all mode by default", () => {
            expect(
                checkPermissions(permissions, [
                    "user.view",
                    "user.edit",
                ])
            ).toBe(true);

            expect(
                checkPermissions(permissions, [
                    "user.view",
                    "user.delete",
                ])
            ).toBe(false);
        });

        it("supports any mode", () => {
            expect(
                checkPermissions(
                    permissions,
                    ["user.delete", "user.edit"],
                    "any"
                )
            ).toBe(true);

            expect(
                checkPermissions(
                    permissions,
                    ["user.delete", "user.export"],
                    "any"
                )
            ).toBe(false);
        });

        it("returns true when no permissions are required", () => {
            expect(
                checkPermissions(permissions, [])
            ).toBe(true);
        });
    });
});