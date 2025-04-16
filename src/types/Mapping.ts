import { Role } from "./Role";

export interface RolePermissionMapping {
  id: number;
  action: string;
  allowed: boolean;
  createdAt: string;
  updatedAt: string;
  roles: Role[];
}