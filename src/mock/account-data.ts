import type { Permission, SpaceKind, SpacePerm, RoleDef, UserInfo } from '../types/user';

export type { Permission, SpaceKind, SpacePerm, RoleDef, UserInfo };

export const roleDefinitions: RoleDef[] = [
  { key: '1', name: '普通员工', icon: '', description: '产品标准权限，所有成员默认角色', members: 10, spacePermissions: [
    { space: 'personal', label: '个人空间', description: '个人知识库完全自主', permissions: ['read', 'write', 'review'] },
    { space: 'team', label: '团队空间', description: '所在团队知识可读', permissions: ['read'] },
    { space: 'enterprise', label: '企业空间', description: '企业级知识可读', permissions: ['read'] },
  ]},
  { key: '2', name: '团队管理员', icon: '', description: '负责团队知识库的子管理员', members: 6, spacePermissions: [
    { space: 'personal', label: '个人空间', description: '权限同普通员工', permissions: ['read', 'write', 'review'] },
    { space: 'team', label: '团队空间', description: '团队知识可读写审核管理', permissions: ['read', 'write', 'review', 'manage'] },
    { space: 'enterprise', label: '企业空间', description: '企业级知识可读', permissions: ['read'] },
  ]},
  { key: '3', name: '企业管理员', icon: '', description: '全企业最高权限', members: 1, spacePermissions: [
    { space: 'personal', label: '个人空间', description: '权限同普通员工', permissions: ['read', 'write', 'review'] },
    { space: 'team', label: '团队空间', description: '兼任团队管理时 = 团队管理员，否则 = 普通员工', permissions: ['read', 'write', 'review', 'manage'] },
    { space: 'enterprise', label: '企业空间', description: '企业全权限管控', permissions: ['read', 'write', 'review', 'manage', 'admin'] },
  ]},
];

export const allDepts = ['销售部', '生产部', '工程部', '研发中心', '人事部', '财务部'];

export const departmentMembers: UserInfo[] = [
  // 销售部
  { key: '1', name: '张三', dept: '销售部', role: '团队管理员', email: 'zhangsan@company.com', active: '今天' },
  { key: '2', name: '李丽', dept: '销售部', role: '普通员工', email: 'lili@company.com', active: '昨天' },
  { key: '3', name: '赵六', dept: '销售部', role: '普通员工', email: 'zhaoliu@company.com', active: '1 周前' },
  { key: '4', name: '孙芳', dept: '销售部', role: '普通员工', email: 'sunfang@company.com', active: '2 天前' },
  // 生产部
  { key: '5', name: '李四', dept: '生产部', role: '团队管理员', email: 'lisi@company.com', active: '昨天' },
  { key: '6', name: '王五', dept: '生产部', role: '普通员工', email: 'wangwu@company.com', active: '3 天前' },
  { key: '7', name: '周强', dept: '生产部', role: '普通员工', email: 'zhouqiang@company.com', active: '今天' },
  // 工程部
  { key: '8', name: '陈工', dept: '工程部', role: '团队管理员', email: 'chengong@company.com', active: '今天' },
  { key: '9', name: '刘鑫', dept: '工程部', role: '普通员工', email: 'liuxin@company.com', active: '1 天前' },
  { key: '10', name: '黄磊', dept: '工程部', role: '普通员工', email: 'huanglei@company.com', active: '4 天前' },
  // 研发中心
  { key: '11', name: '马伟', dept: '研发中心', role: '团队管理员', email: 'mawei@company.com', active: '昨天' },
  { key: '12', name: '陈七', dept: '研发中心', role: '企业管理员', email: 'chenqi@company.com', active: '今天' },
  { key: '13', name: '杨帆', dept: '研发中心', role: '普通员工', email: 'yangfan@company.com', active: '今天' },
  { key: '14', name: '吴桐', dept: '研发中心', role: '普通员工', email: 'wutong@company.com', active: '2 天前' },
  // 人事部
  { key: '15', name: '赵蕾', dept: '人事部', role: '团队管理员', email: 'zhaolei@company.com', active: '今天' },
  { key: '16', name: '张敏', dept: '人事部', role: '普通员工', email: 'zhangmin@company.com', active: '3 天前' },
  // 财务部
  { key: '17', name: '钱伟', dept: '财务部', role: '团队管理员', email: 'qianwei@company.com', active: '昨天' },
  { key: '18', name: '何婷', dept: '财务部', role: '普通员工', email: 'heting@company.com', active: '1 天前' },
];

import type { AbacRule, AuditLog } from '../types/approval';
export type { AbacRule, AuditLog };

export const abacRules: AbacRule[] = [
  { key: '1', name: '空间隔离规则', condition: '[用户.空间] = [知识.所在空间]', action: '允许读', enabled: true },
  { key: '2', name: '团队空间管理', condition: '[用户.角色] = "团队管理员" 且 [知识.所在空间] = "团队空间"', action: '允许读写', enabled: true },
  { key: '3', name: '张三专项权限', condition: '[用户.名称] = "张三"', action: '允许读写', enabled: true, expire: '2026-06-30' },
  { key: '4', name: '大纲审核权限', condition: '[用户.角色] = "企业管理员" 且 [知识.特征.大纲] = "待审核"', action: '允许读写', enabled: true },
  { key: '5', name: '推送审核保护', condition: '[知识.推送状态] = "待审核" 且 [用户.角色] ≠ "团队管理员" 且 [用户.角色] ≠ "企业管理员"', action: '禁止', enabled: false },
];

export const auditLogs: AuditLog[] = [
  { key: '1', time: '2026-05-22 14:32', operator: '张三', actionType: '知识查看', target: '工艺参数设定规范_v3.pdf', detail: '通过 AI 问答检索并查看文档全文' },
  { key: '2', time: '2026-05-22 14:18', operator: '李四', actionType: '知识审核', target: '高原工况补充说明.docx', detail: '审核通过大纲/词条/Wiki，评分 93/72/88' },
  { key: '3', time: '2026-05-22 13:45', operator: '陈七', actionType: '权限变更', target: '销售部知识库', detail: '为赵六授予销售部知识库读写权限' },
  { key: '4', time: '2026-05-22 12:10', operator: '王五', actionType: '文件上传', target: '设备维护操作手册.docx', detail: '从本地客户端上传至工程部知识库' },
  { key: '5', time: '2026-05-22 11:05', operator: '张三', actionType: '知识创建', target: '销售话术模板_2026Q2.docx', detail: '通过 TipTap 编辑器创建并提交' },
  { key: '6', time: '2026-05-22 10:22', operator: '陈七', actionType: '系统配置', target: '模型配置', detail: '修改 AI 模型 temperature 从 0.3 至 0.5' },
  { key: '7', time: '2026-05-21 17:50', operator: '李四', actionType: '成员管理', target: '生产部', detail: '移除长期未活跃成员（3 人）' },
  { key: '8', time: '2026-05-21 15:30', operator: '赵六', actionType: '知识发布', target: 'XX产品竞品分析报告', detail: '全部 9 项特征审核通过，自动发布' },
  { key: '9', time: '2026-05-21 14:12', operator: '张三', actionType: '文件下载', target: '安全生产管理制度汇编.pdf', detail: '下载 PDF 原文件至本地' },
  { key: '10', time: '2026-05-21 10:08', operator: '陈七', actionType: 'ABAC 规则变更', target: '机密文档访问规则', detail: '新增规则：机密文档仅企业管理员可读' },
];
