import type { UserInfo, RoleDef } from '../types';
import { departmentMembers, roleDefinitions } from '../mock/account-data';

// ---- 成员管理 ----

export async function fetchMembers(params?: { dept?: string; role?: string }): Promise<UserInfo[]> {
  // TODO: GET /api/users
  let result = departmentMembers;
  if (params?.dept) result = result.filter(m => m.dept === params.dept);
  if (params?.role) result = result.filter(m => m.role === params.role);
  return result;
}

export async function addMember(member: Omit<UserInfo, 'key'>): Promise<UserInfo> {
  // TODO: POST /api/users
  return { key: 'm' + Date.now(), ...member, active: '刚刚' };
}

export async function removeMember(_id: string): Promise<void> {
  // TODO: DELETE /api/users/:id
}

// ---- 角色 ----

export async function fetchRoles(): Promise<RoleDef[]> {
  // TODO: GET /api/roles
  return roleDefinitions;
}
