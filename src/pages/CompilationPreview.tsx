import { useState, useRef } from 'react';
import { Button, Tag, Typography, Space, Row, Col, Card, Tree, Table, Divider, Modal, Input, message } from 'antd';
import { ArrowLeftOutlined, FolderOutlined, FileOutlined, PushpinOutlined } from '@ant-design/icons';
import MDEditor from '@uiw/react-md-editor';
import '@uiw/react-md-editor/markdown-editor.css';
import {
  FEATURE_NAMES, featureColor, fileFeatures, fileList,
  type TreeNode, initialTreeData, findNodeAndParent, chapterContent,
  entityData, relationData, scenarioData, processData, processStepContent,
  qaData, wikiContent, actionData, summaryText,
} from '../mock/compilation-data';

const { Text, Title, Paragraph } = Typography;

interface Props { fileId: string; onPageChange: (page: string) => void }

// ---- Shared helpers ----

const renderDoc = (text: string) => {
  const sectionKeys = ['ch1', 'ch2', 'ch3', 'ch3-1', 'ch3-2', 'ch4'];
  let sectionIdx = 0;
  return text.split('\n').map((line, i) => {
    if (line.startsWith('## ')) {
      const key = sectionKeys[sectionIdx] || '';
      sectionIdx++;
      return <div key={i} id={'anchor-' + key}><Title level={5} style={{ marginTop: 12, scrollMarginTop: 60 }}>{line.slice(3)}</Title></div>;
    }
    if (line.startsWith('### ')) {
      const key = sectionKeys[sectionIdx] || '';
      sectionIdx++;
      return <div key={i} id={'anchor-' + key}><Title level={5} style={{ marginTop: 8, scrollMarginTop: 60 }}>{line.slice(4)}</Title></div>;
    }
    if (line.startsWith('# ')) return <Title key={i} level={4} style={{ marginTop: 8, scrollMarginTop: 60 }}>{line.slice(2)}</Title>;
    if (line.startsWith('- ')) return <Text key={i} style={{ display: 'block', paddingLeft: 12, fontSize: 12 }}>{line.slice(2)}</Text>;
    if (line.trim() === '') return <br key={i} />;
    return <Text key={i} style={{ display: 'block', fontSize: 12, lineHeight: '1.6' }}>{line}</Text>;
  });
};

function ThreePanel({ left, center, right }: { left: React.ReactNode; center: React.ReactNode; right: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: 12, height: 500, overflow: 'hidden' }}>
      <div style={{ width: '18%', minWidth: 160 }}>{left}</div>
      <div style={{ width: '32%', minWidth: 240 }}>{center}</div>
      <div style={{ flex: 1, minWidth: 260 }}>{right}</div>
    </div>
  );
}

const scenarioColors: Record<string, string> = { operation: '#1a4a9a', emergency: '#8b3a3a', maintenance: '#8b6914' };
const scenarioLabel = (v: string) => v === 'operation' ? '运维' : v === 'emergency' ? '应急' : '维护';
const priorityColor = (v: string) => v === 'high' ? '#8b3a3a' : v === 'medium' ? '#8b6914' : 'default';
const priorityLabel = (v: string) => v === 'high' ? '高' : v === 'medium' ? '中' : '低';
const statusColor = (v: string) => v === '已发布' || v === '已执行' ? '#4a7c59' : v === '待审核' ? '#8b6914' : 'default';

// ===== 9 Feature Modals =====

function OutlineModal({ onClose }: { onClose: () => void }) {
  const [selectedKey, setSelectedKey] = useState('root');
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [treeData, setTreeData] = useState<TreeNode[]>(initialTreeData);
  const [selectedText, setSelectedText] = useState('');
  const [bindVisible, setBindVisible] = useState(false);
  const [bindModal, setBindModal] = useState(false);
  const [bindTargetKey, setBindTargetKey] = useState('');
  const [bindKeyword, setBindKeyword] = useState('');
  const origRef = useRef<HTMLDivElement>(null);
  const current = chapterContent[selectedKey] || chapterContent.root;

  const addChapter = () => { const key = 'ch-new-' + Date.now(); const t = [...treeData]; t.push({ key, title: '新建章节', icon: <FileOutlined /> }); setTreeData(t); setSelectedKey(key); setEditingKey(key); setEditValue('新建章节'); };

  const saveEdit = () => {
    if (!editingKey || !editValue.trim()) { setEditingKey(null); return; }
    const update = (nodes: TreeNode[]): TreeNode[] => nodes.map(n => { if (n.key === editingKey) return { ...n, title: editValue.trim() }; if (n.children) return { ...n, children: update(n.children) }; return n; });
    setTreeData(update(JSON.parse(JSON.stringify(treeData)))); setEditingKey(null);
  };

  const handleTextSelect = () => {
    const sel = window.getSelection();
    const text = sel?.toString().trim();
    if (text && text.length > 3) { setSelectedText(text); setBindVisible(true); }
    else { setBindVisible(false); }
  };

  const handleBind = (nodeKey: string) => { setBindTargetKey(nodeKey); setBindKeyword(selectedText.slice(0, 30)); setBindModal(true); };

  const scrollToAnchor = (key: string) => {
    setTimeout(() => {
      const el = document.getElementById('anchor-' + key);
      const container = el?.closest('.ant-card-body') as HTMLElement | null;
      if (el && container) {
        const rect = el.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        const scrollTop = container.scrollTop + rect.top - containerRect.top - 20;
        container.scrollTo({ top: scrollTop, behavior: 'smooth' });
      }
    }, 50);
  };

  const handleTreeSelect = (keys: React.Key[]) => {
    if (keys.length > 0) { setSelectedKey(keys[0] as string); scrollToAnchor(keys[0] as string); }
  };

  const buildTreeData = (nodes: TreeNode[]): any[] => nodes.map(node => ({
    key: node.key, isLeaf: !node.children,
    title: <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      {editingKey === node.key
        ? <Input size="small" autoFocus value={editValue} onChange={e => setEditValue(e.target.value)} onPressEnter={saveEdit} onBlur={saveEdit} style={{ width: 90, fontSize: 12, height: 22, padding: '1px 4px' }} />
        : <span onDoubleClick={() => { if (node.key !== 'root') { setEditingKey(node.key); setEditValue(node.title); }}} style={{ fontSize: 12, cursor: node.key !== 'root' ? 'pointer' : 'default' }}>{node.title}</span>}
      {bindVisible && <Button type="link" size="small" icon={<PushpinOutlined />} style={{ fontSize: 10, padding: '0 2px', marginLeft: 'auto', opacity: 0.6 }} onClick={(e) => { e.stopPropagation(); handleBind(node.key); }} />}
    </span>,
    children: node.children ? buildTreeData(node.children) : undefined,
  }));

  return (
    <>
    <Modal title=" 大纲详情" open onCancel={onClose} width={1200} footer={null}>
      <div style={{ display: 'flex', gap: 12, height: 500, overflow: 'hidden' }}>
        <div style={{ width: '25%', minWidth: 200 }}>
          <Card size="small" title={<Space size={4}><FolderOutlined /><Text style={{ fontSize: 12 }}>目录树</Text></Space>}
            extra={<Button size="small" style={{ fontSize: 10 }} onClick={addChapter}>+</Button>}
            style={{ height: '100%', overflow: 'hidden' }}
            styles={{ body: { overflow: 'auto', height: '100%', padding: '2px 0' } }}>
            <Tree showIcon draggable defaultExpandedKeys={['root']} selectedKeys={[selectedKey]} onSelect={handleTreeSelect}
              onDrop={(info) => {
                const t = JSON.parse(JSON.stringify(treeData)); const dk = info.dragNode.key as string; const nk = info.node.key as string; const pos = info.dropPosition;
                const { siblings: ds, index: di } = findNodeAndParent(t, dk); const [dragged] = ds.splice(di, 1);
                const { node: dn, siblings: ns, index: ni } = findNodeAndParent(t, nk);
                if (!dn) { setTreeData(t); return; }
                if (pos === 0) { if (!dn.children) dn.children = []; dn.children.push(dragged); }
                else if (pos === -1) ns.splice(ni, 0, dragged);
                else ns.splice(ni + 1, 0, dragged);
                setTreeData(t);
              }}
              treeData={buildTreeData(treeData)} style={{ fontSize: 12 }} />
          </Card>
        </div>
        <div style={{ width: '25%', minWidth: 200 }}>
          <Card size="small" title={<Space size={4}><Text style={{ fontSize: 12 }}>大纲</Text><Text type="secondary" style={{ fontSize: 11 }}>· {current.title}</Text></Space>}
            extra={<Tag color={current.score >= 90 ? '#4a7c59' : current.score >= 60 ? '#8b6914' : '#8b3a3a'} style={{ fontSize: 10 }}>{current.score}分</Tag>}
            style={{ height: '100%', overflow: 'hidden' }}
            styles={{ body: { overflow: 'auto', height: '100%', padding: 8 } }}>
            <div style={{ lineHeight: 1.8, fontSize: 12, whiteSpace: 'pre-wrap' }}>{current.content}</div>
          </Card>
        </div>
        <div style={{ flex: 1, minWidth: 260 }}>
          <Card size="small" title={<Space size={4}><FileOutlined /><Text style={{ fontSize: 12 }}>原文</Text><Text type="secondary" style={{ fontSize: 11 }}>· 全文</Text></Space>}
            extra={bindVisible ? <Tag color="#1a4a9a" style={{ fontSize: 10 }}>已选中文字，点击节点右侧  锚定</Tag> : <Text type="secondary" style={{ fontSize: 10 }}>左键拖动选中文字可锚定目录</Text>}
            style={{ height: '100%', overflow: 'hidden' }}
            styles={{ body: { overflow: 'auto', height: '100%', padding: 8 } }}>
            <div ref={origRef} onMouseUp={handleTextSelect} style={{ fontSize: 12, lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
              {renderDoc(chapterContent.root.original)}
            </div>
          </Card>
        </div>
      </div>
    </Modal>
    <Modal title="绑定目录与原文" open={bindModal} onCancel={() => setBindModal(false)} width={480}
      footer={<Space><Button onClick={() => setBindModal(false)}>取消</Button><Button type="primary" onClick={() => { setBindModal(false); setBindVisible(false); }}>保存</Button></Space>}>
      <Space direction="vertical" size={8} style={{ width: '100%' }}>
        <div><Text type="secondary" style={{ fontSize: 11, display: 'block', marginBottom: 4 }}>目标目录</Text><Tag color="#1a4a9a">{treeData.find(n => findNodeAndParent([n], bindTargetKey) !== null)?.title || bindTargetKey}</Tag></div>
        <div><Text type="secondary" style={{ display: 'block', marginBottom: 4, fontSize: 11 }}>选中原文</Text><Text style={{ fontSize: 12, color: '#6b7d8e' }}>{selectedText}</Text></div>
        <div><Text type="secondary" style={{ display: 'block', marginBottom: 4, fontSize: 11 }}>搜索锚定关键词</Text><Input value={bindKeyword} onChange={e => setBindKeyword(e.target.value)} placeholder="输入关键词，用于原文中定位锚点" /></div>
      </Space>
    </Modal>
    </>
  );
}

function EntityModal({ onClose }: { onClose: () => void }) {
  const [entities, setEntities] = useState(entityData);
  const [selected, setSelected] = useState(entityData[0]);
  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState('');
  const [editType, setEditType] = useState('');

  const startEdit = () => { setEditName(selected.name); setEditType(selected.type); setEditMode(true); };
  const saveEdit = () => {
    const updated = { ...selected, name: editName.trim(), type: editType };
    setEntities(prev => prev.map(e => e.key === selected.key ? updated : e));
    setSelected(updated); setEditMode(false);
  };

  return (
    <Modal title=" 实体详情" open onCancel={onClose} width={1200} footer={null}>
      <ThreePanel
        left={
          <Card size="small" title="实体列表" style={{ height: '100%', overflow: 'hidden' }}
            styles={{ body: { overflow: 'auto', height: '100%', padding: 0 } }}>
            <Table dataSource={entities} pagination={false} size="small" showHeader={false}
              onRow={(r: any) => ({ onClick: () => setSelected(r), style: { cursor: 'pointer', background: selected.key === r.key ? '#e8eef5' : undefined } })}
              columns={[
                { title: '', dataIndex: 'name', key: 'name', render: (v: string) => <Text strong style={{ fontSize: 12 }}>{v}</Text> },
                { title: '', dataIndex: 'type', key: 'type', width: 60, render: (v: string) => <Tag style={{ fontSize: 10 }}>{v}</Tag> },
              ]} />
          </Card>
        }
        center={
          <Card size="small" title={<Text style={{ fontSize: 12 }}>{editMode ? '编辑实体' : selected.name}</Text>}
            extra={editMode
              ? <Space size={4}><Button size="small" onClick={() => setEditMode(false)}>取消</Button><Button size="small" type="primary" onClick={saveEdit}>保存</Button></Space>
              : <Button size="small" onClick={startEdit}>编辑</Button>}
            style={{ height: '100%', overflow: 'hidden' }}
            styles={{ body: { overflow: 'auto', height: '100%', padding: 8 } }}>
            <Space direction="vertical" size={8} style={{ width: '100%' }}>
              <div><Text type="secondary" style={{ fontSize: 11 }}>名称</Text><br />{editMode ? <Input size="small" value={editName} onChange={e => setEditName(e.target.value)} style={{ width: '100%', marginTop: 4 }} /> : <Text style={{ fontSize: 13 }}>{selected.name}</Text>}</div>
              <div><Text type="secondary" style={{ fontSize: 11 }}>类型</Text><br />{editMode ? <Input size="small" value={editType} onChange={e => setEditType(e.target.value)} style={{ width: '100%', marginTop: 4 }} /> : <Tag style={{ marginTop: 4 }}>{selected.type}</Tag>}</div>
              <div><Text type="secondary" style={{ fontSize: 11 }}>出现次数</Text><br /><Text style={{ fontSize: 12 }}>{selected.count} 次</Text></div>
              <div><Text type="secondary" style={{ fontSize: 11 }}>状态</Text><br /><Tag color={statusColor(selected.status)} style={{ fontSize: 10 }}>{selected.status}</Tag></div>
            </Space>
          </Card>
        }
        right={
          <Card size="small" title={<Space size={4}><FileOutlined /><Text style={{ fontSize: 12 }}>原文位置</Text></Space>} style={{ height: '100%', overflow: 'hidden' }}
            styles={{ body: { overflow: 'auto', height: '100%', padding: 8 } }}>
            <Space direction="vertical" size={8} style={{ width: '100%' }}>
              <Text style={{ fontSize: 12 }}>「{selected.name}」在文档正文中共出现 {selected.count} 次，主要集中于参数修正系数章节。</Text>
              <div style={{ background: '#f0f3f5', padding: 12, borderRadius: 6 }}>
                <Text type="secondary" style={{ fontSize: 11 }}>示例原文</Text>
                <Text style={{ fontSize: 12, display: 'block', marginTop: 4 }}>"当海拔超过 3000m 时，需对标准参数进行修正……高海拔地区空气密度降低，导致散热效率下降约 15%。"</Text>
              </div>
            </Space>
          </Card>
        }
      />
    </Modal>
  );
}

function RelationModal({ onClose }: { onClose: () => void }) {
  const [relations, setRelations] = useState(relationData);
  const [editKey, setEditKey] = useState<string | null>(null);
  const [editSource, setEditSource] = useState('');
  const [editRel, setEditRel] = useState('');
  const [editTarget, setEditTarget] = useState('');

  const startEdit = (r: any) => { setEditKey(r.key); setEditSource(r.source); setEditRel(r.relation); setEditTarget(r.target); };
  const saveEdit = () => {
    setRelations(prev => prev.map(r => r.key === editKey ? { ...r, source: editSource, relation: editRel, target: editTarget } : r));
    setEditKey(null);
  };

  return (
    <Modal title="[Link] 关系详情" open onCancel={onClose} width={1200} footer={null}>
      <ThreePanel
        left={
          <Card size="small" title="关系列表" style={{ height: '100%', overflow: 'hidden' }}
            styles={{ body: { overflow: 'auto', height: '100%', padding: 0 } }}>
            <Table dataSource={relations} pagination={false} size="small" showHeader={false}
              onRow={(r: any) => ({ onClick: () => startEdit(r), style: { cursor: 'pointer', background: editKey === r.key ? '#e8eef5' : undefined } })}
              columns={[
                { title: '', key: 'rel', render: (_: any, r: any) => (
                  <Space size={4}><Text style={{ fontSize: 11 }}>{r.source}</Text><Text type="secondary" style={{ fontSize: 10 }}>→{r.relation}→</Text><Text style={{ fontSize: 11 }}>{r.target}</Text></Space>
                )},
              ]} />
          </Card>
        }
        center={
          <Card size="small" title={editKey ? '编辑关系' : '关系分析'}
            extra={editKey ? <Space size={4}><Button size="small" onClick={() => setEditKey(null)}>取消</Button><Button size="small" type="primary" onClick={saveEdit}>保存</Button></Space> : undefined}
            style={{ height: '100%', overflow: 'hidden' }}
            styles={{ body: { overflow: 'auto', height: '100%', padding: 8 } }}>
            {editKey ? (
              <Space direction="vertical" size={12} style={{ width: '100%' }}>
                <div><Text type="secondary" style={{ fontSize: 11 }}>源实体</Text><Input size="small" value={editSource} onChange={e => setEditSource(e.target.value)} style={{ marginTop: 4 }} /></div>
                <div><Text type="secondary" style={{ fontSize: 11 }}>关系类型</Text><Input size="small" value={editRel} onChange={e => setEditRel(e.target.value)} style={{ marginTop: 4 }} /></div>
                <div><Text type="secondary" style={{ fontSize: 11 }}>目标实体</Text><Input size="small" value={editTarget} onChange={e => setEditTarget(e.target.value)} style={{ marginTop: 4 }} /></div>
              </Space>
            ) : <Text type="secondary" style={{ fontSize: 12 }}>点击左侧关系条目进行编辑</Text>}
          </Card>
        }
        right={
          <Card size="small" title={<Space size={4}><FileOutlined /><Text style={{ fontSize: 12 }}>原文依据</Text></Space>} style={{ height: '100%', overflow: 'hidden' }}
            styles={{ body: { overflow: 'auto', height: '100%', padding: 8 } }}>
            <div style={{ background: '#f0f3f5', padding: 12, borderRadius: 6, marginBottom: 8 }}>
              <Text type="secondary" style={{ fontSize: 11 }}>海拔 → 温度修正</Text>
              <Text style={{ fontSize: 12, display: 'block', marginTop: 4 }}>"当海拔超过 3000m 时，上限温度应降低至 170°C。"</Text>
            </div>
            <div style={{ background: '#f0f3f5', padding: 12, borderRadius: 6 }}>
              <Text type="secondary" style={{ fontSize: 11 }}>温度修正 → 压力修正</Text>
              <Text style={{ fontSize: 12, display: 'block', marginTop: 4 }}>"需要同时执行温度和压力修正，不可单独修正其中一项。"</Text>
            </div>
          </Card>
        }
      />
    </Modal>
  );
}

function ScenarioModal({ onClose }: { onClose: () => void }) {
  const [scenarios, setScenarios] = useState(scenarioData);
  const [selected, setSelected] = useState(scenarioData[0]);
  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');

  const startEdit = () => { setEditName(selected.name); setEditDesc(selected.description); setEditMode(true); };
  const saveEdit = () => {
    const updated = { ...selected, name: editName.trim(), description: editDesc };
    setScenarios(prev => prev.map(s => s.key === selected.key ? updated : s));
    setSelected(updated); setEditMode(false);
  };

  return (
    <Modal title=" 场景详情" open onCancel={onClose} width={1200} footer={null}>
      <ThreePanel
        left={
          <Card size="small" title="场景列表" style={{ height: '100%', overflow: 'hidden' }}
            styles={{ body: { overflow: 'auto', height: '100%', padding: 0 } }}>
            <Table dataSource={scenarios} pagination={false} size="small" showHeader={false}
              onRow={(r: any) => ({ onClick: () => { setSelected(r); setEditMode(false); }, style: { cursor: 'pointer', background: selected.key === r.key ? '#e8eef5' : undefined } })}
              columns={[
                { title: '', dataIndex: 'name', key: 'name', render: (v: string) => <Text strong style={{ fontSize: 12 }}>{v}</Text> },
                { title: '', dataIndex: 'type', key: 'type', width: 80, render: (v: string) => <Tag color={scenarioColors[v] || 'default'} style={{ fontSize: 10 }}>{scenarioLabel(v)}</Tag> },
              ]} />
          </Card>
        }
        center={
          <Card size="small" title={<Text style={{ fontSize: 12 }}>{editMode ? '编辑场景' : selected.name}</Text>}
            extra={editMode
              ? <Space size={4}><Button size="small" onClick={() => setEditMode(false)}>取消</Button><Button size="small" type="primary" onClick={saveEdit}>保存</Button></Space>
              : <Button size="small" onClick={startEdit}>编辑</Button>}
            style={{ height: '100%', overflow: 'hidden' }}
            styles={{ body: { overflow: 'auto', height: '100%', padding: 8 } }}>
            {editMode ? (
              <Space direction="vertical" size={12} style={{ width: '100%' }}>
                <div><Text type="secondary" style={{ fontSize: 11 }}>场景名称</Text><Input size="small" value={editName} onChange={e => setEditName(e.target.value)} style={{ marginTop: 4 }} /></div>
                <div><Text type="secondary" style={{ fontSize: 11 }}>描述</Text><Input.TextArea rows={3} value={editDesc} onChange={e => setEditDesc(e.target.value)} style={{ marginTop: 4 }} /></div>
              </Space>
            ) : (
              <Space direction="vertical" size={8} style={{ width: '100%' }}>
                <Text style={{ fontSize: 13 }}>{selected.description}</Text>
                <div style={{ marginTop: 8 }}>
                  <Text type="secondary" style={{ fontSize: 11, display: 'block', marginBottom: 8 }}>场景边界条件</Text>
                  {selected.key === '1' && <Text style={{ fontSize: 12 }}>• 海拔 ≥ 3000m 且 ≤ 5000m<br/>• 环境温度 ≤ 40°C<br/>• 设备已通过预热流程</Text>}
                  {selected.key === '2' && <Text style={{ fontSize: 12 }}>• 海拔 {'>'} 5000m<br/>• 需启用极限工况参数表<br/>• 短期运行不超过 2 小时</Text>}
                  {selected.key === '3' && <Text style={{ fontSize: 12 }}>• 设备首次进入高原环境<br/>• 需完整执行预热+校准流程<br/>• 校准后 72 小时进入稳定期</Text>}
                  {selected.key === '4' && <Text style={{ fontSize: 12 }}>• 季节温差 {'>'} 20°C 时触发<br/>• 参数微调幅度 ≤ 5%<br/>• 调整后 24 小时监测</Text>}
                </div>
              </Space>
            )}
          </Card>
        }
        right={
          <Card size="small" title={<Space size={4}><FileOutlined /><Text style={{ fontSize: 12 }}>原文参考</Text></Space>} style={{ height: '100%', overflow: 'hidden' }}
            styles={{ body: { overflow: 'auto', height: '100%', padding: 8 } }}>
            <div style={{ background: '#f0f3f5', padding: 12, borderRadius: 6 }}>
              <Text type="secondary" style={{ fontSize: 11 }}>原文摘录</Text>
              <Text style={{ fontSize: 12, display: 'block', marginTop: 4 }}>"本说明适用于海拔 3000m 以上地区使用的 XX 系列设备。标准参数在高原环境下需要进行修正以保证设备正常运行。经测试，海拔 4000m 时散热效率下降约 22%，5000m 时下降约 30%。"</Text>
            </div>
          </Card>
        }
      />
    </Modal>
  );
}

function ProcessModal({ onClose }: { onClose: () => void }) {
  const [selectedKey, setSelectedKey] = useState('p-root');
  const [steps, setSteps] = useState(processStepContent);
  const [editOpen, setEditOpen] = useState(false);
  const [editValue, setEditValue] = useState('');
  const current = steps[selectedKey] || steps['p-root'];

  return (
    <Modal title=" 流程详情" open onCancel={onClose} width={1200} footer={null}>
      <ThreePanel
        left={
          <Card size="small" title={<Space size={4}><FolderOutlined /><Text style={{ fontSize: 12 }}>流程树</Text></Space>}
            style={{ height: '100%', overflow: 'hidden' }}
            styles={{ body: { overflow: 'auto', height: '100%', padding: '2px 0' } }}>
            <Tree showIcon defaultExpandedKeys={['p-root']} selectedKeys={[selectedKey]} onSelect={(keys) => { if (keys.length > 0) setSelectedKey(keys[0] as string); }}
              treeData={processData.map(n => ({
                key: n.key, title: n.title, icon: n.icon,
                children: n.children?.map(c => ({ key: c.key, title: c.title, icon: c.icon,
                  children: (c as any).children?.map((gc: any) => ({ key: gc.key, title: gc.title, icon: gc.icon }))
                }))
              }))} style={{ fontSize: 12 }} />
          </Card>
        }
        center={
          <Card size="small" title={<Text style={{ fontSize: 12 }}>步骤详情</Text>}
            extra={<Button size="small" onClick={() => { setEditValue(current); setEditOpen(true); }}>编辑</Button>}
            style={{ height: '100%', overflow: 'hidden' }}
            styles={{ body: { overflow: 'auto', height: '100%', padding: 8 } }}>
            <div style={{ lineHeight: 1.8, fontSize: 12, whiteSpace: 'pre-wrap' }}>{current}</div>
          </Card>
        }
        right={
          <Card size="small" title={<Space size={4}><FileOutlined /><Text style={{ fontSize: 12 }}>原文参考</Text></Space>} style={{ height: '100%', overflow: 'hidden' }}
            styles={{ body: { overflow: 'auto', height: '100%', padding: 8 } }}>
            <div style={{ background: '#f0f3f5', padding: 12, borderRadius: 6, marginBottom: 8 }}>
              <Text type="secondary" style={{ fontSize: 11 }}>修正流程原文</Text>
              <Text style={{ fontSize: 12, display: 'block', marginTop: 4 }}>"当海拔超过 3000m 时，需对标准参数进行修正：温度上限：标准 200°C → 修正至 170°C；压力上限：标准 0.8MPa → 修正至 0.7MPa。"</Text>
            </div>
            <div style={{ background: '#f0f3f5', padding: 12, borderRadius: 6 }}>
              <Text type="secondary" style={{ fontSize: 11 }}>双重校验原文</Text>
              <Text style={{ fontSize: 12, display: 'block', marginTop: 4 }}>"需要同时执行温度和压力修正，不可单独修正其中一项。"</Text>
            </div>
          </Card>
        }
      />
      <Modal title="编辑步骤内容" open={editOpen} onCancel={() => setEditOpen(false)} width={640}
        footer={<Space><Button onClick={() => setEditOpen(false)}>取消</Button><Button type="primary" onClick={() => { setSteps({ ...steps, [selectedKey]: editValue }); setEditOpen(false); }}>保存</Button></Space>}>
        <Input.TextArea rows={10} value={editValue} onChange={e => setEditValue(e.target.value)} />
      </Modal>
    </Modal>
  );
}

function QAModal({ onClose }: { onClose: () => void }) {
  const [qaList, setQaList] = useState(qaData);
  const [selected, setSelected] = useState(qaData[0]);
  const [editMode, setEditMode] = useState(false);
  const [editAnswer, setEditAnswer] = useState('');

  const startEdit = () => { setEditAnswer(selected.answer); setEditMode(true); };
  const saveEdit = () => {
    const updated = { ...selected, answer: editAnswer };
    setQaList(prev => prev.map(q => q.key === selected.key ? updated : q));
    setSelected(updated); setEditMode(false);
  };

  return (
    <Modal title=" 问答详情" open onCancel={onClose} width={1200} footer={null}>
      <ThreePanel
        left={
          <Card size="small" title="问答列表" style={{ height: '100%', overflow: 'hidden' }}
            styles={{ body: { overflow: 'auto', height: '100%', padding: 0 } }}>
            <Table dataSource={qaList} pagination={false} size="small" showHeader={false}
              onRow={(r: any) => ({ onClick: () => { setSelected(r); setEditMode(false); }, style: { cursor: 'pointer', background: selected.key === r.key ? '#e8eef5' : undefined } })}
              columns={[
                { title: '', dataIndex: 'question', key: 'question', render: (v: string) => <Text style={{ fontSize: 12 }}>{v}</Text> },
              ]} />
          </Card>
        }
        center={
          <Card size="small" title={<Text style={{ fontSize: 12 }}>{editMode ? '编辑回答' : selected.question}</Text>}
            extra={editMode
              ? <Space size={4}><Button size="small" onClick={() => setEditMode(false)}>取消</Button><Button size="small" type="primary" onClick={saveEdit}>保存</Button></Space>
              : <Button size="small" onClick={startEdit}>编辑</Button>}
            style={{ height: '100%', overflow: 'hidden' }}
            styles={{ body: { overflow: 'auto', height: '100%', padding: 8 } }}>
            {editMode ? (
              <Input.TextArea rows={6} value={editAnswer} onChange={e => setEditAnswer(e.target.value)} />
            ) : (
              <Space direction="vertical" size={8} style={{ width: '100%' }}>
                <Text strong style={{ fontSize: 12, color: '#1a4a9a' }}>回答</Text>
                <Text style={{ fontSize: 13, lineHeight: 1.8 }}>{selected.answer}</Text>
                <div style={{ marginTop: 8 }}><Text type="secondary" style={{ fontSize: 11 }}>来源：{selected.source}</Text></div>
              </Space>
            )}
          </Card>
        }
        right={
          <Card size="small" title={<Space size={4}><FileOutlined /><Text style={{ fontSize: 12 }}>原文依据</Text></Space>} style={{ height: '100%', overflow: 'hidden' }}
            styles={{ body: { overflow: 'auto', height: '100%', padding: 8 } }}>
            <div style={{ background: '#f0f3f5', padding: 12, borderRadius: 6, marginBottom: 8 }}>
              <Text type="secondary" style={{ fontSize: 11 }}>相关原文段落</Text>
              <Text style={{ fontSize: 12, display: 'block', marginTop: 4 }}>"当设备运行海拔超过 3000m 时，需对标准温度参数进行修正：温度上限：标准 200°C → 修正至 170°C。修正原因：高海拔地区空气密度降低，散热效率下降约 15%。"</Text>
            </div>
            <div style={{ background: '#f0f3f5', padding: 12, borderRadius: 6 }}>
              <Text type="secondary" style={{ fontSize: 11 }}>引用来源</Text>
              <Text style={{ fontSize: 12, display: 'block', marginTop: 4 }}> 高原工况补充说明.docx · 第 3 页 · 第 2.1 节</Text>
            </div>
          </Card>
        }
      />
    </Modal>
  );
}

function WikiModal({ onClose }: { onClose: () => void }) {
  const [editOpen, setEditOpen] = useState(false);
  const [content, setContent] = useState(wikiContent);
  const [editValue, setEditValue] = useState(content);
  return (
    <>
    <Modal title=" Wiki 详情" open onCancel={onClose} width={1200} footer={null}>
      <div style={{ display: 'flex', gap: 16, height: 500 }}>
        <div style={{ flex: 1 }}>
          <Card size="small" title=" 场景 Wiki" extra={<Button size="small" onClick={() => { setEditValue(content); setEditOpen(true); }}>编辑</Button>}
            style={{ height: '100%', overflow: 'hidden' }}
            styles={{ body: { overflow: 'auto', height: '100%', padding: 12 } }}>
            <Paragraph style={{ fontSize: 13, whiteSpace: 'pre-wrap' }}>{content}</Paragraph>
          </Card>
        </div>
      </div>
    </Modal>
    <Modal title="编辑 Wiki" open={editOpen} onCancel={() => setEditOpen(false)} width={1200}
      footer={<Space><Button onClick={() => setEditOpen(false)}>取消</Button><Button type="primary" onClick={() => { setContent(editValue); setEditOpen(false); }}>保存</Button></Space>}>
      <div data-color-mode="light"><MDEditor value={editValue} onChange={(v) => setEditValue(v || '')} height={500} /></div>
    </Modal>
    </>
  );
}

function ActionModal({ onClose }: { onClose: () => void }) {
  const [actions, setActions] = useState(actionData);
  const [editKey, setEditKey] = useState<string | null>(null);
  const [editAction, setEditAction] = useState('');
  const [editPriority, setEditPriority] = useState('');

  const startEdit = (r: any) => { setEditKey(r.key); setEditAction(r.action); setEditPriority(r.priority); };
  const saveEdit = () => {
    setActions(prev => prev.map(a => a.key === editKey ? { ...a, action: editAction, priority: editPriority } : a));
    setEditKey(null);
  };

  return (
    <Modal title=" 行动详情" open onCancel={onClose} width={1200} footer={null}>
      <ThreePanel
        left={
          <Card size="small" title="行动项列表" style={{ height: '100%', overflow: 'hidden' }}
            styles={{ body: { overflow: 'auto', height: '100%', padding: 0 } }}>
            <Table dataSource={actions} pagination={false} size="small" showHeader={false}
              onRow={(r: any) => ({ onClick: () => startEdit(r), style: { cursor: 'pointer', background: editKey === r.key ? '#e8eef5' : undefined } })}
              columns={[
                { title: '', key: 'action', render: (_: any, r: any) => (
                  <Space direction="vertical" size={0}>
                    <Text style={{ fontSize: 12 }}>{r.action}</Text>
                    <Space size={4}><Tag color={priorityColor(r.priority)} style={{ fontSize: 10 }}>{priorityLabel(r.priority)}</Tag>
                    <Tag color={statusColor(r.status)} style={{ fontSize: 10 }}>{r.status}</Tag></Space>
                  </Space>
                )},
              ]} />
          </Card>
        }
        center={
          <Card size="small" title={editKey ? '编辑行动项' : '行动摘要'}
            extra={editKey ? <Space size={4}><Button size="small" onClick={() => setEditKey(null)}>取消</Button><Button size="small" type="primary" onClick={saveEdit}>保存</Button></Space> : undefined}
            style={{ height: '100%', overflow: 'hidden' }}
            styles={{ body: { overflow: 'auto', height: '100%', padding: 8 } }}>
            {editKey ? (
              <Space direction="vertical" size={12} style={{ width: '100%' }}>
                <div><Text type="secondary" style={{ fontSize: 11 }}>行动描述</Text><Input size="small" value={editAction} onChange={e => setEditAction(e.target.value)} style={{ marginTop: 4 }} /></div>
                <div><Text type="secondary" style={{ fontSize: 11 }}>优先级</Text><Input size="small" value={editPriority} onChange={e => setEditPriority(e.target.value)} style={{ marginTop: 4 }} placeholder="high / medium / low" /></div>
              </Space>
            ) : (
              <Space direction="vertical" size={12} style={{ width: '100%' }}>
                <Text strong style={{ fontSize: 13 }}>统计概览</Text>
                <Row gutter={8}>
                  <Col span={8}><Card size="small" styles={{ body: { padding: '8px 12px', textAlign: 'center' as const } }}><Text style={{ fontSize: 18, color: '#8b3a3a' }}>{actions.filter(a => a.priority === 'high').length}</Text><br/><Text type="secondary" style={{ fontSize: 10 }}>高优先级</Text></Card></Col>
                  <Col span={8}><Card size="small" styles={{ body: { padding: '8px 12px', textAlign: 'center' as const } }}><Text style={{ fontSize: 18, color: '#8b6914' }}>{actions.filter(a => a.priority === 'medium').length}</Text><br/><Text type="secondary" style={{ fontSize: 10 }}>中优先级</Text></Card></Col>
                  <Col span={8}><Card size="small" styles={{ body: { padding: '8px 12px', textAlign: 'center' as const } }}><Text style={{ fontSize: 18, color: '#4a7c59' }}>{actions.filter(a => a.status === '已执行').length}</Text><br/><Text type="secondary" style={{ fontSize: 10 }}>已执行</Text></Card></Col>
                </Row>
              </Space>
            )}
          </Card>
        }
        right={
          <Card size="small" title={<Space size={4}><FileOutlined /><Text style={{ fontSize: 12 }}>原文参考</Text></Space>} style={{ height: '100%', overflow: 'hidden' }}
            styles={{ body: { overflow: 'auto', height: '100%', padding: 8 } }}>
            <div style={{ background: '#f0f3f5', padding: 12, borderRadius: 6 }}>
              <Text type="secondary" style={{ fontSize: 11 }}>操作要求原文</Text>
              <Text style={{ fontSize: 12, display: 'block', marginTop: 4 }}>"1. 首次运行前需进行 30 分钟预热\n2. 每 200 小时检查一次压力补偿装置\n3. 建议配置 UPS 电源\n4. 定期校准参数设置\n5. 高原环境下增加巡检频率至每 100 小时一次"</Text>
            </div>
          </Card>
        }
      />
    </Modal>
  );
}

function SummaryModal({ onClose }: { onClose: () => void }) {
  const [editOpen, setEditOpen] = useState(false);
  const [content, setContent] = useState(summaryText);
  const [editText, setEditText] = useState('');
  return (
    <>
    <Modal title=" 摘要详情" open onCancel={onClose} width={1200} footer={null}>
      <div style={{ display: 'flex', gap: 16, height: 500 }}>
        <div style={{ flex: 1 }}>
          <Card size="small" title=" 文档摘要" extra={<Button size="small" onClick={() => { setEditText(content); setEditOpen(true); }}>编辑</Button>}
            style={{ height: '100%', overflow: 'hidden' }}
            styles={{ body: { overflow: 'auto', height: '100%', padding: 12 } }}>
            <Space direction="vertical" size={12} style={{ width: '100%' }}>
              <Paragraph style={{ fontSize: 13, lineHeight: 1.8 }}>{content}</Paragraph>
              <Divider style={{ margin: '8px 0' }} />
              <Text strong style={{ fontSize: 13 }}>文档统计</Text>
              <Row gutter={8}>
                <Col span={6}><Text type="secondary" style={{ fontSize: 11 }}>总字数</Text><br/><Text style={{ fontSize: 14 }}>1,247</Text></Col>
                <Col span={6}><Text type="secondary" style={{ fontSize: 11 }}>章节数</Text><br/><Text style={{ fontSize: 14 }}>4</Text></Col>
                <Col span={6}><Text type="secondary" style={{ fontSize: 11 }}>实体数</Text><br/><Text style={{ fontSize: 14 }}>12</Text></Col>
                <Col span={6}><Text type="secondary" style={{ fontSize: 11 }}>关系数</Text><br/><Text style={{ fontSize: 14 }}>5</Text></Col>
              </Row>
            </Space>
          </Card>
        </div>
      </div>
    </Modal>
    <Modal title="编辑摘要" open={editOpen} onCancel={() => setEditOpen(false)} width={640}
      footer={<Space><Button onClick={() => setEditOpen(false)}>取消</Button><Button type="primary" onClick={() => { setContent(editText); setEditOpen(false); }}>保存</Button></Space>}>
      <Input.TextArea rows={10} value={editText} onChange={e => setEditText(e.target.value)} />
    </Modal>
    </>
  );
}

// ===== Main Page Component =====

export default function CompilationPreview({ fileId, onPageChange }: Props) {
  const file = fileList.find(f => f.key === fileId) || fileList[1];
  const features = fileFeatures[fileId] || fileFeatures['doc-002'];
  const [activeFeature, setActiveFeature] = useState<string | null>(null);

  return (
    <div style={{ height: 'calc(100vh - 56px)', display: 'flex', flexDirection: 'column' }}>
      <Row align="middle" style={{ padding: '8px 24px', borderBottom: '1px solid #e8ecf1' }}>
        <Space>
          <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => onPageChange('compilation-list')}>返回列表</Button>
          <Divider type="vertical" />
          <Space size={8}>
            <Text strong>知识编译 · {file.name}</Text>
            <Tag color={statusColor(file.status)} style={{ fontSize: 10 }}>{file.status}</Tag>
          </Space>
        </Space>
        <Button type="primary" size="small" style={{ marginLeft: 'auto' }}
          onClick={() => {
            const published = FEATURE_NAMES.filter(n => features[n]?.state === 'high');
            message.success({ content: `已发布 ${published.length} 项：${published.join('、')}`, duration: 4 });
          }}>保存并发布</Button>
      </Row>
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left: Markdown original */}
        <div style={{ width: '42%', minWidth: 360, borderRight: '1px solid #e8ecf1', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '8px 16px', borderBottom: '1px solid #e8ecf1', background: '#f5f7fa', flexShrink: 0 }}>
            <Space size={4}><FileOutlined style={{ color: '#1a4a9a' }} /><Text strong style={{ fontSize: 13 }}>编译原文</Text></Space>
          </div>
          <div style={{ flex: 1, overflow: 'auto', padding: 16 }}>
            <div style={{ fontSize: 13, lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
              {renderDoc(chapterContent.root.original)}
            </div>
          </div>
        </div>

        {/* Right: Feature groups */}
        <div style={{ flex: 1, overflow: 'auto', padding: '8px 16px' }}>
          {/* Group A: 结构层 */}
          <Card size="small" style={{ marginBottom: 10 }}
            title={<Space size={8}><Text strong style={{ fontSize: 13 }}>结构层</Text>
              {['大纲','场景','wiki'].map(n => <Tag key={n} color={featureColor(features[n]?.state)} style={{ fontSize: 10 }}>{n}</Tag>)}
            </Space>}
            styles={{ body: { padding: '10px 14px' } }}>
            <Row gutter={12}>
              <Col span={8}>
                <Text type="secondary" style={{ fontSize: 11, display: 'block', marginBottom: 6 }}>大纲</Text>
                <div style={{ border: '1px solid #e8ecf1', borderRadius: 6, padding: '6px 10px', maxHeight: 160, overflow: 'auto' }}>
                  <Tree showIcon defaultExpandedKeys={['root']} selectedKeys={[]}
                    treeData={initialTreeData.map(n => ({ key: n.key, title: n.title, icon: n.icon, children: n.children?.map(c => ({ key: c.key, title: c.title, icon: c.icon })) }))}
                    style={{ fontSize: 12 }} onClick={() => setActiveFeature('大纲')} />
                </div>
              </Col>
              <Col span={8}>
                <Text type="secondary" style={{ fontSize: 11, display: 'block', marginBottom: 6 }}>场景</Text>
                <div style={{ maxHeight: 160, overflow: 'auto' }}>
                  {scenarioData.map(s => (
                    <div key={s.key} onClick={() => setActiveFeature('场景')}
                      style={{ padding: '5px 8px', marginBottom: 4, borderRadius: 4, border: '1px solid #e8ecf1', cursor: 'pointer', background: '#f5f7fa' }}>
                      <Space size={4}><Tag color={scenarioColors[s.type]} style={{ fontSize: 9 }}>{scenarioLabel(s.type)}</Tag><Text style={{ fontSize: 12 }}>{s.name}</Text></Space>
                    </div>
                  ))}
                </div>
              </Col>
              <Col span={8}>
                <Text type="secondary" style={{ fontSize: 11, display: 'block', marginBottom: 6 }}>Wiki</Text>
                <div onClick={() => setActiveFeature('wiki')}
                  style={{ border: '1px solid #e8ecf1', borderRadius: 6, padding: '6px 10px', maxHeight: 160, overflow: 'hidden', cursor: 'pointer', background: '#f5f7fa' }}>
                  <Text style={{ fontSize: 11, lineHeight: 1.5 }}>{wikiContent.slice(0, 120)}...</Text>
                </div>
              </Col>
            </Row>
          </Card>

          {/* Group B: 内容层 */}
          <Card size="small" style={{ marginBottom: 10 }}
            title={<Space size={8}><Text strong style={{ fontSize: 13 }}>内容层</Text>
              {['摘要','问答','流程'].map(n => <Tag key={n} color={featureColor(features[n]?.state)} style={{ fontSize: 10 }}>{n}</Tag>)}
            </Space>}
            styles={{ body: { padding: '10px 14px' } }}>
            <Row gutter={12}>
              <Col span={6}>
                <Text type="secondary" style={{ fontSize: 11, display: 'block', marginBottom: 6 }}>摘要</Text>
                <div onClick={() => setActiveFeature('摘要')}
                  style={{ border: '1px solid #e8ecf1', borderRadius: 6, padding: '6px 10px', background: '#f5f7fa', cursor: 'pointer' }}>
                  <Row gutter={8}>
                    <Col span={6}><Text style={{ fontSize: 16, color: '#1a4a9a' }}>1.2k</Text><Text type="secondary" style={{ fontSize: 9, display: 'block' }}>总字数</Text></Col>
                    <Col span={6}><Text style={{ fontSize: 16, color: '#1a4a9a' }}>4</Text><Text type="secondary" style={{ fontSize: 9, display: 'block' }}>章节</Text></Col>
                    <Col span={6}><Text style={{ fontSize: 16, color: '#1a4a9a' }}>12</Text><Text type="secondary" style={{ fontSize: 9, display: 'block' }}>实体</Text></Col>
                    <Col span={6}><Text style={{ fontSize: 16, color: '#1a4a9a' }}>5</Text><Text type="secondary" style={{ fontSize: 9, display: 'block' }}>关系</Text></Col>
                  </Row>
                </div>
              </Col>
              <Col span={9}>
                <Text type="secondary" style={{ fontSize: 11, display: 'block', marginBottom: 6 }}>问答</Text>
                <div style={{ maxHeight: 100, overflow: 'auto' }}>
                  {qaData.map(q => (
                    <div key={q.key} onClick={() => setActiveFeature('问答')}
                      style={{ padding: '3px 6px', marginBottom: 3, borderRadius: 4, border: '1px solid #e8ecf1', cursor: 'pointer' }}>
                      <Text style={{ fontSize: 11 }}>{q.question}</Text>
                    </div>
                  ))}
                </div>
              </Col>
              <Col span={9}>
                <Text type="secondary" style={{ fontSize: 11, display: 'block', marginBottom: 6 }}>流程</Text>
                <div onClick={() => setActiveFeature('流程')} style={{ cursor: 'pointer' }}>
                  {processData[0]?.children?.slice(0, 4).map((n, i) => (
                    <div key={n.key} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                      <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#1a4a9a', color: '#fff', fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i + 1}</div>
                      <Text style={{ fontSize: 11 }}>{typeof n.title === 'string' ? n.title : ''}</Text>
                    </div>
                  ))}
                </div>
              </Col>
            </Row>
          </Card>

          {/* Group C: 分析层 */}
          <Card size="small" style={{ marginBottom: 10 }}
            title={<Space size={8}><Text strong style={{ fontSize: 13 }}>分析层</Text>
              {['实体','关系','行动'].map(n => <Tag key={n} color={featureColor(features[n]?.state)} style={{ fontSize: 10 }}>{n}</Tag>)}
            </Space>}
            styles={{ body: { padding: '10px 14px' } }}>
            <Row gutter={12}>
              <Col span={14}>
                <Text type="secondary" style={{ fontSize: 11, display: 'block', marginBottom: 6 }}>实体关系图谱</Text>
                <div onClick={() => setActiveFeature('实体')} style={{ cursor: 'pointer', position: 'relative', height: 150, border: '1px solid #e8ecf1', borderRadius: 6, background: '#f5f7fa', overflow: 'hidden' }}>
                  <svg width="100%" height="100%" viewBox="0 0 380 150" style={{ display: 'block' }}>
                    <line x1="50" y1="75" x2="160" y2="30" stroke="#d5dce6" strokeWidth="2" />
                    <line x1="50" y1="75" x2="160" y2="75" stroke="#d5dce6" strokeWidth="2" />
                    <line x1="50" y1="75" x2="160" y2="120" stroke="#d5dce6" strokeWidth="2" />
                    <line x1="160" y1="30" x2="280" y2="45" stroke="#d5dce6" strokeWidth="1.5" />
                    <line x1="160" y1="75" x2="280" y2="75" stroke="#d5dce6" strokeWidth="1.5" />
                    <line x1="160" y1="120" x2="280" y2="105" stroke="#d5dce6" strokeWidth="1.5" />
                    <circle cx="50" cy="75" r="18" fill="#1a4a9a" opacity="0.9" />
                    <text x="50" y="79" textAnchor="middle" fill="#fff" fontSize="9">基准</text>
                    {entityData.slice(0, 6).map((e, i) => {
                      const cx = i < 3 ? 160 : 280;
                      const cy = [30, 75, 120, 45, 75, 105][i];
                      return (
                        <g key={e.key}>
                          <circle cx={cx} cy={cy} r={e.count / 2 + 6} fill={e.status === '已发布' ? '#1a4a9a' : '#8b6914'} opacity={0.7} />
                          <text x={cx} y={cy + 4} textAnchor="middle" fill="#fff" fontSize="8">{e.name.slice(0, 3)}</text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </Col>
              <Col span={10}>
                <Text type="secondary" style={{ fontSize: 11, display: 'block', marginBottom: 6 }}>行动项</Text>
                <div style={{ maxHeight: 150, overflow: 'auto' }}>
                  {actionData.map(a => (
                    <div key={a.key} onClick={() => setActiveFeature('行动')}
                      style={{ padding: '4px 6px', marginBottom: 4, borderRadius: 4, border: '1px solid #e8ecf1', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Tag color={priorityColor(a.priority)} style={{ fontSize: 9, margin: 0 }}>{priorityLabel(a.priority)}</Tag>
                      <Text style={{ fontSize: 11, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.action}</Text>
                    </div>
                  ))}
                </div>
              </Col>
            </Row>
          </Card>
        </div>
      </div>
      {activeFeature === '大纲' && <OutlineModal onClose={() => setActiveFeature(null)} />}
      {activeFeature === '实体' && <EntityModal onClose={() => setActiveFeature(null)} />}
      {activeFeature === '关系' && <RelationModal onClose={() => setActiveFeature(null)} />}
      {activeFeature === '场景' && <ScenarioModal onClose={() => setActiveFeature(null)} />}
      {activeFeature === '流程' && <ProcessModal onClose={() => setActiveFeature(null)} />}
      {activeFeature === '问答' && <QAModal onClose={() => setActiveFeature(null)} />}
      {activeFeature === 'wiki' && <WikiModal onClose={() => setActiveFeature(null)} />}
      {activeFeature === '行动' && <ActionModal onClose={() => setActiveFeature(null)} />}
      {activeFeature === '摘要' && <SummaryModal onClose={() => setActiveFeature(null)} />}
    </div>
  );
}
