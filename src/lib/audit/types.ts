import { z } from "zod";

export const auditStatusSchema = z.enum(["queued", "running", "partial", "failed", "completed"]);

export const startAuditSchema = z.object({
  website: z.string().url().max(2048),
  projectId: z.string().min(1).max(120).default("demo-project"),
});

export type AuditStatus = z.infer<typeof auditStatusSchema>;

export type AuditJob = {
  id: string;
  projectId: string;
  website: string;
  status: AuditStatus;
  stage: "validation" | "queued" | "demo-analysis" | "complete";
  progress: number;
  createdAt: string;
  updatedAt: string;
  error: string | null;
};
