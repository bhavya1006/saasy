import { eq } from "drizzle-orm";
import { getDatabase, isDatabaseConfigured } from "@/lib/db/client";
import { audits } from "@/lib/db/schema";
import { createAudit, getAudit } from "./store";
import type { AuditJob, AuditStatus } from "./types";

const demoDurationMs = 2000;

function advance(job: AuditJob): AuditJob {
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

function toAuditJob(row: typeof audits.$inferSelect): AuditJob {
  return {
    id: row.id,
    projectId: row.projectId,
    website: row.website,
    status: row.status as AuditStatus,
    stage: row.stage as AuditJob["stage"],
    progress: row.progress,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    error: row.error,
  };
}

export async function createAuditRecord(projectId: string, website: string) {
  if (!isDatabaseConfigured()) return createAudit(projectId, website);
  const database = getDatabase();
  const [row] = await database.insert(audits).values({ projectId, website }).returning();
  return toAuditJob(row);
}

export async function getAuditRecord(id: string) {
  if (!isDatabaseConfigured()) return getAudit(id);
  const database = getDatabase();
  const [row] = await database.select().from(audits).where(eq(audits.id, id)).limit(1);
  if (!row) return null;
  const job = advance(toAuditJob(row));
  await database.update(audits).set({ status: job.status, stage: job.stage, progress: job.progress, updatedAt: new Date(job.updatedAt) }).where(eq(audits.id, id));
  return job;
}
