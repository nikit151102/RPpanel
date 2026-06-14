import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../../evirement';

export interface Role {
  id: string;
  name: string;
  description: string;
  parent_role_id?: string | null;
}

export interface Action {
  id: string;
  name: string;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  scope: string;
  action_ids: string[];
}

export interface Microfrontend {
  id: string;
  name: string;
  url: string;
  route: string;
  is_active: boolean;
  priority: number;
}

export interface Tab {
  id: string;
  name: string;
  route?: string;
  order: number;
  is_active: boolean;
  parent_id?: string;
  microfrontend_id: string;
}

@Injectable({
  providedIn: 'root'
})
export class AccessService {
  private apiUrl = environment.apiAuthHubUrl;

  constructor(private http: HttpClient) { }

  // Roles
  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.apiUrl}/roles/`);
  }

  createRole(role: Omit<Role, 'id'>): Observable<Role> {
    return this.http.post<Role>(`${this.apiUrl}/roles/`, role);
  }

  updateRole(roleId: string, role: Omit<Role, 'id'>): Observable<Role> {
    return this.http.put<Role>(`${this.apiUrl}/roles/${roleId}`, role);
  }

  deleteRole(roleId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/roles/${roleId}`);
  }

  assignRoleToUser(roleId: string, iserId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/users/${iserId}/roles/${roleId}`, {});
  }

  removeRoleToUser(roleId: string, iserId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/users/${iserId}/roles/${roleId}`);
  }
  
  assignPermissionToRole(roleId: string, permissionId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/roles/${roleId}/permissions/${permissionId}`, {});
  }

  removePermissionFromRole(roleId: string, permissionId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/roles/${roleId}/permissions/${permissionId}`);
  }

  

  // Actions
  getActions(): Observable<Action[]> {
    return this.http.post<Action[]>(`${this.apiUrl}/actions/Filter`, {});
  }

  createAction(action: { name: string }): Observable<Action> {
    return this.http.post<Action>(`${this.apiUrl}/actions/`, action);
  }

  updateAction(actionId: string, action: { name: string }): Observable<Action> {
    return this.http.put<Action>(`${this.apiUrl}/actions/${actionId}`, action);
  }

  deleteAction(actionId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/actions/${actionId}`);
  }

  // Permissions
  getPermissions(): Observable<Permission[]> {
    return this.http.get<Permission[]>(`${this.apiUrl}/permissions/`);
  }

  createPermission(permission: Omit<Permission, 'id'>): Observable<Permission> {
    return this.http.post<Permission>(`${this.apiUrl}/permissions/`, permission);
  }

  updatePermission(permissionId: string, permission: Omit<Permission, 'id'>): Observable<Permission> {
    return this.http.put<Permission>(`${this.apiUrl}/permissions/${permissionId}`, permission);
  }

  deletePermission(permissionId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/permissions/${permissionId}`);
  }

  // Microfrontends
  getMicrofrontends(): Observable<Microfrontend[]> {
    return this.http.get<Microfrontend[]>(`${this.apiUrl}/microfrontends/`);
  }

  createMicrofrontend(microfrontend: Omit<Microfrontend, 'id'>): Observable<Microfrontend> {
    return this.http.post<Microfrontend>(`${this.apiUrl}/microfrontends/`, microfrontend);
  }

  updateMicrofrontend(microfrontendId: string, microfrontend: Omit<Microfrontend, 'id'>): Observable<Microfrontend> {
    return this.http.put<Microfrontend>(`${this.apiUrl}/microfrontends/${microfrontendId}`, microfrontend);
  }

  deleteMicrofrontend(microfrontendId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/microfrontends/${microfrontendId}`);
  }

  assignPermissionToMicrofrontend(microfrontendId: string, permissionIds: string[]): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/microfrontends/${microfrontendId}/permissions`, { permission_ids: permissionIds });
  }

  removePermissionFromMicrofrontend(microfrontendId: string, permissionId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/microfrontends/${microfrontendId}/permissions/${permissionId}`);
  }

  assignRoleToMicrofrontend(microfrontendId: string, roleId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/microfrontends/${microfrontendId}/roles/${roleId}`, {});
  }

  removeRoleFromMicrofrontend(microfrontendId: string, roleId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/microfrontends/${microfrontendId}/roles/${roleId}`);
  }

  getMicrofrontendRoles(microfrontendId: string): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.apiUrl}/microfrontends/${microfrontendId}/roles`);
  }

  // Tabs
  getMicrofrontendTabs(microfrontendId: string): Observable<Tab[]> {
    return this.http.get<Tab[]>(`${this.apiUrl}/microfrontends/${microfrontendId}/tabs`);
  }

  getTab(tabId: string): Observable<Tab> {
    return this.http.get<Tab>(`${this.apiUrl}/microfrontends/tabs/${tabId}`);
  }

  createTab(microfrontendId: string, tab: { name: string; parent_id?: string; route?: string; order?: number }): Observable<Tab> {
    const params: any = { name: tab.name };
    if (tab.parent_id) params.parent_id = tab.parent_id;
    if (tab.route) params.route = tab.route;
    if (tab.order) params.order = tab.order;

    return this.http.post<Tab>(`${this.apiUrl}/microfrontends/${microfrontendId}/tabs`, null, { params });
  }

  updateTab(tabId: string, tab: { name?: string; route?: string; order?: number; is_active?: boolean; parent_id?: string }): Observable<Tab> {
    return this.http.put<Tab>(`${this.apiUrl}/microfrontends/tabs/${tabId}`, null, { params: tab });
  }

  deleteTab(tabId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/microfrontends/tabs/${tabId}`);
  }

  assignPermissionsToTab(tabId: string, permissionIds: string[]): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/microfrontends/tabs/${tabId}/permissions`, { permission_ids: permissionIds });
  }

  removePermissionsFromTab(tabId: string, permissionIds: string[]): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/microfrontends/tabs/${tabId}/permissions`, { body: { permission_ids: permissionIds } });
  }
}
