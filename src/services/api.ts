// API 基础配置（后续替换为真实 endpoint）
const API_BASE = '/api';

interface ApiResponse<T> {
  code: number;
  data: T;
  message: string;
}

async function request<T>(path: string, _options?: RequestInit): Promise<T> {
  // TODO: 替换为真实 fetch 调用
  // const res = await fetch(API_BASE + path, options);
  // const json: ApiResponse<T> = await res.json();
  // return json.data;
  throw new Error(`API not implemented: ${path}`);
}

export { request, API_BASE };
export type { ApiResponse };
