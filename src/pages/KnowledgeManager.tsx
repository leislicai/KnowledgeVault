import { useState, useCallback } from 'react';
import { Button, Input, Tag, Typography, Space, Row, Col, Layout, Table, Tree, Modal, Select } from 'antd';
import { FolderOutlined, FileOutlined, PlusOutlined, EyeOutlined, SwapOutlined, SendOutlined } from '@ant-design/icons';

const { Text, Title, Paragraph } = Typography;

const mdContent: Record<string, string> = {
  '0': '# 高原工况补充说明\n\n**创建人：李四** | **创建时间：2026-05-17**\n\n## 海拔对设备参数的影响\n\n当设备运行海拔超过 **3000m** 时，需对标准温度参数进行修正：\n- 温度上限：标准 200°C → 修正至 **170°C**\n- 压力上限：标准 0.8MPa → 修正至 **0.7MPa**\n\n修正原因：高海拔地区空气密度降低，散热效率下降约 15%。',
  '1': '# 工艺参数设定规范\n\n**创建人：张三** | **创建时间：2026-05-15**\n\n## 温度范围\n\n标准工作温度为 **150°C 至 200°C**，在此范围内设备运行稳定。\n\n## 压力范围\n\n标准工作压力为 **0.5-0.8MPa**，设计极限压力为 1.2MPa。',
  '2': '# XX集团客户案例\n\n**创建人：张三** | **创建时间：2026-05-13**\n\n## 项目背景\n\nXX集团拥有 12 个生产基地，设备种类超过 200 种。\n\n## 部署效果\n\n- 设备故障率降低 **35%**\n- 年节省维护成本约 **80 万元**',
  '3': '# 竞品分析报告 2026Q1\n\n**创建人：李四** | **创建时间：2026-05-19**\n\n## 核心结论\n\n在高原工况和温度范围两项核心指标上，XX产品具有明显优势。',
  '4': '# 产品结构图说明\n\n**创建人：张三** | **创建时间：2026-05-10**\n\n## 概述\n\n本文件描述了产品内部结构图的标注规范与零部件编号规则。',
  '5': '# Q1 复盘总结\n\n**创建人：张三** | **创建时间：2026-04-28**\n\n## 核心问题\n\nQ1 主要挑战集中在高原客户适配方案的交付周期过长。',
  '6': '# 产品设计规范\n\n**创建人：管理员** | **创建时间：2026-03-15**\n\n## 设计原则\n\n所有新产品设计必须满足高原工况和压力补偿两项基础要求。',
  '7': '# 集团管理制度\n\n**创建人：管理员** | **创建时间：2026-01-20**\n\n## 总则\n\n本制度适用于集团及各子公司知识资产管理。',
};

const filesData = [
  { key: '0', name: '高原工况补充说明.md', path: '个人空间', author: '李四', size: '2.3 KB', created: '2026-05-17', modified: '1 天前', status: '词条待审', statusColor: '#8b6914' as const, pushStatus: '未推送' },
  { key: '1', name: '工艺参数设定规范.md', path: '团队空间 / 销售部公共库', author: '张三', size: '1.8 KB', created: '2026-05-15', modified: '3 天前', status: '已归档', statusColor: '#4a7c59' as const, pushStatus: '已推送' },
  { key: '2', name: 'XX集团客户案例.md', path: '团队空间 / 销售部公共库 / 客户案例', author: '张三', size: '1.2 KB', created: '2026-05-13', modified: '5 天前', status: '已归档', statusColor: '#4a7c59' as const, pushStatus: '未推送' },
  { key: '3', name: '竞品分析报告 2026Q1.md', path: '团队空间 / 工程部知识库', author: '李四', size: '2.8 KB', created: '2026-05-19', modified: '刚刚', status: '待审核', statusColor: '#8b6914' as const, pushStatus: '未推送' },
  { key: '4', name: '产品结构图说明.md', path: '个人空间 / 我的笔记', author: '张三', size: '1.5 KB', created: '2026-05-10', modified: '2 周前', status: '已归档', statusColor: '#4a7c59' as const, pushStatus: '未推送' },
  { key: '5', name: 'Q1 复盘总结.md', path: '个人空间 / 项目复盘', author: '张三', size: '3.1 KB', created: '2026-04-28', modified: '3 周前', status: '已归档', statusColor: '#4a7c59' as const, pushStatus: '已推送' },
  { key: '6', name: '产品设计规范.md', path: '企业空间 / 公司知识库', author: '管理员', size: '4.2 KB', created: '2026-03-15', modified: '2 月前', status: '已归档', statusColor: '#4a7c59' as const, pushStatus: '未推送' },
  { key: '7', name: '集团管理制度.md', path: '企业空间 / 集团知识库', author: '管理员', size: '5.8 KB', created: '2026-01-20', modified: '4 月前', status: '待审核', statusColor: '#8b6914' as const, pushStatus: '未推送' },
];

type TreeNode = {
  key: string; title: string | React.ReactNode; icon?: React.ReactNode; children?: TreeNode[];
  originalTitle?: string; isFolder?: boolean; space?: string; style?: React.CSSProperties; creator?: string;
};

const spaceMap: Record<string, string> = { personal: '0', team: '1', enterprise: '2' };

interface Props { space?: string; role?: string; onOpenPreview?: (id: string) => void }

export default function KnowledgeManager({ space, role, onOpenPreview }: Props) {
  const isAdmin = role === 'team-admin' || role === 'enterprise-admin';
  const title = isAdmin ? '知识库管理（管理员视角）' : '知识管理';
  const [modalFile, setModalFile] = useState<any>(null);
  const [moveFile, setMoveFile] = useState<any>(null);
  const [pushFile, setPushFile] = useState<any>(null);
  const [pushReviewer, setPushReviewer] = useState('');
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [selectedNodePath, setSelectedNodePath] = useState('个人空间');
  const [activeSpace, setActiveSpace] = useState<'personal' | 'team' | 'enterprise'>('personal');

  const spaceTabs = [
    { key: 'personal' as const, label: '个人空间', matchRole: 'normal' },
    { key: 'team' as const, label: '团队空间', matchRole: 'team-admin' },
    { key: 'enterprise' as const, label: '企业空间', matchRole: 'enterprise-admin' },
  ];

  const hasFullPerm = (_filePath: string, author?: string) => {
    const tab = spaceTabs.find(t => t.key === activeSpace);
    if (!tab || role !== tab.matchRole) return false;
    if (role === 'enterprise-admin') return author === '管理员';
    return true;
  };
  const [treeNodes, setTreeNodes] = useState<TreeNode[]>([
    { key: '0', title: '个人空间', icon: <FolderOutlined />, space: 'personal', isFolder: true, creator: '张三', children: [
      { key: '0-0', title: '我的笔记', icon: <FileOutlined />, space: 'personal', isFolder: true, creator: '张三' },
      { key: '0-1', title: '项目复盘', icon: <FileOutlined />, space: 'personal', isFolder: true, creator: '张三' },
    ]},
    { key: '1', title: '团队空间', icon: <FolderOutlined />, space: 'team', isFolder: true, creator: '李四', children: [
      { key: '1-0', title: '销售部公共库', icon: <FolderOutlined />, space: 'team', isFolder: true, creator: '李四', children: [
        { key: '1-0-0', title: '销售话术', icon: <FolderOutlined />, space: 'team', isFolder: true, creator: '李四', children: [
          { key: '1-0-0-0', title: '破冰话术', icon: <FileOutlined />, space: 'team', isFolder: true, creator: '李四' },
          { key: '1-0-0-1', title: '产品介绍', icon: <FileOutlined />, space: 'team', isFolder: true, creator: '王五' },
        ]},
        { key: '1-0-1', title: '客户案例', icon: <FileOutlined />, space: 'team', isFolder: true, creator: '李四' },
      ]},
      { key: '1-1', title: '工程部知识库', icon: <FolderOutlined />, space: 'team', isFolder: true, creator: '赵六', children: [
        { key: '1-1-0', title: '设备维护', icon: <FileOutlined />, space: 'team', isFolder: true, creator: '赵六' },
      ]},
    ]},
    { key: '2', title: '企业空间', icon: <FolderOutlined />, space: 'enterprise', isFolder: true, creator: '管理员', children: [
      { key: '2-0', title: '公司知识库', icon: <FolderOutlined />, space: 'enterprise', isFolder: true, creator: '管理员', children: [
        { key: '2-0-0', title: '产品设计规范', icon: <FileOutlined />, space: 'enterprise', isFolder: true, creator: '管理员' },
      ]},
      { key: '2-1', title: '集团知识库', icon: <FolderOutlined />, space: 'enterprise', isFolder: true, creator: '刘总', children: [
        { key: '2-1-0', title: '管理制度', icon: <FileOutlined />, space: 'enterprise', isFolder: true, creator: '刘总' },
      ]},
    ]},
  ]);
  const currentSpaceKey = spaceMap[space || 'personal'] || '0';

  const findNodePath = useCallback((key: string, nodes: TreeNode[], parentPath: string[] = []): string | null => {
    for (const node of nodes) {
      const currentPath = [...parentPath, typeof node.title === 'string' ? node.title : (node as any).originalTitle || ''];
      if (node.key === key) return currentPath.join(' / ');
      if (node.children) {
        const found = findNodePath(key, node.children, currentPath);
        if (found) return found;
      }
    }
    return null;
  }, []);

  const handleTreeSelect = useCallback((keys: React.Key[]) => {
    if (keys.length === 0) return;
    const path = findNodePath(keys[0] as string, treeNodes);
    if (path) setSelectedNodePath(path);
  }, [treeNodes, findNodePath]);

  const displayedFiles = filesData.filter(f => f.path.startsWith(selectedNodePath));

  const canCreateFolder = hasFullPerm(selectedNodePath);

  const startEdit = useCallback((key: string, currentTitle: string) => {
    setEditingKey(key);
    setEditValue(currentTitle);
  }, []);

  const saveEdit = useCallback(() => {
    if (!editingKey || !editValue.trim()) { setEditingKey(null); return; }
    setTreeNodes(prev => {
      const update = (nodes: TreeNode[]): TreeNode[] => nodes.map(node => {
        if (node.key === editingKey) return { ...node, title: editValue.trim(), originalTitle: node.originalTitle || (typeof node.title === 'string' ? node.title : '') };
        if (node.children) return { ...node, children: update(node.children) };
        return node;
      });
      return update(prev);
    });
    setEditingKey(null);
  }, [editingKey, editValue]);

  const addFolder = useCallback(() => {
    const newKey = `new-${Date.now()}`;
    const parentKey = currentSpaceKey;
    setTreeNodes(prev => {
      const add = (nodes: TreeNode[]): TreeNode[] => nodes.map(node => {
        if (node.key === parentKey) {
          if (!node.children) node.children = [];
          return { ...node, children: [...node.children, { key: newKey, title: '', icon: <FolderOutlined />, space: node.space, isFolder: true, style: { opacity: 1 } }] };
        }
        if (node.children) return { ...node, children: add(node.children) };
        return node;
      });
      return add(prev);
    });
    setEditingKey(newKey);
    setEditValue('');
  }, [currentSpaceKey]);

  const canEditNode = (node: TreeNode) => {
    const tab = spaceTabs.find(t => t.key === activeSpace);
    if (!tab || role !== tab.matchRole) return false;
    if (role === 'enterprise-admin') return node.creator === '管理员';
    return true;
  };

  const applyNodeStyle = (nodes: TreeNode[]): TreeNode[] => nodes.map(node => {
    const canEdit = canEditNode(node);
    const isActiveSpace = node.space === activeSpace;
    return {
    ...node,
    style: { opacity: isActiveSpace ? 1 : 0.45, transition: 'opacity 0.2s' },
    title: editingKey === node.key
      ? <Input size="small" autoFocus value={editValue} onChange={e => setEditValue(e.target.value)}
          onPressEnter={saveEdit} onBlur={saveEdit}
          style={{ width: 110, fontSize: 12, height: 22, padding: '1px 4px', lineHeight: '20px' }} />
      : <span onDoubleClick={() => { if (canEdit && node.isFolder) startEdit(node.key, typeof node.title === 'string' ? node.title : ''); }}
          style={{ cursor: canEdit && node.isFolder ? 'pointer' : 'default' }}>
          {typeof node.title === 'string' ? node.title : ''}
        </span>,
    children: node.children ? applyNodeStyle(node.children) : undefined,
  }});
  const displayNodes = applyNodeStyle(treeNodes.filter(n => n.space === activeSpace));

  const pushTargetSpaces: Record<string, string> = { personal: '团队空间', team: '企业空间', enterprise: '全平台' };
  const pushReviewers: Record<string, string[]> = { personal: ['李四'], team: ['管理员'], enterprise: ['管理员'] };

  const operations = (record: any) => {
    const full = hasFullPerm(record.path, record.author);
    const btns: React.ReactNode[] = [];
    btns.push(<Button key="view" type="link" size="small" icon={<EyeOutlined />} onClick={() => setModalFile(record)}>查看</Button>);
    if (full) {
      btns.push(<Button key="edit" type="link" size="small" onClick={() => onOpenPreview?.(record.key)}>编辑</Button>);
      btns.push(<Button key="move" type="link" size="small" icon={<SwapOutlined />} onClick={() => setMoveFile(record)}>移动</Button>);
      btns.push(<Button key="push" type="link" size="small" icon={<SendOutlined />} onClick={() => { setPushFile(record); setPushReviewer(''); }}>推送</Button>);
    }
    return <Space size={0}>{btns}</Space>;
  };

  return (
    <Layout style={{ height: 'calc(100vh - 56px)' }}>
      <Row align="middle" style={{ padding: '8px 16px', borderBottom: '1px solid #e8ecf1' }}>
        <Title level={5} style={{ margin: 0 }}>{title}</Title>
      </Row>
      <Row style={{ flex: 1, margin: 0, overflow: 'hidden' }}>
        {/* Left: tree */}
        <Col style={{ width: 200, borderRight: '1px solid #e8ecf1', background: '#f5f7fa', display: 'flex', flexDirection: 'column' }}>
          <Row justify="space-between" align="middle" style={{ padding: '8px 12px 4px' }}>
            <Typography.Text strong><FolderOutlined /> 知识库</Typography.Text>
            {canCreateFolder && <Button type="text" size="small" icon={<PlusOutlined />} onClick={addFolder} />}
          </Row>
          <Space size={0} style={{ padding: '0 8px 8px', display: 'flex' }}>
            {spaceTabs.map(tab => (
              <Button key={tab.key} type="text" size="small"
                onClick={() => { setActiveSpace(tab.key); setSelectedNodePath(tab.label); }}
                style={{
                  flex: 1, borderRadius: 0, fontSize: 12,
                  color: activeSpace === tab.key ? '#000' : '#bbb',
                  fontWeight: activeSpace === tab.key ? 600 : 400,
                }}>{tab.label}</Button>
            ))}
          </Space>
          <Tree showIcon defaultExpandedKeys={['0', '1', '2']} onSelect={handleTreeSelect}
            style={{ background: 'transparent', padding: '4px 0', fontSize: 12 }}
            treeData={displayNodes} />
        </Col>

        {/* Center: file list */}
        <Col style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Row align="middle" justify="space-between" style={{ padding: '8px 12px', borderBottom: '1px solid #e8ecf1' }}>
            <Title level={5} style={{ margin: 0 }}>知识列表</Title>
            <Input.Search placeholder="搜索..." size="small" style={{ width: 200 }} />
          </Row>
          <Table dataSource={displayedFiles} pagination={false} size="small"
            columns={[
              { title: '知识名称', dataIndex: 'name', key: 'name', render: (name: string) => <Space><span></span><Text style={{ fontSize: 12 }}>{name}</Text></Space> },
              { title: '知识大小', dataIndex: 'size', key: 'size', width: 90, align: 'center' as const, render: (s: string) => <Text type="secondary" style={{ fontSize: 11 }}>{s}</Text> },
              { title: '知识创建人', dataIndex: 'author', key: 'author', width: 90, align: 'center' as const, render: (a: string) => <Text style={{ fontSize: 11 }}>{a}</Text> },
              { title: '创建时间', dataIndex: 'created', key: 'created', width: 100, align: 'center' as const, render: (d: string) => <Text type="secondary" style={{ fontSize: 11 }}>{d}</Text> },
              { title: '修改时间', dataIndex: 'modified', key: 'modified', width: 100, align: 'center' as const, render: (d: string) => <Text type="secondary" style={{ fontSize: 11 }}>{d}</Text> },
              { title: '知识路径', dataIndex: 'path', key: 'path', width: 200, render: (p: string) => <Text type="secondary" style={{ fontSize: 11 }}> {p}</Text> },
              { title: '知识状态', dataIndex: 'status', key: 'status', width: 90, align: 'center' as const, render: (s: string, r: any) => <Tag color={r.statusColor} style={{ fontSize: 10 }}>{s}</Tag> },
              { title: '推送状态', dataIndex: 'pushStatus', key: 'pushStatus', width: 90, align: 'center' as const, render: (s: string) => <Tag color={s === '已推送' ? '#4a7c59' : 'default'} style={{ fontSize: 10 }}>{s || '未推送'}</Tag> },
              { title: '操作', key: 'action', width: 200, render: (_: any, record: any) => operations(record) },
            ]}
          />
          {/* View modal */}
          <Modal title={modalFile?.name} open={!!modalFile} onCancel={() => setModalFile(null)} width={720}
            footer={<Button type="primary" onClick={() => setModalFile(null)}>关闭</Button>}>
            <div style={{ whiteSpace: 'pre-wrap', fontSize: 13, lineHeight: 1.8, maxHeight: '60vh', overflowY: 'auto' }}>
              {modalFile && (mdContent[modalFile.key] || '').split('\n').map((line: string, i: number) => {
                if (line.startsWith('# ')) return <Title key={i} level={4}>{line.slice(2)}</Title>;
                if (line.startsWith('## ')) return <Title key={i} level={5} style={{ marginTop: 12 }}>{line.slice(3)}</Title>;
                if (line.startsWith('> ')) return <Paragraph key={i} type="secondary" style={{ borderLeft: '3px solid #1a4a9a', paddingLeft: 8 }}>{line.slice(2)}</Paragraph>;
                if (line.startsWith('- ')) return <Text key={i} style={{ display: 'block', paddingLeft: 16, fontSize: 13 }}>{line}</Text>;
                if (line.startsWith('|')) return <Text key={i} style={{ display: 'block', fontSize: 12, color: '#6b7d8e' }}>{line}</Text>;
                if (line.trim() === '') return <br key={i} />;
                const boldMatch = line.match(/\*\*(.*?)\*\*/);
                if (boldMatch) {
                  const parts = line.split(/\*\*.*?\*\*/);
                  return <Text key={i} style={{ display: 'block', fontSize: 13, margin: '2px 0' }}><Text strong>{boldMatch[1]}</Text>{parts[1] || ''}</Text>;
                }
                return <Text key={i} style={{ display: 'block', fontSize: 13 }}>{line}</Text>;
              })}
            </div>
          </Modal>
          {/* Move modal */}
          <Modal title={`移动知识：${moveFile?.name || ''}`} open={!!moveFile} onCancel={() => setMoveFile(null)}
            onOk={() => setMoveFile(null)}>
            <Space direction="vertical" size={4}>
              <Text type="secondary">选择目标文件夹：</Text>
              <Select style={{ width: 300 }} placeholder="选择目录"
                options={(() => {
                  const spaceLabel = activeSpace === 'personal' ? '个人空间' : activeSpace === 'team' ? '团队空间' : '企业空间';
                  const paths = [spaceLabel];
                  const collect = (nodes: any[], prefix: string) => {
                    nodes.forEach(n => {
                      if (n.isFolder) { const p = prefix + ' / ' + (typeof n.title === 'string' ? n.title : ''); paths.push(p); if (n.children) collect(n.children, p); }
                    });
                  };
                  collect(treeNodes.find(n => n.space === activeSpace)?.children || [], spaceLabel);
                  return paths.map(p => ({ value: p, label: p }));
                })()} />
            </Space>
          </Modal>
          {/* Push modal */}
          <Modal title={`推送知识：${pushFile?.name || ''}`} open={!!pushFile} onCancel={() => setPushFile(null)}
            onOk={() => setPushFile(null)}
            footer={<Space><Button onClick={() => setPushFile(null)}>取消</Button><Button type="primary" disabled={!pushReviewer} onClick={() => setPushFile(null)}>提交审核</Button></Space>}>
            <Space direction="vertical" size={12} style={{ width: '100%' }}>
              <div><Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>目标空间</Text><Tag color="#1a4a9a" style={{ fontSize: 12 }}>{pushTargetSpaces[activeSpace]}</Tag></div>
              <div><Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>选择审核人</Text>
                <Select style={{ width: '100%' }} value={pushReviewer || undefined} onChange={setPushReviewer} placeholder="请选择审核人"
                  options={pushReviewers[activeSpace].map(r => ({ value: r, label: r }))} /></div>
              <Text type="secondary" style={{ fontSize: 11 }}>审核通过后，该知识将在目标空间中可见并可被搜索</Text>
            </Space>
          </Modal>
        </Col>
      </Row>
    </Layout>
  );
}
