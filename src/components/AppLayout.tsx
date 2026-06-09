import { Layout, Menu, Button, Space, Tag, Badge, Avatar, Dropdown, Typography, Segmented } from 'antd';
import {
  HomeOutlined, MessageOutlined, FolderOutlined,
  UploadOutlined, EditOutlined, SettingOutlined,
  BellOutlined, UserOutlined, TeamOutlined, GlobalOutlined,
  FileSearchOutlined, CompassOutlined, SearchOutlined, SendOutlined,
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;

type SpaceType = 'personal' | 'team' | 'enterprise';
type RoleType = 'normal' | 'team-admin' | 'enterprise-admin';
type PageType =
  | 'home' | 'knowledge-create' | 'compilation-list' | 'ai-chat'
  | 'knowledge-search' | 'knowledge-subscribe' | 'file-manager' | 'private-space'
  | 'knowledge-manager' | 'knowledge-base-admin' | 'knowledge-push'
  | 'compilation-preview' | 'knowledge-detail' | 'knowledge-graph' | 'permission-config'
  | 'admin-dashboard' | 'admin-config';

interface Props {
  children: React.ReactNode;
  currentPage: PageType;
  onPageChange: (page: PageType) => void;
  space: SpaceType;
  onSpaceChange: (space: SpaceType) => void;
  role: RoleType;
  onRoleChange: (role: RoleType) => void;
  onFocusChange?: (focus: string | null) => void;
}

const spaceOptions = [
  { value: 'personal' as SpaceType, label: '个人空间', icon: <UserOutlined /> },
  { value: 'team' as SpaceType, label: '团队空间', icon: <TeamOutlined /> },
  { value: 'enterprise' as SpaceType, label: '企业空间', icon: <GlobalOutlined /> },
];


const roleLabels: Record<RoleType, string> = { normal: '普通用户', 'team-admin': '团队管理员', 'enterprise-admin': '企业管理员' };
export default function AppLayout({ children, currentPage, onPageChange, space, onSpaceChange, role, onRoleChange, onFocusChange }: Props) {
  const showAdmin = role === 'team-admin' || role === 'enterprise-admin';
  const baseMenu = [
    { key: 'home' as PageType, label: '知识助理', icon: <HomeOutlined /> },
    { key: 'knowledge-create' as PageType, label: '知识创建', icon: <CompassOutlined /> },
    { key: 'compilation-list' as PageType, label: '知识编译', icon: <FileSearchOutlined /> },
    { key: 'ai-chat' as PageType, label: '知识问答', icon: <MessageOutlined /> },
    { key: 'knowledge-search' as PageType, label: '知识搜索', icon: <SearchOutlined /> },
    { key: 'knowledge-manager' as PageType, label: '知识管理', icon: <FolderOutlined /> },
    { key: 'knowledge-push' as PageType, label: '知识审批', icon: <SendOutlined /> },
    ...(showAdmin ? [
      { key: 'permission-config' as PageType, label: '权限配置', icon: <SettingOutlined /> },
    ] : []),
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#fff', display: 'flex', alignItems: 'center', padding: '0 24px', height: 56 }}>
        <Space size={24} align="center">
          <Typography.Title level={4} style={{ margin: 0, whiteSpace: 'nowrap', lineHeight: 'normal' }}> 知枢答理</Typography.Title>
          <Segmented value={space} onChange={(v) => onSpaceChange(v as SpaceType)} options={spaceOptions} />
        </Space>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 16 }}>
          <Dropdown trigger={['click']} menu={{
            items: [
              { key: 'review', label: ' 知识审核: 3 项待处理', onClick: () => onPageChange('compilation-list' as PageType) },
              { type: 'divider' as const },
              { key: 'push', label: ' 知识审批: 2 项待审核', onClick: () => onPageChange('knowledge-push' as PageType) },
            ],
          }}>
            <Badge count={3} size="small"><BellOutlined style={{ fontSize: 18, display: 'block', cursor: 'pointer' }} /></Badge>
          </Dropdown>
          <Dropdown menu={{ items: [
            { key: 'role-switch', label: '切换角色', children: [
              { key: 'role-normal', label: `普通用户${role === 'normal' ? ' ✓' : ''}`, onClick: () => onRoleChange('normal') },
              { key: 'role-team-admin', label: `团队管理员${role === 'team-admin' ? ' ✓' : ''}`, onClick: () => onRoleChange('team-admin') },
              { key: 'role-enterprise-admin', label: `企业管理员${role === 'enterprise-admin' ? ' ✓' : ''}`, onClick: () => onRoleChange('enterprise-admin') },
            ] },
            { type: 'divider' as const },
            { key: 'profile', label: '个人设置' },
            { key: 'logout', label: '退出登录' },
          ]}}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', height: 32 }}>
              <Avatar size={28} icon={<UserOutlined />} />
              <Typography.Text style={{ fontSize: 13, lineHeight: '28px' }}>张三</Typography.Text>
              <Tag color={role === 'enterprise-admin' ? '#8b3a3a' : role === 'team-admin' ? '#8b6914' : '#1a4a9a'} style={{ fontSize: 12, lineHeight: '22px', margin: 0 }}>{roleLabels[role]}</Tag>
            </div>
          </Dropdown>
        </div>
      </Header>
      <Layout>
        <Sider width={200} style={{ background: '#f5f7fa', position: 'relative', display: 'flex', flexDirection: 'column' }}>
          <Menu mode="inline" selectedKeys={[currentPage]} onClick={({ key }) => onPageChange(key as PageType)}
            items={baseMenu} style={{ borderInlineEnd: 0, marginTop: 4, flex: 1, overflowY: 'auto' }} />
          <div style={{ padding: '12px 16px', borderTop: '1px solid #e8ecf1', background: '#f5f7fa' }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button type="dashed" block size="small" icon={<UploadOutlined />} onClick={() => { onFocusChange?.('upload'); onPageChange('knowledge-create' as PageType); }}>上传文件</Button>
              <Button type="dashed" block size="small" icon={<EditOutlined />} onClick={() => { onFocusChange?.('editor'); onPageChange('knowledge-create' as PageType); }}>新建笔记</Button>
            </Space>
          </div>
        </Sider>
        <Content style={{ minHeight: 'calc(100vh - 56px)' }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
