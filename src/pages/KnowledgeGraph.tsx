import { Card, Input, Tag, Button, Typography, Space, Row, Col, Alert, Segmented, Divider, Layout, Avatar } from 'antd';

const { Text, Title } = Typography;

export default function KnowledgeGraph() {
  return (
    <Layout style={{ height: 'calc(100vh - 56px)' }}>
      <Row align="middle" justify="space-between" style={{ padding: '8px 24px', borderBottom: '1px solid #e8ecf1' }}>
        <Segmented size="small" options={[{ value: 'overview', label: '图谱总览' }, { value: 'search', label: '节点搜索' }, { value: 'path', label: '路径分析' }]} />
        <Space>
          <Input.Search placeholder="搜索实体..." size="small" style={{ width: 180 }} />
          <Button size="small">⊕ 放大</Button>
          <Button size="small">⊖ 缩小</Button>
          <Button size="small">⟲ 重置</Button>
        </Space>
      </Row>
      <Row style={{ flex: 1, overflow: 'hidden' }}>
        <Col style={{ flex: 1, background: 'linear-gradient(135deg, #f8f9ff, #f0f2f5)', position: 'relative', minHeight: 400 }}>
          <svg viewBox="0 0 500 340" style={{ width: '100%', height: '100%' }}>
            <line x1="250" y1="60" x2="250" y2="120" stroke="#8e9aaf" strokeWidth="1.5" strokeDasharray="4,2" />
            <line x1="250" y1="120" x2="120" y2="200" stroke="#1a4a9a" strokeWidth="3" />
            <line x1="250" y1="120" x2="380" y2="200" stroke="#8e9aaf" strokeWidth="1.5" />
            <line x1="120" y1="200" x2="80" y2="290" stroke="#8e9aaf" strokeWidth="1" strokeDasharray="3,2" />
            <line x1="120" y1="200" x2="180" y2="290" stroke="#1a4a9a" strokeWidth="3" />
            <line x1="380" y1="200" x2="330" y2="290" stroke="#8e9aaf" strokeWidth="1" />
            <line x1="180" y1="290" x2="330" y2="290" stroke="#1a4a9a" strokeWidth="3" strokeDasharray="6,3" />
            <line x1="380" y1="200" x2="430" y2="290" stroke="#8e9aaf" strokeWidth="1" />
            {[
              { cx: 250, cy: 40, r: 22, fill: '#1a4a9a', label: 'SOP' },
              { cx: 250, cy: 120, r: 20, fill: '#4a7c59', label: '工艺' },
              { cx: 120, cy: 200, r: 18, fill: '#1a4a9a', label: '设备A' },
              { cx: 380, cy: 200, r: 18, fill: '#8b6914', label: '参数' },
              { cx: 180, cy: 290, r: 18, fill: '#1a4a9a', label: '故障' },
              { cx: 330, cy: 290, r: 18, fill: '#8b3a3a', label: '方案' },
              { cx: 80, cy: 290, r: 14, fill: '#8e9aaf', label: '供应商', opacity: 0.5 },
              { cx: 430, cy: 290, r: 14, fill: '#8e9aaf', label: '负责人', opacity: 0.5 },
            ].map((n, i) => (
              <g key={i} opacity={n.opacity || 1}>
                <circle cx={n.cx} cy={n.cy} r={n.r} fill={n.fill} stroke="#fff" strokeWidth={3} />
                <text x={n.cx} y={n.cy + 4} textAnchor="middle" fill="#fff" fontSize={10} fontWeight="bold">{n.label}</text>
              </g>
            ))}
          </svg>
          <Card size="small" style={{ position: 'absolute', bottom: 12, left: 12 }} bodyStyle={{ padding: '8px 12px' }}>
            <Space direction="vertical" size={4}>
              <Space size={4}><Tag color="#1a4a9a" style={{ fontSize: 10, margin: 0 }}>实体</Tag><span style={{ width: 20, height: 2, background: '#1a4a9a', display: 'inline-block', marginRight: 4 }}></span><Text style={{ fontSize: 10, color: '#8e9aaf' }}>推理路径</Text></Space>
              <Space size={4}><Tag style={{ fontSize: 10, margin: 0, color: '#8e9aaf', background: '#f0f3f5' }}>关联节点</Tag><span style={{ width: 20, height: 1, background: '#8e9aaf', display: 'inline-block', marginRight: 4 }}></span><Text style={{ fontSize: 10, color: '#8e9aaf' }}>关联关系</Text></Space>
            </Space>
          </Card>
          <Alert type="info" showIcon style={{ position: 'absolute', top: 12, right: 12, width: 280, fontSize: 12 }}
            message={<div><Text strong style={{ fontSize: 12, display: 'block', marginBottom: 4 }}> 多跳推理路径</Text><Text>工艺 SOP → 设备A → 故障记录 → 解决方案</Text><Button type="link" size="small">查看推理详情 →</Button></div>} />
        </Col>
        <Col style={{ width: 240, borderLeft: '1px solid #e8ecf1', padding: 12, background: '#f5f7fa', overflowY: 'auto' }}>
          <Space direction="vertical" size={8} style={{ width: '100%' }}>
            <Text type="secondary" style={{ fontSize: 10, textTransform: 'uppercase' }}>选中节点</Text>
            <Avatar style={{ width: 40, height: 40, background: '#1a4a9a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', fontSize: 16 }}>A</Avatar>
            <Title level={5} style={{ margin: 0 }}>设备 A</Title>
            <Text type="secondary" style={{ fontSize: 11 }}>实体 · 所属基地：华东</Text>
            <Divider style={{ margin: '4px 0' }} />
            <Text strong style={{ fontSize: 11, display: 'block' }}>关联知识</Text>
            <Button type="link" size="small" block style={{ textAlign: 'left' }}> 设备A操作手册.pdf</Button>
            <Button type="link" size="small" block style={{ textAlign: 'left' }}> 设备A故障处理规范.docx</Button>
            <Divider style={{ margin: '4px 0' }} />
            <Text strong style={{ fontSize: 11, display: 'block' }}>关系</Text>
            <Text type="secondary" style={{ fontSize: 11 }}>→ <Typography.Link>故障记录</Typography.Link>（产生）</Text>
            <Text type="secondary" style={{ fontSize: 11 }}>→ <Typography.Link>供应商</Typography.Link>（采购自）</Text>
            <Text type="secondary" style={{ fontSize: 11 }}>← <Typography.Link>工艺 SOP</Typography.Link>（被使用）</Text>
            <Divider style={{ margin: '4px 0' }} />
            <Button type="link" size="small" block> 以此节点为中心展开 →</Button>
          </Space>
        </Col>
      </Row>
    </Layout>
  );
}
