import { useState } from 'react';
import { Button, Input, Typography, Space, Row, Col, Tabs, Checkbox, Select } from 'antd';
import { LockOutlined, MobileOutlined, MailOutlined, SafetyCertificateOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface Props { onPageChange: (page: string) => void; onLogin?: () => void }

const features = [
  { text: 'AI 自动抽取文档知识，生成结构化知识特征' },
  { text: '混合检索 + 大纲加速，精准定位所需知识' },
  { text: '跨空间推送审核，知识安全流转' },
  { text: 'AI 问答助手，基于知识库精准回答' },
];

const pageStyle: React.CSSProperties = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(135deg, #e8ecf1 0%, #d5dce6 50%, #c8d1de 100%)',
  position: 'relative',
  overflow: 'hidden',
};

const bgDecoration: React.CSSProperties = {
  position: 'absolute',
  borderRadius: '50%',
  opacity: 0.08,
  pointerEvents: 'none',
};

export default function LoginPage({ onPageChange, onLogin }: Props) {
  const [countryCode, setCountryCode] = useState('+86');

  return (
    <div style={pageStyle}>
      {/* Background decorative elements */}
      <div style={{ ...bgDecoration, width: 500, height: 500, background: '#4096ff', top: '-10%', right: '-5%' }} />
      <div style={{ ...bgDecoration, width: 400, height: 400, background: '#1a4a9a', bottom: '-8%', left: '-5%' }} />
      <div style={{ ...bgDecoration, width: 200, height: 200, background: '#2d6bcb', top: '40%', left: '60%' }} />

      <div style={{
        width: 1100, height: 700,
        display: 'flex', borderRadius: 20,
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0,0,0,0.12), 0 8px 24px rgba(0,0,0,0.06)',
        position: 'relative', zIndex: 1,
      }}>
        {/* Left brand panel */}
        <div style={{
          width: 480, padding: '64px 48px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          background: 'linear-gradient(135deg, #2d6bcb 0%, #1a4a9a 25%, #0d2b6e 55%, #061838 80%, #030d1f 100%)',
          position: 'relative',
        }}>
          {/* Decorative subtle overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse at 30% 20%, rgba(22,119,255,0.15) 0%, transparent 60%)',
            pointerEvents: 'none',
          }} />

          <div style={{
            width: 72, height: 72, borderRadius: 20,
            background: 'linear-gradient(135deg, #4096ff, #1a4a9a)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 28,
            boxShadow: '0 8px 24px rgba(22,119,255,0.35)',
            position: 'relative', zIndex: 1,
          }}>
            <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#fff', letterSpacing: 1 }}>KV</Text>
          </div>

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ marginBottom: 8, position: 'relative' }}>
              <Text style={{
                fontSize: 32, fontWeight: 700, display: 'block', textAlign: 'center', letterSpacing: 2,
                background: 'linear-gradient(180deg, #ffffff 0%, #b8d4ff 50%, #7ab0ff 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
              }}>
                知枢答理
              </Text>
            </div>
            <Text style={{
              fontSize: 12, letterSpacing: 8, marginBottom: 28, display: 'block', textAlign: 'center',
              textTransform: 'uppercase',
              background: 'linear-gradient(180deg, #d0e0ff 0%, #7a9fd4 50%, #4a6b9a 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.3))',
            }}>
              KNOWLEDGE VAULT
            </Text>
            <Text style={{
              fontSize: 14, textAlign: 'center', lineHeight: 1.8, maxWidth: 360, marginBottom: 44, display: 'block',
              fontWeight: 400,
              background: 'linear-gradient(180deg, rgba(255,255,255,0.75) 0%, rgba(180,200,230,0.6) 50%, rgba(140,160,200,0.5) 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.15))',
            }}>
              企业级 AI 知识库平台，让知识从文档中自动涌现，为团队提供智能化的知识管理体验
            </Text>
          </div>

          <div style={{ width: '100%', maxWidth: 340, position: 'relative', zIndex: 1 }}>
            {features.map((f, i) => (
              <div key={f.text} style={{ display: 'flex', gap: 12, marginBottom: i < features.length - 1 ? 18 : 0, alignItems: 'flex-start' }}>
                <div style={{
                  width: 22, height: 22, minWidth: 22, borderRadius: 6, marginTop: 2,
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, color: 'rgba(255,255,255,0.45)', fontWeight: 500,
                }}>
                  {i + 1}
                </div>
                <Text style={{
                  fontSize: 13, lineHeight: 1.6, flex: 1,
                  background: 'linear-gradient(180deg, rgba(220,230,250,0.8) 0%, rgba(160,180,210,0.55) 50%, rgba(120,145,180,0.45) 100%)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                }}>{f.text}</Text>
              </div>
            ))}
          </div>
        </div>

        {/* Right form panel */}
        <div style={{
          width: 620, padding: '60px 72px',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          background: '#fff',
        }}>
          <div style={{ marginBottom: 36 }}>
            <Text style={{
              fontSize: 28, fontWeight: 700, color: '#1a1a2e', display: 'block',
              letterSpacing: 0.5,
            }}>
              欢迎回来
            </Text>
            <Text style={{
              fontSize: 14, color: '#8e9aaf', marginTop: 8, display: 'block',
              lineHeight: 1.6,
            }}>
              请登录您的账号以继续使用知枢答理
            </Text>
          </div>

          <Tabs centered defaultActiveKey="account"
            style={{ marginBottom: 4 }}
            items={[
              { key: 'account', label: '账号密码', children: (
                <Space direction="vertical" size={22} style={{ width: '100%' }}>
                  <div>
                    <Text style={{ fontSize: 13, fontWeight: 500, color: '#3d3d4e', display: 'block', marginBottom: 8 }}>邮箱地址</Text>
                    <Input size="large" placeholder="admin@knowledgevault.com"
                      prefix={<MailOutlined style={{ color: '#b0b9c8' }} />}
                      style={{ borderRadius: 10, height: 48, paddingLeft: 14 }}
                    />
                  </div>
                  <div>
                    <Text style={{ fontSize: 13, fontWeight: 500, color: '#3d3d4e', display: 'block', marginBottom: 8 }}>密码</Text>
                    <Input.Password size="large" placeholder="请输入密码"
                      prefix={<LockOutlined style={{ color: '#b0b9c8' }} />}
                      style={{ borderRadius: 10, height: 48, paddingLeft: 14 }}
                    />
                  </div>
                </Space>
              )},
              { key: 'phone', label: '手机号登录', children: (
                <Space direction="vertical" size={22} style={{ width: '100%' }}>
                  <div>
                    <Text style={{ fontSize: 13, fontWeight: 500, color: '#3d3d4e', display: 'block', marginBottom: 8 }}>手机号</Text>
                    <Input size="large" placeholder="138 0000 1234"
                      prefix={<MobileOutlined style={{ color: '#b0b9c8' }} />}
                      addonBefore={<Select variant="borderless" value={countryCode} onChange={setCountryCode}
                        style={{ minWidth: 100 }}
                        options={[{ value: '+86', label: '+86' }, { value: '+852', label: '+852' }, { value: '+1', label: '+1' }]} />}
                      style={{ borderRadius: 10, height: 48, paddingLeft: 14 }}
                    />
                  </div>
                  <div>
                    <Text style={{ fontSize: 13, fontWeight: 500, color: '#3d3d4e', display: 'block', marginBottom: 8 }}>验证码</Text>
                    <Row gutter={10}>
                      <Col flex="auto"><Input size="large" placeholder="请输入验证码"
                        prefix={<SafetyCertificateOutlined style={{ color: '#b0b9c8' }} />}
                        style={{ borderRadius: 10, height: 48, paddingLeft: 14 }} /></Col>
                      <Col><Button size="large"
                        style={{ height: 48, borderRadius: 10, paddingInline: 20, fontSize: 13 }}>获取验证码</Button></Col>
                    </Row>
                  </div>
                </Space>
              )},
            ]}
          />

          <Row justify="space-between" align="middle" style={{ marginTop: 18, marginBottom: 28 }}>
            <Checkbox defaultChecked style={{ fontSize: 13 }}>记住我</Checkbox>
            <Text style={{ fontSize: 13, color: '#1a4a9a', cursor: 'pointer', fontWeight: 500 }}>忘记密码？</Text>
          </Row>

          <Button block size="large" onClick={() => { onLogin?.(); onPageChange('home'); }}
            style={{
              height: 44, borderRadius: 10, fontSize: 15, fontWeight: 600, marginBottom: 24,
              border: 'none', color: '#fff', letterSpacing: 1,
              background: 'linear-gradient(135deg, #2d6bcb 0%, #1a4a9a 50%, #0d2b6e 100%)',
              boxShadow: '0 4px 16px rgba(22,119,255,0.35)',
            }}>
            登录
          </Button>

          <Row align="middle" style={{ marginBottom: 22 }}>
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, #e2e6ed, transparent)' }} />
            <Text style={{ margin: '0 16px', fontSize: 12, color: '#b0b9c8', whiteSpace: 'nowrap' }}>或使用第三方登录</Text>
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, #e2e6ed, transparent)' }} />
          </Row>

          <Button block size="large"
            style={{
              height: 42, borderRadius: 10, fontSize: 13, fontWeight: 500, color: '#3d3d4e',
              borderColor: '#d5dce6', marginBottom: 28,
              background: '#f5f7fa',
            }}>
            SSO 单点登录
          </Button>

          <div style={{ textAlign: 'center', fontSize: 13, color: '#8e9aaf' }}>
            还没有账号？
            <Text style={{ color: '#1a4a9a', fontWeight: 600, cursor: 'pointer', marginLeft: 4 }}>联系管理员开通</Text>
          </div>
        </div>
      </div>
    </div>
  );
}
