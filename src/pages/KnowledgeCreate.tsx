import { useState, useCallback, useEffect } from 'react';
import { Card, Button, Typography, Space, Row, Col, Upload, Alert, Layout, Input, Switch, Tag, Radio, Modal, Select, AutoComplete, Progress } from 'antd';
import { InboxOutlined, LinkOutlined, FileAddOutlined, GlobalOutlined, FolderOpenOutlined, PlusOutlined, CheckCircleOutlined, CheckCircleFilled, SyncOutlined, CloseOutlined } from '@ant-design/icons';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import MDEditor from '@uiw/react-md-editor';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

const { Text, Title } = Typography;
const { Dragger } = Upload;

interface Props { onPageChange: (page: string) => void; role?: string; focus?: string | null }

const rolePaths: Record<string, string[]> = {
  normal: ['个人空间', '个人空间 / 我的笔记', '个人空间 / 项目复盘'],
  'team-admin': ['团队空间', '团队空间 / 销售部公共库', '团队空间 / 工程部知识库', '团队空间 / 销售部公共库 / 销售话术', '团队空间 / 销售部公共库 / 客户案例'],
  'enterprise-admin': ['企业空间', '企业空间 / 公司知识库', '企业空间 / 集团知识库'],
};

const existingFiles = [
  { name: '高原工况补充说明', path: '个人空间' },
  { name: '工艺参数设定规范', path: '团队空间 / 销售部公共库' },
  { name: '产品结构图说明', path: '个人空间 / 我的笔记' },
];

function RichEditor() {
  const editor = useEditor({ extensions: [StarterKit, Underline, Placeholder.configure({ placeholder: '在此输入知识内容' })] });
  return (
    <div style={{ border: '1px solid #d5dce6', borderRadius: 4, overflow: 'hidden' }}>
      <div style={{ display: 'flex', gap: 2, padding: '6px 8px 4px', flexWrap: 'wrap', borderBottom: '1px solid #e8ecf1', background: '#f5f7fa' }}>
        <Button size="small" type="text" onMouseDown={(e) => { e.preventDefault(); editor?.chain().focus().toggleBold().run(); }} style={{ fontSize: 13, fontWeight: 'bold' }}>B</Button>
        <div style={{ width: 1, height: 20, background: '#e0e0e0', margin: '0 4px' }} />
        <Button size="small" type="text" onMouseDown={(e) => { e.preventDefault(); editor?.chain().focus().toggleItalic().run(); }} style={{ fontSize: 13, fontStyle: 'italic' }}>I</Button>
        <Button size="small" type="text" onMouseDown={(e) => { e.preventDefault(); editor?.chain().focus().toggleUnderline().run(); }} style={{ fontSize: 13, textDecoration: 'underline' }}>U</Button>
        <Button size="small" type="text" onMouseDown={(e) => { e.preventDefault(); editor?.chain().focus().toggleStrike().run(); }} style={{ fontSize: 13 }}>S</Button>
        <div style={{ width: 1, height: 20, background: '#e0e0e0', margin: '0 4px' }} />
        <Button size="small" type="text" onMouseDown={(e) => { e.preventDefault(); editor?.chain().focus().toggleHeading({ level: 1 }).run(); }}>H1</Button>
        <Button size="small" type="text" onMouseDown={(e) => { e.preventDefault(); editor?.chain().focus().toggleHeading({ level: 2 }).run(); }}>H2</Button>
        <Button size="small" type="text" onMouseDown={(e) => { e.preventDefault(); editor?.chain().focus().toggleHeading({ level: 3 }).run(); }}>H3</Button>
        <div style={{ width: 1, height: 20, background: '#e0e0e0', margin: '0 4px' }} />
        <Button size="small" type="text" onMouseDown={(e) => { e.preventDefault(); editor?.chain().focus().toggleBulletList().run(); }}>☰ 列表</Button>
        <Button size="small" type="text" onMouseDown={(e) => { e.preventDefault(); editor?.chain().focus().toggleOrderedList().run(); }}># 有序</Button>
        <Button size="small" type="text" onMouseDown={(e) => { e.preventDefault(); editor?.chain().focus().toggleBlockquote().run(); }}>❝ 引用</Button>
        <div style={{ width: 1, height: 20, background: '#e0e0e0', margin: '0 4px' }} />
        <Button size="small" type="text" onMouseDown={(e) => { e.preventDefault(); editor?.chain().focus().setHorizontalRule().run(); }}>— 分割线</Button>
      </div>
      <div style={{ padding: 8, minHeight: 140 }}><EditorContent editor={editor} style={{ minHeight: 120 }} /></div>
    </div>
  );
}

const allNameOptions = existingFiles.map(f => ({ value: f.name, label: f.name }));

export default function KnowledgeCreate({ onPageChange: _onPageChange, role, focus }: Props) {
  const [editorMode, setEditorMode] = useState('richtext');
  const [mdValue, setMdValue] = useState('');
  const [uploads, setUploads] = useState<{ name: string; progress: number; done: boolean }[]>([]);
  const [submitOpen, setSubmitOpen] = useState(false);
  const [conflictOpen, setConflictOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [kName, setKName] = useState('');
  const defaultPath = rolePaths[role || 'normal']?.[0] || '个人空间';
  const [kPath, setKPath] = useState(defaultPath);
  const [kVersion, setKVersion] = useState('V1');
  const [addPathOpen, setAddPathOpen] = useState(false);
  const [newPath, setNewPath] = useState('');
  const [newPathType, setNewPathType] = useState('network');
  const [authEnabled, setAuthEnabled] = useState(false);
  const [authUser, setAuthUser] = useState('');
  const [authPass, setAuthPass] = useState('');
  const [authPort, setAuthPort] = useState('');
  const [authKey, setAuthKey] = useState('');
  const [authSecret, setAuthSecret] = useState('');
  const [authEndpoint, setAuthEndpoint] = useState('');
  const [authBucket, setAuthBucket] = useState('');
  const [authRegion, setAuthRegion] = useState('');
  const [md5Check, setMd5Check] = useState(true);
  const [incrScan, setIncrScan] = useState(true);
  const [resumeTransfer, setResumeTransfer] = useState(true);
  const [docConnectorOpen, setDocConnectorOpen] = useState(false);
  const [connectors, setConnectors] = useState<Array<{ key: string; name: string; type: string; status: string; config: Record<string, string> }>>([
    { key: '1', name: '企业微信', type: 'wecom', status: '已连接', config: { corpId: 'wx123456', corpSecret: '***', agentId: '100001' } },
    { key: '2', name: '钉钉', type: 'dingtalk', status: '已连接', config: { appKey: 'dingabc123', appSecret: '***', webhook: 'https://oapi.dingtalk.com/robot/xxx' } },
    { key: '3', name: '飞书', type: 'lark', status: '待配置', config: { appId: '' } },
  ]);
  const [newConnectorType, setNewConnectorType] = useState('dingtalk');
  const [, setConnectorName] = useState('');
  const [connectorConfig, setConnectorConfig] = useState<Record<string, string>>({});

  const [extractUrl, setExtractUrl] = useState('');

  useEffect(() => {
    if (focus) {
      setTimeout(() => {
        const all = document.querySelectorAll('.ant-card');
        const findCard = (text: string): Element | null => { for (const c of all) { if (c.textContent?.includes(text)) return c; } return null; };
        if (focus === 'upload') findCard('上传文件')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        if (focus === 'editor') findCard('知识编辑器')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 200);
    }
  }, [focus]);
  const [extractModalOpen, setExtractModalOpen] = useState(false);
  const [extractResult, setExtractResult] = useState<{ success: boolean; content?: string; error?: string } | null>(null);

  const handleExtract = useCallback(() => {
    if (!extractUrl.trim()) return;
    if (!extractUrl.startsWith('http')) {
      setExtractResult({ success: false, error: 'URL 格式无效，请输入以 http:// 或 https:// 开头的完整地址' });
      setExtractModalOpen(true);
      return;
    }
    if (extractUrl.includes('example.com') || extractUrl.includes('test')) {
      setExtractResult({ success: false, error: '无法访问目标地址，请求超时（连接超过 10 秒未响应）' });
      setExtractModalOpen(true);
      return;
    }
    setExtractResult({ success: true, content: `# 网页提取结果\n\n**来源：** ${extractUrl}\n\n## 核心内容\n\n在高原工况和温度范围两项核心指标上，XX产品具有明显优势。\\n\n1. 温度范围：150-200°C，高原环境降至 170°C\\n\n2. 压力范围：0.5-0.8MPa，含自动补偿\\n\n3. 适配等级：支持 3000m 以下 95% 工况\n\n## 元数据\n\n- 标题：XX产品技术参数说明 - 官方网站\n- 字数：约 1200 字\n- 提取时间：2026-05-20 14:32\n\n> 已自动去除导航栏、广告、页脚等噪音内容` });
    setExtractModalOpen(true);
  }, [extractUrl]);

  const [monitorFolders, setMonitorFolders] = useState([
    { key: '1', path: ' 个人空间', type: 'local', files: 18, status: '监控中', md5: true, incr: true, resume: true,
    checks: { total: 18, passed: 18, failed: 0 } },
    { key: '2', path: '/network/share/工艺文档/', type: 'network', files: 12, status: '监控中', md5: true, incr: true, resume: true,
    checks: { total: 12, passed: 11, failed: 1 } },
    { key: '3', path: 'sftp://zhangsan-server/doc/', type: 'network', files: 5, status: '已暂停', md5: true, incr: false, resume: true,
    checks: { total: 5, passed: 5, failed: 0 } },
  ]);

  const connectorFields: Record<string, { key: string; label: string; required?: boolean }[]> = {
    dingtalk: [
      { key: 'appKey', label: 'AppKey（应用标识）', required: true },
      { key: 'appSecret', label: 'AppSecret（应用密钥）', required: true },
      { key: 'webhook', label: '机器人 Webhook 地址' },
      { key: 'agentId', label: 'AgentId（微应用 ID）' },
    ],
    wecom: [
      { key: 'corpId', label: 'CorpId（企业 ID）', required: true },
      { key: 'corpSecret', label: 'CorpSecret（应用密钥）', required: true },
      { key: 'agentId', label: 'AgentId（应用 ID）' },
      { key: 'webhook', label: '群机器人 Webhook 地址' },
    ],
    lark: [
      { key: 'appId', label: 'App ID（应用标识）', required: true },
      { key: 'appSecret', label: 'App Secret（应用密钥）', required: true },
      { key: 'webhook', label: '机器人 Webhook 地址' },
    ],
  };

  const handleAddConnector = () => {
    const key = 'c' + Date.now();
    const labels = { dingtalk: '钉钉', wecom: '企业微信', lark: '飞书' };
    setConnectors(prev => [...prev, { key, name: labels[newConnectorType as keyof typeof labels] || newConnectorType, type: newConnectorType, status: '已连接', config: { ...connectorConfig } }]);
    setDocConnectorOpen(false); setConnectorName(''); setConnectorConfig({});
  };

  const handleAddPath = () => {
    if (!newPath.trim()) return;
    const key = 'f' + Date.now();
    const authInfo = authEnabled ? {
      user: authUser, pass: authPass, port: authPort, accessKey: authKey, secretKey: authSecret, endpoint: authEndpoint, bucket: authBucket, region: authRegion
    } : null;
    setMonitorFolders(prev => [...prev, { key, path: newPath, type: newPathType, files: 0, status: '监控中', md5: md5Check, incr: incrScan, resume: resumeTransfer, checks: { total: 0, passed: 0, failed: 0 }, auth: authInfo }]);
    setNewPath(''); setNewPathType('network'); setAuthEnabled(false); setAuthUser(''); setAuthPass(''); setAuthPort(''); setAuthKey(''); setAuthSecret(''); setAuthEndpoint(''); setAuthBucket(''); setAuthRegion('');
    setAddPathOpen(false);
  };

  const checkConflict = (name: string, path: string) => existingFiles.find(f => f.name === name && f.path === path);
  const parseVer = (v: string) => Math.min(Math.max(parseInt(v.replace(/^V/i, '')) || 1, 1), 999999);
  const formatVer = (n: number) => 'V' + Math.min(Math.max(n, 1), 999999);

  const handleSubmitClick = () => {
    const conflict = checkConflict(kName, kPath);
    if (conflict) {
      setConflictOpen(true);
    } else {
      setKVersion('V1');
      setSubmitOpen(false);
    }
  };

  const handleUpdateVersion = () => {
    setKVersion(formatVer(parseVer(kVersion) + 1));
    setConflictOpen(false);
    setSubmitOpen(false);
  };

  const handleOverwriteClick = () => { setConflictOpen(false); setPasswordOpen(true); };

  const handlePasswordConfirm = () => {
    if (password === 'admin123') {
      setPasswordOpen(false);
      setSubmitOpen(false);
      setPassword('');
    }
  };

  return (
    <Layout style={{ padding: 24, overflowY: 'auto', height: 'calc(100vh - 56px)' }}>
      <Title level={4} style={{ marginBottom: 16 }}>知识创建</Title>

      <Card title={<Space><FileAddOutlined /> 上传文件</Space>} size="small" style={{ marginBottom: 16 }}
        extra={<Button type="primary" size="small" disabled={uploads.some(u => !u.done) || uploads.length === 0}
          onClick={() => {
            const conflict = uploads.find(u => existingFiles.some(f => f.name === u.name.replace(/\.\w+$/, '')));
            if (conflict) { setKName(conflict.name.replace(/\.\w+$/, '')); setConflictOpen(true); }
            else setUploads([]);
          }}>提交</Button>}>
        <Dragger style={{ padding: 16 }} multiple showUploadList={false}
          beforeUpload={(file) => {
            const newItem = { name: file.name, progress: 0, done: false };
            setUploads(prev => [...prev, newItem]);
            let p = 0;
            const interval = setInterval(() => {
              p += Math.floor(Math.random() * 12) + 5;
              if (p >= 100) {
                p = 100; clearInterval(interval);
                setUploads(prev => prev.map(u => u.name === file.name && !u.done ? { ...u, progress: 100, done: true } : u));
              } else {
                setUploads(prev => prev.map(u => u.name === file.name ? { ...u, progress: p } : u));
              }
            }, 250);
            return false;
          }}>
          <p className="ant-upload-drag-icon"><InboxOutlined /></p>
          <p className="ant-upload-text">拖拽文件到此处，或点击选择文件</p>
          <p className="ant-upload-hint">支持 PDF / DOCX / PPTX / HTML / TXT / CSV / 图片</p>
        </Dragger>
        {uploads.length > 0 && (
          <div style={{ marginTop: 12 }}>
            {uploads.map((u, i) => (
              <Row key={i} align="middle" style={{ marginBottom: i < uploads.length - 1 ? 6 : 0 }}>
                <Text style={{ fontSize: 12, width: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.name}</Text>
                <div style={{ flex: 1, margin: '0 12px' }}>
                  <Progress percent={u.progress} size="small" showInfo={u.progress > 0 && !u.done} strokeColor={u.done ? '#4a7c59' : '#1a4a9a'} />
                </div>
                {u.done ? <CheckCircleFilled style={{ color: '#4a7c59', fontSize: 16 }} /> : <Text type="secondary" style={{ fontSize: 11, width: 36, textAlign: 'right' }}>{u.progress}%</Text>}
                <Button type="text" size="small" icon={<CloseOutlined />} onClick={() => setUploads(prev => prev.filter((_, idx) => idx !== i))} style={{ marginLeft: 4 }} />
              </Row>
            ))}
          </div>
        )}
      </Card>

      <Row gutter={16} style={{ display: 'flex' }}>
        <Col span={12} style={{ display: 'flex' }}>
          <Card size="small" title={<Space><FolderOpenOutlined /> 文件夹智能监听</Space>}
            extra={<Button type="primary" size="small" icon={<PlusOutlined />} onClick={() => setAddPathOpen(true)}>添加路径</Button>}
            style={{ flex: 1, display: 'flex', flexDirection: 'column' }} bodyStyle={{ flex: 1 }}>
            <Text type="secondary" style={{ fontSize: 11, marginBottom: 8, display: 'block' }}>监控指定本地/网络/云存储路径，自动发现新增、修改或删除的文件</Text>
            {monitorFolders.map(f => (
              <Card key={f.key} size="small" bodyStyle={{ padding: '6px 8px' }}>
                <Row justify="space-between" align="middle" style={{ marginBottom: 4 }}>
                  <Space>
                    <Tag color={f.type === 'local' ? '#1a4a9a' : f.type === 'network' ? '#8b6914' : '#6b5488'} style={{ fontSize: 9 }}>{f.type === 'local' ? '本地' : f.type === 'network' ? '网络' : '云'}</Tag>
                    <Text strong style={{ fontSize: 12 }}>{f.path}</Text>
                  </Space>
                  <Space size={4}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: f.status === '监控中' ? '#4a7c59' : '#8e9aaf', display: 'inline-block' }} />
                    <Text style={{ fontSize: 10, color: f.status === '监控中' ? '#4a7c59' : '#8e9aaf' }}>{f.status}</Text>
                    <Switch size="small" checked={f.status === '监控中'} disabled={f.path === ' 个人空间'} onChange={(v) => setMonitorFolders(prev => prev.map(x => x.key === f.key ? { ...x, status: v ? '监控中' : '已暂停' } : x))} />
                  </Space>
                </Row>
                <Row align="middle" style={{ fontSize: 10, color: '#8e9aaf' }}>
                  <Col span={8}> {f.files} 个文件</Col>
                  <Col span={8}>{f.md5 && <><CheckCircleOutlined style={{ color: f.checks.failed > 0 ? '#8b3a3a' : '#4a7c59' }} /> MD5 {f.checks.passed}/{f.checks.total}</>}</Col>
                  <Col span={4}>{f.incr && <><SyncOutlined /> 增量</>}</Col>
                  <Col span={4}>{f.resume && ' 续传'}</Col>
                </Row>
              </Card>
            ))}
          </Card>
        </Col>
        <Col span={12} style={{ display: 'flex' }}>
          <Card size="small" title={<Space><LinkOutlined /> 文档连接器</Space>}
            extra={<Button type="primary" size="small" icon={<PlusOutlined />} onClick={() => setDocConnectorOpen(true)}>添加</Button>}
            style={{ flex: 1, display: 'flex', flexDirection: 'column' }} bodyStyle={{ flex: 1 }}>
            <Text type="secondary" style={{ fontSize: 11, marginBottom: 8, display: 'block' }}>对接钉钉、企业微信、飞书的云文档，自动同步文档到知识库</Text>
            {connectors.map(c => (
              <Card key={c.key} size="small" bodyStyle={{ padding: '6px 8px' }} style={{ marginBottom: 4 }}>
                <Row justify="space-between" align="middle">
                  <Space>
                    <Tag color={c.type === 'wecom' ? '#1a4a9a' : c.type === 'dingtalk' ? '#4a7c59' : '#6b5488'} style={{ fontSize: 9 }}>
                      {c.type === 'wecom' ? '企微' : c.type === 'dingtalk' ? '钉钉' : '飞书'}
                    </Tag>
                    <Text strong style={{ fontSize: 12 }}>{c.name}</Text>
                  </Space>
                  <Tag color={c.status === '已连接' ? '#4a7c59' : '#8b6914'} style={{ fontSize: 9 }}>{c.status}</Tag>
                </Row>
                {Object.keys(c.config).length > 0 && <Text type="secondary" style={{ fontSize: 9, display: 'block' }}>
                  {c.type === 'wecom' && `CorpId: ${c.config.corpId}`}
                  {c.type === 'dingtalk' && `AppKey: ${c.config.appKey}`}
                  {c.type === 'lark' && `AppId: ${c.config.appId || '—'}`}
                </Text>}
              </Card>
            ))}
          </Card>
        </Col>
      </Row>

      <Card size="small" title={<Space><GlobalOutlined /> 网页自动提取</Space>}
        extra={<Button type="primary" size="small" icon={<PlusOutlined />} disabled={!extractUrl.trim()} onClick={handleExtract}>提取</Button>} style={{ marginTop: 16 }}>
        <Space direction="vertical" size={8} style={{ width: '100%' }}>
          <Text type="secondary" style={{ fontSize: 11 }}>输入 URL 后自动抓取并清洗网页核心内容，转为结构化知识</Text>
          <Input placeholder="https://..." size="small" style={{ maxWidth: 480 }} value={extractUrl} onChange={e => setExtractUrl(e.target.value)} onPressEnter={handleExtract} />
          <Alert type="info" showIcon message="支持去广告、去导航、提取正文" style={{ fontSize: 11 }} />
        </Space>
      </Card>

      <Card title="知识编辑器" size="small" style={{ marginTop: 16, marginBottom: 16 }}
        extra={<Space><Button size="small">暂存</Button><Button type="primary" size="small" onClick={() => setSubmitOpen(true)}>提交</Button></Space>}>
        <Space direction="vertical" size={8} style={{ width: '100%' }}>
          <Radio.Group value={editorMode} onChange={(e) => setEditorMode(e.target.value)} size="small">
            <Radio.Button value="richtext">富文本</Radio.Button>
            <Radio.Button value="markdown">Markdown</Radio.Button>
          </Radio.Group>
          {editorMode === 'richtext' ? <RichEditor /> : <div data-color-mode="light"><MDEditor value={mdValue} onChange={(v) => setMdValue(v || '')} height={200} /></div>}
        </Space>
      </Card>

      <Modal title="网页提取结果" open={extractModalOpen} onCancel={() => setExtractModalOpen(false)} width={640}
        footer={<Space>{extractResult?.success
          ? <><Button onClick={() => setExtractModalOpen(false)}>取消</Button><Button type="primary" onClick={() => { setExtractModalOpen(false); setSubmitOpen(true); }}>确认入库</Button></>
          : <Button type="primary" onClick={() => setExtractModalOpen(false)}>关闭</Button>}</Space>}>
        {extractResult?.success
          ? <div style={{ whiteSpace: 'pre-wrap', fontSize: 13, lineHeight: 1.8, maxHeight: '50vh', overflowY: 'auto' }}>
              {extractResult.content?.split('\\n').map((line, i) => {
                if (line.startsWith('# ')) return <Typography.Title key={i} level={5}>{line.slice(2)}</Typography.Title>;
                if (line.startsWith('## ')) return <Typography.Title key={i} level={5} style={{ marginTop: 8 }}>{line.slice(3)}</Typography.Title>;
                if (line.startsWith('- ')) return <Typography.Text key={i} style={{ display: 'block', paddingLeft: 12 }}>{line}</Typography.Text>;
                if (line.startsWith('> ')) return <Typography.Paragraph key={i} type="secondary" style={{ borderLeft: '3px solid #1a4a9a', paddingLeft: 8 }}>{line.slice(2)}</Typography.Paragraph>;
                if (line.trim() === '') return <br key={i} />;
                return <Typography.Text key={i} style={{ display: 'block' }}>{line}</Typography.Text>;
              })}
            </div>
          : <Alert type="error" showIcon message={extractResult?.error || '提取失败'} />}
      </Modal>

      <Modal title="添加文档连接器" open={docConnectorOpen} onCancel={() => setDocConnectorOpen(false)}
        footer={<Space><Button onClick={() => setDocConnectorOpen(false)}>取消</Button><Button type="primary" onClick={handleAddConnector}>添加</Button></Space>} width={480}>
        <Space direction="vertical" size={12} style={{ width: '100%' }}>
          <div>
            <Text type="secondary" style={{ display: 'block', marginBottom: 4, fontSize: 12 }}>平台类型</Text>
            <Select style={{ width: '100%' }} value={newConnectorType} onChange={(v) => { setNewConnectorType(v); setConnectorConfig({}); }}
              options={[
                { value: 'dingtalk', label: ' 钉钉' },
                { value: 'wecom', label: ' 企业微信' },
                { value: 'lark', label: ' 飞书' },
              ]} />
          </div>
          <Card size="small" bodyStyle={{ padding: 8 }}>
            <Space direction="vertical" size={6} style={{ width: '100%' }}>
              {(connectorFields[newConnectorType] || []).map(field => (
                <Input key={field.key} placeholder={field.label} value={connectorConfig[field.key] || ''}
                  onChange={e => setConnectorConfig(prev => ({ ...prev, [field.key]: e.target.value }))} size="small" />
              ))}
            </Space>
          </Card>
        </Space>
      </Modal>

      <Modal title="添加监听路径" open={addPathOpen} onCancel={() => setAddPathOpen(false)}
        footer={<Space><Button onClick={() => setAddPathOpen(false)}>取消</Button><Button type="primary" onClick={handleAddPath}>添加</Button></Space>} width={520}>
        <Space direction="vertical" size={12} style={{ width: '100%' }}>
          <div>
            <Text type="secondary" style={{ display: 'block', marginBottom: 4, fontSize: 12 }}>路径</Text>
            <Input placeholder="输入网络路径或云存储路径" value={newPath} onChange={e => setNewPath(e.target.value)} />
          </div>
          <div>
            <Text type="secondary" style={{ display: 'block', marginBottom: 4, fontSize: 12 }}>存储类型</Text>
            <Select style={{ width: '100%' }} value={newPathType} onChange={(v) => { setNewPathType(v); setAuthEnabled(false); }}
              options={[
                { value: 'network', label: ' 网络存储（FTP/SFTP/SMB）' },
                { value: 'cloud', label: ' 云存储（S3/OSS/MinIO）' },
              ]} />
          </div>

          {/* Auth section */}
          <div>
              <Row justify="space-between" align="middle" style={{ marginBottom: 8 }}>
                <Text type="secondary" style={{ fontSize: 12 }}>需要鉴权</Text>
                <Switch size="small" checked={authEnabled} onChange={setAuthEnabled} />
              </Row>
              {authEnabled && (
                <Card size="small" bodyStyle={{ padding: 8 }}>
                  <Space direction="vertical" size={6} style={{ width: '100%' }}>
                    {newPathType === 'network' && (
                      <>
                        <Input placeholder="用户名" value={authUser} onChange={e => setAuthUser(e.target.value)} size="small" />
                        <Input.Password placeholder="密码" value={authPass} onChange={e => setAuthPass(e.target.value)} size="small" />
                        <Input placeholder="端口（如 22）" value={authPort} onChange={e => setAuthPort(e.target.value)} size="small" />
                      </>
                    )}
                    {newPathType === 'cloud' && (
                      <>
                        <Input placeholder="Access Key" value={authKey} onChange={e => setAuthKey(e.target.value)} size="small" />
                        <Input.Password placeholder="Secret Key" value={authSecret} onChange={e => setAuthSecret(e.target.value)} size="small" />
                        <Input placeholder="Endpoint（如 s3.amazonaws.com）" value={authEndpoint} onChange={e => setAuthEndpoint(e.target.value)} size="small" />
                        <Input placeholder="Bucket" value={authBucket} onChange={e => setAuthBucket(e.target.value)} size="small" />
                        <Input placeholder="Region（如 us-east-1）" value={authRegion} onChange={e => setAuthRegion(e.target.value)} size="small" />
                      </>
                    )}
                  </Space>
                </Card>
              )}
            </div>

          <div><Text type="secondary" style={{ display: 'block', marginBottom: 4, fontSize: 12 }}>监听选项</Text>
            <Space direction="vertical" size={4}>
              <Row justify="space-between" align="middle" style={{ width: 320 }}><Text style={{ fontSize: 12 }}>文件完整性校验（MD5）</Text><Switch size="small" checked={md5Check} onChange={setMd5Check} /></Row>
              <Row justify="space-between" align="middle" style={{ width: 320 }}><Text style={{ fontSize: 12 }}>增量扫描</Text><Switch size="small" checked={incrScan} onChange={setIncrScan} /></Row>
              <Row justify="space-between" align="middle" style={{ width: 320 }}><Text style={{ fontSize: 12 }}>断点续传</Text><Switch size="small" checked={resumeTransfer} onChange={setResumeTransfer} /></Row>
            </Space>
          </div>
        </Space>
      </Modal>

      <Modal title="提交知识" open={submitOpen} onCancel={() => setSubmitOpen(false)}
        footer={<Space><Button onClick={() => setSubmitOpen(false)}>取消</Button><Button type="primary" onClick={handleSubmitClick}>提交</Button></Space>}>
        <Space direction="vertical" size={12} style={{ width: '100%' }}>
          <div>
            <Text type="secondary" style={{ display: 'block', marginBottom: 4, fontSize: 12 }}>知识名称</Text>
            <AutoComplete style={{ width: '100%' }} value={kName} onChange={(v) => setKName(v)} options={allNameOptions} filterOption={(inputValue, option) => option!.value.includes(inputValue)}>
              <Input placeholder="输入或选择知识名称" />
            </AutoComplete>
          </div>
          <div>
            <Text type="secondary" style={{ display: 'block', marginBottom: 4, fontSize: 12 }}>知识路径</Text>
            <Select style={{ width: '100%' }} value={kPath} onChange={setKPath}
              options={(rolePaths[role || 'normal'] || rolePaths.normal).map(p => ({ value: p, label: ' ' + p }))} />
          </div>
          <div>
            <Text type="secondary" style={{ display: 'block', marginBottom: 4, fontSize: 12 }}>知识版本</Text>
            <Input value={kVersion} disabled style={{ color: '#8e9aaf', background: '#f0f3f5' }} />
          </div>
        </Space>
      </Modal>

      <Modal title="版本冲突" open={conflictOpen} onCancel={() => setConflictOpen(false)}
        footer={<Space><Button type="primary" onClick={handleUpdateVersion}>更新</Button><Button type="primary" danger onClick={handleOverwriteClick}>覆盖</Button></Space>}>
        <Alert type="warning" showIcon message={'该文件 "' + kName + '" 在路径 "' + kPath + '" 中已存在，是否更新版本？'} />
      </Modal>

      <Modal title="密码确认" open={passwordOpen} onCancel={() => setPasswordOpen(false)}
        footer={<Space><Button onClick={() => { setPasswordOpen(false); setPassword(''); }}>取消</Button><Button type="primary" danger onClick={handlePasswordConfirm}>确认覆盖</Button></Space>}>
        <Space direction="vertical" size={8}>
          <Text type="secondary">覆盖文件需要管理员权限，请输入密码确认：</Text>
          <Input.Password placeholder="输入密码（提示：admin123）" value={password} onChange={e => setPassword(e.target.value)} onPressEnter={handlePasswordConfirm} />
        </Space>
      </Modal>
    </Layout>
  );
}
