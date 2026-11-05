import { NextResponse } from "next/server";
import { getAuditRecord } from "@/lib/audit/repository";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const audit = await getAuditRecord(id);
  if (!audit) return NextResponse.json({ error: "Audit not found." }, { status: 404 });
  return NextResponse.json({ audit });
}
