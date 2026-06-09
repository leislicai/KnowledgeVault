import { useState, lazy, Suspense } from 'react';
import { ConfigProvider, Spin } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import AppLayout from './components/AppLayout';
import PersonalHome from './pages/PersonalHome';
import AIChat from './pages/AIChat';
const KnowledgeManager = lazy(() => import('./pages/KnowledgeManager'));
import CompilationList from './pages/CompilationList';
import CompilationPreview from './pages/CompilationPreview';
import KnowledgeGraph from './pages/KnowledgeGraph';
import AdminDashboard from './pages/AdminDashboard';
import AdminConfig from './pages/AdminConfig';
import KnowledgeSearch from './pages/KnowledgeSearch';
import KnowledgeSubscribe from './pages/KnowledgeSubscribe';
import PrivateSpace from './pages/PrivateSpace';
import FileManager from './pages/FileManager';
import KnowledgeDetail from './pages/KnowledgeDetail';
import KnowledgePush from './pages/KnowledgePush';
import LoginPage from './pages/LoginPage';

const KnowledgeCreate = lazy(() => import('./pages/KnowledgeCreate'));

export type SpaceType = 'personal' | 'team' | 'enterprise';
export type RoleType = 'normal' | 'team-admin' | 'enterprise-admin';
export type PageType =
  | 'home'
  | 'knowledge-create'
  | 'compilation-list'
  | 'ai-chat'
  | 'knowledge-search'
  | 'knowledge-subscribe'
  | 'file-manager'
  | 'private-space'
  | 'knowledge-manager'
  | 'knowledge-base-admin'
  | 'compilation-preview'
  | 'knowledge-graph'
  | 'admin-dashboard'
  | 'admin-config'
  | 'knowledge-detail'
  | 'knowledge-push'
  | 'login'
  | 'permission-config';

export default function App() {
  const [space, setSpace] = useState<SpaceType>((localStorage.getItem('kv_space') as SpaceType) || 'personal');
  const [role, setRole] = useState<RoleType>((localStorage.getItem('kv_role') as RoleType) || 'normal');
  const [page, setPage] = useState<PageType>('login');
  const [previewFileId, setPreviewFileId] = useState<string>('doc-002');
  const [detailItem, setDetailItem] = useState<{ title: string; excerpt: string; source: string; tags: string[] } | null>(null);
  const [focusSection, setFocusSection] = useState<string | null>(null);

  const handlePageChange = (p: string) => setPage(p as PageType);
  const handleRoleChange = (r: RoleType) => {
    const newSpace = r === 'team-admin' ? 'team' : r === 'enterprise-admin' ? 'enterprise' : 'personal';
    localStorage.setItem('kv_role', r);
    localStorage.setItem('kv_space', newSpace);
    setRole(r);
    setSpace(newSpace);
    setPage('home');
  };
  const handleSpaceChange = (s: SpaceType) => {
    setSpace(s);
    setPage('home');
  };
  const handleOpenPreview = (fileId: string) => {
    setPreviewFileId(fileId);
    setPage('compilation-preview');
  };
  const handleOpenDetail = (item: { title: string; excerpt: string; source: string; tags: string[] }) => {
    setDetailItem(item);
    setPage('knowledge-detail');
  };

  const renderPage = () => {
    switch (page) {
      case 'home': return <PersonalHome space={space} onPageChange={handlePageChange} />;
      case 'knowledge-create': return <Suspense fallback={<Spin size="large" style={{ display: 'flex', justifyContent: 'center', marginTop: '30vh' }} />}><KnowledgeCreate onPageChange={handlePageChange} role={role} focus={focusSection} /></Suspense>;
      case 'compilation-list': return <CompilationList onOpenPreview={handleOpenPreview} />;
      case 'ai-chat': return <AIChat space={space} />;
      case 'knowledge-search': return <KnowledgeSearch onOpenDetail={handleOpenDetail} />;
      case 'knowledge-subscribe': return <KnowledgeSubscribe />;
      case 'file-manager': return <FileManager />;
      case 'private-space': return <PrivateSpace />;
      case 'knowledge-manager':
      case 'knowledge-base-admin': return <Suspense fallback={<Spin style={{ display: 'flex', justifyContent: 'center', marginTop: '30vh' }} />}><KnowledgeManager space={space} role={role} onOpenPreview={handleOpenPreview} /></Suspense>;
      case 'compilation-preview': return <CompilationPreview fileId={previewFileId} onPageChange={handlePageChange} />;
      case 'knowledge-detail': return <KnowledgeDetail item={detailItem} onPageChange={handlePageChange} onOpenPreview={handleOpenPreview} />;
      case 'knowledge-push': return <KnowledgePush role={role} />;
      case 'permission-config': return <AdminConfig role={role} />;
      case 'knowledge-graph': return <KnowledgeGraph />;
      case 'admin-dashboard': return <AdminDashboard />;
      case 'admin-config': return <AdminConfig role={role} />;
      default: return <PersonalHome space={space} onPageChange={handlePageChange} />;
    }
  };

  return (
    <ConfigProvider locale={zhCN} theme={{ token: { colorPrimary: '#1a4a9a', borderRadius: 6, colorLink: '#1a4a9a' } }}>
      {page === 'login' ? <LoginPage onPageChange={handlePageChange} onLogin={() => { setRole('normal'); setSpace('personal'); localStorage.setItem('kv_role', 'normal'); localStorage.setItem('kv_space', 'personal'); }} /> : (
        <AppLayout currentPage={page} onPageChange={handlePageChange} space={space} onSpaceChange={handleSpaceChange} role={role} onRoleChange={handleRoleChange} onFocusChange={setFocusSection}>
          {renderPage()}
        </AppLayout>
      )}
    </ConfigProvider>
  );
}
