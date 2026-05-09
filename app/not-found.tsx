import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-5xl space-y-3 px-6 py-20 text-center">
      <h1 className="text-3xl font-semibold tracking-tight">Audit not found</h1>
      <p className="text-ink-600">That share link is wrong or expired.</p>
      <Link href="/audit" className="btn-brand inline-flex">Run a fresh audit</Link>
    </div>
  );
}
