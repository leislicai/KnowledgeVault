import type { PushTask } from '../types';
import { pushTasks } from '../mock/compilation-data';

// ---- 推送审批 ----

export async function fetchPushTasks(): Promise<PushTask[]> {
  // TODO: GET /api/push/tasks
  return pushTasks;
}

export async function approvePushTask(_id: string): Promise<void> {
  // TODO: PUT /api/push/tasks/:id/approve
}

export async function rejectPushTask(_id: string, _reason: string): Promise<void> {
  // TODO: PUT /api/push/tasks/:id/reject
}

export async function batchApprovePushTasks(_ids: string[]): Promise<void> {
  // TODO: POST /api/push/tasks/batch-approve
}

export async function batchRejectPushTasks(_ids: string[]): Promise<void> {
  // TODO: POST /api/push/tasks/batch-reject
}
