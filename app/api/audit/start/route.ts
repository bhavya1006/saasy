import { NextResponse } from "next/server";
import { startAuditSchema } from "@/lib/audit/types";
import { createAuditRecord } from "@/lib/audit/repository";
import { validateAuditUrl } from "@/lib/audit/url";

export async function POST(request: Request) {
  try {
    const input = startAuditSchema.parse(await request.json());
    const website = validateAuditUrl(input.website);
    const audit = await createAuditRecord(input.projectId, website);
    return NextResponse.json({ audit }, { status: 202 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid audit request.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
