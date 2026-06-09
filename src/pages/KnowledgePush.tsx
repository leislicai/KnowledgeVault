import { useState } from 'react';
import { Table, Tag, Button, Typography, Space, Layout, Modal, Input, Checkbox, Row } from 'antd';
import { pushTasks, type PushTask } from '../mock/compilation-data';

const { Text, Title } = Typography;

interface Props { role?: string }

export default function KnowledgePush({ role }: Props) {
  const [tasks, setTasks] = useState(pushTasks);
  const [batchMode, setBatchMode] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [rejectItem, setRejectItem] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const canReview = role === 'team-admin' || role === 'enterprise-admin';

  const handleApprove = (key: string) => setTasks(prev => prev.map(t => t.key === key ? { ...t, status: '已通过' as const, reviewer: role === 'team-admin' ? '团队管理员' : '企业管理员' } : t));

  const handleRejectConfirm = () => {
    if (!rejectItem) return;
    setTasks(prev => prev.map(t => t.key === rejectItem ? { ...t, status: '已驳回' as const, rejectReason } : t));
    setRejectItem(null);
    setRejectReason('');
  };

  const batchApprove = () => {
    setTasks(prev => prev.map(t => selectedKeys.includes(t.key) ? { ...t, status: '已通过' as const, reviewer: role === 'team-admin' ? '团队管理员' : '企业管理员' } : t));
    setSelectedKeys([]);
    setBatchMode(false);
  };

  const batchReject = () => {
    setTasks(prev => prev.map(t => selectedKeys.includes(t.key) ? { ...t, status: '已驳回' as const } : t));
    setSelectedKeys([]);
    setBatchMode(false);
  };

  const columns: any[] = [
    ...(batchMode ? [{ title: '', key: 'checkbox', width: 40, render: (_: any, r: PushTask) => r.status === '待审核' ? <Checkbox checked={selectedKeys.includes(r.key)} onChange={(e) => setSelectedKeys(prev => e.target.checked ? [...prev, r.key] : prev.filter(k => k !== r.key))} /> : null }] : []),
    { title: '知识名称', dataIndex: 'knowledgeName', key: 'knowledgeName', width: 160, render: (v: string) => <Text strong style={{ fontSize: 12 }}>{v}</Text> },
    { title: '来源空间', dataIndex: 'fromSpace', key: 'fromSpace', width: 100, render: (v: string) => <Tag color="#1a4a9a" style={{ fontSize: 10 }}>{v}</Tag> },
    { title: '目标空间', dataIndex: 'toSpace', key: 'toSpace', width: 100, render: (v: string) => <Tag color="#4a7c59" style={{ fontSize: 10 }}>{v}</Tag> },
    { title: '提交人', dataIndex: 'submitter', key: 'submitter', width: 80, render: (v: string) => <Text style={{ fontSize: 12 }}>{v}</Text> },
    { title: '提交时间', dataIndex: 'time', key: 'time', width: 140, render: (v: string) => <Text type="secondary" style={{ fontSize: 11 }}>{v}</Text> },
    { title: '状态', dataIndex: 'status', key: 'status', width: 80, render: (v: string) => {
      const colors: Record<string, string> = { '待审核': '#8b6914', '已通过': '#4a7c59', '已驳回': '#8b3a3a' };
      return <Tag color={colors[v] || 'default'} style={{ fontSize: 10 }}>{v}</Tag>;
    }},
    { title: '审核人', dataIndex: 'reviewer', key: 'reviewer', width: 80, render: (v: string) => v ? <Text style={{ fontSize: 12 }}>{v}</Text> : <Text type="secondary" style={{ fontSize: 11 }}>—</Text> },
    { title: '驳回理由', dataIndex: 'rejectReason', key: 'rejectReason', width: 120, render: (v: string) => v ? <Text type="secondary" style={{ fontSize: 11 }}>{v}</Text> : <Text type="secondary" style={{ fontSize: 11 }}>—</Text> },
    ...(!batchMode ? [{ title: '操作', key: 'action', width: 120, render: (_: any, r: PushTask) => (
      r.status === '待审核' && canReview ? (
        <Space size={4}>
          <Button type="link" size="small" onClick={() => handleApprove(r.key)}>通过</Button>
          <Button type="link" size="small" danger onClick={() => { setRejectItem(r.key); setRejectReason(''); }}>驳回</Button>
        </Space>
      ) : <Text type="secondary" style={{ fontSize: 11 }}>—</Text>
    )}] : []),
  ];

  return (
    <Layout style={{ padding: 24, height: 'calc(100vh - 56px)', overflowY: 'auto' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Space>
          <Title level={4} style={{ margin: 0 }}>知识审批</Title>
          {batchMode && canReview && <Button size="small" onClick={() => { setBatchMode(false); setSelectedKeys([]); }}>取消多选</Button>}
        </Space>
      </Row>
      <Row align="middle" justify="space-between" style={{ marginBottom: 12 }}>
        <Text type="secondary" style={{ fontSize: 12 }}>
          管理跨空间的知识推送审批流程。提交后需审核通过方可生效，管理员可审核通过或驳回。
        </Text>
        {canReview && !batchMode && <Button type="primary" size="small" onClick={() => setBatchMode(true)}>批量操作</Button>}
        {batchMode && canReview && (
          <Space>
            <Button type="primary" size="small" disabled={selectedKeys.length === 0} onClick={batchApprove}>全部通过</Button>
            <Button size="small" danger disabled={selectedKeys.length === 0} onClick={batchReject}>全部驳回</Button>
          </Space>
        )}
      </Row>
      <Table dataSource={tasks} pagination={false} size="small" rowKey="key" columns={columns} />

      <Modal title="驳回理由" open={!!rejectItem} onCancel={() => setRejectItem(null)}
        footer={<Space><Button onClick={() => setRejectItem(null)}>取消</Button><Button danger type="primary" disabled={!rejectReason.trim()} onClick={handleRejectConfirm}>确认驳回</Button></Space>}>
        <Space direction="vertical" size={8} style={{ width: '100%' }}>
          <Text type="secondary" style={{ fontSize: 12 }}>请输入驳回理由：</Text>
          <Input.TextArea rows={4} value={rejectReason} onChange={e => setRejectReason(e.target.value)} placeholder="请说明驳回原因..." />
        </Space>
      </Modal>
    </Layout>
  );
}
