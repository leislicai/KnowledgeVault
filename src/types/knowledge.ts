export type FeatureState = 'default' | 'review' | 'high';

export type FileStatus = '已发布' | '未归档' | '编译中';
export type PushStatus = '未推送' | '已推送';

export interface KnowledgeFile {
  id: string;
  name: string;
  knowledgeName: string;
  author: string;
  size: string;
  createdAt: string;
  modifiedAt: string;
  status: FileStatus;
  pushStatus?: PushStatus;
  path?: string;
  source?: string;
  tags?: string[];
  features?: Record<string, FeatureState>;
  excerpt?: string;
  encrypted?: boolean;
  fileType?: string;
}

export interface TreeNode {
  key: string;
  title: string;
  icon?: React.ReactNode;
  children?: TreeNode[];
}

export interface PushTask {
  key: string;
  knowledgeName: string;
  fromSpace: string;
  toSpace: string;
  submitter: string;
  time: string;
  status: '待审核' | '已通过' | '已驳回';
  reviewer?: string;
  rejectReason?: string;
}

export interface EntityItem {
  key: string;
  name: string;
  type: string;
  count: number;
  status: string;
}

export interface RelationItem {
  key: string;
  source: string;
  relation: string;
  target: string;
  status: string;
}

export interface ScenarioItem {
  key: string;
  name: string;
  type: string;
  description: string;
}

export interface QaItem {
  key: string;
  question: string;
  answer: string;
  source: string;
}

export interface ActionItem {
  key: string;
  action: string;
  priority: string;
  status: string;
  source: string;
}

export interface ChapterContent {
  title: string;
  content: string;
  original: string;
  score: number;
}

export interface AgentAction {
  key: string;
  label: string;
  icon: React.ReactNode;
  prompt: string;
}
