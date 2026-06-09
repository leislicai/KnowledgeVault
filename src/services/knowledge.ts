import type { KnowledgeFile, FeatureState } from '../types';
import { fileList, fileFeatures } from '../mock/compilation-data';

// ---- 知识文件 CRUD ----

export async function fetchFileList(params?: {
  status?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}): Promise<KnowledgeFile[]> {
  // TODO: GET /api/knowledge/files
  let result = fileList as unknown as KnowledgeFile[];
  if (params?.status) result = result.filter(f => f.status === params.status);
  if (params?.search) result = result.filter(f => f.name.includes(params.search!) || f.knowledgeName.includes(params.search!));
  return result;
}

export async function fetchFileById(id: string): Promise<KnowledgeFile | null> {
  // TODO: GET /api/knowledge/files/:id
  return (fileList.find(f => f.key === id) as unknown as KnowledgeFile) || null;
}

export async function fetchFileFeatures(id: string): Promise<Record<string, { state: FeatureState; summary: string }> | null> {
  // TODO: GET /api/knowledge/files/:id/features
  return fileFeatures[id] || fileFeatures['doc-002'] || null;
}

// ---- 搜索 ----

export async function searchFiles(query: string): Promise<KnowledgeFile[]> {
  // TODO: GET /api/search?q=...
  if (!query) return fileList as unknown as KnowledgeFile[];
  return (fileList.filter(f =>
    f.name.includes(query) || f.knowledgeName.includes(query) || f.excerpt.includes(query)
  ) as unknown as KnowledgeFile[]);
}
