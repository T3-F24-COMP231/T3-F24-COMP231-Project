import { IUser } from "@/types";

// Define roles and permissions
type Role = 
  | "Finance Tracker"
  | "Debt Repayer"
  | "Financial Expert"
  | "Investor"
  | "Administrator";
type Permission = (typeof ROLES)[Role][number];

const ROLES = {
  "Finance Tracker": [
    "view:income",
    "view:expenses",
    "create:expenses",
    "create:income",
    "update:expenses",
    "update:income",
  ],
  "Debt Repayer": [
    "view:debts",
    "create:debts",
    "update:debts",
    "delete:debts",
  ],
  "Financial Expert": [
    "view:income",
    "view:expenses",
    "view:debts",
    "analyze:finance",
    "create:reports",
  ],
  Investor: [
    "view:investments",
    "create:investments",
    "update:investments",
    "view:finance-summary",
  ],
  Administrator: [
    "view:users",
    "manage:users",
    "view:transactions",
    "manage:transactions",
    "view:all-reports",
  ],
} as const;

// Function to check if the user has a specific permission
export function hasPermission(user: IUser | null, permission: Permission): boolean {
  if (!user || !user.role) return false;
  const rolePermissions = ROLES[user.role as Role] as readonly Permission[];
  return rolePermissions.includes(permission);
}

// Helper function to get all permissions for a specific role
export function getPermissions(role: Role): readonly Permission[] {
  return ROLES[role];
}
