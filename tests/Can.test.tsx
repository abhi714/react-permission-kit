import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { PermissionProvider } from "../src/context/PermissionProvider";
import { Can } from "../src/components/Can";

describe("<Can />", () => {
    it("renders children when the user has the permission", () => {
        render(
            <PermissionProvider permissions={["user.view"]}>
                <Can permission="user.view">
                    <button>View User</button>
                </Can>
            </PermissionProvider>
        );

        expect(
            screen.getByRole("button", {
                name: "View User",
            })
        ).toBeInTheDocument();
    });

    it("does not render children when the user does not have the permission", () => {
        render(
            <PermissionProvider permissions={["user.view"]}>
                <Can permission="user.delete">
                    <button>Delete User</button>
                </Can>
            </PermissionProvider>
        );

        expect(
            screen.queryByRole("button", {
                name: "Delete User",
            })
        ).not.toBeInTheDocument();
    });

    it("renders fallback when permission is denied", () => {
        render(
            <PermissionProvider permissions={["user.view"]}>
                <Can
                    permission="user.delete"
                    fallback={<span>Access denied</span>}
                >
                    <button>Delete User</button>
                </Can>
            </PermissionProvider>
        );

        expect(
            screen.getByText("Access denied")
        ).toBeInTheDocument();

        expect(
            screen.queryByRole("button", {
                name: "Delete User",
            })
        ).not.toBeInTheDocument();
    });

    it("renders children when using any mode", () => {
        render(
            <PermissionProvider
                permissions={[
                    "user.view",
                    "user.edit",
                ]}
            >
                <Can
                    permissions={[
                        "user.delete",
                        "user.edit",
                    ]}
                    mode="any"
                >
                    <button>Manage User</button>
                </Can>
            </PermissionProvider>
        );

        expect(
            screen.getByRole("button", {
                name: "Manage User",
            })
        ).toBeInTheDocument();
    });

    it("does not render children when all permissions are not available", () => {
        render(
            <PermissionProvider
                permissions={[
                    "user.view",
                    "user.edit",
                ]}
            >
                <Can
                    permissions={[
                        "user.view",
                        "user.delete",
                    ]}
                    mode="all"
                >
                    <button>Manage User</button>
                </Can>
            </PermissionProvider>
        );

        expect(
            screen.queryByRole("button", {
                name: "Manage User",
            })
        ).not.toBeInTheDocument();
    });

    it("supports a single permission through permission prop", () => {
        render(
            <PermissionProvider permissions={["user.create"]}>
                <Can permission="user.create">
                    <span>Create allowed</span>
                </Can>
            </PermissionProvider>
        );

        expect(
            screen.getByText("Create allowed")
        ).toBeInTheDocument();
    });

    it("does not render children when no permission is provided", () => {
        render(
            <PermissionProvider permissions={["user.view"]}>
                <Can>
                    <button>Restricted Action</button>
                </Can>
            </PermissionProvider>
        );

        expect(
            screen.queryByRole("button", {
                name: "Restricted Action",
            })
        ).not.toBeInTheDocument();
    });

    it("renders fallback when no permission is provided", () => {
        render(
            <PermissionProvider permissions={["user.view"]}>
                <Can fallback={<span>Access denied</span>}>
                    <button>Restricted Action</button>
                </Can>
            </PermissionProvider>
        );

        expect(
            screen.getByText("Access denied")
        ).toBeInTheDocument();

        expect(
            screen.queryByRole("button", {
                name: "Restricted Action",
            })
        ).not.toBeInTheDocument();
    });
});