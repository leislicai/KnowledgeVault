import { useState, useCallback } from 'react';
import { Card, Input, Tag, Button, Typography, Space, Row, Col, List, Alert, Avatar, Popover, Spin, Drawer, Modal } from 'antd';
import { RobotOutlined, SendOutlined, LikeOutlined, DislikeOutlined } from '@ant-design/icons';
import type { SpaceType } from '../App';

type Citation = { id: number; name: string; excerpt: string };
type ChatMessage = { role: 'user' | 'assistant'; content: string; citations?: Citation[]; kbs?: string[] };

const { Text, Title } = Typography;

const API_KEY_STORAGE = 'ds_api_key';
let cachedKey = localStorage.getItem(API_KEY_STORAGE) || '';

const knowledgeBases = [
  { key: 'group', label: '集团知识库', scope: '全集团' },
  { key: 'company', label: '公司知识库', scope: '本公司' },
  { key: 'dept-sales', label: '销售部知识库', scope: '销售部' },
  { key: 'dept-eng', label: '工程部知识库', scope: '工程部' },
  { key: 'dept-prod', label: '生产部知识库', scope: '生产部' },
  { key: 'personal', label: '个人知识库', scope: '仅自己' },
];

const scopeMap: Record<string, string> = { personal: '个人知识库', team: '团队知识库', enterprise: '企业知识库' };

const mockData: Record<string, { reply: string; citations: Citation[] }> = {
  'XX产品参数是多少？': {
    reply: 'XX 产品的标准工作温度为 150-200°C，压力范围 0.5-0.8MPa，转速 1200-1500rpm。当海拔超过 3000m 时，上限温度应降低至 170°C，压力上限调整为 0.7MPa。',
    citations: [
      { id: 1, name: '工艺参数设定规范_v3.pdf', excerpt: '第三章 - 标准工作温度为 150-200°C，压力范围 0.5-0.8MPa，转速 1200-1500rpm...' },
      { id: 2, name: '高原工况补充说明.docx', excerpt: '第 2.1 节 - 当海拔超过 3000m 时，上限温度应降低至 170°C，压力上限调整为 0.7MPa...' },
    ],
  },
  '最新版销售话术': {
    reply: '最新版销售话术模板（v2.0）包含以下核心场景：\n\n1. 初次拜访破冰——"感谢您抽出时间，我们针对贵司所在行业梳理了三个常见痛点..."\n2. 价格异议处理——"我们的价格反映了产品全生命周期的总成本，包括..."\n3. 竞品对比回应——"相较于竞品，我们的核心差异在于..."\n\n建议结合具体客户画像选择匹配话术。',
    citations: [
      { id: 1, name: '销售话术模板_2026Q2.docx', excerpt: '第二章 - 初次拜访破冰话术模板，包含 5 种不同客户类型的开场白...' },
      { id: 2, name: '客户案例_XX集团.pdf', excerpt: '附录 B - 真实客户对话记录，展示了话术在实际场景中的运用效果...' },
    ],
  },
  '竞品对比分析': {
    reply: '目前市场上主要竞品对比（2026 Q1）：\n\n| 维度 | XX产品 | 竞品A | 竞品B |\n| 温度范围 | 150-200°C | 120-180°C | 140-190°C |\n| 高原适配 |  支持 | ✗ 不支持 |  需定制 |\n\n综合来看，在高原工况和温度范围两项核心指标上，XX产品具有明显优势。',
    citations: [
      { id: 1, name: 'XX产品竞品分析报告_2026Q1.docx', excerpt: '第三章 - 竞品参数对比表格，涵盖温度、压力、高原适配等 12 项指标...' },
      { id: 2, name: '客户案例_XX集团.pdf', excerpt: '第 5 页 - 客户亲述：竞品A在高原环境使用 3 个月后出现温度偏差...' },
      { id: 3, name: '行业技术白皮书_2025.pdf', excerpt: '第 12 节 - 高原工况设备性能要求行业标准对比...' },
    ],
  },
  '客户案例推荐': {
    reply: '根据您的行业和客户画像，推荐以下 3 个参考案例：\n\n1. **XX集团**（制造业）——部署后设备故障率降低 35%，年节省维护成本约 80 万元\n2. **YY公司**（能源行业）——使用高原适配方案后，产线稳定运行 18 个月无异常\n3. **ZZ股份**（化工行业）——全厂 120 台设备统一接入知识库，参数管理效率提升 60%',
    citations: [
      { id: 1, name: '客户案例_XX集团.pdf', excerpt: '全文 - XX集团部署 XX 产品的完整案例记录，含使用前后数据对比...' },
      { id: 2, name: '成功案例蒸馏_系统蒸馏.docx', excerpt: '第 3 条 - AI 从高频问答中自动蒸馏的案例总结，经管理员审核发布...' },
    ],
  },
};
const mockCitations = Object.fromEntries(Object.entries(mockData).map(([k, v]) => [k, v.citations]));

const mockOriginalText: Record<string, string> = {
  '工艺参数设定规范_v3.pdf': '# 工艺参数设定规范\n\n**版本：v3**\n**生效日期：2026-03-15**\n\n## 第三章 参数范围\n\n### 3.1 温度范围\n\n标准工作温度为 **150°C 至 200°C**，在此范围内设备运行稳定，输出效率达到额定值的 95% 以上。\n\n### 3.2 压力范围\n\n标准工作压力为 **0.5-0.8MPa**，设计极限压力为 1.2MPa（短期耐受，不超过 30 分钟）。\n\n### 3.3 转速范围\n\n额定转速 **1200-1500rpm**，推荐长期运行转速 1350rpm，兼顾效率与设备寿命。',
  '高原工况补充说明.docx': '# 高原工况补充说明\n\n**版本：v1**\n**生效日期：2026-05-01**\n\n## 第二章 海拔对设备参数的影响\n\n### 2.1 温度修正\n\n当设备运行海拔超过 **3000m** 时，需对标准温度参数进行修正：\n\n- 温度上限：标准 200°C → 修正至 **170°C**\n- 压力上限：标准 0.8MPa → 修正至 **0.7MPa**\n\n修正原因：高海拔地区空气密度降低，散热效率下降约 15%。',
  '销售话术模板_2026Q2.docx': '# 销售话术模板 2026Q2\n\n## 第二章 初次拜访破冰\n\n### 2.1 通用破冰模板\n\n"感谢您抽出时间，我们针对贵司所在行业梳理了三个常见痛点：\n\n1. 设备参数管理分散，查找标准耗时\n2. 新人培训依赖老员工口传，效率低\n3. 跨部门协作时信息不对称"\n\n### 2.2 制造业专属开场\n\n"贵司作为制造业标杆，我们注意到行业普遍面临设备知识传承的挑战..."',
  '客户案例_XX集团.pdf': '# XX集团客户案例\n\n**行业：制造业**\n**部署时间：2025年11月**\n\n## 项目背景\n\nXX集团拥有 12 个生产基地，设备种类超过 200 种，原有知识管理依赖纸质文档和口头传授。\n\n## 部署效果\n\n- 设备故障率降低 **35%**\n- 年节省维护成本约 **80 万元**\n- 新人上岗培训时间从 2 周缩短至 3 天\n\n## 客户评价\n\n"知识库+AI 问答让我们的老师傅经验真正沉淀下来了。" —— 生产总监 王总',
  'XX产品竞品分析报告_2026Q1.docx': '# XX产品竞品分析报告 2026Q1\n\n## 第三章 竞品参数对比\n\n| 维度 | XX产品 | 竞品A | 竞品B |\n|------|--------|-------|-------|\n| 温度范围 | 150-200°C | 120-180°C | 140-190°C |\n| 压力范围 | 0.5-0.8MPa | 0.3-0.6MPa | 0.4-0.7MPa |\n| 高原适配 |  支持 | ✗ 不支持 |  需定制 |\n\n## 结论\n\n在高原工况和温度范围两项核心指标上，XX产品具有明显优势，建议优先向高原地区客户推荐。',
  '行业技术白皮书_2025.pdf': '# 行业技术白皮书 2025\n\n## 第 12 节 高原工况设备性能要求\n\n### 12.1 温度适应性\n\n设备在海拔 3000m 以上运行时，需满足以下要求：\n- 温度上限降低幅度不超过 15%\n- 连续运行 72 小时无性能衰减\n\n### 12.2 压力适应性\n\n- 压力补偿装置需在海拔变化时自动调整\n- 补偿响应时间不超过 30 秒',
  '成功案例蒸馏_系统蒸馏.docx': '# 成功案例蒸馏\n\n**来源：AI 高频问答自动蒸馏**\n**审核状态：已发布**\n\n## 案例 3\n\nXX产品在高原地区客户的部署案例，重点展示了温度修正和压力补偿两项功能在实际生产中的价值。\n\n此案例已被销售部门引用 12 次。',
};

interface Props {
  space: SpaceType;
  compact?: boolean;
  showHeader?: boolean;
}

export default function ChatPanel({ space, compact, showHeader }: Props) {
  const [inputValue, setInputValue] = useState('');
  const [selectedKBs, setSelectedKBs] = useState<typeof knowledgeBases>([]);
  const [showMention, setShowMention] = useState(false);
  const [mentionSearch, setMentionSearch] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerCitations, setDrawerCitations] = useState<Citation[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ name: '', text: '' });
  const [apiKey, setApiKey] = useState(cachedKey);

  const scopeText = scopeMap[space] || '个人知识库';

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

  const callDeepSeek = useCallback(async (question: string) => {
    if (!apiKey) return;
    setLoading(true);
    const kbHint = selectedKBs.length > 0 ? `用户指定知识库：${selectedKBs.map(k => k.label).join('、')}。` : '';
    const systemPrompt = `你是一个企业级 AI 知识库助手。当前检索范围：${scopeText}。${kbHint}每个回答必须基于知识库内容，给出引用来源。如果知识库中没有相关内容，请明确说"当前无匹配的知识"。`;
    try {
      const res = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages.slice(-10).map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: question },
          ],
          stream: false,
        }),
      });
      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content || 'API 调用失败，请检查 API Key';
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: '网络错误，请检查 API Key 与网络连接' }]);
    }
    setLoading(false);
  }, [apiKey, messages, scopeText, selectedKBs]);

  const openCitations = useCallback((citations: Citation[]) => {
    setDrawerCitations(citations);
    setDrawerOpen(true);
  }, []);

  const handleSend = useCallback((text?: string) => {
    const question = (text || inputValue).trim();
    if (!question || loading) return;
    const kbs = selectedKBs.length > 0 ? selectedKBs.map(k => k.label) : undefined;
    setMessages(prev => [...prev, { role: 'user', content: question, kbs }]);
    setInputValue('');
    const mock = mockData[question];
    if (mock) {
      setMessages(prev => [...prev, { role: 'assistant', content: mock.reply, citations: mock.citations }]);
    } else {
      callDeepSeek(question);
    }
  }, [inputValue, loading, callDeepSeek]);

  const quickQuestions = compact ? ['XX产品参数是多少？', '最新版销售话术', '竞品对比分析', '客户案例推荐'] : [];

  const renderDoc = (text: string) => text.split('\n').map((line, i) => {
    const boldRE = /\*\*(.*?)\*\*/;
    if (line.startsWith('# ')) return <Title key={i} level={5} style={{ margin: '12px 0 4px' }}>{line.slice(2)}</Title>;
    if (line.startsWith('## ')) return <Title key={i} level={5} style={{ margin: '12px 0 4px' }}>{line.slice(3)}</Title>;
    if (line.startsWith('### ')) return <Text key={i} strong style={{ display: 'block', margin: '8px 0 2px', fontSize: 13 }}>{line.slice(4)}</Text>;
    if (line.startsWith('**') && line.includes('：')) {
      const m = line.match(boldRE);
      const rest = line.replace(boldRE, '');
      return <Text key={i} style={{ display: 'block', fontSize: 13 }}><Text strong>{m?.[1] || ''}</Text>{rest}</Text>;
    }
    if (line.startsWith('- ')) return <Text key={i} style={{ display: 'block', fontSize: 13, paddingLeft: 16 }}>{line}</Text>;
    if (line.trim() === '') return <br key={i} />;
    return <Text key={i} style={{ display: 'block', fontSize: 13 }}>{line}</Text>;
  });

  return (
    <>
    <Drawer title="引用来源" placement="right" onClose={() => setDrawerOpen(false)} open={drawerOpen} width={480}>
      <List dataSource={drawerCitations} renderItem={(c) => (
        <List.Item>
          <Card size="small" style={{ width: '100%' }}>
            <Space direction="vertical" size={4}>
              <Text strong style={{ fontSize: 13 }}>{c.id}. {c.name}</Text>
              <Text style={{ fontSize: 12, color: '#6b7d8e' }}>{c.excerpt}</Text>
              <Button type="link" size="small" onClick={() => {
                setModalContent({ name: c.name, text: mockOriginalText[c.name] || '（原文内容暂未收录）' });
                setModalOpen(true);
              }}>查看原文 →</Button>
            </Space>
          </Card>
        </List.Item>
      )} />
    </Drawer>
    <Modal title={modalContent.name} open={modalOpen} onCancel={() => setModalOpen(false)} width={720} maskClosable
      closable={false}
      footer={<Row justify="end"><Space><Button> 下载文档</Button><Button type="primary" onClick={() => setModalOpen(false)}>关闭</Button></Space></Row>}>
      <div style={{ whiteSpace: 'pre-wrap', fontSize: 13, lineHeight: 1.8, maxHeight: '60vh', overflowY: 'auto' }}>
        {renderDoc(modalContent.text)}
      </div>
    </Modal>
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {showHeader && (
        <Row align="middle" justify="space-between" style={{ padding: '8px 16px', borderBottom: '1px solid #e8ecf1' }}>
          <Space>
            <Text strong>知识问答</Text>
            <Tag color="#1a4a9a" style={{ fontSize: 10 }}>Agent 在线</Tag>
          </Space>
          <Text type="secondary" style={{ fontSize: 11 }}>默认检索范围：{scopeText}</Text>
        </Row>
      )}

      <div style={{ flex: 1, overflowY: 'auto', padding: compact ? 24 : 16 }}>
        {messages.length === 0 && !loading && !compact && (
          <Row justify="center" style={{ marginTop: 40 }}>
            <Space direction="vertical" size={16} align="center">
              <Avatar size={48} icon={<RobotOutlined />} style={{ background: 'linear-gradient(135deg, #1a4a9a, #4a7c59)' }} />
              <Text style={{ fontSize: 14 }}>有什么可以帮你？</Text>
              <Text type="secondary" style={{ fontSize: 12 }}>当前默认检索范围：{scopeText}</Text>
              <Card size="small" style={{ maxWidth: '80%', background: '#f5f7fa', marginTop: 8 }}>
                <Space direction="vertical" size={6} style={{ width: '100%' }}>
                  <Row justify="center"><Text type="secondary" style={{ fontSize: 11 }}>示例对话</Text></Row>
                  <Text style={{ fontSize: 12 }}>我们产品的温度范围是多少？高原环境下有什么注意事项？</Text>
                  <Text style={{ fontSize: 12 }}>标准工作温度为 <Text strong>150-200°C</Text>，高原环境需降至 <Text strong>170°C</Text>。</Text>
                  <Text type="secondary" style={{ fontSize: 11 }}>引用来源：<Button type="link" size="small" style={{ fontSize: 11, padding: 0 }} onClick={() => openCitations(mockCitations['XX产品参数是多少？'])}>1. 工艺参数设定规范_v3.pdf  2. 高原工况补充说明.docx</Button></Text>
                </Space>
              </Card>
            </Space>
          </Row>
        )}
        {messages.length === 0 && !loading && compact && (
          <Row justify="center" style={{ marginTop: 40 }}>
            <Space direction="vertical" size={16} align="center">
              <Avatar size={48} icon={<RobotOutlined />} style={{ background: 'linear-gradient(135deg, #1a4a9a, #4a7c59)' }} />
              <Text style={{ fontSize: 14 }}>有什么可以帮你？</Text>
              <Text type="secondary" style={{ fontSize: 12 }}>当前默认检索范围：{scopeText}</Text>
              <Space size={8} wrap>
                {quickQuestions.map((q, i) => (<Button key={i} shape="round" size="small" onClick={() => handleSend(q)}>{q}</Button>))}
              </Space>
              <Card size="small" style={{ maxWidth: '80%', background: '#f5f7fa', marginTop: 8 }}>
                <Space direction="vertical" size={6} style={{ width: '100%' }}>
                  <Row justify="center"><Text type="secondary" style={{ fontSize: 11 }}>示例对话</Text></Row>
                  <Space><Text type="secondary" style={{ fontSize: 11 }}>你：</Text><Text style={{ fontSize: 12 }}>我们产品的温度范围是多少？高原环境下有什么注意事项？</Text></Space>
                  <Space align="start">
                    <Text style={{ color: '#1a4a9a', fontSize: 11 }}> Agent：</Text>
                    <Space direction="vertical" size={2}>
                      <Text style={{ fontSize: 12 }}>标准工作温度为 <Text strong>150-200°C</Text>（工艺参数设定规范第三章）。</Text>
                      <Text style={{ fontSize: 12 }}>当海拔超过 <Text strong>3000m</Text> 时，上限温度降低至 <Text strong>170°C</Text>（高原工况补充说明第 2.1 节）。</Text>
                      <Text type="secondary" style={{ fontSize: 11 }}>引用来源：<Button type="link" size="small" style={{ fontSize: 11, padding: 0 }} onClick={() => openCitations(mockCitations['XX产品参数是多少？'])}>1. 工艺参数设定规范_v3.pdf  2. 高原工况补充说明.docx</Button></Text>
                    </Space>
                  </Space>
                </Space>
              </Card>
            </Space>
          </Row>
        )}
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          {messages.map((msg, i) => (
            msg.role === 'user' ? (
              <Row key={i} justify="end" style={{ width: '100%' }}>
                <Card size="small" bodyStyle={{ padding: '10px 14px', background: '#1a4a9a', color: '#fff', borderRadius: 12 }}>
                  <Text style={{ color: '#fff', fontSize: 13 }}>{msg.content}</Text>
                  {msg.kbs && msg.kbs.length > 0 && (
                    <>
                      <div style={{ height: 1, background: 'rgba(255,255,255,0.3)', margin: '8px 0' }} />
                      <Space size={4} wrap>
                        <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>引用：</Text>
                        {msg.kbs.map(kb => <span key={kb} style={{ color: '#fff', fontSize: 11, background: 'rgba(255,255,255,0.15)', padding: '1px 6px', borderRadius: 4 }}>{kb}</span>)}
                      </Space>
                    </>
                  )}
                </Card>
              </Row>
            ) : (
              <Row key={i} align="top" style={{ width: '100%' }}>
                <Avatar size={28} icon={<RobotOutlined />} style={{ background: '#e8ecf1', color: '#333', marginRight: 8 }} />
                <Col style={{ maxWidth: '70%' }}>
                  <Card size="small" bodyStyle={{ padding: '10px 14px' }} style={{ borderRadius: 12 }}>
                    <Text style={{ fontSize: 13, whiteSpace: 'pre-wrap' }}>{msg.content}</Text>
                    {msg.citations && msg.citations.length > 0 && (
                      <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid #e8ecf1' }}>
                        <Text type="secondary" style={{ fontSize: 11 }}>引用来源：</Text>
                        {msg.citations.map((c, j) => (
                          <Button key={c.id} type="link" size="small" onClick={() => openCitations(msg.citations!)}
                            style={{ fontSize: 11, padding: 0 }}>{j + 1}. {c.name}{j < msg.citations!.length - 1 ? '  ' : ''}</Button>
                        ))}
                      </div>
                    )}
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
              <Avatar size={28} icon={<RobotOutlined />} style={{ background: '#e8ecf1', color: '#333', marginRight: 8 }} />
              <Card size="small" bodyStyle={{ padding: '10px 14px' }} style={{ borderRadius: 12 }}><Spin size="small" /> 思考中...</Card>
            </Row>
          )}
        </Space>
      </div>

      {!apiKey && (
        <Alert type="info" showIcon style={{ margin: '0 16px' }}
          message={
            <Space>
              <Text style={{ fontSize: 12 }}>请输入 DeepSeek API Key：</Text>
              <Input.Password size="small" style={{ width: 280 }} placeholder="sk-..."
                onChange={(e) => { localStorage.setItem(API_KEY_STORAGE, e.target.value); cachedKey = e.target.value; setApiKey(e.target.value); }} />
            </Space>
          }
        />
      )}

      <div style={{ padding: '12px 16px', borderTop: '1px solid #e8ecf1' }}>
        {selectedKBs.length > 0 && (
          <Space size={4} style={{ marginBottom: 6, display: 'flex' }}>
            <Text type="secondary" style={{ fontSize: 11 }}>引用知识库：</Text>
            {selectedKBs.map(kb => (
              <Tag key={kb.key} color="#1a4a9a" closable onClose={() => setSelectedKBs(prev => prev.filter(k => k.key !== kb.key))}
                style={{ fontSize: 11 }}>{kb.label}</Tag>
            ))}
          </Space>
        )}
        <div style={{ border: '1px solid #d5dce6', borderRadius: 6, padding: '4px 8px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 4, background: '#fff' }}>
          <Popover open={showMention && filtered.length > 0} trigger="click" placement="topLeft"
            content={
              <List size="small" style={{ width: 220 }} dataSource={filtered}
                renderItem={item => (
                  <List.Item key={item.key} onClick={() => handleSelectKB(item)} style={{ cursor: 'pointer', padding: '6px 10px' }}>
                    <Space direction="vertical" size={0}><Text style={{ fontSize: 12 }}>{item.label}</Text><Text type="secondary" style={{ fontSize: 10 }}>{item.scope}</Text></Space>
                  </List.Item>
                )}
              />
            }>
            <Input placeholder={selectedKBs.length > 0 ? '输入问题...' : '输入问题，或 @ 指定知识范围...'}
              size="middle" value={inputValue} onChange={handleInputChange} onPressEnter={() => handleSend()}
              bordered={false} style={{ flex: 1, minWidth: 150 }}
              suffix={<Button type="primary" size="small" icon={<SendOutlined />} loading={loading} onClick={() => handleSend()} style={{ fontSize: 12 }}>发送</Button>}
            />
          </Popover>
        </div>
      </div>
    </div>
    </>
  );
}
