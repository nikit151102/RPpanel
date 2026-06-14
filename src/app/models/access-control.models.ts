export interface User {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  isActive: boolean;
  isSuperuser: boolean;
  roles: Role[];
  groups: Group[];
  lastLogin?: string;
  createdAt: string;
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  parentRoleId?: string;
  users: User[];
  permissions: Permission[];
  microfrontends: Microfrontend[];
  parent?: Role;
  children: Role[];
}

export interface Permission {
  id: string;
  name: string;
  description?: string;
  scope?: string;
  actions: Action[];
  roles: Role[];
  microfrontends: Microfrontend[];
}

export interface Action {
  id: string;
  name: string; // 'read', 'create', 'update', 'delete'
}

export interface Microfrontend {
  id: string;
  name: string;
  url: string;
  route?: string;
  isActive: boolean;
  priority: number;
  roles: Role[];
  permissions: Permission[];
  tabs: MicrofrontendTab[];
}

export interface MicrofrontendTab {
  id: string;
  microfrontendId: string;
  parentId?: string;
  name: string;
  route?: string;
  order: number;
  isActive: boolean;
  permissions: Permission[];
  microfrontend?: Microfrontend;
  parent?: MicrofrontendTab;
  children: MicrofrontendTab[];
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  users: User[];
}

// DTOs for forms
export interface CreateRoleDto {
  name: string;
  description?: string;
  parentRoleId?: string;
  permissionIds: string[];
}

export interface CreatePermissionDto {
  name: string;
  description?: string;
  scope?: string;
  actionIds: string[];
}

export interface AssignPermissionsDto {
  roleId: string;
  permissionIds: string[];
}

export interface UserRoleAssignmentDto {
  userId: string;
  roleIds: string[];
}