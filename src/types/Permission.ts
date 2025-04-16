import { Role } from './Role';

export interface Permission {
    id: number;
    action: string;
    allowed: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface RolePermission {
    permission: Permission;
    permissionId: number;
    role: Role;
    roleId: number;
}