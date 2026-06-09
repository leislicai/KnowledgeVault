export interface AbacRule {
  key: string;
  name: string;
  condition: string;
  action: '允许读' | '允许读写' | '禁止';
  enabled: boolean;
  expire?: string;
}

export interface AuditLog {
  key: string;
  time: string;
  operator: string;
  actionType: string;
  target: string;
  detail: string;
}
