import { useState } from 'react';
import { Card, Input, Typography, Space, Tag, Layout, Button, Row, Modal } from 'antd';
import { fileList, FEATURE_NAMES, featureColor, featureLabel, fileFeatures, type FeatureState } from '../mock/compilation-data';

const { Text } = Typography;
const PAGE_SIZE = 4;

interface Props { onOpenDetail: (item: { title: string; excerpt: string; source: string; tags: string[] }) => void }

export default function KnowledgeSearch({ onOpenDetail }: Props) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [preview, setPreview] = useState<{ fileKey: string; featureName: string } | null>(null);
  const filtered = search.trim()
    ? fileList.filter(f => f.name.includes(search) || f.knowledgeName.includes(search) || f.excerpt.includes(search) || f.tags.some(t => t.includes(search)))
    : fileList;
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSearch = (v: string) => { setSearch(v); setPage(1); };

  return (
    <Layout style={{ padding: 24, height: 'calc(100vh - 56px)', overflowY: 'auto' }}>
      <Input.Search size="large" placeholder="搜索已编译的知识文件..." enterButton="搜索"
        value={search} onChange={e => setSearch(e.target.value)} onSearch={handleSearch}
        style={{ marginBottom: 16 }} />
      <Text type="secondary" style={{ display: 'block', marginBottom: 12, fontSize: 12 }}>
        找到 {filtered.length} 条结果{totalPages > 1 ? `，第 ${page}/${totalPages} 页` : ''}
      </Text>
      <Space direction="vertical" size={8} style={{ width: '100%' }}>
        {paged.map((r) => (
          <Card key={r.key} size="small" hoverable styles={{ body: { padding: 12 } }}>
            <Space direction="vertical" size={6} style={{ width: '100%' }}>
              <Button type="link" style={{ padding: 0, fontSize: 13, height: 'auto', lineHeight: 'inherit', color: '#1a4a9a' }}
                onClick={() => onOpenDetail({ title: r.knowledgeName, excerpt: r.excerpt, source: r.source, tags: r.tags })}>
                <Text strong style={{ fontSize: 13, color: '#1a4a9a' }}>{r.knowledgeName}</Text>
              </Button>
              <Text style={{ fontSize: 12 }}>{r.excerpt}</Text>
              <Space wrap size={4}>
                {FEATURE_NAMES.map(fn => (
                  <span key={fn} onClick={() => setPreview({ fileKey: r.key, featureName: fn })}>
                    <Tag color={featureColor(r.features[fn] as FeatureState)} style={{ fontSize: 10, cursor: 'pointer' }}>{fn}</Tag>
                  </span>
                ))}
              </Space>
              <Space>
                <Text type="secondary" style={{ fontSize: 11 }}>{r.source}</Text>
                {r.tags.map(t => <Tag key={t} style={{ fontSize: 10 }}>{t}</Tag>)}
              </Space>
            </Space>
          </Card>
        ))}
      </Space>
      {totalPages > 1 && (
        <Row justify="center" style={{ marginTop: 16 }}>
          <Space>
            <Button size="small" disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}>上一页</Button>
            <Text style={{ fontSize: 12 }}>{page} / {totalPages}</Text>
            <Button size="small" disabled={page >= totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}>下一页</Button>
          </Space>
        </Row>
      )}
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
