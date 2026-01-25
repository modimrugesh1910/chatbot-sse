export const runtime = "nodejs";

export async function POST() {
  const { rows } = await db.query(
    `SELECT * FROM ingestion_jobs WHERE status='pending' LIMIT 1`
  );

  if (!rows.length) return Response.json({ ok: true });

  const job = rows[0];

  await db.query(
    `UPDATE ingestion_jobs SET status='processing' WHERE id=$1`,
    [job.id]
  );

  // process PDF/DOC here (reuse existing logic)

  await db.query(
    `UPDATE ingestion_jobs SET status='done' WHERE id=$1`,
    [job.id]
  );

  return Response.json({ processed: job.id });
}
import { db } from "@/lib/db";