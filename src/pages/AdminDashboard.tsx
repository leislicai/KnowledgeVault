import { Card, Button, Row, Col, Typography, Space, Tag, Progress, Statistic, Layout } from 'antd';
import { FileTextOutlined, BarChartOutlined, MessageOutlined, UserOutlined } from '@ant-design/icons';

const { Text } = Typography;

const distribution = [
  { name: '技术文档', percent: 45, color: '#1a4a9a' },
  { name: '管理制度', percent: 25, color: '#4a7c59' },
  { name: '客户案例', percent: 15, color: '#8b6914' },
  { name: '培训材料', percent: 10, color: '#8b3a3a' },
  { name: '其他', percent: 5, color: '#8e9aaf' },
];

const leaderboard = [
  { rank: '#1', name: '张三', upload: 24, edit: 56, cited: 132 },
  { rank: '#2', name: '李四', upload: 18, edit: 42, cited: 98 },
  { rank: '#3', name: '王五', upload: 15, edit: 38, cited: 76 },
  { rank: '4', name: '赵六', upload: 10, edit: 25, cited: 45 },
  { rank: '5', name: '陈七', upload: 8, edit: 20, cited: 33 },
];

const blindSpots = [
  { question: '设备保修期是多久？', count: 12, suggest: '无 · 建议补充：售后政策文档' },
  { question: '销售报价审批流程', count: 8, suggest: '报价指引.pdf · 需抽取知识' },
  { question: 'XX产品与竞品对比', count: 6, suggest: '无 · 建议新建竞品对比文档' },
];

export default function AdminDashboard() {
  return (
    <Layout style={{ padding: 24, overflowY: 'auto', height: 'calc(100vh - 56px)' }}>
      <Row gutter={12} style={{ marginBottom: 16 }}>
        <Col span={6}><Card size="small"><Statistic title="知识总量" value={1284} prefix={<FileTextOutlined />} suffix="↑ 12% 本月" valueStyle={{ color: '#1a4a9a' }} /></Card></Col>
        <Col span={6}><Card size="small"><Statistic title="本月新增" value={156} prefix={<BarChartOutlined />} suffix="文件 98 · 知识 58" valueStyle={{ color: '#4a7c59' }} /></Card></Col>
        <Col span={6}><Card size="small"><Statistic title="AI 问答次数" value={3847} prefix={<MessageOutlined />} suffix="本周 +589" valueStyle={{ color: '#8b6914' }} /></Card></Col>
        <Col span={6}><Card size="small"><Statistic title="活跃用户" value={247} prefix={<UserOutlined />} suffix="本日活跃 83" /></Card></Col>
      </Row>
      <Row gutter={12}>
        <Col span={12}>
          <Card size="small" title="知识分类分布" style={{ marginBottom: 12 }}>
            {distribution.map((item, i) => (
              <Row key={i} align="middle" style={{ marginBottom: 6 }}>
                <Text style={{ width: 80, fontSize: 11 }}>{item.name}</Text>
                <Progress percent={item.percent} size="small" strokeColor={item.color} style={{ flex: 1 }} showInfo={false} />
                <Text type="secondary" style={{ fontSize: 11, width: 30, textAlign: 'right' }}>{item.percent}%</Text>
              </Row>
            ))}
          </Card>
          <Card size="small" title="知识增长趋势（近 6 月）">
            <Row align="bottom" style={{ height: 100, margin: 0 }}>
              {[40, 55, 48, 65, 72, 85].map((h, i) => (
                <Col key={i} flex={1} style={{ textAlign: 'center' }}>
                  <div style={{ height: h, background: 'linear-gradient(to top, #e8eef5, #1a4a9a)', borderRadius: '3px 3px 0 0', margin: '0 3px' }} />
                  <Text type="secondary" style={{ fontSize: 10, marginTop: 4, display: 'block' }}>{['12月', '1月', '2月', '3月', '4月', '5月'][i]}</Text>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
        <Col span={12}>
          <Card size="small" title=" 知识贡献排行" extra={<Button type="link" size="small">查看全部 →</Button>} style={{ marginBottom: 12 }}>
            {leaderboard.map((item, i) => (
              <Row key={i} align="middle" style={{ padding: '6px 0', borderBottom: i < leaderboard.length - 1 ? '1px solid #e8ecf1' : 'none' }}>
                <Text style={{ fontSize: 14, marginRight: 8 }}>{item.rank}</Text>
                <Text strong style={{ fontSize: 12, flex: 1 }}>{item.name}</Text>
                <Text type="secondary" style={{ fontSize: 11 }}>上传 {item.upload} · 编辑 {item.edit} · 被引用 {item.cited}</Text>
              </Row>
            ))}
          </Card>
          <Card size="small" title=" 检索盲区 · 未解答问题" extra={<Tag color="#8b3a3a">37 个</Tag>}>
            {blindSpots.map((item, i) => (
              <Card key={i} size="small" bodyStyle={{ padding: '6px 8px' }} style={{ marginBottom: 4 }}>
                <Row justify="space-between"><Text style={{ fontSize: 11 }}>"{item.question}"</Text><Tag style={{ fontSize: 10 }}>{item.count} 次</Tag></Row>
                <Text type="secondary" style={{ fontSize: 10 }}>相关文件：{item.suggest}</Text>
              </Card>
            ))}
            <Button type="link" size="small" block>查看全部未解答 →</Button>
          </Card>
        </Col>
      </Row>
      <Card size="small" bodyStyle={{ padding: '8px 12px' }} style={{ marginTop: 12 }}>
        <Space split={<Text type="secondary">|</Text>} style={{ fontSize: 11, color: '#8e9aaf' }}>
          <Text type="secondary"> 当前视角：企业空间</Text>
          <Text type="secondary"> 数据范围：全集团 · 更新至 2026-05-18</Text>
        </Space>
      </Card>
    </Layout>
  );
}
