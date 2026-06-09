import { Card, Button, Tag, Typography, Space, Row, Layout, Table, Input, Upload } from 'antd';
import { UploadOutlined, FolderOutlined, InboxOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;
const { Dragger } = Upload;

const files = [
  { key: '1', name: '高原工况补充说明.docx', author: '李四', size: '856 KB', date: '1 天前', type: '文档' },
  { key: '2', name: '工艺参数设定规范_v3.pdf', author: '张三', size: '2.4 MB', date: '3 天前', type: '文档' },
  { key: '3', name: '客户案例_XX集团.pdf', author: '张三', size: '1.2 MB', date: '5 天前', type: '文档' },
  { key: '4', name: '竞品分析报告_2026Q1.docx', author: '李四', size: '3.5 MB', date: '6 天前', type: '文档' },
  { key: '5', name: '产品结构图.png', author: '王五', size: '480 KB', date: '1 周前', type: '图片' },
  { key: '6', name: '培训视频_2026Q1.mp4', author: '管理员', size: '125 MB', date: '2 周前', type: '视频' },
];

export default function FileManager() {
  return (
    <Layout style={{ padding: 24, height: 'calc(100vh - 56px)', overflowY: 'auto' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>文件管理</Title>
        <Space>
          <Input.Search placeholder="搜索文件..." size="small" style={{ width: 200 }} />
          <Button icon={<UploadOutlined />} type="primary">上传文件</Button>
          <Button icon={<FolderOutlined />}>新建文件夹</Button>
        </Space>
      </Row>
      <Card size="small" title=" 上传文件" style={{ marginBottom: 16 }}>
        <Dragger style={{ padding: 16 }}>
          <p className="ant-upload-drag-icon"><InboxOutlined /></p>
          <p className="ant-upload-text">拖拽文件到此处，或点击选择文件</p>
          <p className="ant-upload-hint">支持 PDF / DOCX / PPTX / HTML / TXT / CSV / 图片</p>
        </Dragger>
      </Card>
      <Card size="small" title=" 全部文件">
        <Table dataSource={files} pagination={{ pageSize: 20, size: 'small' }} size="small"
          columns={[
            { title: '文件名', dataIndex: 'name', key: 'name', render: (v: string, r: any) => <Space><span>{r.type === '图片' ? '' : r.type === '视频' ? '' : ''}</span><Text style={{ fontSize: 12 }}>{v}</Text></Space> },
            { title: '上传者', dataIndex: 'author', key: 'author', width: 80, render: (v: string) => <Text type="secondary" style={{ fontSize: 11 }}>{v}</Text> },
            { title: '大小', dataIndex: 'size', key: 'size', width: 80, render: (v: string) => <Text type="secondary" style={{ fontSize: 11 }}>{v}</Text> },
            { title: '日期', dataIndex: 'date', key: 'date', width: 100, render: (v: string) => <Text type="secondary" style={{ fontSize: 11 }}>{v}</Text> },
            { title: '类型', dataIndex: 'type', key: 'type', width: 80, render: (v: string) => <Tag style={{ fontSize: 10 }}>{v}</Tag> },
            { title: '', key: 'action', width: 100, render: (_: any, _r: any) => <Space><Button type="link" size="small">预览</Button><Button type="link" size="small">下载</Button></Space> },
          ]}
        />
      </Card>
    </Layout>
  );
}
