import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import {
    PermissionProvider,
} from "../src/context/PermissionProvider";

import { usePermission } from "../src/hooks/usePermission";
import { usePermissions } from "../src/hooks/usePermissions";

function PermissionTestComponent() {
    const canView = usePermission("user.view");
    const canDelete = usePermission("user.delete");

    const canEditAndView = usePermissions(
        ["user.view", "user.edit"],
        "all"
    );

    const canDeleteOrEdit = usePermissions(
        ["user.delete", "user.edit"],
        "any"
    );

    return (
        <div>
            <div data-testid="can-view">
                {canView ? "true" : "false"}
            </div>

            <div data-testid="can-delete">
                {canDelete ? "true" : "false"}
            </div>

            <div data-testid="can-edit-and-view">
                {canEditAndView ? "true" : "false"}
            </div>

            <div data-testid="can-delete-or-edit">
                {canDeleteOrEdit ? "true" : "false"}
            </div>
        </div>
    );
}

describe("Permission Hooks", () => {
    it("checks a single permission", () => {
        render(
            <PermissionProvider
                permissions={[
                    "user.view",
                    "user.edit",
                ]}
            >
                <PermissionTestComponent />
            </PermissionProvider>
        );

        expect(
            screen.getByTestId("can-view")
        ).toHaveTextContent("true");

        expect(
            screen.getByTestId("can-delete")
        ).toHaveTextContent("false");
    });

    it("checks multiple permissions using all mode", () => {
        render(
            <PermissionProvider
                permissions={[
                    "user.view",
                    "user.edit",
                ]}
            >
                <PermissionTestComponent />
            </PermissionProvider>
        );

        expect(
            screen.getByTestId("can-edit-and-view")
        ).toHaveTextContent("true");
    });

    it("checks multiple permissions using any mode", () => {
        render(
            <PermissionProvider
                permissions={[
                    "user.view",
                    "user.edit",
                ]}
            >
                <PermissionTestComponent />
            </PermissionProvider>
        );

        expect(
            screen.getByTestId("can-delete-or-edit")
        ).toHaveTextContent("true");
    });

    it("throws an error when usePermission is used outside the provider", () => {
        expect(() => {
            render(<PermissionTestComponent />);
        }).toThrow(
            "usePermission must be used inside a PermissionProvider"
        );
    });
});