export type Permission = 'read' | 'write' | 'review' | 'manage' | 'admin';
export type SpaceKind = 'personal' | 'team' | 'enterprise';

export interface SpacePerm {
  space: SpaceKind;
  label: string;
  description: string;
  permissions: Permission[];
}

export interface RoleDef {
  key: string;
  name: string;
  icon: string;
  description: string;
  members: number;
  spacePermissions: SpacePerm[];
}

export interface UserInfo {
  key: string;
  name: string;
  dept: string;
  role: string;
  email: string;
  active: string;
}
