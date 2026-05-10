import { ImageResponse } from "next/og";
import { getAuditBySlug } from "@/lib/db";

export const runtime = "nodejs"; // we read the file-based DB; not edge

const fmt = (n: number) => `$${Math.round(n).toLocaleString()}`;

export async function GET(req: Request) {
  const url = new URL(req.url);
  const slug = url.searchParams.get("slug");
  if (!slug) return new Response("missing slug", { status: 400 });
  const audit = await getAuditBySlug(slug);
  if (!audit) return new Response("not found", { status: 404 });

  const monthly = audit.results.totalMonthlySavings;
  const annual = audit.results.totalAnnualSavings;
  const wellSpent = monthly === 0;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "64px 72px",
          background: "#0e0d0b",
          color: "#f8f8f7",
          fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", fontSize: 22, opacity: 0.8 }}>
          <div style={{ width: 14, height: 14, borderRadius: 7, background: "#0a7d4f", marginRight: 12 }} />
          <div style={{ display: "flex" }}>RightSize · AI spend audit</div>
        </div>

        {wellSpent ? (
          <div style={{ display: "flex", flexDirection: "column", marginTop: 60 }}>
            <div style={{ display: "flex", fontSize: 84, fontWeight: 600, lineHeight: 1.05 }}>
              You&apos;re spending well.
            </div>
            <div style={{ display: "flex", fontSize: 28, marginTop: 24, color: "#b9b5ac" }}>
              Nothing in this stack obviously needs to change.
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", marginTop: 60 }}>
            <div style={{ display: "flex", fontSize: 32, color: "#b9b5ac" }}>Estimated leak</div>
            <div style={{ display: "flex", fontSize: 132, fontWeight: 700, lineHeight: 1, marginTop: 8 }}>
              {fmt(monthly)}
            </div>
            <div style={{ display: "flex", fontSize: 32, color: "#b9b5ac", marginTop: 12 }}>
              per month · {fmt(annual)} per year
            </div>
          </div>
        )}

        <div style={{ display: "flex", marginTop: "auto", fontSize: 22, color: "#8a857a" }}>
          rightsize.app — free, 60 seconds, no login
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
