import type { KnowledgeBaseOption } from '../types';

export const knowledgeBaseOptions: KnowledgeBaseOption[] = [
  { key: 'group', label: '集团知识库', scope: '全集团' },
  { key: 'company', label: '公司知识库', scope: '本公司' },
  { key: 'dept-sales', label: '销售部知识库', scope: '销售部' },
  { key: 'dept-eng', label: '工程部知识库', scope: '工程部' },
  { key: 'dept-prod', label: '生产部知识库', scope: '生产部' },
  { key: 'personal', label: '个人知识库', scope: '仅自己' },
];
