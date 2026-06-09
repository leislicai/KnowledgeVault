import { useState } from 'react';
import { Button, Tag, Typography, Space, Card, Row, Col, Divider, Modal, Tree } from 'antd';
import { ArrowLeftOutlined, FileOutlined } from '@ant-design/icons';
import {
  featureColor, fileFeatures, titleToFileId, fileList,
  initialTreeData, wikiContent,
  entityData, relationData, scenarioData, processData,
  qaData, actionData, summaryText,
} from '../mock/compilation-data';

const { Text } = Typography;

interface Props {
  item: { title: string; excerpt: string; source: string; tags: string[] } | null;
  onPageChange: (page: string) => void;
  onOpenPreview?: (fileId: string) => void;
}

export default function KnowledgeDetail({ item, onPageChange, onOpenPreview }: Props) {
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  if (!item) return null;

  const shortName = item.title.replace(/\.\w+$/, '');
  const fileId = titleToFileId[shortName];
  const matchedFile = fileList.find(f => f.key === fileId);
  const features = fileId ? fileFeatures[fileId] : null;
  const tagColors: Record<string, string> = { '技术文档': '#1a4a9a', '制度': '#6b5488', '流程': '#4a7c7c', '销售': '#4a7c59', '竞品': '#8b6914', '客户案例': '#4a6b8b', '维护': '#8b5a3a', '参数': '#7a8a3a' };
  const scenarioColors: Record<string, string> = { operation: '#1a4a9a', emergency: '#8b3a3a', maintenance: '#8b6914' };
  const scenarioLabel = (v: string) => v === 'operation' ? '运维' : v === 'emergency' ? '应急' : '维护';
  const priorityColor = (v: string) => v === 'high' ? '#8b3a3a' : v === 'medium' ? '#8b6914' : 'default';
  const priorityLabel = (v: string) => v === 'high' ? '高' : v === 'medium' ? '中' : '低';

  return (
    <div style={{ height: 'calc(100vh - 56px)', display: 'flex', flexDirection: 'column' }}>
      <Row align="middle" style={{ padding: '8px 24px', borderBottom: '1px solid #e8ecf1' }}>
        <Space>
          <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => onPageChange('knowledge-search')}>返回搜索结果</Button>
          <Divider type="vertical" />
          <Text strong style={{ fontSize: 14 }}>{item.title}</Text>
        </Space>
      </Row>
      <div style={{ flex: 1, overflow: 'auto', padding: '16px 24px' }}>
        <Row gutter={[16, 16]} style={{ alignItems: 'stretch' }}>
          <Col span={16} style={{ display: 'flex' }}>
            <Card size="small" title="文档内容" styles={{ body: { padding: 16 } }} style={{ flex: 1 }}>
              <Space direction="vertical" size={12} style={{ width: '100%' }}>
                <Text style={{ fontSize: 13, lineHeight: 1.8 }}>{item.excerpt}</Text>
                <Divider style={{ margin: '4px 0' }} />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {matchedFile?.author ? `上传者：${matchedFile.author} · ${matchedFile.time} · ${matchedFile.size}` : ''}
                  {matchedFile?.status ? ` · 状态：` : ''}
                  {matchedFile?.status === '已发布' ? '已发布' : matchedFile?.status === '编译中' ? '编译中' : '未归档'}
                </Text>
              </Space>
            </Card>
          </Col>
          <Col span={8} style={{ display: 'flex', flexDirection: 'column' }}>
            <Card size="small" title="文档属性" styles={{ body: { padding: 16 } }}>
              <Space direction="vertical" size={8} style={{ width: '100%' }}>
                <div><Text type="secondary" style={{ fontSize: 11 }}>来源</Text><br /><Text style={{ fontSize: 12 }}>{item.source}</Text></div>
                <div><Text type="secondary" style={{ fontSize: 11 }}>标签</Text><br />
                  <Space size={4} wrap style={{ marginTop: 4 }}>
                    {item.tags.map(t => <Tag key={t} color={tagColors[t] || 'default'}>{t}</Tag>)}
                  </Space>
                </div>
                {matchedFile && <>
                  <Divider style={{ margin: '4px 0' }} />
                  <div><Text type="secondary" style={{ fontSize: 11 }}>上传者</Text><br /><Text style={{ fontSize: 12 }}>{matchedFile.author}</Text></div>
                  <div><Text type="secondary" style={{ fontSize: 11 }}>文件大小</Text><br /><Text style={{ fontSize: 12 }}>{matchedFile.size}</Text></div>
                  <div><Text type="secondary" style={{ fontSize: 11 }}>更新时间</Text><br /><Text style={{ fontSize: 12 }}>{matchedFile.time}</Text></div>
                </>}
                <Divider style={{ margin: '4px 0' }} />
                <Text type="secondary" style={{ fontSize: 11 }}>关联文件</Text>
                <Tag icon={<FileOutlined />} color="#1a4a9a" style={{ fontSize: 11, padding: '4px 8px' }}>{item.title}</Tag>
              </Space>
            </Card>
            {onOpenPreview && fileId && (
              <Card size="small" title="操作" styles={{ body: { padding: 16 } }} style={{ marginTop: 12 }}>
                <Button type="primary" block size="small" onClick={() => onOpenPreview(fileId)}>前往知识编译</Button>
              </Card>
            )}
          </Col>
        </Row>
        {features && (
          <>
            <Divider style={{ margin: '16px 0 12px' }} />
            <Text strong style={{ fontSize: 14, display: 'block', marginBottom: 8 }}>知识特征</Text>

            {/* Group A: 结构层 — 大纲+场景+wiki */}
            <Card size="small" hoverable style={{ marginBottom: 10 }}
              onClick={() => setActiveFeature('大纲')}
              title={<Text strong style={{ fontSize: 13 }}>结构层</Text>}
              styles={{ body: { padding: '10px 14px' } }}>
              <Row gutter={12} align="top">
                <Col span={8}>
                  <Text type="secondary" style={{ fontSize: 11, display: 'block', marginBottom: 4 }}>大纲</Text>
                  <Tree showIcon defaultExpandedKeys={['root']} selectedKeys={[]}
                    treeData={initialTreeData.map(n => ({ key: n.key, title: n.title, icon: n.icon, children: n.children?.map(c => ({ key: c.key, title: c.title, icon: c.icon })) }))}
                    style={{ fontSize: 11 }} />
                </Col>
                <Col span={8}>
                  <Text type="secondary" style={{ fontSize: 11, display: 'block', marginBottom: 4 }}>场景</Text>
                  {scenarioData.map(s => (
                    <div key={s.key} style={{ marginBottom: 3 }}>
                      <Tag color={scenarioColors[s.type]} style={{ fontSize: 9 }}>{scenarioLabel(s.type)}</Tag>
                      <Text style={{ fontSize: 11 }}>{s.name}</Text>
                    </div>
                  ))}
                </Col>
                <Col span={8}>
                  <Text type="secondary" style={{ fontSize: 11, display: 'block', marginBottom: 4 }}>Wiki</Text>
                  <Text style={{ fontSize: 11, lineHeight: 1.6 }}>{wikiContent.slice(0, 160)}...</Text>
                </Col>
              </Row>
            </Card>

            {/* Group B: 内容层 — 摘要+问答+流程 */}
            <Card size="small" hoverable style={{ marginBottom: 10 }}
              onClick={() => setActiveFeature('摘要')}
              title={<Text strong style={{ fontSize: 13 }}>内容层</Text>}
              styles={{ body: { padding: '10px 14px' } }}>
              <Row gutter={12} align="top">
                <Col span={8}>
                  <Text type="secondary" style={{ fontSize: 11, display: 'block', marginBottom: 4 }}>摘要</Text>
                  <Row gutter={4}>
                    <Col span={6}><Text style={{ fontSize: 14, color: '#1a4a9a' }}>1.2k</Text><Text type="secondary" style={{ fontSize: 9, display: 'block' }}>字</Text></Col>
                    <Col span={6}><Text style={{ fontSize: 14, color: '#1a4a9a' }}>4</Text><Text type="secondary" style={{ fontSize: 9, display: 'block' }}>章节</Text></Col>
                    <Col span={6}><Text style={{ fontSize: 14, color: '#1a4a9a' }}>12</Text><Text type="secondary" style={{ fontSize: 9, display: 'block' }}>实体</Text></Col>
                    <Col span={6}><Text style={{ fontSize: 14, color: '#1a4a9a' }}>5</Text><Text type="secondary" style={{ fontSize: 9, display: 'block' }}>关系</Text></Col>
                  </Row>
                  <Text style={{ fontSize: 11, lineHeight: 1.5, marginTop: 6, display: 'block' }}>{summaryText.slice(0, 80)}...</Text>
                </Col>
                <Col span={8}>
                  <Text type="secondary" style={{ fontSize: 11, display: 'block', marginBottom: 4 }}>问答</Text>
                  {qaData.slice(0, 3).map(q => (
                    <div key={q.key} style={{ marginBottom: 2, padding: '2px 6px', border: '1px solid #e8ecf1', borderRadius: 4 }}>
                      <Text style={{ fontSize: 11 }}>{q.question}</Text>
                    </div>
                  ))}
                </Col>
                <Col span={8}>
                  <Text type="secondary" style={{ fontSize: 11, display: 'block', marginBottom: 4 }}>流程</Text>
                  {processData[0]?.children?.slice(0, 4).map((n, i) => (
                    <div key={n.key} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 1 }}>
                      <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#1a4a9a', color: '#fff', fontSize: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i + 1}</div>
                      <Text style={{ fontSize: 11 }}>{typeof n.title === 'string' ? n.title : ''}</Text>
                    </div>
                  ))}
                </Col>
              </Row>
            </Card>

            {/* Group C: 分析层 — 实体+关系+行动 */}
            <Card size="small" hoverable style={{ marginBottom: 10 }}
              onClick={() => setActiveFeature('实体')}
              title={<Text strong style={{ fontSize: 13 }}>分析层</Text>}
              styles={{ body: { padding: '10px 14px' } }}>
              <Row gutter={12} align="top">
                <Col span={8}>
                  <Text type="secondary" style={{ fontSize: 11, display: 'block', marginBottom: 4 }}>实体</Text>
                  <Space size={4} wrap>
                    {entityData.map(e => <Tag key={e.key} color="#1a4a9a" style={{ fontSize: 9 }}>{e.name}</Tag>)}
                  </Space>
                </Col>
                <Col span={8}>
                  <Text type="secondary" style={{ fontSize: 11, display: 'block', marginBottom: 4 }}>关系</Text>
                  {relationData.slice(0, 3).map(r => (
                    <div key={r.key} style={{ fontSize: 11, marginBottom: 2 }}>
                      <Text style={{ fontSize: 11 }}>{r.source}</Text>
                      <Text type="secondary" style={{ fontSize: 10 }}> → </Text>
                      <Text style={{ fontSize: 11 }}>{r.target}</Text>
                    </div>
                  ))}
                </Col>
                <Col span={8}>
                  <Text type="secondary" style={{ fontSize: 11, display: 'block', marginBottom: 4 }}>行动</Text>
                  {actionData.slice(0, 4).map(a => (
                    <div key={a.key} style={{ marginBottom: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Tag color={priorityColor(a.priority)} style={{ fontSize: 9, margin: 0 }}>{priorityLabel(a.priority)}</Tag>
                      <Text style={{ fontSize: 11 }}>{a.action.slice(0, 16)}...</Text>
                    </div>
                  ))}
                </Col>
              </Row>
            </Card>

            <Modal title={activeFeature ? `知识特征详情` : ''} open={!!activeFeature} onCancel={() => setActiveFeature(null)}
              footer={null} width={560}>
              {activeFeature && (
                <Space direction="vertical" size={12} style={{ width: '100%' }}>
                  <Row align="middle" justify="space-between">
                    <Text strong style={{ fontSize: 15 }}>{activeFeature}</Text>
                    <Tag color={featureColor(features[activeFeature]?.state)}>{features[activeFeature]?.state === 'high' ? '已完成' : features[activeFeature]?.state === 'review' ? '待审核' : '未解析'}</Tag>
                  </Row>
                  <div style={{ background: '#f0f3f5', padding: 14, borderRadius: 8 }}>
                    <Text style={{ fontSize: 13, lineHeight: 1.8 }}>{features[activeFeature]?.summary}</Text>
                  </div>
                </Space>
              )}
            </Modal>
          </>
        )}
      </div>
    </div>
  );
}
