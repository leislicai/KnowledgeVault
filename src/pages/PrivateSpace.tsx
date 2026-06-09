import { Card, Button, Typography, Space, Row, Layout, Table, Tag, Input, Upload } from 'antd';
import { LockOutlined, UploadOutlined, EyeOutlined, DeleteOutlined, InboxOutlined } from '@ant-design/icons';
import { useState } from 'react';

const { Text, Title } = Typography;
const { Dragger } = Upload;

const files = [
  { key: '1', name: '个人技术笔记_2026.docx', size: '245 KB', modified: '2 小时前', encrypted: true },
  { key: '2', name: '项目复盘_XX项目.md', size: '18 KB', modified: '昨天', encrypted: true },
  { key: '3', name: '行业调研笔记.pdf', size: '1.2 MB', modified: '3 天前', encrypted: true },
];

export default function PrivateSpace() {
  const [password, setPassword] = useState('');
  const [unlocked, setUnlocked] = useState(false);

  if (!unlocked) {
    return (
      <Layout style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 'calc(100vh - 56px)' }}>
        <Card style={{ width: 400, textAlign: 'center' }}>
          <Space direction="vertical" size={16} style={{ width: '100%' }}>
            <LockOutlined style={{ fontSize: 48, color: '#1a4a9a' }} />
            <Title level={4}>私有空间</Title>
            <Text type="secondary">端到端加密 · 密码丢失不可找回</Text>
            <Input.Password placeholder="输入密码解锁私有空间" value={password} onChange={(e) => setPassword(e.target.value)}
              onPressEnter={() => setUnlocked(true)} />
            <Button type="primary" block onClick={() => setUnlocked(true)}>解锁</Button>
          </Space>
        </Card>
      </Layout>
    );
  }

  return (
    <Layout style={{ padding: 24, height: 'calc(100vh - 56px)', overflowY: 'auto' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Space>
          <LockOutlined style={{ fontSize: 18, color: '#1a4a9a' }} />
          <Title level={4} style={{ margin: 0 }}>私有空间</Title>
          <Tag color="#4a7c59">已解锁</Tag>
        </Space>
        <Button icon={<UploadOutlined />} type="primary">上传文件</Button>
      </Row>
      <Card size="small" title=" 上传文件" style={{ marginBottom: 16 }}>
        <Dragger style={{ padding: 16 }}>
          <p className="ant-upload-drag-icon"><InboxOutlined /></p>
          <p className="ant-upload-text">拖拽文件到此处，或点击选择文件（文件将端到端加密）</p>
          <p className="ant-upload-hint">支持 PDF / DOCX / PPTX / HTML / TXT / CSV / 图片</p>
        </Dragger>
      </Card>
      <Card size="small" title=" 加密文件">
        <Table dataSource={files} pagination={false} size="small"
          columns={[
            { title: '文件名', dataIndex: 'name', key: 'name', render: (v: string) => <Space><span></span><Text style={{ fontSize: 12 }}>{v}</Text></Space> },
            { title: '大小', dataIndex: 'size', key: 'size', width: 100, render: (v: string) => <Text type="secondary" style={{ fontSize: 11 }}>{v}</Text> },
            { title: '修改时间', dataIndex: 'modified', key: 'modified', width: 120, render: (v: string) => <Text type="secondary" style={{ fontSize: 11 }}>{v}</Text> },
            { title: '', key: 'action', width: 100, render: () => <Space><Button type="link" size="small" icon={<EyeOutlined />} /><Button type="link" size="small" danger icon={<DeleteOutlined />} /></Space> },
          ]}
        />
      </Card>
      <Card size="small" title="重要提示" style={{ marginTop: 12 }}>
        <Space direction="vertical" size={4}>
          <Text type="secondary" style={{ fontSize: 11 }}>• 所有文件使用 AES-256-GCM 端到端加密</Text>
          <Text type="secondary" style={{ fontSize: 11 }}>• 云端不可解密——包括系统管理员在内的任何角色均无法查看</Text>
          <Text type="secondary" style={{ fontSize: 11 }}>• 密码丢失不可找回，请妥善保管</Text>
        </Space>
      </Card>
    </Layout>
  );
}
