import { randomUUID } from "node:crypto";
import type { AuditJob } from "./types";

const jobs = new Map<string, AuditJob>();
const demoDurationMs = 2000;

export function createAudit(projectId: string, website: string): AuditJob {
  const now = new Date().toISOString();
  const job: AuditJob = {
    id: randomUUID(),
    projectId,
    website,
    status: "queued",
    stage: "queued",
    progress: 0,
    createdAt: now,
    updatedAt: now,
    error: null,
  };
  jobs.set(job.id, job);
  return job;
}

export function getAudit(id: string): AuditJob | null {
  const job = jobs.get(id);
  if (!job) return null;

  const elapsed = Date.now() - Date.parse(job.createdAt);
  if (elapsed >= demoDurationMs) {
    job.status = "completed";
    job.stage = "complete";
    job.progress = 100;
  } else {
    job.status = elapsed > 150 ? "running" : "queued";
    job.stage = elapsed > 150 ? "demo-analysis" : "queued";
    job.progress = Math.min(95, Math.max(8, Math.round((elapsed / demoDurationMs) * 100)));
  }
  job.updatedAt = new Date().toISOString();
  return job;
}
