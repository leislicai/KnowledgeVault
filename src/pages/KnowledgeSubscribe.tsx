import { Card, Button, Tag, Typography, Space, Row, Col, Layout, Table, Switch } from 'antd';
import { BellOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

const subscriptions = [
  { key: '1', type: '分类', name: '技术文档', scope: '部门知识库', count: '12 篇/月', active: true },
  { key: '2', type: '分类', name: '管理制度', scope: '集团知识库', count: '5 篇/月', active: true },
  { key: '3', type: '标签', name: '竞品分析', scope: '部门知识库', count: '3 篇/月', active: true },
  { key: '4', type: '标签', name: '高原工况', scope: '公司知识库', count: '2 篇/月', active: false },
  { key: '5', type: '文档', name: '销售话术模板_2026Q2.docx', scope: '部门知识库', count: '2 次更新', active: true },
  { key: '6', type: '文档', name: '工艺参数设定规范_v3.pdf', scope: '部门知识库', count: '1 次更新', active: true },
];

export default function KnowledgeSubscribe() {
  return (
    <Layout style={{ padding: 24, height: 'calc(100vh - 56px)', overflowY: 'auto' }}>
      <Title level={4} style={{ marginBottom: 16 }}>知识订阅</Title>
      <Text type="secondary" style={{ display: 'block', marginBottom: 16, fontSize: 13 }}>
        订阅感兴趣的知识分类、标签或文档，更新时通过站内通知、企微、钉钉、邮件推送
      </Text>
      <Row gutter={16}>
        <Col span={16}>
          <Card size="small" title="我的订阅">
            <Table dataSource={subscriptions} pagination={false} size="small"
              columns={[
                { title: '类型', dataIndex: 'type', key: 'type', width: 80, render: (v: string) => <Tag>{v}</Tag> },
                { title: '名称', dataIndex: 'name', key: 'name', render: (v: string) => <Text strong style={{ fontSize: 12 }}>{v}</Text> },
                { title: '范围', dataIndex: 'scope', key: 'scope', width: 120, render: (v: string) => <Text type="secondary" style={{ fontSize: 11 }}>{v}</Text> },
                { title: '更新频率', dataIndex: 'count', key: 'count', width: 120, render: (v: string) => <Text style={{ fontSize: 11 }}>{v}</Text> },
                { title: '状态', dataIndex: 'active', key: 'active', width: 80, render: (v: boolean, _r: any) => <Switch size="small" checked={v} onChange={() => {}} /> },
                { title: '', key: 'action', width: 60, render: () => <Button type="link" size="small" danger>取消</Button> },
              ]}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card size="small" title={<Space><BellOutlined /> 推送渠道</Space>}>
            <Space direction="vertical" size={4}>
              {['站内通知', '企业微信', '钉钉', '邮件'].map((ch, i) => (
                <Row key={i} justify="space-between" align="middle">
                  <Text style={{ fontSize: 12 }}>{ch}</Text>
                  <Switch size="small" defaultChecked={i < 3} />
                </Row>
              ))}
            </Space>
          </Card>
          <Card size="small" title="推荐订阅" style={{ marginTop: 12 }}>
            <Space direction="vertical" size={8} style={{ width: '100%' }}>
              {['安全生产管理制度', '设备维护手册', '客户案例集'].map((item, i) => (
                <Row key={i} justify="space-between" align="middle">
                  <Text style={{ fontSize: 12 }}>{item}</Text>
                  <Button size="small" type="primary" ghost>订阅</Button>
                </Row>
              ))}
            </Space>
          </Card>
        </Col>
      </Row>
    </Layout>
  );
}
