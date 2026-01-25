export type Role = "admin" | "user";

export type Permission =
  | "chat:read"
  | "chat:write"
  | "documents:upload"
  | "documents:read"
  | "admin:manage";

/**
 * Role → permissions mapping
 */
const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  admin: [
    "chat:read",
    "chat:write",
    "documents:upload",
    "documents:read",
    "admin:manage"
  ],
  user: [
    "chat:read",
    "chat:write",
    "documents:upload",
    "documents:read"
  ]
};

/**
 * Check if role has permission
 */
export function hasPermission(
  role: Role,
  permission: Permission
): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

/**
 * Assert permission or throw
 */
export function assertPermission(
  role: Role,
  permission: Permission
) {
  if (!hasPermission(role, permission)) {
    throw new Error("Forbidden");
  }
}
