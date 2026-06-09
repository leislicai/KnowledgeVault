import { useState } from 'react';
import dayjs from 'dayjs';
import { Card, Table, Tag, Button, Typography, Space, Row, Col, Input, Menu, Layout, Modal, Switch, Slider, Select, DatePicker } from 'antd';
import { roleDefinitions, departmentMembers, abacRules, auditLogs, allDepts } from '../mock/account-data';
import type { AbacRule } from '../mock/account-data';

const { Text, Title } = Typography;

const sideMenuItems = [
  { key: 'rbac', label: ' RBAC 规则' },
  { key: 'abac', label: ' ABAC 规则' },
  { key: 'members', label: ' 成员列表' },
  { key: 'model', label: ' 模型配置' },
  { key: 'audit', label: ' 审计日志' },
];

// ---- RBAC ----
const permLabel = (p: string) => p === 'read' ? '可读' : p === 'write' ? '可写' : p === 'review' ? '审核' : p === 'manage' ? '管理' : '系统';

function RbacPanel({ role }: { role?: string }) {
  const visibleRoles = role === 'enterprise-admin' ? roleDefinitions : roleDefinitions.filter(r => r.key !== '3');
  const canCreate = role === 'enterprise-admin';
  const [roles, setRoles] = useState(visibleRoles);
  const [editRole, setEditRole] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [newRole, setNewRole] = useState<{ name: string; description: string; personal: string[]; team: string[]; enterprise: string[] }>({ name: '', description: '', personal: [], team: [], enterprise: [] });

  const togglePerm = (space: 'personal' | 'team' | 'enterprise', perm: string) => {
    setNewRole(prev => {
      const list = [...prev[space]];
      return { ...prev, [space]: list.includes(perm) ? list.filter(p => p !== perm) : [...list, perm] };
    });
  };

  const createRole = () => {
    if (!newRole.name.trim()) return;
    setRoles(prev => [...prev, {
      key: 'r' + Date.now(),
      name: newRole.name,
      icon: '',
      description: newRole.description || '',
      members: 0,
      spacePermissions: [
        { space: 'personal', label: '个人空间', description: '自定义权限', permissions: newRole.personal as any[] },
        { space: 'team', label: '团队空间', description: '自定义权限', permissions: newRole.team as any[] },
        { space: 'enterprise', label: '企业空间', description: '自定义权限', permissions: newRole.enterprise as any[] },
      ],
    }]);
    setAddOpen(false);
    setNewRole({ name: '', description: '', personal: [], team: [], enterprise: [] });
  };

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <Row justify="space-between" align="middle"><Title level={5}>RBAC 角色管理</Title>{canCreate && <Button type="primary" size="small" onClick={() => setAddOpen(true)}>+ 新建角色</Button>}</Row>
      <Text type="secondary" style={{ fontSize: 12 }}>权限按「角色 × 空间」交叉定义。用户在不同空间中按角色行使对应权限</Text>
      {roles.map(role => (
        <Card key={role.key} size="small" title={<Space>{role.icon} <Text strong>{role.name}</Text><Tag color="#1a4a9a" style={{ fontSize: 10 }}>{role.members} 人</Tag></Space>}
          extra={<Button type="link" size="small" onClick={() => setEditRole(role.key)}>编辑</Button>}
          styles={{ body: { padding: 12 } }}>
          <Text type="secondary" style={{ fontSize: 11, display: 'block', marginBottom: 12 }}>{role.description}</Text>
          <Row gutter={8}>
            {role.spacePermissions.map(sp => (
              <Col span={8} key={sp.space}>
                <Card size="small" type="inner" title={<Space size={4}><Text style={{ fontSize: 12 }}>{sp.label}</Text><Text type="secondary" style={{ fontSize: 10 }}>— {sp.description}</Text></Space>}
                  styles={{ body: { padding: '6px 12px' }, header: { padding: '4px 12px', background: '#f5f7fa' } }}>
                  <Space size={4} wrap>{sp.permissions.map(p => <Tag key={p} color="#4a7c59" style={{ fontSize: 10 }}>{permLabel(p)}</Tag>)}</Space>
                </Card>
              </Col>
            ))}
          </Row>
        </Card>
      ))}
      <Modal title="编辑角色" open={!!editRole} onCancel={() => setEditRole(null)} width={560}
        footer={<Space><Button onClick={() => setEditRole(null)}>取消</Button><Button type="primary" onClick={() => setEditRole(null)}>保存</Button></Space>}>
        <Space direction="vertical" size={12} style={{ width: '100%' }}>
          <div><Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>角色名称</Text><Input value={roles.find(r => r.key === editRole)?.name || ''} /></div>
          <div><Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 8 }}>各空间权限</Text>
            {['personal', 'team', 'enterprise'].map((space, i) => (
              <Card key={space} size="small" type="inner" title={<Text style={{ fontSize: 12 }}>{i === 0 ? '个人空间' : i === 1 ? '团队空间' : '企业空间'}</Text>}
                styles={{ body: { padding: '6px 12px' } }} style={{ marginBottom: 4 }}>
                {['read', 'write', 'review', 'manage', 'admin'].map(p => (
                  <span key={p}><Switch size="small" defaultChecked style={{ marginRight: 8 }} /><Text style={{ fontSize: 12 }}>{permLabel(p)}</Text></span>
                ))}
              </Card>
            ))}
          </div>
        </Space>
      </Modal>
      <Modal title="新建角色" open={addOpen} onCancel={() => { setAddOpen(false); setNewRole({ name: '', description: '', personal: [], team: [], enterprise: [] }); }} width={560}
        footer={<Space><Button onClick={() => { setAddOpen(false); setNewRole({ name: '', description: '', personal: [], team: [], enterprise: [] }); }}>取消</Button><Button type="primary" onClick={createRole}>创建</Button></Space>}>
        <Space direction="vertical" size={12} style={{ width: '100%' }}>
          <div><Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>角色名称</Text><Input value={newRole.name} onChange={e => setNewRole(prev => ({ ...prev, name: e.target.value }))} placeholder="请输入角色名称" /></div>
          <div><Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>角色描述</Text><Input value={newRole.description} onChange={e => setNewRole(prev => ({ ...prev, description: e.target.value }))} placeholder="描述该角色的职责范围" /></div>
          <div><Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 8 }}>各空间权限</Text>
            {(['personal', 'team', 'enterprise'] as const).map((space, i) => (
              <Card key={space} size="small" type="inner" title={<Text style={{ fontSize: 12 }}>{i === 0 ? '个人空间' : i === 1 ? '团队空间' : '企业空间'}</Text>}
                styles={{ body: { padding: '6px 12px' } }} style={{ marginBottom: 4 }}>
                {['read', 'write', 'review', 'manage', 'admin'].map(p => (
                  <span key={p}>
                    <Switch size="small" checked={newRole[space].includes(p)} onChange={() => togglePerm(space, p)} style={{ marginRight: 8 }} />
                    <Text style={{ fontSize: 12 }}>{permLabel(p)}</Text>
                  </span>
                ))}
              </Card>
            ))}
          </div>
        </Space>
      </Modal>
    </Space>
  );
}

// ---- ABAC ----
function AbacPanel() {
  const [rules, setRules] = useState(abacRules);
  const [editRule, setEditRule] = useState<AbacRule | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [formState, setFormState] = useState<{ name: string; condition: string; action: '允许读' | '允许读写' | '禁止'; expire: string; enabled: boolean }>({ name: '', condition: '', action: '允许读', expire: '', enabled: true });

  const toggleRule = (key: string) => setRules(prev => prev.map(r => r.key === key ? { ...r, enabled: !r.enabled } : r));

  const resetForm = () => setFormState({ name: '', condition: '', action: '允许读', expire: '', enabled: true });

  const addRule = () => {
    if (!formState.name.trim() || !formState.condition.trim()) return;
    setRules(prev => [...prev, { key: 'r' + Date.now(), name: formState.name, condition: formState.condition, action: formState.action, enabled: formState.enabled, expire: formState.expire || undefined }]);
    setAddOpen(false);
    resetForm();
  };

  const saveEdit = () => {
    if (!editRule || !formState.name.trim() || !formState.condition.trim()) return;
    setRules(prev => prev.map(r => r.key === editRule.key ? { ...r, name: formState.name, condition: formState.condition, action: formState.action, enabled: formState.enabled, expire: formState.expire || undefined } : r));
    setEditRule(null);
  };

  const deleteRule = (key: string) => setRules(prev => prev.filter(r => r.key !== key));

  return (
    <Space direction="vertical" size={12} style={{ width: '100%' }}>
      <Row justify="space-between" align="middle"><Title level={5}>ABAC 属性规则</Title><Button type="primary" size="small" onClick={() => { resetForm(); setAddOpen(true); }}>+ 添加规则</Button></Row>
      <Text type="secondary" style={{ fontSize: 12 }}>基于属性的访问控制，规则按优先级匹配，优先级高的规则优先生效</Text>
      {rules.map(rule => (
        <Card key={rule.key} size="small" style={{ opacity: rule.enabled ? 1 : 0.5 }}
          title={<Space size={8}><Switch size="small" checked={rule.enabled} onChange={() => toggleRule(rule.key)} /><Text style={{ fontSize: 13 }}>{rule.name}</Text></Space>}
          extra={<Space><Button type="link" size="small" onClick={() => { setFormState({ name: rule.name, condition: rule.condition, action: rule.action, expire: rule.expire || '', enabled: rule.enabled }); setEditRule(rule); }}>编辑</Button><Button type="link" size="small" danger onClick={() => deleteRule(rule.key)}>删除</Button></Space>}
          styles={{ body: { padding: '10px 16px' } }}>
          <Row align="middle" style={{ marginLeft: 0 }}>
            <Text style={{ fontSize: 12, flex: 1, color: '#6b7d8e' }}>{rule.condition}</Text>
            <Space size={4}>
              <Tag color={rule.action === '禁止' ? '#8b3a3a' : rule.action === '允许读写' ? '#4a7c59' : '#1a4a9a'} style={{ fontSize: 10 }}>{rule.action}</Tag>
              {rule.expire && <Tag color="#8b6914" style={{ fontSize: 10 }}>到期 {rule.expire}</Tag>}
            </Space>
          </Row>
        </Card>
      ))}
      <Modal title="添加 ABAC 规则" open={addOpen} onCancel={() => { setAddOpen(false); resetForm(); }} width={560}
        footer={<Space><Button onClick={() => { setAddOpen(false); resetForm(); }}>取消</Button><Button type="primary" onClick={addRule}>保存</Button></Space>}>
        <Space direction="vertical" size={12} style={{ width: '100%' }}>
          <div><Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>规则名称</Text><Input value={formState.name} onChange={e => setFormState(prev => ({ ...prev, name: e.target.value }))} placeholder="例：空间隔离规则" /></div>
          <div><Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>条件描述</Text><Input value={formState.condition} onChange={e => setFormState(prev => ({ ...prev, condition: e.target.value }))} placeholder='例：[用户.空间] = [知识.所在空间]' /></div>
          <div><Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>动作</Text>
            <Select style={{ width: '100%' }} value={formState.action} onChange={v => setFormState(prev => ({ ...prev, action: v }))}
              options={[{ value: '允许读', label: '允许读' }, { value: '允许读写', label: '允许读写' }, { value: '禁止', label: '禁止' }]} /></div>
          <div><Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>到期时间（可选）</Text>
            <DatePicker style={{ width: '100%' }} value={formState.expire ? dayjs(formState.expire) : null} onChange={(d) => setFormState(prev => ({ ...prev, expire: d ? d.format('YYYY-MM-DD') : '' }))} /></div>
          <div><Switch size="small" checked={formState.enabled} onChange={v => setFormState(prev => ({ ...prev, enabled: v }))} style={{ marginRight: 8 }} /><Text style={{ fontSize: 12 }}>启用</Text></div>
        </Space>
      </Modal>
      <Modal title="编辑 ABAC 规则" open={!!editRule} onCancel={() => setEditRule(null)} width={560}
        footer={<Space><Button onClick={() => setEditRule(null)}>取消</Button><Button type="primary" onClick={saveEdit}>保存</Button></Space>}>
        <Space direction="vertical" size={12} style={{ width: '100%' }}>
          <div><Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>规则名称</Text><Input value={formState.name} onChange={e => setFormState(prev => ({ ...prev, name: e.target.value }))} /></div>
          <div><Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>条件描述</Text><Input value={formState.condition} onChange={e => setFormState(prev => ({ ...prev, condition: e.target.value }))} /></div>
          <div><Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>动作</Text>
            <Select style={{ width: '100%' }} value={formState.action} onChange={v => setFormState(prev => ({ ...prev, action: v }))}
              options={[{ value: '允许读', label: '允许读' }, { value: '允许读写', label: '允许读写' }, { value: '禁止', label: '禁止' }]} /></div>
          <div><Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>到期时间（可选）</Text>
            <DatePicker style={{ width: '100%' }} value={formState.expire ? dayjs(formState.expire) : null} onChange={(d) => setFormState(prev => ({ ...prev, expire: d ? d.format('YYYY-MM-DD') : '' }))} /></div>
          <div><Switch size="small" checked={formState.enabled} onChange={v => setFormState(prev => ({ ...prev, enabled: v }))} style={{ marginRight: 8 }} /><Text style={{ fontSize: 12 }}>启用</Text></div>
        </Space>
      </Modal>
    </Space>
  );
}

// ---- 模型配置 ----
function ModelPanel() {
  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <Title level={5}>AI 模型配置</Title>
      <Card size="small" title="模型选择" styles={{ body: { padding: 16 } }}>
        <Space direction="vertical" size={12} style={{ width: '100%' }}>
          <div>
            <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 8 }}>对话模型</Text>
            <Select style={{ width: '100%' }} defaultValue="deepseek-chat"
              options={[{ value: 'deepseek-chat', label: 'DeepSeek-Chat (推荐)' }, { value: 'deepseek-reasoner', label: 'DeepSeek-Reasoner' }, { value: 'qwen-max', label: '通义千问 Max' }]} />
          </div>
          <div>
            <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 8 }}>向量化模型</Text>
            <Select style={{ width: '100%' }} defaultValue="bge-large-zh"
              options={[{ value: 'bge-large-zh', label: 'BGE-Large-ZH (推荐)' }, { value: 'text2vec-large', label: 'Text2Vec-Large' }, { value: 'm3e-base', label: 'M3E-Base' }]} />
          </div>
        </Space>
      </Card>
      <Card size="small" title="模型参数" styles={{ body: { padding: 16 } }}>
        <Space direction="vertical" size={12} style={{ width: '100%' }}>
          <Row gutter={16}>
            <Col span={8}><Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>Temperature</Text><Input defaultValue="0.3" /></Col>
            <Col span={8}><Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>Max Tokens</Text><Input defaultValue="4096" /></Col>
            <Col span={8}><Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>Top P</Text><Input defaultValue="0.9" /></Col>
          </Row>
        </Space>
      </Card>
      <Card size="small" title="知识检索参数" styles={{ body: { padding: 16 } }}>
        <Space direction="vertical" size={12} style={{ width: '100%' }}>
          <Row gutter={16}>
            <Col span={12}><Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 8 }}>相似度阈值</Text><Slider min={0} max={100} defaultValue={75} marks={{ 0: '0', 50: '50', 100: '100' }} /></Col>
            <Col span={12}><Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 8 }}>最大召回文档数</Text><Slider min={1} max={20} defaultValue={8} marks={{ 1: '1', 10: '10', 20: '20' }} /></Col>
          </Row>
        </Space>
      </Card>
      <Row justify="end"><Button type="primary" size="small">保存配置</Button></Row>
    </Space>
  );
}

// ---- 审计日志 ----
function AuditPanel() {
  const [filter, setFilter] = useState('');
  const logs = filter ? auditLogs.filter(l => l.actionType.includes(filter) || l.operator.includes(filter)) : auditLogs;

  const actionColors: Record<string, string> = { '知识查看': '#1a4a9a', '知识审核': '#4a7c59', '权限变更': '#8b3a3a', '文件上传': '#4a7c7c', '知识创建': '#6b5488', '系统配置': '#8b6914', '成员管理': '#8b5a3a', '知识发布': '#4a7c59', '文件下载': '#4a6b8b', 'ABAC 规则变更': '#8b3a3a' };

  return (
    <Space direction="vertical" size={12} style={{ width: '100%' }}>
      <Row justify="space-between" align="middle"><Title level={5}>审计日志</Title>
        <Space>
          <Select style={{ width: 140 }} size="small" placeholder="操作类型" allowClear onChange={v => setFilter(v || '')}
            options={[{ value: '知识审核', label: '知识审核' }, { value: '权限变更', label: '权限变更' }, { value: '系统配置', label: '系统配置' }, { value: '知识发布', label: '知识发布' }, { value: '文件上传', label: '文件上传' }, { value: '成员管理', label: '成员管理' }]}
          />
          <Input.Search placeholder="搜索操作人..." size="small" style={{ width: 160 }} onSearch={v => setFilter(v)} />
        </Space>
      </Row>
      <Table dataSource={logs} size="small" pagination={{ pageSize: 10, size: 'small' }}
        columns={[
          { title: '时间', dataIndex: 'time', key: 'time', width: 150, render: (v: string) => <Text style={{ fontSize: 12 }}>{v}</Text> },
          { title: '操作人', dataIndex: 'operator', key: 'operator', width: 70, render: (v: string) => <Text strong style={{ fontSize: 12 }}>{v}</Text> },
          { title: '操作类型', dataIndex: 'actionType', key: 'actionType', width: 100, render: (v: string) => <Tag color={actionColors[v] || 'default'} style={{ fontSize: 10 }}>{v}</Tag> },
          { title: '目标', dataIndex: 'target', key: 'target', width: 200, render: (v: string) => <Text style={{ fontSize: 12 }}>{v}</Text> },
          { title: '详情', dataIndex: 'detail', key: 'detail', render: (v: string) => <Text type="secondary" style={{ fontSize: 11 }}>{v}</Text> },
        ]} />
    </Space>
  );
}

// ---- Members Panel ----
function MembersPanel({ role }: { role?: string }) {
  const [members, setMembers] = useState(departmentMembers);
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({ name: '', dept: '', role: '', email: '' });

  const isEnterprise = role === 'enterprise-admin';
  const isTeam = role === 'team-admin';
  const teamDept = members.find(m => m.role === '团队管理员')?.dept || '';
  const depts = isEnterprise ? allDepts : [teamDept];
  const roles = isEnterprise ? ['普通用户', '团队管理员', '企业管理员'] : ['普通用户', '团队管理员'];

  const showMembers = isTeam ? members.filter(m => m.role !== '企业管理员') : members;

  const canRemove = (record: any) => {
    if (isEnterprise) return true;
    return isTeam && record.dept === teamDept && record.role !== '企业管理员';
  };

  const addMember = () => {
    if (!form.name.trim()) return;
    setMembers(prev => [...prev, { key: 'm' + Date.now(), name: form.name, dept: form.dept || depts[0], role: form.role || roles[0], email: form.email || '—', active: '刚刚' }]);
    setAddOpen(false);
    setForm({ name: '', dept: '', role: '', email: '' });
  };

  const removeMember = (key: string) => setMembers(prev => prev.filter(m => m.key !== key));

  return (
    <Space direction="vertical" size={12} style={{ width: '100%' }}>
      <Row justify="space-between" align="middle"><Title level={5}>成员列表</Title><Space><Input.Search placeholder="搜索" size="small" style={{ width: 160 }} /><Button type="primary" size="small" onClick={() => setAddOpen(true)}>+ 添加成员</Button></Space></Row>
      <Table dataSource={showMembers} pagination={false} size="small"
        columns={[
          { title: '姓名', dataIndex: 'name', key: 'name', width: 80, render: (v: string) => <Text strong>{v}</Text> },
          { title: '部门', dataIndex: 'dept', key: 'dept', width: 90, render: (v: string) => <Tag style={{ fontSize: 10 }}>{v}</Tag> },
          { title: '角色', dataIndex: 'role', key: 'role', width: 100, render: (v: string) => <Tag color={v === '企业管理员' ? '#8b3a3a' : v === '团队管理员' ? '#8b6914' : '#1a4a9a'} style={{ fontSize: 10 }}>{v}</Tag> },
          { title: '邮箱', dataIndex: 'email', key: 'email', width: 180, render: (v: string) => <Text type="secondary" style={{ fontSize: 11 }}>{v}</Text> },
          { title: '最近活跃', dataIndex: 'active', key: 'active', width: 80, align: 'center' as const },
          { title: '', key: 'action', width: 60, render: (_: any, r: any) => canRemove(r) ? <Button type="link" size="small" danger onClick={() => removeMember(r.key)}>移除</Button> : <Text type="secondary" style={{ fontSize: 11 }}>—</Text> },
        ]} />
      <Modal title="添加成员" open={addOpen} onCancel={() => setAddOpen(false)} width={480}
        footer={<Space><Button onClick={() => setAddOpen(false)}>取消</Button><Button type="primary" onClick={addMember}>确定</Button></Space>}>
        <Space direction="vertical" size={12} style={{ width: '100%' }}>
          <div><Text type="secondary" style={{ display: 'block', marginBottom: 4 }}>姓名</Text><Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="请输入姓名" /></div>
          <div><Text type="secondary" style={{ display: 'block', marginBottom: 4 }}>部门</Text>
            <Select style={{ width: '100%' }} value={form.dept || undefined} onChange={v => setForm(p => ({ ...p, dept: v }))} placeholder="选择部门"
              options={depts.map(d => ({ value: d, label: d }))} /></div>
          <div><Text type="secondary" style={{ display: 'block', marginBottom: 4 }}>角色</Text>
            <Select style={{ width: '100%' }} value={form.role || undefined} onChange={v => setForm(p => ({ ...p, role: v }))} placeholder="选择角色"
              options={roles.map(r => ({ value: r, label: r }))} /></div>
          <div><Text type="secondary" style={{ display: 'block', marginBottom: 4 }}>邮箱</Text><Input value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="请输入邮箱" /></div>
        </Space>
      </Modal>
    </Space>
  );
}

// ---- Main ----
export default function AdminConfig({ role }: { role?: string }) {
  const filteredMenu = sideMenuItems.filter(item => {
    if (item.key === 'model' && role !== 'enterprise-admin') return false;
    return true;
  });
  const [sideKey, setSideKey] = useState('rbac');

  const contentArea = () => {
    switch (sideKey) {
      case 'rbac': return <RbacPanel role={role} />;
      case 'abac': return <AbacPanel />;
      case 'members': return <MembersPanel role={role} />;
      case 'model': return role === 'enterprise-admin' ? <ModelPanel /> : <MembersPanel role={role} />;
      case 'audit': return <AuditPanel />;
      default: return null;
    }
  };

  return (
    <Layout style={{ height: 'calc(100vh - 56px)' }}>
      <Row style={{ height: '100%', margin: 0 }}>
        <Col style={{ width: 160, borderRight: '1px solid #e8ecf1', background: '#f5f7fa' }}>
          <Menu mode="inline" selectedKeys={[sideKey]} onClick={({ key }) => setSideKey(key)}
            items={filteredMenu} style={{ borderInlineEnd: 0, background: 'transparent', marginTop: 4 }} />
        </Col>
        <Col style={{ flex: 1, padding: 24, overflowY: 'auto' }}>
          {contentArea()}
        </Col>
      </Row>
    </Layout>
  );
}
