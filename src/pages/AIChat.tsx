import { useState } from 'react';
import { Button, Typography, Space, Row, Col, List, Layout, Dropdown, Divider } from 'antd';
import { PlusOutlined, MoreOutlined, PushpinOutlined, DeleteOutlined } from '@ant-design/icons';
import ChatPanel from '../components/ChatPanel';
import type { SpaceType } from '../App';

const { Text } = Typography;

const historyItems = ['产品参数对比', '竞品分析', '销售话术优化', '客户案例检索', '合同条款查询', '竞争对手分析'];

interface Props { space: SpaceType }

export default function AIChat({ space }: Props) {
  const [pinnedOrder, setPinnedOrder] = useState<string[]>(['item-0']);
  const [activeChat, setActiveChat] = useState(0);
  const pinnedSet = new Set(pinnedOrder);

  return (
    <Layout style={{ height: 'calc(100vh - 56px)' }}>
      <Row style={{ height: '100%', margin: 0 }}>
        <Col style={{ width: 180, borderRight: '1px solid #e8ecf1', padding: 12, background: '#f5f7fa' }}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <div style={{ padding: '4px 4px 8px' }}>
              <Button type="primary" block size="small" icon={<PlusOutlined />}>新对话</Button>
            </div>
            <Divider style={{ margin: '0 0 8px' }} />
            <Text type="secondary" style={{ fontSize: 13, padding: '0 4px', display: 'block', marginBottom: 8 }}>历史对话</Text>
            <List size="small" dataSource={historyItems} renderItem={(item) => {
              const originalIndex = historyItems.indexOf(item);
              const key = `item-${originalIndex}`;
              const pinned = pinnedSet.has(key);
              const selected = originalIndex === activeChat;
              const togglePin = () => {
                if (pinned) { setPinnedOrder((prev) => prev.filter((k) => k !== key)); }
                else { setPinnedOrder((prev) => [key, ...prev]); }
              };
              return (
                <List.Item onClick={() => setActiveChat(originalIndex)}
                  style={{ padding: '5px 8px', cursor: 'pointer', border: 'none', background: selected ? '#e8eef5' : 'transparent', borderRadius: 4, display: 'flex', justifyContent: 'space-between' }}>
                  <Text style={{ color: selected ? '#1a4a9a' : '#333', fontSize: 13 }}>{item}</Text>
                  <Dropdown trigger={['click']} menu={{ items: [
                    { key: 'pin', icon: <PushpinOutlined />, label: pinned ? '取消置顶' : '置顶', onClick: togglePin },
                    { key: 'delete', icon: <DeleteOutlined />, label: '删除', danger: true, onClick: () => {} },
                  ]}}>
                    <Button type="text" size="small" icon={pinned ? <PushpinOutlined style={{ color: '#8e9aaf' }} /> : <MoreOutlined style={{ color: '#8e9aaf' }} />} style={{ padding: '0 4px' }} />
                  </Dropdown>
                </List.Item>
              );
            }} />
          </Space>
        </Col>
        <Col style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <ChatPanel space={space} compact showHeader />
        </Col>
      </Row>
    </Layout>
  );
}
