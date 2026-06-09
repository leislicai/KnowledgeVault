import { useState } from 'react';
import { Table, Tag, Button, Input, Typography, Space, Row, Col, Layout, Segmented, Modal } from 'antd';
import { FEATURE_NAMES, featureColor, featureLabel, fileList, fileFeatures, type FeatureState } from '../mock/compilation-data';

const { Text } = Typography;

interface Props { onOpenPreview: (id: string) => void }

const statusColor = (s: string) => s === '已发布' ? '#2d6bcb' : s === '编译中' ? '#6b5488' : '#4a7c7c';

export default function CompilationList({ onOpenPreview }: Props) {
  const [filter, setFilter] = useState('unarchived');
  const [search, setSearch] = useState('');
  const [preview, setPreview] = useState<{ fileKey: string; featureName: string } | null>(null);
  const filtered = fileList.filter(d => {
    if (filter === 'unarchived' && d.status === '已发布') return false;
    if (filter === 'published' && d.status !== '已发布') return false;
    if (search && !d.name.toLowerCase().includes(search.toLowerCase()) && !d.knowledgeName.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const columns = [
    { title: '文件名称', dataIndex: 'name', key: 'name', width: 200, render: (name: string, r: any) => (
      <Space><span style={{ fontSize: 16 }}></span>
        <div><Text strong style={{ fontSize: 12 }}>{name}</Text><Text type="secondary" style={{ fontSize: 10, display: 'block' }}>{r.author} · {r.time} · {r.size}</Text></div>
      </Space>
    )},
    { title: '知识名称', dataIndex: 'knowledgeName', key: 'knowledgeName', width: 200, render: (kn: string) => (
      <Space><span style={{ fontSize: 16 }}></span><Text style={{ fontSize: 12 }}>{kn}</Text></Space>
    )},
    { title: '知识特征', dataIndex: 'features', key: 'features', width: 380, render: (_: Record<string, string>, r: any) => (
      <Space size={4} wrap>
        {FEATURE_NAMES.map(fn => (
          <span key={fn} onClick={() => setPreview({ fileKey: r.key, featureName: fn })}>
            <Tag color={featureColor(r.features[fn] as FeatureState)} style={{ fontSize: 10, cursor: 'pointer' }}>{fn}</Tag>
          </span>
        ))}
      </Space>
    )},
    { title: '文件状态', dataIndex: 'status', key: 'status', width: 100, align: 'center' as const, render: (s: string) => <Tag color={statusColor(s)} style={{ fontSize: 11 }}>{s}</Tag> },
    { title: '', key: 'action', width: 100, align: 'right' as const, render: (_: any, r: any) => {
      if (r.status === '已发布') return <Button type="link" size="small" onClick={() => onOpenPreview(r.key)}>查看</Button>;
      return <Button type="link" size="small" danger onClick={() => onOpenPreview(r.key)}>去审核 →</Button>;
    }},
  ];

  return (
    <Layout style={{ padding: '0 24px', height: 'calc(100vh - 56px)' }}>
      <Row align="middle" justify="space-between" style={{ padding: '12px 0', borderBottom: '1px solid #e8ecf1' }}>
        <Space size={12}>
          <Text strong style={{ fontSize: 16 }}>知识编译</Text>
          <Segmented size="small" value={filter} onChange={(v) => setFilter(v as string)}
            options={[
              { value: 'all', label: '全部' },
              { value: 'unarchived', label: '未归档' },
              { value: 'published', label: '已发布' },
            ]}
          />
        </Space>
        <Input.Search placeholder="搜索文件..." size="small" style={{ width: 180 }} value={search} onChange={e => setSearch(e.target.value)} onSearch={v => setSearch(v)} />
      </Row>
      <Table columns={columns} dataSource={filtered} pagination={{ pageSize: 20, size: 'small' }} size="small" style={{ marginTop: 12 }} />
      <Row style={{ margin: '8px 0 12px' }}>
        <Col style={{ marginRight: 48 }}>
          <Text type="secondary" style={{ fontSize: 11, display: 'block', marginBottom: 4 }}>文件状态</Text>
          <Space size={12}>
            <Text type="secondary" style={{ fontSize: 11 }}><Tag color="#2d6bcb" style={{ fontSize: 10 }}>已发布</Tag> 处理完成</Text>
            <Text type="secondary" style={{ fontSize: 11 }}><Tag color="#4a7c7c" style={{ fontSize: 10 }}>未归档</Tag> 待处理</Text>
            <Text type="secondary" style={{ fontSize: 11 }}><Tag color="#6b5488" style={{ fontSize: 10 }}>编译中</Tag> 进行中</Text>
          </Space>
        </Col>
        <Col style={{ borderLeft: '1px solid #d5dce6', paddingLeft: 16 }}>
          <Text type="secondary" style={{ fontSize: 11, display: 'block', marginBottom: 4 }}>知识特征</Text>
          <Space size={12}>
            <Text type="secondary" style={{ fontSize: 11 }}><Tag color="#4a7c59" style={{ fontSize: 10 }}>已完成</Tag> 高质量</Text>
            <Text type="secondary" style={{ fontSize: 11 }}><Tag color="#8b6914" style={{ fontSize: 10 }}>待审核</Tag> 需确认</Text>
            <Text type="secondary" style={{ fontSize: 11 }}><Tag color="default" style={{ fontSize: 10 }}>未解析</Tag> 无数据</Text>
          </Space>
        </Col>
      </Row>
      <Modal title={preview ? `${preview.featureName} — ${fileList.find(f => f.key === preview.fileKey)?.knowledgeName || ''}` : ''}
        open={!!preview} onCancel={() => setPreview(null)} footer={null} width={480}>
        {preview && (() => {
          const f = fileFeatures[preview.fileKey]?.[preview.featureName];
          if (!f) return <Text type="secondary">暂无数据</Text>;
          return (
            <Space direction="vertical" size={12} style={{ width: '100%' }}>
              <Row align="middle" justify="space-between">
                <Text strong style={{ fontSize: 14 }}>{preview.featureName}</Text>
                <Tag color={featureColor(f.state)} style={{ fontSize: 11 }}>{featureLabel(f.state)}</Tag>
              </Row>
              <div style={{ background: '#f0f3f5', padding: 12, borderRadius: 6 }}>
                <Text style={{ fontSize: 13, lineHeight: 1.8 }}>{f.summary}</Text>
              </div>
            </Space>
          );
        })()}
      </Modal>
    </Layout>
  );
}
