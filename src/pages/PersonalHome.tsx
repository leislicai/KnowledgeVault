import { useState, useCallback } from 'react';
import { Card, Button, Tag, Typography, Space, Row, Col, List, Dropdown, Divider, Avatar, Input, Spin, Popover } from 'antd';
import { BellOutlined, PlusOutlined, MoreOutlined, PushpinOutlined, DeleteOutlined, RobotOutlined, SendOutlined, LikeOutlined, DislikeOutlined, FileAddOutlined, AuditOutlined, SearchOutlined, FileTextOutlined } from '@ant-design/icons';
import type { SpaceType } from '../App';

const { Text } = Typography;

interface Props { space: SpaceType; onPageChange: (page: string) => void }

type ChatMessage = { role: 'user' | 'assistant'; content: string; kbs?: string[] };

const knowledgeBases = [
  { key: 'group', label: '集团知识库', scope: '全集团' },
  { key: 'company', label: '公司知识库', scope: '本公司' },
  { key: 'dept-sales', label: '销售部知识库', scope: '销售部' },
  { key: 'dept-eng', label: '工程部知识库', scope: '工程部' },
  { key: 'personal', label: '个人知识库', scope: '仅自己' },
];
type AgentAction = { key: string; label: string; icon: React.ReactNode; prompt: string };

const recentChats = ['创建设备维护技术规范', '审核高原工况补充说明', '搜索温度修正参数', '编译预览安全生产制度', '生成新产品研发流程知识', '查询压力补偿装置相关文档'];

const agentActions: AgentAction[] = [
  { key: 'create-knowledge', label: '创建知识', icon: <FileAddOutlined />, prompt: '我想创建一篇新知识，标题是「{用户输入}」，请帮我生成知识初稿，包含标题、摘要和正文框架。' },
  { key: 'review-pending', label: '待审核知识', icon: <AuditOutlined />, prompt: '请列出当前空间中待审核的知识条目，并帮我评估各条目的审核优先级。' },
  { key: 'search-knowledge', label: '搜索知识', icon: <SearchOutlined />, prompt: '帮我搜索关于「{用户输入}」的所有相关知识，并给出简要汇总。' },
  { key: 'compile-preview', label: '编译预览', icon: <FileTextOutlined />, prompt: '帮我预览「{用户输入}」的知识编译结果，检查大纲、实体和关系的抽取质量。' },
];

const agentReplies: Record<string, { reply: string }> = {
  'create-knowledge': { reply: '已为您生成知识初稿...\n\n# 知识初稿\n\n**标题**：待定\n**类型**：技术文档\n**概述**：请提供更多细节以便我完善内容。\n\n## 背景\n\n根据现有知识库中的相关信息，该主题涉及以下要点...\n\n## 正文\n\n（等待您的补充描述以生成完整内容）\n\n> 提示：您可以在知识创建页面继续编辑和提交这篇知识。' },
  'review-pending': { reply: '当前空间有 3 条待审核知识，审核优先级如下：\n\n1. 高原工况补充说明（高优先级）\n2. 设备维护操作手册（中优先级）\n3. 安全生产管理制度汇编（中优先级）\n\n建议从高原工况补充说明开始审核。' },
  'search-knowledge': { reply: '正在搜索知识库...与您查询相关的知识：\n\n1. 工艺参数设定规范_v3\n2. 高原工况补充说明\n3. XX产品竞品分析报告 2026Q1\n\n可前往知识搜索页面查看详情。' },
  'compile-preview': { reply: '知识编译预览报告：\n\n**文档**：高原工况补充说明\n**编译状态**：9 项特征中 4 项已完成，1 项待审核\n\n| 特征 | 状态 |\n|------|------|\n| 大纲 | 已完成 93分 |\n| 实体 | 待审核 72分 |\n| 关系 | 已完成 88分 |\n| 场景 | 已完成 91分 |\n\n建议优先处理实体特征。' },
};

const quickMessages = ['我想创建一个新技术规范', '帮我审核待处理的知识', '搜索高原工况相关内容', '查看最新的编译预览结果'];

export default function PersonalHome({ space: _space, onPageChange }: Props) {
  const [pinnedOrder, setPinnedOrder] = useState<string[]>(['item-0']);
  const [activeChat, setActiveChat] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedKBs, setSelectedKBs] = useState<typeof knowledgeBases>([]);
  const [showMention, setShowMention] = useState(false);
  const [mentionSearch, setMentionSearch] = useState('');
  const pinnedSet = new Set(pinnedOrder);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    const cursorPos = e.target.selectionStart || 0;
    const textBefore = val.slice(0, cursorPos);
    const atIndex = textBefore.lastIndexOf('@');
    if (atIndex !== -1 && (atIndex === 0 || textBefore[atIndex - 1] === ' ')) {
      const search = textBefore.slice(atIndex + 1);
      if (!search.includes(' ')) { setMentionSearch(search); setShowMention(true); return; }
    }
    setShowMention(false);
  }, []);

  const handleSelectKB = useCallback((kb: typeof knowledgeBases[0]) => {
    if (selectedKBs.find(k => k.key === kb.key)) { setShowMention(false); return; }
    setSelectedKBs(prev => [...prev, kb]);
    const atIndex = inputValue.lastIndexOf('@');
    const afterAt = inputValue.slice(atIndex);
    const spaceIdx = afterAt.indexOf(' ');
    const cleaned = spaceIdx === -1 ? '' : afterAt.slice(spaceIdx + 1);
    setInputValue(atIndex === -1 ? inputValue : inputValue.slice(0, atIndex) + cleaned);
    setShowMention(false);
  }, [inputValue, selectedKBs]);

  const filtered = knowledgeBases.filter(kb =>
    kb.label.toLowerCase().includes(mentionSearch.toLowerCase()) && !selectedKBs.find(k => k.key === kb.key)
  );

  const handleSend = useCallback((text: string) => {
    const msg = text.trim();
    if (!msg || loading) return;
    const kbs = selectedKBs.length > 0 ? selectedKBs.map(k => k.label) : undefined;
    setMessages(prev => [...prev, { role: 'user', content: msg, kbs }]);
    setInputValue('');
    setLoading(true);
    setTimeout(() => {
      const reply = agentReplies[Object.keys(agentReplies).find(k => msg.includes('审核') ? k === 'review-pending' : msg.includes('搜索') ? k === 'search-knowledge' : msg.includes('编译') ? k === 'compile-preview' : k === 'create-knowledge') || 'create-knowledge'];
      setMessages(prev => [...prev, { role: 'assistant', content: reply.reply }]);
      setLoading(false);
    }, 800);
  }, [loading]);

  return (
    <div style={{ height: 'calc(100vh - 56px)', display: 'flex', flexDirection: 'column' }}>
      {/* Top banner strip */}
      <div style={{ padding: '10px 12px', borderBottom: '1px solid #e8ecf1', background: '#f5f7fa', display: 'flex', gap: 12, overflowX: 'auto', alignItems: 'center' }}>
        <Card size="small" bodyStyle={{ padding: '8px 14px', textAlign: 'center' }} style={{ flex: '1 1 0', minWidth: 280 }}>
          <Space size={10}>
            <Text strong style={{ fontSize: 13 }}> 我的待办</Text>
            <Button type="link" size="small" style={{ fontSize: 12, padding: 0 }} onClick={() => onPageChange('compilation-list')}><Tag color="#8b3a3a" style={{ fontSize: 12, padding: '2px 8px', cursor: 'pointer' }}>知识审核: 3</Tag></Button>
            <Button type="link" size="small" style={{ fontSize: 12, padding: 0 }} onClick={() => onPageChange('knowledge-push')}><Tag color="#8b6914" style={{ fontSize: 12, padding: '2px 8px', cursor: 'pointer' }}>知识审批: 2</Tag></Button>
          </Space>
        </Card>
        <Card size="small" bodyStyle={{ padding: '8px 14px', textAlign: 'center' }} style={{ flex: '1 1 0', minWidth: 280, opacity: 0.5 }}>
          <Space size={8}>
            <Text strong style={{ fontSize: 13 }}> 我的小计</Text>
            <Button type="link" size="small" style={{ fontSize: 12, padding: 0 }}><Tag color="#1a4a9a" style={{ fontSize: 12, padding: '2px 8px', cursor: 'default' }}>审核 24</Tag></Button>
            <Button type="link" size="small" style={{ fontSize: 12, padding: 0 }}><Tag color="#4a7c59" style={{ fontSize: 12, padding: '2px 8px', cursor: 'default' }}>归档 56</Tag></Button>
            <Button type="link" size="small" style={{ fontSize: 12, padding: 0 }}><Tag color="#6b5488" style={{ fontSize: 12, padding: '2px 8px', cursor: 'default' }}>被引用 132</Tag></Button>
            <Tag color="default" style={{ fontSize: 10 }}>待开放</Tag>
          </Space>
        </Card>
        <Card size="small" bodyStyle={{ padding: '8px 14px', textAlign: 'center' }} style={{ flex: '1 1 0', minWidth: 280, opacity: 0.5 }}>
          <Space size={8}>
            <BellOutlined style={{ fontSize: 14 }} />
            <Text strong style={{ fontSize: 13 }}>我的订阅</Text>
            <Button type="link" size="small" style={{ fontSize: 12, padding: 0 }}><Tag color="#8b3a3a" style={{ fontSize: 12, padding: '2px 8px', cursor: 'default' }}> 销售话术</Tag></Button>
            <Button type="link" size="small" style={{ fontSize: 12, padding: 0 }}><Tag color="#1a4a9a" style={{ fontSize: 12, padding: '2px 8px', cursor: 'default' }}> 竞品分析 2 条</Tag></Button>
            <Tag color="default" style={{ fontSize: 10 }}>待开放</Tag>
          </Space>
        </Card>
      </div>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left sidebar */}
        <div style={{ width: 160, borderRight: '1px solid #e8ecf1', padding: 8, background: '#f5f7fa', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '4px 4px 8px' }}>
            <Button type="primary" block size="small" icon={<PlusOutlined />} onClick={() => { setMessages([]); setInputValue(''); }}>新对话</Button>
          </div>
          <Divider style={{ margin: '0 0 8px' }} />
          <Text type="secondary" style={{ fontSize: 12, padding: '0 4px', display: 'block', marginBottom: 6 }}>历史对话</Text>
          <List size="small" dataSource={recentChats} renderItem={(item) => {
            const idx = recentChats.indexOf(item);
            const key = `item-${idx}`;
            const pinned = pinnedSet.has(key);
            const selected = idx === activeChat;
            const togglePin = () => {
              if (pinned) { setPinnedOrder(prev => prev.filter(k => k !== key)); }
              else { setPinnedOrder(prev => [key, ...prev]); }
            };
            return (
              <List.Item onClick={() => setActiveChat(idx)}
                style={{ padding: '4px 8px', cursor: 'pointer', border: 'none', background: selected ? '#e8eef5' : 'transparent', borderRadius: 4, display: 'flex', justifyContent: 'space-between' }}>
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
        </div>

        {/* Center: Agent Assistant Chat */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#fff' }}>
          <Row align="middle" justify="space-between" style={{ padding: '10px 20px', borderBottom: '1px solid #e8ecf1', flexShrink: 0 }}>
            <Space>
              <Avatar size={32} icon={<RobotOutlined />} style={{ background: 'linear-gradient(135deg, #1a4a9a, #4096ff)' }} />
              <div>
                <Text strong style={{ fontSize: 14 }}>知识助理</Text>
                <Tag color="#4a7c59" style={{ fontSize: 10, marginLeft: 8 }}>在线</Tag>
              </div>
            </Space>
            <Text type="secondary" style={{ fontSize: 11 }}>可创建知识 · 审核管理 · 智能检索 · 编译预览</Text>
          </Row>

          <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
            {messages.length === 0 && !loading && (
              <div style={{ maxWidth: 640, margin: '0 auto' }}>
                <Row justify="center" style={{ marginTop: 24, marginBottom: 28 }}>
                  <Space direction="vertical" size={12} align="center">
                    <Avatar size={56} icon={<RobotOutlined />} style={{ background: 'linear-gradient(135deg, #1a4a9a, #4096ff)' }} />
                    <Text style={{ fontSize: 16, fontWeight: 600 }}>你好，我是知识助理</Text>
                    <Text type="secondary" style={{ fontSize: 13, textAlign: 'center' }}>
                      我可以帮你创建知识、审核内容、智能检索和编译预览。
                      <br />请选择一个快捷操作或直接输入你的需求。
                    </Text>
                  </Space>
                </Row>

                <Text type="secondary" style={{ fontSize: 12, marginBottom: 12, display: 'block' }}>快捷能力</Text>
                <Row gutter={[12, 12]} style={{ marginBottom: 24 }}>
                  {agentActions.map(a => (
                    <Col span={12} key={a.key}>
                      <Card size="small" hoverable onClick={() => handleSend(a.prompt.replace('{用户输入}', '新知识'))}
                        styles={{ body: { padding: '12px 16px' } }}>
                        <Space>
                          <span style={{ fontSize: 18, color: '#1a4a9a' }}>{a.icon}</span>
                          <div>
                            <Text strong style={{ fontSize: 13 }}>{a.label}</Text>
                            <Text type="secondary" style={{ fontSize: 11, display: 'block' }}>点击快速开始</Text>
                          </div>
                        </Space>
                      </Card>
                    </Col>
                  ))}
                </Row>

                <Text type="secondary" style={{ fontSize: 12, marginBottom: 12, display: 'block' }}>快捷提问</Text>
                <Space wrap size={8}>
                  {quickMessages.map(q => (
                    <Button key={q} shape="round" size="small" onClick={() => handleSend(q)}
                      style={{ fontSize: 12, paddingInline: 14 }}>{q}</Button>
                  ))}
                </Space>
              </div>
            )}

            <Space direction="vertical" size={16} style={{ width: '100%' }}>
              {messages.map((msg, i) => (
                msg.role === 'user' ? (
                  <Row key={i} justify="end" style={{ width: '100%' }}>
                    <Card size="small" bodyStyle={{ padding: '10px 14px', background: '#1a4a9a', color: '#fff', borderRadius: 12 }}>
                      <Text style={{ color: '#fff', fontSize: 13 }}>{msg.content}</Text>
                      {msg.kbs && msg.kbs.length > 0 && (
                        <>
                          <div style={{ height: 1, background: 'rgba(255,255,255,0.25)', margin: '6px 0' }} />
                          <Space size={4} wrap>
                            <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 10 }}>引用：</Text>
                            {msg.kbs.map(kb => <span key={kb} style={{ color: '#fff', fontSize: 10, background: 'rgba(255,255,255,0.12)', padding: '1px 5px', borderRadius: 3 }}>{kb}</span>)}
                          </Space>
                        </>
                      )}
                    </Card>
                  </Row>
                ) : (
                  <Row key={i} align="top" style={{ width: '100%' }}>
                    <Avatar size={28} icon={<RobotOutlined />} style={{ background: 'linear-gradient(135deg, #1a4a9a, #4096ff)', color: '#fff', marginRight: 10, flexShrink: 0 }} />
                    <Col style={{ maxWidth: '80%' }}>
                      <Card size="small" bodyStyle={{ padding: '10px 14px' }} style={{ borderRadius: 12 }}>
                        <Text style={{ fontSize: 13, whiteSpace: 'pre-wrap' }}>{msg.content}</Text>
                      </Card>
                      <Space size={8} style={{ marginTop: 4 }}>
                        <Button type="text" size="small" icon={<LikeOutlined />} />
                        <Button type="text" size="small" icon={<DislikeOutlined />} />
                      </Space>
                    </Col>
                  </Row>
                )
              ))}
              {loading && (
                <Row align="top" style={{ width: '100%' }}>
                  <Avatar size={28} icon={<RobotOutlined />} style={{ background: 'linear-gradient(135deg, #1a4a9a, #4096ff)', color: '#fff', marginRight: 10, flexShrink: 0 }} />
                  <Card size="small" bodyStyle={{ padding: '10px 14px' }} style={{ borderRadius: 12 }}><Spin size="small" /> 思考中...</Card>
                </Row>
              )}
            </Space>
          </div>

          <div style={{ padding: '12px 20px', borderTop: '1px solid #e8ecf1', flexShrink: 0 }}>
            {selectedKBs.length > 0 && (
              <Space size={4} style={{ marginBottom: 6, display: 'flex' }}>
                <Text type="secondary" style={{ fontSize: 11 }}>引用知识库：</Text>
                {selectedKBs.map(kb => (
                  <Tag key={kb.key} color="#1a4a9a" closable onClose={() => setSelectedKBs(prev => prev.filter(k => k.key !== kb.key))} style={{ fontSize: 11 }}>{kb.label}</Tag>
                ))}
              </Space>
            )}
            <div style={{ border: '1px solid #d5dce6', borderRadius: 8, padding: '4px 10px', display: 'flex', alignItems: 'center', gap: 4, background: '#fff' }}>
              <Popover open={showMention && filtered.length > 0} trigger="click" placement="topLeft"
                content={<List size="small" style={{ width: 200 }} dataSource={filtered}
                  renderItem={item => (
                    <List.Item key={item.key} onClick={() => handleSelectKB(item)} style={{ cursor: 'pointer', padding: '6px 10px' }}>
                      <Space direction="vertical" size={0}><Text style={{ fontSize: 12 }}>{item.label}</Text><Text type="secondary" style={{ fontSize: 10 }}>{item.scope}</Text></Space>
                    </List.Item>
                  )} />}>
                <Input placeholder="描述你想创建的知识、需要审核的内容，或直接提出搜索和编译需求... 输入 @ 指定知识库"
                  size="middle" value={inputValue} onChange={handleInputChange} onPressEnter={() => handleSend(inputValue)}
                  bordered={false} style={{ flex: 1 }}
                  suffix={<Button type="primary" size="small" icon={<SendOutlined />} loading={loading} onClick={() => handleSend(inputValue)} style={{ fontSize: 12 }}>发送</Button>} />
              </Popover>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
