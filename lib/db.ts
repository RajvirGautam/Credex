// File-backed JSON store. Replace with Supabase in prod (see ARCHITECTURE.md §swap-targets).
// Single writer per process — fine for the audit traffic profile (a few req/sec at most on free Vercel).
import { promises as fs } from "node:fs";
import path from "node:path";
import { nanoid } from "nanoid";
import type { AuditInput, AuditResult } from "@/lib/engine";

const DATA_DIR = process.env.VERCEL ? "/tmp" : path.join(process.cwd(), ".data");
const AUDITS_FILE = path.join(DATA_DIR, "audits.json");
const LEADS_FILE = path.join(DATA_DIR, "leads.json");

export interface AuditRecord {
  id: string;
  slug: string;
  inputs: AuditInput;
  results: AuditResult;
  summary?: { text: string; source: "ai" | "fallback" };
  createdAt: string;
}

export interface LeadRecord {
  id: string;
  auditId: string;
  email: string;
  company?: string;
  role?: string;
  teamSize?: number;
  createdAt: string;
}

async function ensureFile(p: string, initial: string) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(p);
  } catch {
    await fs.writeFile(p, initial, "utf8");
  }
}

async function readJson<T>(p: string, initial: T): Promise<T> {
  await ensureFile(p, JSON.stringify(initial));
  const raw = await fs.readFile(p, "utf8");
  try {
    return JSON.parse(raw) as T;
  } catch {
    return initial;
  }
}

async function writeJson<T>(p: string, data: T): Promise<void> {
  await ensureFile(p, JSON.stringify([]));
  await fs.writeFile(p, JSON.stringify(data, null, 2), "utf8");
}

export async function createAudit(args: {
  inputs: AuditInput;
  results: AuditResult;
  summary?: AuditRecord["summary"];
}): Promise<AuditRecord> {
  const all = await readJson<AuditRecord[]>(AUDITS_FILE, []);
  const slug = nanoid(10);
  const record: AuditRecord = {
    id: nanoid(16),
    slug,
    inputs: args.inputs,
    results: args.results,
    summary: args.summary,
    createdAt: new Date().toISOString(),
  };
  all.push(record);
  await writeJson(AUDITS_FILE, all);
  return record;
}

export async function getAuditBySlug(slug: string): Promise<AuditRecord | null> {
  const all = await readJson<AuditRecord[]>(AUDITS_FILE, []);
  return all.find((a) => a.slug === slug) ?? null;
}

export async function updateAuditSummary(slug: string, summary: NonNullable<AuditRecord["summary"]>): Promise<void> {
  const all = await readJson<AuditRecord[]>(AUDITS_FILE, []);
  const target = all.find((a) => a.slug === slug);
  if (!target) return;
  target.summary = summary;
  await writeJson(AUDITS_FILE, all);
}

export async function createLead(args: {
  auditId: string;
  email: string;
  company?: string;
  role?: string;
  teamSize?: number;
}): Promise<LeadRecord> {
  const all = await readJson<LeadRecord[]>(LEADS_FILE, []);
  const record: LeadRecord = {
    id: nanoid(16),
    auditId: args.auditId,
    email: args.email,
    company: args.company,
    role: args.role,
    teamSize: args.teamSize,
    createdAt: new Date().toISOString(),
  };
  all.push(record);
  await writeJson(LEADS_FILE, all);
  return record;
}
