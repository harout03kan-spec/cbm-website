// @ts-nocheck
// Ported from a Claude Artifact as a single file (kept intact on purpose).
// Type annotations are intentionally deferred to a later cleanup pass.
import React, { useState, useEffect, useMemo } from "react";
import * as XLSX from "xlsx";
import { LayoutDashboard, Users, CalendarClock, Activity, Plus, Download, Search, RefreshCw, X, Phone, Mail, MessageSquare, AlertTriangle, TrendingUp, Pencil, Trash2, ChevronRight, DollarSign, FileText, Truck, Lock } from "lucide-react";
import { crmStorage } from "./crmStorage";

const STORE_KEY = "cbm-crm-data-v3";

const STATUS = ["New", "Contacted", "Warm", "Active Deal", "Won", "Lost", "Nurture", "Dormant"];
const DIR = ["Buy", "Sell", "Repair", "Hosting", "Consolidation"];
const PRIO = ["High", "Medium", "Low"];
const TYPES = ["Individual", "Company"];
const OPPORTUNITY = ["Buyer", "Seller", "Buyer & Seller", "Broker", "Repair", "Hosting", "Hosting facility"];
const LEAD_SOURCES = ["Email", "Website form submission", "Facebook Marketplace", "Call", "Referral", "Telegram", "Past customer"];
const LANGS = ["English", "French", "Other"];
const ACT_TYPES = ["Call", "Text", "Email", "Voicemail", "Quote", "Note"];

const NOT_OPEN = ["won", "lost", "dead", "closed", "dormant"];
const PROB = { "New": 0.1, "Contacted": 0.25, "Warm": 0.5, "Active Deal": 0.75, "Won": 1, "Lost": 0, "Nurture": 0.05, "Dormant": 0.05 };

// ---------- seed: your imported contact list ----------
// format: name|phone|country(C/U/O)|segment|model|note
const SEED = [
"Sample Customer|+1 555 000 0000|C|Buyer||Sample lead only",
];
const CC = { C: "Canada", U: "US", O: "Other" };
function cleanSeg(s) {
  const k = norm(s);
  const map = { asicbuyer: "Buyer", buyer: "Buyer", asicseller: "Seller", seller: "Seller", buyerandseller: "Buyer & Seller", buyerseller: "Buyer & Seller", customer: "Buyer", repair: "Repair", hosting: "Hosting", hostingfacility: "Hosting facility", websitelead: "" };
  if (k in map) return map[k];
  if (OPPORTUNITY.some((o) => norm(o) === k)) return s;
  return "";
}
function cleanSource(s) {
  const k = norm(s);
  const map = { iphoneimport: "", websiteemaillist: "Website form submission", websitesubmission: "Website form submission", website: "Website form submission", websiteform: "Website form submission", websiteformsubmission: "Website form submission", storeorder: "Website form submission", phonecall: "Call", call: "Call", email: "Email", telegram: "Telegram", facebookmarketplace: "Facebook Marketplace", referral: "Referral", oldclient: "Past customer", oldclients: "Past customer", pastcustomer: "Past customer", quickbooks: "QuickBooks invoice" };
  if (k in map) return map[k];
  return s || "";
}

function seedToLeads() {
  return SEED.map((s, i) => {
    const [name, phone, cc, seg, model, note] = s.split("|");
    const l = blankLead();
    l.id = "L-" + String(i + 1).padStart(4, "0");
    l.dateAdded = "2026-05-23";
    l.contactName = name; l.company = "";
    l.phone = (phone || "").trim();
    l.country = CC[cc] || "";
    l.segment = cleanSeg(seg);
    l.asicModel = model || "";
    l.notes = note || "";
    l.direction = "";
    l.preferredContact = "Phone";
    l.leadSource = "";
    l.priority = "Low";
    l.status = "Nurture";
    l.lastUpdated = "2026-05-23";
    return l;
  });
}

// ---------- website / email-list leads (junk + duplicates already removed) ----------
const WEBSITE_LEADS = [];

function mergeWebsiteLeads(list) {
  const out = list.map((l) => ({ ...l }));
  let added = 0;
  WEBSITE_LEADS.forEach((w, i) => {
    const e = norm(w.e), p = phoneKey(w.p), nm = norm(w.n);
    let ex = e ? out.find((l) => norm(l.email) === e) : null;
    if (!ex && p.length >= 10) ex = out.find((l) => phoneKey(l.phone) === p);
    if (!ex && nm) ex = out.find((l) => norm(l.contactName) === nm);
    if (ex) {
      if (!ex.email && w.e) ex.email = w.e;
      if (w.n && (!ex.contactName || /^\d+$/.test(ex.contactName.trim()))) ex.contactName = w.n;
      if (phoneKey(ex.phone).length < 10 && w.p) ex.phone = w.p;
      return;
    }
    const l = blankLead();
    l.id = "W-" + String(i + 1).padStart(4, "0");
    l.dateAdded = "2026-05-23";
    l.contactName = w.n || (w.e ? w.e.split("@")[0] : "Unknown");
    l.company = ""; l.email = w.e || ""; l.phone = w.p || "";
    l.segment = ""; l.direction = ""; l.leadSource = "Website form submission";
    l.preferredContact = w.e ? "Email" : "Phone"; l.priority = "Low"; l.status = "Nurture"; l.lastUpdated = "2026-05-23";
    out.push(l); added++;
  });
  return { list: out, added };
}

// ---------- invoices: real buyers (matched to existing contacts, marked Won) ----------
const INVOICES = [];

function mergeInvoices(list) {
  const out = list.map((l) => ({ ...l }));
  let matched = 0, added = 0;
  INVOICES.forEach((v) => {
    const e = norm(v.e), p = phoneKey(v.p), nm = norm(v.n);
    let ex = null;
    if (p.length >= 10) ex = out.find((l) => phoneKey(l.phone) === p);
    if (!ex && p.length < 10 && e) ex = out.find((l) => norm(l.email) === e);
    if (!ex && p.length < 10 && nm) ex = out.find((l) => norm(l.contactName) === nm);
    const line = `Address: ${v.a} | Bought ${v.m}${v.q > 1 ? " x" + v.q : ""} on ${v.d} for ${cad(v.t)} (Order #${v.o})`;
    if (ex) {
      ex.segment = "Buyer"; ex.customer = true;
      if (!ex.email && v.e) ex.email = v.e;
      if (!ex.address && v.a) ex.address = v.a;
      if (phoneKey(ex.phone).length < 10 && v.p) ex.phone = v.p;
      if (v.n && (/\s/.test(v.n) || /^\d+$/.test((ex.contactName || "").trim()))) ex.contactName = v.n;
      if (!ex.asicModel) ex.asicModel = v.m;
      if (!ex.notes || !ex.notes.includes("Order #" + v.o)) {
        ex.notes = ex.notes ? ex.notes + " | " + line : line;
        ex.lastResult = `Bought ${v.m} (Order #${v.o})`;
        matched++;
      }
    } else {
      const l = blankLead();
      l.id = "INV-" + v.o; l.contactName = v.n; l.email = v.e || ""; l.phone = v.p || "";
      l.segment = "Buyer"; l.customer = true; l.direction = "Sell"; l.asicModel = v.m; l.address = v.a || "";
      l.status = "Nurture"; l.priority = "Low";
      l.dateAdded = v.d; l.lastContacted = v.d; l.leadSource = "Website form submission";
      l.lastResult = `Bought ${v.m} (Order #${v.o})`; l.notes = line; l.lastUpdated = v.d;
      out.push(l); added++;
    }
  });
  return { list: out, matched, added };
}

function buildInvoices(list) {
  return INVOICES.map((v) => {
    const e = norm(v.e), p = phoneKey(v.p), nm = norm(v.n);
    let ex = null;
    if (p.length >= 10) ex = list.find((l) => phoneKey(l.phone) === p);
    if (!ex && e) ex = list.find((l) => norm(l.email) === e);
    if (!ex && nm) ex = list.find((l) => norm(l.contactName) === nm);
    return { id: "IV-" + v.o, leadId: ex ? ex.id : "", contact: v.n, number: v.o, model: v.m, qty: v.q, amount: v.t, cost: "", profit: "", supplier: "", date: v.d, dueDate: v.d, status: "Paid", historical: true, notes: "" };
  });
}

const QB_CUSTOMERS = [];


function qbMatch(list, c) {
  const e = norm(c.e), p = phoneKey(c.p);
  let ex = null;
  if (p.length >= 10) ex = list.find((l) => phoneKey(l.phone) === p);
  if (!ex && e) ex = list.find((l) => norm(l.email) === e && (l.email || "").includes("@"));
  return ex;
}

function mergeQB(list) {
  const out = list.map((l) => ({ ...l }));
  let matched = 0, added = 0;
  QB_CUSTOMERS.forEach((c) => {
    const ex = qbMatch(out, c);
    if (ex) {
      ex.customer = true;
      if (!ex.company && c.co) ex.company = c.co;
      if (!ex.address && c.addr) ex.address = c.addr;
      if (!ex.city && c.city) ex.city = c.city;
      if (!ex.email && c.e) ex.email = c.e;
      if (phoneKey(ex.phone).length < 10 && c.p) ex.phone = c.p;
      matched++;
    } else {
      const l = blankLead();
      l.id = "QB-" + norm(c.n) + "-" + Math.random().toString(36).slice(2, 6);
      l.contactName = /\s/.test(c.n) ? c.n : (c.co ? "" : c.n);
      l.company = c.co || (/\s/.test(c.n) ? "" : c.n);
      l.email = c.e || ""; l.phone = c.p || ""; l.city = c.city || ""; l.address = c.addr || "";
      l.segment = "Buyer"; l.customer = true; l.leadSource = "Past customer"; l.status = "Nurture"; l.priority = "Low";
      l.notes = "Imported from QuickBooks customers";
      out.push(l); added++;
    }
  });
  return { list: out, matched, added };
}

function qbOpenInvoices(list) {
  const today = todayISO();
  return QB_CUSTOMERS.filter((c) => c.bal > 0).map((c) => {
    const ex = qbMatch(list, c);
    return { id: "QBO-" + norm(c.n), leadId: ex ? ex.id : "", contact: c.n, number: "Open balance (QB)", model: "", qty: "", amount: c.bal, cost: "", profit: "", supplier: "", date: today, dueDate: today, status: "Unpaid", notes: "Open balance imported from QuickBooks" };
  });
}

const QBS_INV = [];


const QBS_MODEL = {};
const QBS_FLAGS = {};

const FIRST_INV = {};

const QBS_TAX = {};
const QBS_TAXLAB = {};

function qbsMatch(list, name) {
  const nm = norm(name);
  return list.find((l) => (norm(l.contactName) && norm(l.contactName) === nm) || (norm(l.company) && norm(l.company) === nm));
}

const UNPAID_NUMS = {};
const UNPAID_AMT = {};
function buildQBSInvoices(list) {
  return QBS_INV.map((v) => {
    const ex = qbsMatch(list, v.cust);
    const unpaid = !!UNPAID_NUMS[String(v.num)];
    const taxed = QBS_TAX[String(v.num)];
    const lab = QBS_TAXLAB[String(v.num)];
    const amount = unpaid && UNPAID_AMT[String(v.num)] != null ? UNPAID_AMT[String(v.num)] : (!unpaid && taxed != null ? taxed : v.amt);
    const taxNote = unpaid ? ", amount incl. tax" : (taxed != null ? ", incl. " + lab : ", pre-tax (province unknown)");
    return { id: "QBS-" + v.num, leadId: ex ? ex.id : "", contact: v.cust, number: v.num, model: v.prod, qty: "", amount, cost: "", profit: "", supplier: "", date: v.date, dueDate: v.date, status: unpaid ? "Unpaid" : "Paid", historical: !unpaid, notes: v.type + " (QuickBooks)" + taxNote };
  });
}

function mergeQBSales(list) {
  const out = list.map((l) => ({ ...l }));
  const byCust = {};
  QBS_INV.forEach((v) => {
    const k = norm(v.cust);
    if (!byCust[k]) byCust[k] = { name: v.cust, bought: false, repaired: false, total: 0, n: 0 };
    const c = byCust[k];
    if (v.type === "Repair" || v.type === "Mixed") c.repaired = true;
    if (v.type === "Sale" || v.type === "Mixed") c.bought = true;
    c.total += v.amt; c.n += 1;
  });
  let matched = 0, added = 0;
  Object.values(byCust).forEach((c) => {
    const note = `QuickBooks history: ${c.bought ? "bought" : ""}${c.bought && c.repaired ? " and " : ""}${c.repaired ? "repairs" : ""}, ${c.n} invoice${c.n === 1 ? "" : "s"}, total ${cad(c.total)}`;
    const model = QBS_MODEL[norm(c.name)] || "";
    let ex = qbsMatch(out, c.name);
    if (ex) {
      if (c.bought) ex.customer = true;
      if (c.repaired) ex.repairClient = true;
      ex.segment = c.bought ? "Buyer" : "Repair";
      if (model) ex.asicModel = model;
      if (!(ex.notes || "").includes("QuickBooks history")) ex.notes = ex.notes ? ex.notes + " | " + note : note;
      matched++;
    } else {
      const l = blankLead();
      l.id = "QBS-C-" + norm(c.name) + "-" + Math.random().toString(36).slice(2, 6);
      l.contactName = /\s/.test(c.name) ? c.name : "";
      l.company = /\s/.test(c.name) ? "" : c.name;
      l.customer = c.bought; l.repairClient = c.repaired;
      l.segment = c.bought ? "Buyer" : "Repair";
      l.asicModel = model;
      l.leadSource = "Past customer"; l.status = "Nurture"; l.priority = "Low"; l.notes = note;
      { const fd = FIRST_INV[norm(c.name)]; if (fd) { l.dateAdded = fd; l.lastContacted = fd; } }
      out.push(l); added++;
    }
  });
  return { list: out, matched, added };
}

const MANUAL_INV = [
  {num: "SAMPLE-0001", name: "Sample Customer", email: "sample@example.com", phone: "+1 555 000 0000", addr: "123 Sample Street", date: "2026-01-01", model: "Sample Miner x1", amount: 1000, status: "Paid", cur: "CAD", kind: "sale"},
];


function manualMatch(list, v) {
  const e = norm(v.email), p = phoneKey(v.phone), nm = norm(v.name);
  let ex = null;
  if (e && v.email.includes("@")) ex = list.find((l) => norm(l.email) === e && (l.email || "").includes("@"));
  if (!ex && p.length >= 10) ex = list.find((l) => phoneKey(l.phone) === p);
  if (!ex && nm) ex = list.find((l) => norm(l.contactName) === nm || norm(l.company) === nm);
  return ex;
}

function mergeManual(list) {
  const out = list.map((l) => ({ ...l }));
  MANUAL_INV.forEach((v) => {
    let ex = manualMatch(out, v);
    const isCompany = !/\s/.test(v.name) ? true : /(inc|llc|ltd|corp|holdings|investment|mart|canada|construction|technologies|advisory)/i.test(v.name);
    if (ex) {
      if (v.kind === "repair") ex.repairClient = true; else if (v.status !== "Quote") ex.customer = true;
      if (!ex.email && v.email) ex.email = v.email;
      if (phoneKey(ex.phone).length < 10 && v.phone) ex.phone = v.phone;
      if (!ex.address && v.addr) ex.address = v.addr;
      if (v.date && (!ex.dateAdded || ex.dateAdded > v.date)) ex.dateAdded = v.date;
    } else {
      const l = blankLead();
      l.id = "MAN-C-" + norm(v.name) + "-" + Math.random().toString(36).slice(2, 6);
      l.contactName = isCompany ? "" : v.name;
      l.company = isCompany ? v.name : "";
      l.contactType = isCompany ? "Company" : "Individual";
      l.email = v.email || ""; l.phone = v.phone || ""; l.address = v.addr || "";
      l.segment = v.kind === "repair" ? "Repair" : "Buyer";
      l.customer = v.kind !== "repair" && v.status !== "Quote";
      l.repairClient = v.kind === "repair";
      l.leadSource = "Past customer"; l.status = "Nurture"; l.priority = "Low";
      l.dateAdded = v.date || todayISO(); l.lastContacted = v.date || "";
      l.notes = v.status === "Quote" ? "Quote, did not proceed" : "Manual invoice " + v.num;
      out.push(l);
    }
  });
  return out;
}

function buildManualInvoices(list) {
  return MANUAL_INV.map((v) => {
    const ex = manualMatch(list, v);
    const note = (v.kind === "repair" ? "Repair" : "Sale") + (v.cur === "USD" ? " — amount in USD" : "") + (v.status === "Quote" ? " — quote, no price" : "");
    return { id: "MAN-" + v.num + "-" + norm(v.name).slice(0, 8) + "-" + (v.amount || 0), leadId: ex ? ex.id : "", contact: v.name, number: v.num, model: v.model, qty: "", amount: v.status === "Quote" ? "" : v.amount, cost: "", profit: "", supplier: "", date: v.date, dueDate: v.date, status: v.status, historical: v.status === "Paid" || v.status === "Refund", notes: note };
  });
}

// ---------- helpers ----------
const norm = (s) => String(s || "").toLowerCase().replace(/[^a-z0-9]/g, "");
const cad = (v) => "$" + Math.round(v).toLocaleString("en-CA");
const digits = (s) => String(s || "").replace(/[^0-9+]/g, "");
const GMAIL_ACCOUNT = "info@example.com";
const gmailUrl = (to) => `https://mail.google.com/mail/u/${encodeURIComponent(GMAIL_ACCOUNT)}/?view=cm&fs=1&to=${encodeURIComponent(to)}`;
const phoneKey = (s) => { let d = String(s || "").replace(/\D/g, ""); if (d.length === 11 && d[0] === "1") d = d.slice(1); return d.length >= 10 ? d.slice(-10) : d; };
const numVal = (v) => Number(String(v || "").replace(/[^0-9.]/g, "")) || 0;

const FIELD_MAP = {
  id: ["leadid", "id", "importleadid"],
  dateAdded: ["dateadded", "date", "datecreated", "receiveddate", "received", "receiveddat"],
  company: ["companymine", "company", "companyname", "businessname", "mine", "mineco"],
  contactName: ["contactname", "name", "contact", "fullname"],
  role: ["roletitle", "role", "title", "position"],
  phone: ["phone", "phonenumber", "mobile", "cell", "tel"],
  email: ["email", "emailaddress", "contactemail"],
  country: ["country"],
  city: ["cityregion", "city"],
  address: ["address", "shippingaddress", "streetaddress", "billingaddress"],
  language: ["language", "languagespoken", "lang"],
  leadSource: ["leadsource", "source"],
  segment: ["leadsegment", "segment", "leadtype", "type"],
  contactType: ["contacttype", "individualorcompany"],
  operationSize: ["operationsize", "fleetsize", "minercount", "miners", "megawatts", "mw"],
  direction: ["dealdirection", "direction"],
  asicModel: ["asicmodelsneeds", "asicmodel", "model", "asic", "needs"],
  quantity: ["qtybatchsize", "quantity", "qty", "batchsize", "batch"],
  estValue: ["estvalue", "value", "dealvalue", "amount", "estimatedvalue"],
  preferredContact: ["preferredcontact"],
  lastContacted: ["lastcontacted"],
  lastResult: ["lastresult", "lastresults"],
  nextFollowUp: ["nextfollowup", "followup", "followupdate"],
  priority: ["followuppriority", "priority"],
  status: ["status"],
  dealAlert: ["dealalertsok", "dealalert"],
  nextAction: ["nextaction", "suggestednextstep"],
  aiSummary: ["aisummary", "callsummary", "transcriptsummary"],
  website: ["website", "site", "url"],
  owner: ["owner"],
  notes: ["notes", "note", "messagepreview", "subject", "matchedkeyword"],
};

const toISO = (v) => {
  if (v === null || v === undefined || v === "") return "";
  if (v instanceof Date && !isNaN(v)) return v.toISOString().slice(0, 10);
  if (typeof v === "number") { const d = new Date(Math.round((v - 25569) * 86400 * 1000)); if (!isNaN(d)) return d.toISOString().slice(0, 10); }
  const d = new Date(v);
  if (!isNaN(d)) return d.toISOString().slice(0, 10);
  return String(v);
};

const todayISO = () => new Date().toISOString().slice(0, 10);
const addDays = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };
const daysSince = (iso) => { if (!iso) return null; const d = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000); return isNaN(d) ? null : d; };
const uid = (p) => p + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

const isOpen = (s) => !NOT_OPEN.includes(norm(s));
const COLD_DAYS = 45;
function isCold(l) { const tt = todayISO(); return isOpen(l.status) && l.lastContacted && (daysSince(l.lastContacted) || 0) >= COLD_DAYS && (!l.nextFollowUp || l.nextFollowUp <= tt); }
const isWarmActive = (s) => { const n = norm(s); return n.includes("warm") || n.includes("active"); };

function SEED_TEMPLATES() {
  return [
    { id: uid("T"), category: "Sales", title: "Bulk pricing reply", body: "Hi [name],\n\nThanks for reaching out. We have [model] in stock, tested and working. Price is [price] CAD per unit. For 10 or more units I can do a better rate.\n\nWe ship across Canada. Let me know how many you need and I will send the full details.\n\nThanks,\n[Your Name]\n[Your Company]\n[Your Website]\n[Your Phone]" },
    { id: uid("T"), category: "Follow up", title: "Follow up", body: "Hi [name],\n\nJust following up on the miners you asked about. Still have them ready to go. Let me know if you want to move forward.\n\nThanks,\n[Your Name]" },
    { id: uid("T"), category: "Repair", title: "Repair intake", body: "Hi [name],\n\nWe can repair that hashboard. Send it to our Montreal shop and we will test it and give you a quote before any work is done. Most repairs are finished within a few days.\n\nShip to: [Your Shipping Address]\n\nThanks,\n[Your Name]\n[Your Company]" },
  ];
}

function blankLead() {
  return {
    id: uid("L"), dateAdded: todayISO(), company: "", contactName: "", contactType: "", role: "", phone: "", email: "",
    country: "", city: "", address: "", language: "", leadSource: "", segment: "", direction: "", asicModel: "", operationSize: "", quantity: "", estValue: "",
    preferredContact: "", lastContacted: "", lastResult: "", nextFollowUp: "", priority: "Medium",
    status: "Nurture", dealAlert: false, customer: false, supplier: false, repairClient: false, nextAction: "", aiSummary: "", website: "", owner: "Owner", notes: "", tags: [], lastUpdated: todayISO(),
  };
}

const headerToField = {};
Object.entries(FIELD_MAP).forEach(([field, aliases]) => aliases.forEach((a) => { if (!headerToField[a]) headerToField[a] = field; }));

function rowToLead(row) {
  const out = blankLead();
  let touched = false;
  Object.entries(row).forEach(([k, val]) => {
    if (val === "" || val === null || val === undefined) return;
    const f = headerToField[norm(k)];
    if (!f) return;
    touched = true;
    if (["dateAdded", "lastContacted", "nextFollowUp", "lastUpdated"].includes(f)) out[f] = toISO(val);
    else if (f === "dealAlert") { const n = norm(val); out[f] = ["yes", "true", "hot", "alert", "urgent", "1"].some((x) => n.includes(x)); }
    else if (f === "notes" && out.notes) out.notes = out.notes + " | " + String(val).slice(0, 200);
    else out[f] = typeof val === "number" ? val : String(val).trim();
  });
  if (!out.contactName && out.company) out.contactName = out.company;
  if (!out.id) out.id = uid("L");
  return touched ? out : null;
}

function rowToActivity(row) {
  const g = (aliases) => { for (const k of Object.keys(row)) { if (aliases.includes(norm(k)) && row[k] !== "") return row[k]; } return ""; };
  const date = toISO(g(["date", "dateadded", "when", "timestamp"]));
  const type = g(["type", "activitytype", "action"]);
  const contact = g(["contact", "contactname", "name"]);
  const outcome = g(["outcome", "result", "lastresult"]);
  const notes = g(["notes", "note", "details", "summary"]);
  const leadId = g(["leadid", "id"]);
  if (!date && !type && !contact && !notes) return null;
  return { id: uid("A"), date: date || todayISO(), leadId: String(leadId || ""), contact: String(contact || ""), type: String(type || "Note"), outcome: String(outcome || ""), notes: String(notes || "") };
}

function classifySheet(name) {
  const n = norm(name);
  if (n.includes("dash")) return "skip";
  if (n.includes("activ") || (n.includes("log") && !n.includes("lead"))) return "activity";
  if (n.includes("follow")) return "skip";
  return "lead";
}

function parseExcel() {
  return Promise.reject(new Error("window.fs auto-read is only available in the Claude Artifact sandbox")).then((buf) => {
    const wb = XLSX.read(buf, { type: "array", cellDates: true });
    const leads = []; const acts = [];
    wb.SheetNames.forEach((sn) => {
      const kind = classifySheet(sn);
      if (kind === "skip") return;
      const rows = XLSX.utils.sheet_to_json(wb.Sheets[sn], { defval: "" });
      rows.forEach((r) => { if (kind === "activity") { const a = rowToActivity(r); if (a) acts.push(a); } else { const l = rowToLead(r); if (l) leads.push(l); } });
    });
    const byEmail = {}; const final = [];
    leads.forEach((l) => { const key = norm(l.email); if (key && byEmail[key]) { const ex = byEmail[key]; Object.keys(l).forEach((k) => { if (!ex[k] && l[k]) ex[k] = l[k]; }); } else { if (key) byEmail[key] = l; final.push(l); } });
    return { leads: final, acts };
  }).catch(() => null);
}

// ---------- component ----------
export default function App({ onLock }) {
  const [tab, setTab] = useState("dash");
  const [leads, setLeads] = useState([]);
  const [acts, setActs] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [invForm, setInvForm] = useState(null);
  const [batches, setBatches] = useState([]);
  const [batchForm, setBatchForm] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [tplForm, setTplForm] = useState(null);
  const [fCold, setFCold] = useState(false);
  const [bSearch, setBSearch] = useState("");
  const [bFilter, setBFilter] = useState("Available");
  const [copiedId, setCopiedId] = useState("");
  const [importNote, setImportNote] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [note, setNote] = useState("Loading...");
  const [search, setSearch] = useState("");
  const [fStatus, setFStatus] = useState("");
  const [fDir, setFDir] = useState("");
  const [fSeg, setFSeg] = useState("");
  const [fSource, setFSource] = useState("");
  const [fHot, setFHot] = useState(false);
  const [light, setLight] = useState(false);
  const [sort, setSort] = useState("updated");
  const [edit, setEdit] = useState(null);
  const [actForm, setActForm] = useState(null);
  const [menu, setMenu] = useState(false);
  const [view, setView] = useState(() => { try { return localStorage.getItem("cbm-crm-view") || "all"; } catch (e) { return "all"; } });
  const [showAllToday, setShowAllToday] = useState(false);
  const [importPrev, setImportPrev] = useState(null);
  const [tplPreview, setTplPreview] = useState(null);
  const [restorePrev, setRestorePrev] = useState(null);
  const [importMode, setImportMode] = useState("skip");

  const save = async (l, a, inv, bat, tpl) => { try { await crmStorage.set(STORE_KEY, JSON.stringify({ leads: l, activities: a, invoices: inv, batches: bat, templates: tpl, v: 4, wl: true, iv2: true, clean1: true, clean2: true, inv3: true, tpl1: true, qb1: true, qbs1: true, clean3: true, qbs2: true, qbs3: true, qbs4: true, qbs5: true, inv4: true, inv5: true, man1: true, inv6: true, inv7: true, man2: true, man3: true, man4: true, man5: true, man6: true, inv8: true }), false); } catch (e) {} };

  const reImport = async () => {
    setNote("Reading Excel file...");
    const res = await parseExcel();
    if (res && res.leads.length) { setLeads(res.leads); setActs(res.acts); await save(res.leads, res.acts, invoices, batches, templates); setNote(`Imported ${res.leads.length} leads from your Excel file.`); }
    else setNote("No Excel file found this session. Your current data is unchanged.");
  };

  useEffect(() => {
    (async () => {
      let base = null, acts0 = [], wl = false, iv2 = false, clean1 = false, clean2 = false, savedInv = null, inv3 = false, savedBat = [], savedTpl = null, tpl1 = false, qb1 = false, qbs1 = false, clean3 = false, qbs2 = false, qbs3 = false, qbs4 = false, qbs5 = false, inv4 = false, inv5 = false, man1 = false, inv6 = false, inv7 = false, man2 = false, man3 = false, man4 = false, man5 = false, man6 = false, inv8 = false;
      try {
        const saved = await crmStorage.get(STORE_KEY, false);
        if (saved && saved.value) { const p = JSON.parse(saved.value); if ((p.leads || []).length) { base = p.leads; acts0 = p.activities || []; wl = !!p.wl; iv2 = !!p.iv2; clean1 = !!p.clean1; clean2 = !!p.clean2; savedInv = p.invoices || null; inv3 = !!p.inv3; savedBat = p.batches || []; savedTpl = p.templates || null; tpl1 = !!p.tpl1; qb1 = !!p.qb1; qbs1 = !!p.qbs1; clean3 = !!p.clean3; qbs2 = !!p.qbs2; qbs3 = !!p.qbs3; qbs4 = !!p.qbs4; qbs5 = !!p.qbs5; inv4 = !!p.inv4; inv5 = !!p.inv5; man1 = !!p.man1; inv6 = !!p.inv6; inv7 = !!p.inv7; man2 = !!p.man2; man3 = !!p.man3; man4 = !!p.man4; man5 = !!p.man5; man6 = !!p.man6; inv8 = !!p.inv8; } }
      } catch (e) {}
      if (!base) base = seedToLeads();
      base = base.map((l) => ({ ...blankLead(), ...l }));
      if (!clean1) base = base.map((l) => ({ ...l, status: "Nurture", segment: cleanSeg(l.segment), leadSource: cleanSource(l.leadSource) }));
      if (!clean2) base = base.map((l) => ({ ...l, leadSource: cleanSource(l.leadSource), customer: l.customer || /Order #/.test(l.notes || "") }));
      if (!clean3) base = base.map((l) => ({ ...l, leadSource: cleanSource(l.leadSource) }));
      if (!qbs2) base = base.map((l) => { const m = QBS_MODEL[norm(l.contactName || "")] || QBS_MODEL[norm(l.company || "")]; return m ? { ...l, asicModel: m } : l; });
      if (!qbs3) base = base.map((l) => { const k = QBS_FLAGS[norm(l.contactName || "")] ? norm(l.contactName) : (QBS_FLAGS[norm(l.company || "")] ? norm(l.company) : null); if (!k) return l; const fl = QBS_FLAGS[k]; return { ...l, customer: l.customer || fl.b === 1, repairClient: fl.r === 1, asicModel: QBS_MODEL[k] || l.asicModel }; });
      if (!qbs4) base = base.map((l) => { const k = QBS_FLAGS[norm(l.contactName || "")] ? norm(l.contactName) : (QBS_FLAGS[norm(l.company || "")] ? norm(l.company) : null); if (!k) return l; const fl = QBS_FLAGS[k]; return { ...l, segment: fl.b === 1 ? "Buyer" : "Repair", asicModel: QBS_MODEL[k] || l.asicModel }; });
      if (!qbs5) base = base.map((l) => { const fd = FIRST_INV[norm(l.contactName || "")] || FIRST_INV[norm(l.company || "")]; if (fd && (!l.dateAdded || l.dateAdded > fd)) return { ...l, dateAdded: fd, lastContacted: l.lastContacted || fd }; return l; });
      let list = base, wlAdded = 0, ivMatched = 0, ivAdded = 0;
      if (!wl) { const r = mergeWebsiteLeads(list); list = r.list; wlAdded = r.added; }
      if (!iv2) {
        list = list.map((l) => ({ ...l, estValue: "", status: l.status === "Won" ? "Nurture" : l.status }));
      }
      { const r = mergeInvoices(list); list = r.list; ivMatched = r.matched; ivAdded = r.added; }
      if (!qb1) { const r = mergeQB(list); list = r.list; }
      if (!qbs1) { const r = mergeQBSales(list); list = r.list; }
      if (!man6) { list = mergeManual(list); }
      let invs = (inv3 && savedInv) ? savedInv : buildInvoices(list);
      if (!qbs1) { invs = [...buildQBSInvoices(list), ...invs]; }
      if (!man6) { invs = invs.filter((i) => !String(i.id).startsWith("MAN-")); invs = [...buildManualInvoices(list), ...invs]; }
      list = list.filter((l) => !/\(deleted\)/i.test((l.contactName || "") + " " + (l.company || "")));
      invs = invs.filter((i) => !/\(deleted\)/i.test(i.contact || ""));
      if (!inv5) {
        invs = invs.filter((i) => !String(i.id).startsWith("QBO-"));
        invs = invs.map((i) => { if (!UNPAID_NUMS[String(i.number)]) return i; const amt = UNPAID_AMT[String(i.number)]; return { ...i, status: "Unpaid", amount: amt != null ? amt : i.amount }; });
      }
      if (!inv6) {
        invs = invs.map((i) => {
          const isImport = /^(IV-|QBS-|MAN-|QBO-)/.test(String(i.id));
          if (isImport && norm(i.status) === "paid") return { ...i, historical: true };
          return i;
        });
      }
      if (!inv7) {
        invs = invs.map((i) => {
          const num = String(i.number);
          if (String(i.id).startsWith("QBS-") && norm(i.status) === "paid" && QBS_TAX[num] != null) {
            return { ...i, amount: QBS_TAX[num], notes: (i.notes || "").replace(/, pre-tax \(history\)/, "") + (/, incl\./.test(i.notes || "") ? "" : ", incl. " + QBS_TAXLAB[num]) };
          }
          return i;
        });
      }
      if (!inv8) {
        invs = invs.map((i) => {
          const num = String(i.number);
          if (String(i.id).startsWith("QBS-") && norm(i.status) === "paid" && QBS_TAX[num] != null) {
            return { ...i, amount: QBS_TAX[num], notes: (i.notes || "").replace(/, pre-tax \(province unknown\)/, "") + (/, incl\./.test(i.notes || "") ? "" : ", incl. " + QBS_TAXLAB[num]) };
          }
          return i;
        });
      }
      const tpls = ((tpl1 && savedTpl) ? savedTpl : SEED_TEMPLATES()).map((tp) => ({ category: "General", ...tp }));
      setLeads(list); setActs(acts0); setInvoices(invs); setBatches(savedBat || []); setTemplates(tpls); setLoaded(true);
      setNote(`${list.length} contacts total.`);
      try { await crmStorage.set(STORE_KEY, JSON.stringify({ leads: list, activities: acts0, invoices: invs, batches: savedBat || [], templates: tpls, v: 4, wl: true, iv2: true, clean1: true, clean2: true, inv3: true, tpl1: true, qb1: true, qbs1: true, clean3: true, qbs2: true, qbs3: true, qbs4: true, qbs5: true, inv4: true, inv5: true, man1: true, inv6: true, inv7: true, man2: true, man3: true, man4: true, man5: true, man6: true, inv8: true }), false); } catch (e) {}
    })();
  }, []);

  useEffect(() => { if (loaded) save(leads, acts, invoices, batches, templates); }, [leads, acts, invoices, batches, templates, loaded]);

  const t = todayISO();
  const m = useMemo(() => {
    return {
      total: leads.length,
      dueToday: leads.filter((l) => l.nextFollowUp === t && isOpen(l.status)).length,
      overdue: leads.filter((l) => l.nextFollowUp && l.nextFollowUp < t && isOpen(l.status)).length,
      alerts: leads.filter((l) => l.dealAlert).length,
      dealsClosed: invoices.filter((i) => norm(i.status) === "paid" && !i.historical).reduce((s, i) => s + numVal(i.amount), 0),
      dealsCount: invoices.filter((i) => norm(i.status) === "paid" && !i.historical).length,
      profit: invoices.filter((i) => norm(i.status) === "paid" && !i.historical).reduce((s, i) => s + numVal(i.profit), 0),
      cold: leads.filter((l) => isCold(l)).length,
    };
  }, [leads, invoices]);

  const statusCounts = useMemo(() => STATUS.map((s) => ({ s, n: leads.filter((l) => l.status === s).length })), [leads]);
  const maxStatus = Math.max(1, ...statusCounts.map((x) => x.n));
  const segments = useMemo(() => Array.from(new Set(leads.map((l) => l.segment).filter(Boolean))).sort(), [leads]);
  const sources = useMemo(() => Array.from(new Set(leads.map((l) => l.leadSource).filter(Boolean))).sort(), [leads]);

  const viewMatch = (l) => {
    switch (view) {
      case "hot": return l.dealAlert;
      case "today": return l.nextFollowUp === t && isOpen(l.status);
      case "overdue": return l.nextFollowUp && l.nextFollowUp < t && isOpen(l.status);
      case "customers": return l.customer;
      case "suppliers": return l.supplier;
      case "repair": return l.repairClient;
      case "bulk": return /buyer/i.test(l.segment || "") || (l.tags || []).some((x) => /bulk/i.test(x)) || numVal(l.estValue) >= 10000;
      case "lost": return norm(l.status) === "lost";
      case "cold": return isCold(l);
      case "quote": return isOpen(l.status) && ((l.tags || []).some((x) => /quote/i.test(x)) || /quote/i.test(l.lastResult || ""));
      default: return true;
    }
  };
  const filtered = useMemo(() => {
    const q = norm(search);
    let r = leads.filter((l) => {
      if (!viewMatch(l)) return false;
      if (fStatus && l.status !== fStatus) return false;
      if (fDir && l.direction !== fDir) return false;
      if (fSeg && l.segment !== fSeg) return false;
      if (fSource && l.leadSource !== fSource) return false;
      if (fHot && !l.dealAlert) return false;
      if (fCold && !isCold(l)) return false;
      if (!q) return true;
      return [l.company, l.contactName, l.email, l.phone, l.asicModel, l.city, l.country, l.address, l.segment, l.notes, (l.tags || []).join(" ")].some((v) => norm(v).includes(q));
    });
    const nm = (l) => (l.contactName || l.company || "").toLowerCase();
    if (sort === "name") r = [...r].sort((a, b) => nm(a).localeCompare(nm(b)));
    else if (sort === "value") r = [...r].sort((a, b) => numVal(b.estValue) - numVal(a.estValue));
    else if (sort === "followup") r = [...r].sort((a, b) => (a.nextFollowUp || "9999").localeCompare(b.nextFollowUp || "9999"));
    else r = [...r].sort((a, b) => (b.lastUpdated || "").localeCompare(a.lastUpdated || ""));
    return r;
  }, [leads, search, fStatus, fDir, fSeg, fSource, fHot, fCold, sort, view, t]);

  const followUps = useMemo(() => leads.filter((l) => l.nextFollowUp && isOpen(l.status)).sort((a, b) => a.nextFollowUp.localeCompare(b.nextFollowUp)), [leads]);

  const toContact = useMemo(() => {
    const seen = new Set(); const out = [];
    const add = (l, why) => { if (!seen.has(l.id)) { seen.add(l.id); out.push({ l, why }); } };
    leads.filter((l) => l.nextFollowUp && l.nextFollowUp < t && isOpen(l.status)).sort((a, b) => (a.nextFollowUp || "").localeCompare(b.nextFollowUp || "")).forEach((l) => add(l, "Overdue"));
    leads.filter((l) => l.nextFollowUp === t && isOpen(l.status)).forEach((l) => add(l, "Due today"));
    leads.filter((l) => isCold(l)).sort((a, b) => (a.lastContacted || "").localeCompare(b.lastContacted || "")).forEach((l) => add(l, "Going cold"));
    return out;
  }, [leads]);

  const invMeta = useMemo(() => {
    const unpaid = invoices.filter((i) => { const ss = norm(i.status); return ss === "unpaid" || ss === "overdue"; });
    const overdue = unpaid.filter((i) => i.dueDate && i.dueDate < t);
    const totalUnpaid = unpaid.reduce((acc, i) => acc + numVal(i.amount), 0);
    const oldest = unpaid.filter((i) => i.date).sort((a, b) => (a.date || "").localeCompare(b.date || ""))[0] || null;
    return { unpaidCount: unpaid.length, overdueCount: overdue.length, totalUnpaid, oldest };
  }, [invoices, t]);

  const counts = useMemo(() => ({
    all: leads.length,
    hot: leads.filter((l) => l.dealAlert).length,
    today: leads.filter((l) => l.nextFollowUp === t && isOpen(l.status)).length,
    overdue: leads.filter((l) => l.nextFollowUp && l.nextFollowUp < t && isOpen(l.status)).length,
    customers: leads.filter((l) => l.customer).length,
    suppliers: leads.filter((l) => l.supplier).length,
    repair: leads.filter((l) => l.repairClient).length,
    bulk: leads.filter((l) => /buyer/i.test(l.segment || "") || (l.tags || []).some((x) => /bulk/i.test(x)) || numVal(l.estValue) >= 10000).length,
    lost: leads.filter((l) => norm(l.status) === "lost").length,
    cold: leads.filter((l) => isCold(l)).length,
    quote: leads.filter((l) => isOpen(l.status) && ((l.tags || []).some((x) => /quote/i.test(x)) || /quote/i.test(l.lastResult || ""))).length,
  }), [leads, t]);

  const recentActs = useMemo(() => [...acts].sort((a, b) => (b.date || "").localeCompare(a.date || "")).slice(0, 8), [acts]);

  const VIEWS = [
    { k: "all", label: "All contacts" }, { k: "hot", label: "Hot leads" }, { k: "today", label: "Follow-up today" },
    { k: "overdue", label: "Overdue" }, { k: "quote", label: "Awaiting quote" }, { k: "unpaid", label: "Unpaid invoices" },
    { k: "customers", label: "Customers" }, { k: "suppliers", label: "Suppliers" }, { k: "repair", label: "Repair clients" },
    { k: "bulk", label: "Bulk buyers" }, { k: "lost", label: "Lost leads" }, { k: "cold", label: "Cold leads" },
  ];
  const applyView = (v) => {
    setView(v); setSearch(""); setFStatus(""); setFSeg(""); setFSource(""); setFHot(false); setFCold(false);
    if (v === "lost") setFStatus("Lost");
    if (v === "today" || v === "overdue") setSort("followup");
    try { localStorage.setItem("cbm-crm-view", v); } catch (e) {}
    setTab(v === "unpaid" ? "invoices" : "leads");
  };
  const quickFollow = (id, days) => { const d = days === 0 ? todayISO() : addDays(days); setLeads((prev) => prev.map((x) => x.id === id ? { ...x, nextFollowUp: d, lastUpdated: t } : x)); };
  const setFollowDate = (id, d) => setLeads((prev) => prev.map((x) => x.id === id ? { ...x, nextFollowUp: d || "", lastUpdated: t } : x));
  const patchLead = (id, partial) => setLeads((prev) => prev.map((x) => x.id === id ? { ...x, ...partial, lastUpdated: t } : x));
  const addNote = (l, text, type) => {
    if (!text && !type) return;
    setActs((prev) => [{ id: uid("A"), date: t, leadId: l.id, contact: l.contactName || l.company, type: type || "Note", outcome: text || "", notes: "" }, ...prev]);
    setLeads((prev) => prev.map((x) => x.id === l.id ? { ...x, lastContacted: t, lastResult: text || x.lastResult, status: (norm(x.status) === "nurture" || norm(x.status) === "new") ? "Contacted" : x.status, lastUpdated: t } : x));
  };
  const quickMark = (l, kind) => {
    let partial = {}; let note = "";
    if (kind === "hot") { partial = { dealAlert: !l.dealAlert }; note = l.dealAlert ? "" : "Marked hot lead"; }
    else if (kind === "customer") { partial = { customer: !l.customer }; note = l.customer ? "" : "Marked customer"; }
    else if (kind === "lost") { partial = { status: "Lost", dealAlert: false }; note = "Marked lost"; }
    patchLead(l.id, partial);
    if (note) setActs((prev) => [{ id: uid("A"), date: t, leadId: l.id, contact: l.contactName || l.company, type: "Note", outcome: note, notes: "" }, ...prev]);
  };
  const actsCount = useMemo(() => { const map = {}; acts.forEach((a) => { if (a.leadId) map[a.leadId] = (map[a.leadId] || 0) + 1; }); return map; }, [acts]);
  const copyText = (txt) => { try { navigator.clipboard.writeText(txt); } catch (e) {} };

  const saveLead = (l) => { l.lastUpdated = t; setLeads((prev) => { const i = prev.findIndex((x) => x.id === l.id); if (i >= 0) { const c = [...prev]; c[i] = l; return c; } return [l, ...prev]; }); setEdit(null); };
  const saveInv = (iv) => { setInvoices((prev) => { const i = prev.findIndex((x) => x.id === iv.id); if (i >= 0) { const c = [...prev]; c[i] = iv; return c; } return [iv, ...prev]; }); setInvForm(null); };
  const delInv = (id) => { setInvoices((prev) => prev.filter((x) => x.id !== id)); setInvForm(null); };
  const saveBatch = (b) => { setBatches((prev) => { const i = prev.findIndex((x) => x.id === b.id); if (i >= 0) { const c = [...prev]; c[i] = b; return c; } return [b, ...prev]; }); setBatchForm(null); };
  const delBatch = (id) => { setBatches((prev) => prev.filter((x) => x.id !== id)); setBatchForm(null); };
  const saveTpl = (tp) => { setTemplates((prev) => { const i = prev.findIndex((x) => x.id === tp.id); if (i >= 0) { const c = [...prev]; c[i] = tp; return c; } return [tp, ...prev]; }); setTplForm(null); };
  const delTpl = (id) => { setTemplates((prev) => prev.filter((x) => x.id !== id)); setTplForm(null); };
  const copyTpl = (tp) => { try { navigator.clipboard.writeText(tp.body); } catch (e) {} setCopiedId(tp.id); setTimeout(() => setCopiedId(""), 1500); };

  // ---- invoice aging ----
  const aging = useMemo(() => {
    const buckets = { current: 0, d30: 0, d60: 0, d90: 0, d90plus: 0 };
    let totalUnpaid = 0, overdue = 0;
    const byClient = {};
    invoices.forEach((iv) => {
      const st = norm(iv.status);
      if (st !== "unpaid" && st !== "overdue") return;
      const amt = numVal(iv.amount);
      totalUnpaid += amt;
      const ref = iv.dueDate || iv.date;
      const age = ref ? (daysSince(ref) || 0) : 0;
      const past = iv.dueDate && iv.dueDate < t;
      if (past) overdue += amt;
      if (!past || age <= 0) buckets.current += amt;
      else if (age <= 30) buckets.d30 += amt;
      else if (age <= 60) buckets.d60 += amt;
      else if (age <= 90) buckets.d90 += amt;
      else buckets.d90plus += amt;
      const key = iv.contact || iv.leadId || "Unknown";
      if (!byClient[key]) byClient[key] = { contact: iv.contact || "Unknown", leadId: iv.leadId || "", amount: 0, oldest: age, count: 0 };
      byClient[key].amount += amt; byClient[key].count += 1; byClient[key].oldest = Math.max(byClient[key].oldest, age);
    });
    const clients = Object.values(byClient).sort((a, b) => b.amount - a.amount);
    return { buckets, totalUnpaid, overdue, clients };
  }, [invoices, t]);

  // ---- duplicate finder: same email / phone / company / similar name ----
  const norm2 = (x) => norm(x);
  const dupGroups = useMemo(() => {
    const groups = []; const seen = new Set();
    const push = (reason, arr) => {
      if (arr.length < 2) return;
      const sig = reason + ":" + arr.map((l) => l.id).sort().join("|");
      if (seen.has(sig)) return; seen.add(sig);
      groups.push({ reason, leads: arr });
    };
    const byEmail = {}, byPhone = {}, byCompany = {}, byName = {};
    leads.forEach((l) => {
      const e = (l.email && l.email.includes("@")) ? norm2(l.email) : "";
      const p = phoneKey(l.phone);
      const co = norm2(l.company);
      const nm = norm2(l.contactName);
      if (e) (byEmail[e] = byEmail[e] || []).push(l);
      if (p.length >= 10) (byPhone[p] = byPhone[p] || []).push(l);
      if (co && co.length >= 3) (byCompany[co] = byCompany[co] || []).push(l);
      if (nm && nm.length >= 4) (byName[nm] = byName[nm] || []).push(l);
    });
    Object.values(byEmail).forEach((a) => push("Same email", a));
    Object.values(byPhone).forEach((a) => push("Same phone", a));
    Object.values(byCompany).forEach((a) => push("Same company", a));
    Object.values(byName).forEach((a) => push("Same name", a));
    let ignored = {}; try { ignored = JSON.parse(localStorage.getItem("cbm-crm-dupe-ignored") || "{}"); } catch (e) {}
    return groups.filter((g) => !ignored[g.reason + ":" + g.leads.map((l) => l.id).sort().join("|")]);
  }, [leads]);
  const ignoreDupe = (g) => { try { const k = "cbm-crm-dupe-ignored"; const cur = JSON.parse(localStorage.getItem(k) || "{}"); cur[g.reason + ":" + g.leads.map((l) => l.id).sort().join("|")] = 1; localStorage.setItem(k, JSON.stringify(cur)); setLeads((p) => [...p]); } catch (e) {} };

  // ---- import preview (parse only, then confirm) ----
  const previewImport = async (file) => {
    if (!file) return;
    setImportNote("Reading file...");
    try {
      const isCsv = /\.csv$/i.test(file.name);
      const buf = await file.arrayBuffer();
      const wb = isCsv ? XLSX.read(new TextDecoder().decode(new Uint8Array(buf)), { type: "string" }) : XLSX.read(new Uint8Array(buf), { type: "array" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(ws, { defval: "" });
      const headers = Object.keys(rows[0] || {});
      const mapped = headers.map((h) => ({ header: h, field: headerToField[norm(h)] || null }));
      const detected = mapped.filter((mm) => mm.field).map((mm) => mm.field);
      const unmapped = mapped.filter((mm) => !mm.field).map((mm) => mm.header);
      const hasInvoiceCols = headers.some((h) => /invoice|amount|paid|due|order/i.test(h));
      const hasNoteCols = headers.some((h) => /note|message|outcome|summary|comment/i.test(h));
      const haveP = new Set(leads.map((l) => phoneKey(l.phone)).filter((x) => x.length >= 10));
      const haveE = new Set(leads.filter((l) => l.email && l.email.includes("@")).map((l) => norm(l.email)));
      let toAdd = 0, dup = 0, missing = 0, noName = 0, withNotes = 0; const parsed = [];
      rows.forEach((row) => {
        const nl = rowToLead(row); if (!nl) return;
        const pk = phoneKey(nl.phone), ek = nl.email && nl.email.includes("@") ? norm(nl.email) : "";
        const isDup = (pk.length >= 10 && haveP.has(pk)) || (ek && haveE.has(ek));
        const noContact = pk.length < 10 && !ek;
        const missingName = !(nl.contactName || "").trim() && !(nl.company || "").trim();
        if (isDup) dup++; else { toAdd++; if (pk.length >= 10) haveP.add(pk); if (ek) haveE.add(ek); }
        if (noContact) missing++;
        if (missingName) noName++;
        if ((nl.notes || "").trim()) withNotes++;
        parsed.push({ nl, isDup, noContact });
      });
      setImportNote("");
      setImportMode("skip");
      setImportPrev({ fileName: file.name, total: rows.length, toAdd, dup, missing, noName, withNotes, mapped, detected, unmapped, hasInvoiceCols, hasNoteCols, parsed });
    } catch (e) { setImportNote("Could not read that file. Make sure it is a CSV or Excel file with a header row."); }
  };
  const confirmImport = () => {
    if (!importPrev) return;
    const mode = importMode;
    let next = [...leads]; let added = 0, updated = 0, skipped = 0;
    const findMatch = (nl) => {
      const pk = phoneKey(nl.phone), ek = nl.email && nl.email.includes("@") ? norm(nl.email) : "";
      return next.find((l) => (pk.length >= 10 && phoneKey(l.phone) === pk) || (ek && norm(l.email) === ek));
    };
    importPrev.parsed.forEach(({ nl, isDup }) => {
      if (isDup) {
        if (mode === "skip") { skipped++; return; }
        if (mode === "new") { nl.status = nl.status || "Nurture"; nl.leadSource = nl.leadSource || ""; next.unshift(nl); added++; return; }
        // fill: update only empty fields on the matched existing contact
        const ex = findMatch(nl);
        if (!ex) { nl.status = nl.status || "Nurture"; next.unshift(nl); added++; return; }
        let touched = false;
        Object.keys(nl).forEach((k) => {
          if (k === "id" || k === "lastUpdated") return;
          const incoming = nl[k];
          const cur = ex[k];
          const curEmpty = cur === "" || cur === null || cur === undefined || (Array.isArray(cur) && cur.length === 0);
          const hasIncoming = !(incoming === "" || incoming === null || incoming === undefined || (Array.isArray(incoming) && incoming.length === 0));
          if (curEmpty && hasIncoming) { ex[k] = incoming; touched = true; }
        });
        if (touched) { ex.lastUpdated = t; updated++; } else skipped++;
        return;
      }
      nl.status = nl.status || "Nurture"; nl.leadSource = nl.leadSource || ""; next.unshift(nl); added++;
    });
    setLeads(next.map((l) => ({ ...l })));
    setImportNote(`Imported: ${added} added${updated ? `, ${updated} updated` : ""}${skipped ? `, ${skipped} skipped` : ""}.`);
    setImportPrev(null);
  };

  // ---- full backup / restore (all CRM data, version-safe) ----
  const collectBackup = () => {
    let dupeIgnored = {}, savedView = "all";
    try { dupeIgnored = JSON.parse(localStorage.getItem("cbm-crm-dupe-ignored") || "{}"); } catch (e) {}
    try { savedView = localStorage.getItem("cbm-crm-view") || "all"; } catch (e) {}
    return {
      backupType: "cbm-crm-backup", version: 1, exportedAt: new Date().toISOString(),
      storeKey: STORE_KEY,
      leads, activities: acts, invoices, batches, templates,
      settings: { dupeIgnored, view: savedView, light },
    };
  };
  const downloadBackup = () => {
    try {
      const data = JSON.stringify(collectBackup(), null, 2);
      const blob = new Blob([data], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `cbm-crm-backup-${todayISO()}.json`;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (e) {}
  };
  const previewRestore = async (file) => {
    if (!file) return;
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      const payload = data && data.backupType === "cbm-crm-backup" ? data : (data && (data.leads || data.activities) ? data : null);
      if (!payload) { setImportNote("That file is not a CRM backup. Use Backup to create one first."); return; }
      const ignoredCount = payload.settings && payload.settings.dupeIgnored ? Object.keys(payload.settings.dupeIgnored).length : 0;
      setRestorePrev({
        fileName: file.name, payload,
        counts: {
          contacts: (payload.leads || []).length,
          invoices: (payload.invoices || []).length,
          notes: (payload.activities || []).length,
          templates: (payload.templates || []).length,
          followups: (payload.leads || []).filter((l) => l && l.nextFollowUp).length,
          ignored: ignoredCount,
        },
      });
    } catch (e) { setImportNote("Could not read that backup file. Make sure it is a valid CRM backup JSON."); }
  };
  const confirmRestore = () => {
    if (!restorePrev) return;
    const p = restorePrev.payload;
    const safeLeads = (p.leads || []).map((l) => ({ ...blankLead(), ...l }));
    const safeTpls = (p.templates || []).map((tp) => ({ category: "General", ...tp }));
    setLeads(safeLeads);
    setActs(p.activities || []);
    setInvoices(p.invoices || []);
    setBatches(p.batches || []);
    setTemplates(safeTpls.length ? safeTpls : SEED_TEMPLATES().map((tp) => ({ category: "General", ...tp })));
    try {
      if (p.settings && p.settings.dupeIgnored) localStorage.setItem("cbm-crm-dupe-ignored", JSON.stringify(p.settings.dupeIgnored));
      if (p.settings && p.settings.view) localStorage.setItem("cbm-crm-view", p.settings.view);
    } catch (e) {}
    setImportNote(`Restored ${safeLeads.length} contacts from backup.`);
    setRestorePrev(null);
  };

  // ---- data health checks ----
  const health = useMemo(() => {
    const noContact = leads.filter((l) => phoneKey(l.phone).length < 10 && !(l.email && l.email.includes("@")));
    const noName = leads.filter((l) => !(l.contactName || "").trim() && !(l.company || "").trim());
    const followNoDate = []; // follow-up records are lead.nextFollowUp; n/a as separate records
    const unpaidNoDue = invoices.filter((i) => { const st = norm(i.status); return (st === "unpaid" || st === "overdue") && !i.dueDate; });
    const phoneMap = {}, emailMap = {};
    leads.forEach((l) => { const p = phoneKey(l.phone); if (p.length >= 10) (phoneMap[p] = phoneMap[p] || []).push(l); const e = (l.email && l.email.includes("@")) ? norm(l.email) : ""; if (e) (emailMap[e] = emailMap[e] || []).push(l); });
    const dupPhones = Object.values(phoneMap).filter((a) => a.length > 1);
    const dupEmails = Object.values(emailMap).filter((a) => a.length > 1);
    const tplNoCat = templates.filter((tp) => !tp.category);
    const emptyNotes = acts.filter((a) => !(a.outcome || "").trim() && !(a.notes || "").trim());
    return { noContact, noName, followNoDate, unpaidNoDue, dupPhones, dupEmails, tplNoCat, emptyNotes };
  }, [leads, invoices, templates, acts]);
  const importContacts = async (file) => {
    if (!file) return;
    setImportNote("Reading file...");
    try {
      const isCsv = /\.csv$/i.test(file.name);
      const buf = await file.arrayBuffer();
      const wb = isCsv ? XLSX.read(new TextDecoder().decode(new Uint8Array(buf)), { type: "string" }) : XLSX.read(new Uint8Array(buf), { type: "array" });
      const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { defval: "" });
      let added = 0, skipped = 0;
      const next = [...leads];
      const haveP = new Set(next.map((l) => phoneKey(l.phone)).filter((x) => x.length >= 10));
      const haveE = new Set(next.map((l) => norm(l.email)).filter((x) => x && next.find((l) => norm(l.email) === x && l.email.includes("@"))));
      rows.forEach((row) => {
        const nl = rowToLead(row);
        if (!nl) return;
        const pk = phoneKey(nl.phone), ek = nl.email && nl.email.includes("@") ? norm(nl.email) : "";
        if ((pk.length >= 10 && haveP.has(pk)) || (ek && haveE.has(ek))) { skipped++; return; }
        if (pk.length >= 10) haveP.add(pk); if (ek) haveE.add(ek);
        nl.status = "Nurture"; nl.leadSource = nl.leadSource || ""; next.unshift(nl); added++;
      });
      setLeads(next);
      setImportNote(`Added ${added} new contact${added === 1 ? "" : "s"}. Skipped ${skipped} duplicate${skipped === 1 ? "" : "s"}.`);
    } catch (e) { setImportNote("Could not read that file. Make sure it is a CSV or Excel file with a header row."); }
  };
  const delLead = (id) => { setLeads((prev) => prev.filter((x) => x.id !== id)); setEdit(null); };
  const saveAct = (a, advanceDate) => {
    setActs((prev) => [a, ...prev]);
    if (a.leadId) setLeads((prev) => prev.map((l) => l.id === a.leadId ? { ...l, lastContacted: a.date, lastResult: a.outcome || l.lastResult, nextFollowUp: advanceDate || l.nextFollowUp, status: norm(l.status) === "nurture" || norm(l.status) === "new" ? "Contacted" : l.status, lastUpdated: t } : l));
    setActForm(null);
  };

  const TABS = [
    { k: "dash", label: "Dashboard", icon: LayoutDashboard },
    { k: "leads", label: "Contacts", icon: Users },
    { k: "invoices", label: "Invoices", icon: FileText },
    { k: "batches", label: "Batches", icon: Truck },
    { k: "follow", label: "Follow-ups", icon: CalendarClock },
    { k: "templates", label: "Templates", icon: MessageSquare },
    { k: "dupes", label: "Duplicates", icon: AlertTriangle },
    { k: "health", label: "Data Health", icon: Activity },
    { k: "log", label: "Activity Log", icon: Activity },
  ];

  return (
    <div className={light ? "light" : ""}>
      <style>{`
        .light .bg-black{background:#eef0f3 !important;}
        .light .bg-neutral-950{background:#ffffff !important;}
        .light .bg-neutral-950\\/95{background:#ffffff !important;}
        .light .bg-neutral-900{background:#f3f4f6 !important;}
        .light .bg-neutral-900\\/95{background:#ffffff !important;}
        .light .bg-neutral-900\\/70{background:#f3f4f6 !important;}
        .light .bg-neutral-900\\/60{background:#f3f4f6 !important;}
        .light .bg-neutral-900\\/40{background:#eef0f3 !important;}
        .light .bg-neutral-800{background:#e5e7eb !important;}
        .light .bg-neutral-800\\/40{background:#eaecef !important;}
        .light .bg-red-950\\/40{background:#fee2e2 !important;}
        .light .hover\\:bg-neutral-800:hover{background:#e5e7eb !important;}
        .light .hover\\:bg-neutral-700:hover{background:#d1d5db !important;}
        .light .hover\\:bg-neutral-900:hover{background:#f3f4f6 !important;}
        .light .hover\\:bg-neutral-900\\/60:hover{background:#eef0f3 !important;}
        .light .hover\\:bg-neutral-900\\/70:hover{background:#eef0f3 !important;}
        .light .hover\\:bg-red-950\\/40:hover{background:#fee2e2 !important;}
        .light .border-neutral-800{border-color:#e2e5e9 !important;}
        .light .border-neutral-800\\/60{border-color:#e2e5e9 !important;}
        .light .border-neutral-800\\/50{border-color:#e8eaed !important;}
        .light .border-neutral-700{border-color:#d1d5db !important;}
        .light .border-neutral-700\\/70{border-color:#d6d9de !important;}
        .light .text-white{color:#111827 !important;}
        .light .text-slate-200,.light .text-neutral-100,.light .text-neutral-200,.light .text-neutral-300{color:#1f2937 !important;}
        .light .text-neutral-400,.light .text-neutral-500{color:#6b7280 !important;}
        .light .text-neutral-600,.light .text-neutral-700{color:#9ca3af !important;}
        .light input,.light select,.light textarea{color:#111827 !important;}
        .light input::placeholder,.light textarea::placeholder{color:#9ca3af !important;}
        /* keep colored accents readable on white */
        .light .text-red-300,.light .text-red-400{color:#dc2626 !important;}
        .light .text-emerald-300,.light .text-emerald-400{color:#047857 !important;}
        .light .text-amber-300,.light .text-amber-400{color:#b45309 !important;}
        .light .text-blue-300,.light .text-blue-400{color:#1d4ed8 !important;}
        .light .text-sky-300{color:#0369a1 !important;}
        .light .text-violet-300{color:#6d28d9 !important;}
        .light .text-green-300{color:#15803d !important;}
        /* primary red buttons keep white text on red (overrides text-white remap) */
        .light .bg-red-600{color:#ffffff !important;}
      `}</style>
      <div className="min-h-screen bg-black text-slate-200 flex" style={{ fontFamily: "system-ui, sans-serif" }}>
        <div className="hidden md:flex flex-col w-56 shrink-0 border-r border-neutral-800 bg-neutral-950 sticky top-0 h-screen">
          <div className="flex items-center gap-2.5 px-4 py-4 border-b border-neutral-800">
            <div className="w-9 h-9 rounded-xl bg-red-600 text-white font-bold flex items-center justify-center text-sm shadow-lg shadow-red-900/30">CBM</div>
            <div className="min-w-0"><div className="font-semibold text-white text-sm leading-tight">Canada Bitcoin Miners</div><div className="text-[11px] uppercase tracking-widest text-red-500 font-medium">CRM</div></div>
          </div>
          <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
            {TABS.map(({ k, label, icon: I }) => (
              <button key={k} onClick={() => setTab(k)} className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition ${tab === k ? "bg-red-600/15 text-red-400 font-medium" : "text-neutral-400 hover:bg-neutral-900 hover:text-neutral-100"}`}>
                <I size={17} /> {label}
                {k === "invoices" && invMeta.unpaidCount > 0 && <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full bg-red-600 text-white">{invMeta.unpaidCount}</span>}
                {k === "follow" && (m.dueToday + m.overdue) > 0 && <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/30 text-amber-300">{m.dueToday + m.overdue}</span>}
              </button>
            ))}
          </nav>
          <div className="p-2 border-t border-neutral-800">
            <button onClick={() => onLock && onLock()} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-neutral-400 hover:bg-red-950/40 hover:text-red-300 border border-neutral-800 hover:border-red-700 transition"><Lock size={16} /> Lock CRM</button>
          </div>
        </div>

        <div className="flex-1 min-w-0 flex flex-col">
          <div className="bg-neutral-950/95 backdrop-blur border-b border-neutral-800 sticky top-0 z-20">
            <div className="px-4 py-3 flex items-center gap-3">
              <div className="md:hidden w-9 h-9 rounded-xl bg-red-600 text-white font-bold flex items-center justify-center text-sm shrink-0">CBM</div>
              <div className="flex-1 min-w-0 relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input value={search} onChange={(e) => { setSearch(e.target.value); if (tab !== "leads") setTab("leads"); }} placeholder="Search contacts, phone, email, model..." className="w-full pl-9 pr-3 py-2 rounded-xl border border-neutral-800 bg-neutral-900 text-neutral-100 placeholder-neutral-600 text-sm focus:border-red-600 focus:ring-1 focus:ring-red-600/30 outline-none" />
              </div>
              <button onClick={() => setEdit(blankLead())} className="flex items-center gap-1.5 bg-red-600 text-white text-sm font-medium px-3 py-2 rounded-xl hover:bg-red-500 transition shadow-lg shadow-red-900/20"><Plus size={16} /> <span className="hidden sm:inline">Contact</span></button>
              <button onClick={() => setLight(!light)} title={light ? "Dark mode" : "Light mode"} className="p-2 rounded-xl hover:bg-neutral-800 text-neutral-400 text-xs font-medium">{light ? "Dark" : "Light"}</button>
              <div className="relative">
                <button onClick={() => setMenu(!menu)} title="Data" className="p-2 rounded-xl hover:bg-neutral-800 text-neutral-400"><RefreshCw size={18} /></button>
                {menu && (
                  <div className="absolute right-0 mt-1 w-56 bg-neutral-900 border border-neutral-800 rounded-xl shadow-xl shadow-black/40 py-1 text-sm z-30">
                    <button onClick={() => { setMenu(false); downloadBackup(); }} className="w-full text-left px-3 py-2 hover:bg-neutral-800 text-neutral-200 flex items-center gap-2"><Download size={14} /> Backup (full JSON)</button>
                    <label className="w-full text-left px-3 py-2 hover:bg-neutral-800 text-neutral-200 flex items-center gap-2 cursor-pointer"><RefreshCw size={14} /> Restore from backup<input type="file" accept=".json,application/json" className="hidden" onChange={(e) => { const file = e.target.files && e.target.files[0]; setMenu(false); previewRestore(file); e.target.value = ""; }} /></label>
                    <div className="my-1 border-t border-neutral-800" />
                    <button onClick={() => { const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(leads), "Leads"); XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(acts), "Activity Log"); XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(invoices), "Invoices"); XLSX.writeFile(wb, "Canada BTC Miners CRM.xlsx"); setMenu(false); }} className="w-full text-left px-3 py-2 hover:bg-neutral-800 text-neutral-200 flex items-center gap-2"><Download size={14} /> Export to Excel</button>
                    <button onClick={() => { setMenu(false); setTab("health"); }} className="w-full text-left px-3 py-2 hover:bg-neutral-800 text-neutral-200 flex items-center gap-2"><Activity size={14} /> Data health</button>
                  </div>
                )}
              </div>
              <button onClick={() => onLock && onLock()} title="Lock CRM" className="md:hidden p-2 rounded-xl border border-neutral-800 hover:border-red-700 hover:bg-red-950/40 text-neutral-400 hover:text-red-300 transition"><Lock size={16} /></button>
            </div>
            <div className="md:hidden px-2 pb-1 flex gap-1 overflow-x-auto">
              {TABS.map(({ k, label, icon: I }) => (<button key={k} onClick={() => setTab(k)} className={`flex items-center gap-1.5 px-3 py-2 text-sm border-b-2 whitespace-nowrap transition ${tab === k ? "border-red-600 text-red-500 font-medium" : "border-transparent text-neutral-500 hover:text-neutral-200"}`}><I size={16} /> {label}</button>))}
            </div>
          </div>

          <div className="max-w-6xl w-full mx-auto px-4 py-5">
        {tab === "dash" && (
          <div className="space-y-5">
            <div className="flex items-baseline justify-between gap-2">
              <div className="text-lg font-semibold text-white">Today</div>
              <div className="text-sm text-neutral-500">{new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              <Card label="Due Today" value={m.dueToday} accent="amber" icon={CalendarClock} onClick={() => applyView("today")} />
              <Card label="Overdue" value={m.overdue} accent="red" icon={CalendarClock} onClick={() => applyView("overdue")} />
              <Card label="Hot Leads" value={m.alerts} accent="red" icon={AlertTriangle} onClick={() => applyView("hot")} />
              <Card label="Awaiting Quote" value={counts.quote} accent="blue" icon={FileText} onClick={() => applyView("quote")} />
              <Card label="Unpaid" value={cad(invMeta.totalUnpaid)} accent="red" icon={DollarSign} onClick={() => applyView("unpaid")} />
              <Card label="Cold (30d+)" value={m.cold} accent="slate" icon={TrendingUp} onClick={() => applyView("cold")} />
            </div>
            <div className="grid lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 bg-neutral-950 rounded-2xl border border-neutral-800 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="font-medium text-white flex items-center gap-2"><CalendarClock size={16} className="text-red-500" /> Who to contact today</div>
                  <div className="text-xs text-neutral-500 bg-neutral-900 border border-neutral-800 rounded-full px-2 py-0.5">{toContact.length} need a touch</div>
                </div>
                {toContact.length === 0 ? <div className="text-sm text-neutral-500 py-6 text-center">Nothing pending. You are all caught up.</div> : (
                  <div className="space-y-1">
                    {toContact.slice(0, showAllToday ? 12 : 5).map(({ l, why }) => { const ph = digits(l.phone); const em = l.email && l.email.includes("@") ? l.email : ""; return (
                      <div key={l.id} className="group flex items-center gap-2 px-2 py-2 rounded-xl hover:bg-neutral-900 transition">
                        <span className={`shrink-0 text-[10px] font-medium px-1.5 py-0.5 rounded-full ${why === "Overdue" ? "bg-red-500/20 text-red-300" : why === "Due today" ? "bg-amber-500/20 text-amber-300" : "bg-neutral-800 text-neutral-400"}`}>{why}</span>
                        <button onClick={() => setEdit(l)} className="text-sm text-neutral-200 truncate text-left flex-1 min-w-0">{l.contactName || l.company || l.phone || "Unnamed"}<span className="text-xs text-neutral-600 ml-2">{l.asicModel || l.segment || ""}</span></button>
                        <div className="flex items-center gap-1 shrink-0 opacity-70 group-hover:opacity-100 transition">
                          {ph && <a href={`tel:${ph}`} title="Call" className="p-1.5 rounded-md bg-neutral-800 hover:bg-neutral-700 text-neutral-300"><Phone size={13} /></a>}
                          {em && <a href={gmailUrl(em)} target="_blank" rel="noopener noreferrer" title="Email" className="p-1.5 rounded-md bg-neutral-800 hover:bg-neutral-700 text-neutral-300"><Mail size={13} /></a>}
                          <button onClick={() => setActForm({ id: uid("A"), date: t, leadId: l.id, contact: l.contactName || l.company, type: "Call", outcome: "", notes: "" })} title="Log note" className="p-1.5 rounded-md bg-neutral-800 hover:bg-neutral-700 text-neutral-300"><Activity size={13} /></button>
                          <button onClick={() => quickFollow(l.id, 7)} title="Follow up in 7 days" className="p-1.5 rounded-md bg-neutral-800 hover:bg-neutral-700 text-neutral-300"><CalendarClock size={13} /></button>
                        </div>
                      </div>
                    ); })}
                    {toContact.length > 5 && !showAllToday && <button onClick={() => setShowAllToday(true)} className="text-xs text-red-400 hover:text-red-300 mt-1">View more ({toContact.length - 5})</button>}
                    {showAllToday && toContact.length > 12 && <button onClick={() => applyView("cold")} className="text-xs text-red-400 hover:text-red-300 mt-1">See all going cold ({toContact.length})</button>}
                    {showAllToday && toContact.length > 5 && <button onClick={() => setShowAllToday(false)} className="text-xs text-neutral-500 hover:text-neutral-300 mt-1 ml-3">Show less</button>}
                  </div>
                )}
              </div>
              <div className="bg-neutral-950 rounded-2xl border border-neutral-800 p-4">
                <div className="font-medium text-white flex items-center gap-2 mb-3"><Activity size={16} className="text-red-500" /> Recent activity</div>
                {recentActs.length === 0 ? <div className="text-sm text-neutral-600 py-6 text-center">No activity yet.</div> : (
                  <div className="space-y-2.5">
                    {recentActs.map((a) => (
                      <div key={a.id} className="flex items-start gap-2 text-xs">
                        <span className="px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300 shrink-0">{a.type}</span>
                        <div className="min-w-0"><div className="text-neutral-200 truncate">{a.contact || "—"}</div><div className="text-neutral-500 truncate">{a.outcome || a.notes || ""}{(a.outcome || a.notes) ? " · " : ""}{a.date}</div></div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="mt-3 pt-3 border-t border-neutral-800 grid grid-cols-2 gap-2 text-center">
                  <button onClick={() => setTab("invoices")} className="rounded-xl bg-neutral-900 border border-neutral-800 p-2 hover:border-neutral-700"><div className="text-base font-bold text-emerald-400">{cad(m.dealsClosed)}</div><div className="text-[10px] text-neutral-500">Sales closed</div></button>
                  <button onClick={() => applyView("unpaid")} className="rounded-xl bg-neutral-900 border border-neutral-800 p-2 hover:border-neutral-700"><div className="text-base font-bold text-red-400">{invMeta.unpaidCount}</div><div className="text-[10px] text-neutral-500">Unpaid invoices</div></button>
                </div>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-neutral-950 rounded-2xl border border-neutral-800 p-4">
                <div className="font-medium text-white mb-3">Contacts by Status</div>
                <div className="space-y-2">
                  {statusCounts.map(({ s, n }) => (
                    <button key={s} onClick={() => { setFStatus(s); setFSeg(""); setFSource(""); setFHot(false); setSearch(""); setTab("leads"); }} className="w-full flex items-center gap-2 text-sm hover:opacity-80">
                      <div className="w-24 shrink-0 text-neutral-400 text-left">{s}</div>
                      <div className="flex-1 bg-neutral-800 rounded h-5 overflow-hidden"><div className="h-full bg-red-600 rounded" style={{ width: `${(n / maxStatus) * 100}%` }} /></div>
                      <div className="w-8 text-right text-neutral-300">{n}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div className="bg-neutral-950 rounded-2xl border border-neutral-800 p-4">
                <div className="font-medium text-white mb-3">Contacts by Opportunity</div>
                {segments.length === 0 ? <div className="text-sm text-neutral-600 py-4 text-center">Nothing tagged yet.</div> : (
                  <div className="space-y-2">
                    {segments.map((sg) => { const n = leads.filter((l) => l.segment === sg).length; return (
                      <button key={sg} onClick={() => { setFSeg(sg); setFStatus(""); setFSource(""); setFHot(false); setSearch(""); setTab("leads"); }} className="w-full flex items-center justify-between py-1.5 border-b border-neutral-800 last:border-0 hover:bg-neutral-900 rounded px-1 text-sm">
                        <span className="text-neutral-300">{sg}</span><span className="text-neutral-500">{n}</span>
                      </button>
                    ); })}
                  </div>
                )}
              </div>
              <div className="bg-neutral-950 rounded-2xl border border-neutral-800 p-4 md:col-span-2">
                <div className="font-medium text-white mb-3">Contacts by Source</div>
                {sources.length === 0 ? <div className="text-sm text-neutral-600 py-4 text-center">No sources tagged.</div> : (
                  <div className="space-y-2">
                    {sources.map((sc) => { const n = leads.filter((l) => l.leadSource === sc).length; return (
                      <button key={sc} onClick={() => { setFSource(sc); setFStatus(""); setFSeg(""); setFHot(false); setSearch(""); setTab("leads"); }} className="w-full flex items-center justify-between py-1.5 border-b border-neutral-800 last:border-0 hover:bg-neutral-900 rounded px-1 text-sm">
                        <span className="text-neutral-300">{sc}</span><span className="text-neutral-500">{n}</span>
                      </button>
                    ); })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {tab === "leads" && (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-1.5">
              {VIEWS.map((v) => (
                <button key={v.k} onClick={() => applyView(v.k)} className={`text-xs font-medium px-3 py-1.5 rounded-full border transition ${view === v.k ? "border-red-600 bg-red-600/15 text-red-400" : "border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800"}`}>
                  {v.label}{counts[v.k] != null && counts[v.k] > 0 && <span className="ml-1.5 text-[10px] text-neutral-500">{counts[v.k]}</span>}
                </button>
              ))}
            </div>
            <div className="bg-neutral-950 rounded-2xl border border-neutral-800 p-3 flex flex-wrap gap-2 items-center">
              <div className="flex-1 min-w-[200px] relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, phone, model, segment, tag..." className="w-full pl-9 pr-3 py-2 rounded-xl border border-neutral-800 bg-neutral-900 text-neutral-100 placeholder-neutral-600 text-sm focus:border-red-600 focus:ring-1 focus:ring-red-600/30 outline-none" />
              </div>
              <select value={fStatus} onChange={(e) => setFStatus(e.target.value)} className="px-2.5 py-2 rounded-xl border border-neutral-800 bg-neutral-900 text-neutral-200 text-sm outline-none focus:border-red-600"><option value="">All status</option>{STATUS.map((s) => <option key={s}>{s}</option>)}</select>
              <select value={fSeg} onChange={(e) => setFSeg(e.target.value)} className="px-2.5 py-2 rounded-xl border border-neutral-800 bg-neutral-900 text-neutral-200 text-sm outline-none focus:border-red-600"><option value="">All opportunities</option>{segments.map((s) => <option key={s}>{s}</option>)}</select>
              <select value={sort} onChange={(e) => setSort(e.target.value)} className="px-2.5 py-2 rounded-xl border border-neutral-800 bg-neutral-900 text-neutral-200 text-sm outline-none focus:border-red-600"><option value="updated">Recently updated</option><option value="followup">Follow-up date</option><option value="name">Name</option></select>
              <button onClick={() => setFCold(!fCold)} className={`px-3 py-2 rounded-xl border text-sm transition ${fCold ? "border-red-700 bg-red-950/40 text-red-300" : "border-neutral-800 bg-neutral-900 text-neutral-300 hover:bg-neutral-800"}`}>Going cold</button>
              <label className="px-3 py-2 rounded-xl border border-neutral-800 bg-neutral-900 text-neutral-300 text-sm cursor-pointer hover:bg-neutral-800 flex items-center gap-1.5 transition"><Download size={14} /> Import<input type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={(e) => { const file = e.target.files && e.target.files[0]; previewImport(file); e.target.value = ""; }} /></label>
            </div>
            {importNote && <div className="text-xs px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300">{importNote}</div>}
            <div className="flex items-center justify-between text-xs text-neutral-500 px-1"><span>{filtered.length} of {leads.length} contacts{view !== "all" ? ` · ${(VIEWS.find((v) => v.k === view) || {}).label || ""}` : ""}</span>{(view !== "all" || fStatus || fSeg || fDir || fSource || fHot || fCold || search) && <button onClick={() => { setView("all"); try { localStorage.setItem("cbm-crm-view", "all"); } catch (e) {} setFStatus(""); setFSeg(""); setFDir(""); setFSource(""); setFHot(false); setFCold(false); setSearch(""); }} className="text-red-400 hover:text-red-300 font-medium">Clear filters</button>}</div>
            <div className="bg-neutral-950 rounded-2xl border border-neutral-800 overflow-x-auto">
              <table className="w-full text-sm min-w-[1040px]">
                <thead><tr className="text-left text-[11px] uppercase tracking-wider text-neutral-500 border-b border-neutral-800 bg-neutral-900/40">
                  <th className="px-4 py-2.5 font-medium">Contact</th><th className="px-3 py-2.5 font-medium">Category</th><th className="px-3 py-2.5 font-medium">Status</th><th className="px-3 py-2.5 font-medium whitespace-nowrap">Last contact</th><th className="px-3 py-2.5 font-medium whitespace-nowrap">Next follow-up</th><th className="px-3 py-2.5 font-medium text-right">Value</th><th className="px-3 py-2.5 font-medium text-center">Notes</th><th className="px-3 py-2.5 font-medium">Quick actions</th>
                </tr></thead>
                <tbody>
                  {filtered.map((l) => {
                    const od = l.nextFollowUp && l.nextFollowUp < t && isOpen(l.status);
                    const ds = daysSince(l.lastContacted);
                    const ph = digits(l.phone); const em = l.email && l.email.includes("@") ? l.email : "";
                    const nc = actsCount[l.id] || 0;
                    return (
                      <tr key={l.id} className="border-b border-neutral-800/50 hover:bg-neutral-900/70 cursor-pointer transition-colors" onClick={() => setEdit(l)}>
                        <td className="px-4 py-3">
                          <div className="font-medium text-neutral-100 flex items-center gap-1.5 flex-wrap">{l.dealAlert && <AlertTriangle size={12} className="text-red-500 shrink-0" />}{l.contactName || l.company || "Unnamed"}{l.customer && <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/20">Customer</span>}{l.supplier && <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full bg-sky-500/15 text-sky-300 border border-sky-500/20">Supplier</span>}{l.repairClient && <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/20">Repair</span>}</div>
                          <div className="text-xs text-neutral-500 mt-0.5 flex items-center gap-2 flex-wrap">{l.company && l.contactName && <span className="truncate max-w-[160px]">{l.company}</span>}{l.phone && <span>{l.phone}</span>}{em && <span className="truncate max-w-[180px] text-neutral-600">{em}</span>}</div>
                          {(l.tags || []).length > 0 && <div className="flex flex-wrap gap-1 mt-1">{(l.tags || []).slice(0, 3).map((tg) => <span key={tg} className="text-[10px] px-1.5 py-0.5 rounded-full bg-neutral-800 text-neutral-400">{tg}</span>)}</div>}
                        </td>
                        <td className="px-3 py-3 text-neutral-400 whitespace-nowrap">{l.segment || "—"}{l.asicModel ? <div className="text-[11px] text-neutral-600 truncate max-w-[140px]">{l.asicModel}</div> : null}</td>
                        <td className="px-3 py-3"><StatusPill s={l.status} /></td>
                        <td className="px-3 py-3 text-neutral-500 whitespace-nowrap">{ds != null ? `${ds}d ago` : "—"}</td>
                        <td className={`px-3 py-3 whitespace-nowrap ${od ? "text-red-400 font-medium" : "text-neutral-400"}`}>{od && <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5 align-middle" />}{l.nextFollowUp || "—"}</td>
                        <td className="px-3 py-3 text-right text-neutral-300 whitespace-nowrap">{numVal(l.estValue) ? cad(numVal(l.estValue)) : "—"}</td>
                        <td className="px-3 py-3 text-center text-neutral-400">{nc > 0 ? nc : "—"}</td>
                        <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center gap-1">
                            {ph && <a href={`tel:${ph}`} title="Call" className="p-1.5 rounded-md bg-neutral-800 hover:bg-neutral-700 text-neutral-300"><Phone size={13} /></a>}
                            {em && <a href={gmailUrl(em)} target="_blank" rel="noopener noreferrer" title="Email" className="p-1.5 rounded-md bg-neutral-800 hover:bg-neutral-700 text-neutral-300"><Mail size={13} /></a>}
                            <button onClick={() => setActForm({ id: uid("A"), date: t, leadId: l.id, contact: l.contactName || l.company, type: "Note", outcome: "", notes: "" })} title="Add note" className="p-1.5 rounded-md bg-neutral-800 hover:bg-neutral-700 text-neutral-300"><MessageSquare size={13} /></button>
                            <button onClick={() => quickFollow(l.id, 7)} title="Follow up in 7 days" className="p-1.5 rounded-md bg-neutral-800 hover:bg-neutral-700 text-neutral-300"><CalendarClock size={13} /></button>
                            <button onClick={() => quickMark(l, "hot")} title="Mark hot" className={`p-1.5 rounded-md ${l.dealAlert ? "bg-red-600/30 text-red-300" : "bg-neutral-800 hover:bg-neutral-700 text-neutral-300"}`}><AlertTriangle size={13} /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filtered.length === 0 && <tr><td colSpan={8} className="px-3 py-10 text-center text-neutral-600">No contacts match. Try clearing filters or switch to All contacts.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "invoices" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <div className="text-lg font-semibold text-white">Invoices</div>
                <div className="text-xs text-neutral-500">{invoices.length} invoices · Sales closed {cad(m.dealsClosed)} ({m.dealsCount} since fresh start) · Past invoices shown as history</div>
              </div>
              <button onClick={() => setInvForm({ id: uid("IV"), leadId: "", contact: "", number: "", model: "", qty: 1, amount: "", cost: "", profit: "", supplier: "", date: t, dueDate: t, status: "Unpaid", notes: "" })} className="flex items-center gap-1 bg-red-600 text-white text-sm px-3 py-2 rounded-lg hover:bg-red-500"><Plus size={16} /> Invoice</button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Card label="Paid" value={cad(m.dealsClosed)} accent="green" icon={DollarSign} />
              <Card label="Total Unpaid" value={cad(aging.totalUnpaid)} accent="red" icon={DollarSign} />
              <Card label="Overdue" value={cad(aging.overdue)} accent="amber" icon={AlertTriangle} />
              <Card label="Profit (paid)" value={cad(m.profit)} accent="blue" />
            </div>
            <div className="bg-neutral-950 rounded-2xl border border-neutral-800 p-4">
              <div className="text-[11px] uppercase tracking-wider text-neutral-500 mb-3">Unpaid aging</div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {[["Current", aging.buckets.current, "text-neutral-200"], ["1–30 days", aging.buckets.d30, "text-amber-300"], ["31–60 days", aging.buckets.d60, "text-amber-400"], ["61–90 days", aging.buckets.d90, "text-red-300"], ["90+ days", aging.buckets.d90plus, "text-red-400"]].map(([lab, val, cls]) => (
                  <div key={lab} className="rounded-xl bg-neutral-900 border border-neutral-800 p-3 text-center">
                    <div className={`text-lg font-bold ${cls}`}>{cad(val)}</div>
                    <div className="text-[10px] text-neutral-500 mt-0.5">{lab}</div>
                  </div>
                ))}
              </div>
              {aging.clients.length > 0 && (
                <div className="mt-4">
                  <div className="text-[11px] uppercase tracking-wider text-neutral-500 mb-2">Clients to follow up for payment</div>
                  <div className="space-y-1">
                    {aging.clients.slice(0, 8).map((c, i) => (
                      <button key={i} onClick={() => { const l = leads.find((x) => x.id === c.leadId); if (l) setEdit(l); }} className="w-full flex items-center gap-2 text-left px-2 py-1.5 rounded-lg hover:bg-neutral-900 transition text-sm">
                        <span className="text-neutral-200 truncate flex-1">{c.contact}</span>
                        <span className="text-xs text-neutral-500">{c.count} inv</span>
                        {c.oldest > 0 && <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${c.oldest >= 60 ? "bg-red-500/20 text-red-300" : c.oldest >= 30 ? "bg-amber-500/20 text-amber-300" : "bg-neutral-800 text-neutral-400"}`}>{c.oldest}d</span>}
                        <span className="text-red-400 font-medium w-20 text-right">{cad(c.amount)}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="bg-neutral-950 rounded-2xl border border-neutral-800 overflow-x-auto">
              <table className="w-full text-sm min-w-[640px]">
                <thead><tr className="text-left text-[11px] uppercase tracking-wider text-neutral-500 border-b border-neutral-800 bg-neutral-900/40"><th className="px-4 py-2.5 font-medium">Contact</th><th className="px-3 py-2.5 font-medium">Invoice #</th><th className="px-3 py-2.5 font-medium hidden sm:table-cell">Model</th><th className="px-3 py-2.5 font-medium text-right">Amount</th><th className="px-3 py-2.5 font-medium hidden md:table-cell">Due</th><th className="px-3 py-2.5 font-medium">Age</th><th className="px-3 py-2.5 font-medium">Status</th></tr></thead>
                <tbody>
                  {[...invoices].sort((a, b) => {
                    const rank = (s) => norm(s) === "unpaid" || norm(s) === "overdue" ? 0 : norm(s) === "sent" ? 1 : 2;
                    const ra = rank(a.status), rb = rank(b.status);
                    if (ra !== rb) return ra - rb;
                    const na = /^\d+$/.test(String(a.number || "").trim()), nb = /^\d+$/.test(String(b.number || "").trim());
                    if (na && nb) return Number(b.number) - Number(a.number);
                    if (na !== nb) return na ? -1 : 1;
                    return String(b.number || "").localeCompare(String(a.number || ""));
                  }).map((iv) => {
                    const isUnpaid = norm(iv.status) === "unpaid" || norm(iv.status) === "overdue";
                    const overdue = isUnpaid && iv.dueDate && iv.dueDate < t;
                    const age = isUnpaid ? daysSince(iv.date) : null;
                    const ageBadge = age == null ? "" : age >= 90 ? "90+" : age >= 60 ? "60+" : age >= 30 ? "30+" : "<30";
                    return (
                    <tr key={iv.id} onClick={() => setInvForm({ ...iv })} className="border-b border-neutral-800/50 hover:bg-neutral-900/70 cursor-pointer transition-colors">
                      <td className="px-4 py-3 text-neutral-100">{iv.contact || "—"}</td>
                      <td className="px-3 py-3 text-neutral-400">{iv.number || "—"}</td>
                      <td className="px-3 py-3 text-neutral-400 hidden sm:table-cell">{iv.model || "—"}</td>
                      <td className={`px-3 py-3 text-right ${isUnpaid ? "text-red-400 font-medium" : "text-neutral-200"}`}>{iv.amount !== "" && iv.amount != null ? cad(numVal(iv.amount)) : "—"}</td>
                      <td className={`px-3 py-3 hidden md:table-cell ${overdue ? "text-red-400" : "text-neutral-400"}`}>{iv.dueDate || "—"}</td>
                      <td className="px-3 py-3">{ageBadge ? <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${age >= 60 ? "bg-red-500/20 text-red-300" : age >= 30 ? "bg-amber-500/20 text-amber-300" : "bg-neutral-800 text-neutral-400"}`}>{ageBadge}d</span> : <span className="text-neutral-700">—</span>}</td>
                      <td className="px-3 py-3"><div className="flex items-center gap-1.5"><InvPill status={overdue ? "Overdue" : iv.status} />{iv.historical && <span className="text-[10px] text-neutral-600">history</span>}</div></td>
                    </tr>
                  ); })}
                  {invoices.length === 0 && <tr><td colSpan={7} className="px-3 py-8 text-center text-neutral-600">No invoices yet. Tap Invoice to add one.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {tab === "batches" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <div className="text-lg font-semibold text-white">Batches available</div>
                <div className="text-xs text-neutral-500">Log what people have to sell, then search to match a buyer.</div>
              </div>
              <button onClick={() => setBatchForm({ id: uid("B"), model: "", qty: "", price: "", source: "", sourceType: "Phone", phone: "", email: "", status: "Available", date: t, notes: "" })} className="flex items-center gap-1 bg-red-600 text-white text-sm px-3 py-2 rounded-lg hover:bg-red-500"><Plus size={16} /> Batch</button>
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              <div className="flex-1 min-w-[180px] relative">
                <Search size={16} className="absolute left-3 top-2.5 text-neutral-500" />
                <input value={bSearch} onChange={(e) => setBSearch(e.target.value)} placeholder="Search model, source, who has it..." className="w-full pl-9 pr-3 py-2 rounded-lg border border-neutral-800 bg-neutral-900 text-neutral-100 placeholder-neutral-600 text-sm" />
              </div>
              <select value={bFilter} onChange={(e) => setBFilter(e.target.value)} className="px-2 py-2 rounded-lg border border-neutral-800 bg-neutral-900 text-neutral-200 text-sm"><option>Available</option><option>Sold</option><option>All</option></select>
            </div>
            {(() => {
              const q = norm(bSearch);
              const rows = batches.filter((b) => (bFilter === "All" || b.status === bFilter)).filter((b) => !q || [b.model, b.source, b.phone, b.email, b.notes].some((v) => norm(v).includes(q))).sort((a, b) => (b.date || "").localeCompare(a.date || ""));
              if (batches.length === 0) return <div className="text-sm text-neutral-500 bg-neutral-950 border border-neutral-800 rounded-xl p-6 text-center">No batches logged yet. Tap Batch when someone has miners to sell.</div>;
              if (rows.length === 0) return <div className="text-sm text-neutral-500 bg-neutral-950 border border-neutral-800 rounded-xl p-6 text-center">Nothing matches that search.</div>;
              return (
                <div className="space-y-2">
                  {rows.map((b) => (
                    <button key={b.id} onClick={() => setBatchForm({ ...b })} className="w-full text-left bg-neutral-950 rounded-xl border border-neutral-800 p-3 hover:border-neutral-700 flex items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-neutral-100 flex items-center gap-2 flex-wrap">{b.model || "Miner"}<span className="text-xs text-neutral-500">{b.qty ? `x${b.qty}` : ""}</span>{b.status === "Sold" && <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400">Sold</span>}</div>
                        <div className="text-xs text-neutral-500 truncate">{[b.source && `from ${b.source}`, b.sourceType, b.phone, b.email].filter(Boolean).join(" · ") || "no source noted"}</div>
                      </div>
                      <div className="text-right shrink-0"><div className="text-neutral-200 text-sm">{b.price ? cad(numVal(b.price)) : "—"}</div><div className="text-[11px] text-neutral-600">{b.date}</div></div>
                    </button>
                  ))}
                </div>
              );
            })()}
          </div>
        )}
        {tab === "follow" && (
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2 mb-1">
              <div className="text-sm text-neutral-400">Active leads with a follow-up date, soonest first. Overdue in red.</div>
              <button onClick={() => setEdit({ ...blankLead(), nextFollowUp: t, priority: "High" })} className="flex items-center gap-1 bg-red-600 text-white text-sm px-3 py-2 rounded-lg hover:bg-red-500 shrink-0"><Plus size={16} /> Follow-up</button>
            </div>
            {followUps.length === 0 && <div className="text-sm text-neutral-500 bg-neutral-950 border border-neutral-800 rounded-xl p-6 text-center">No follow-ups scheduled. Tap Follow-up to add one.</div>}
            {followUps.map((l) => {
              const od = l.nextFollowUp < t; const due = l.nextFollowUp === t; const ds = daysSince(l.lastContacted);
              return (
                <div key={l.id} className={`bg-neutral-950 rounded-2xl border p-3 flex items-center gap-3 ${od ? "border-red-800/70" : due ? "border-amber-800/70" : "border-neutral-800"}`}>
                  <div className={`shrink-0 w-16 text-center px-2 py-1.5 rounded-xl text-[11px] font-semibold tracking-wide ${od ? "bg-red-500/20 text-red-300" : due ? "bg-amber-500/20 text-amber-300" : "bg-neutral-800 text-neutral-400"}`}>{od ? "OVERDUE" : due ? "TODAY" : l.nextFollowUp.slice(5)}</div>
                  <div className="flex-1 min-w-0"><div className="font-medium text-neutral-100 truncate">{l.contactName || l.company || "Unnamed"}</div><div className="text-xs text-neutral-500 truncate">{l.priority} priority · {l.nextAction || l.segment || l.asicModel || "no detail"}{ds != null ? ` · last contact ${ds}d ago` : ""}</div></div>
                  <Reach lead={l} />
                  <button onClick={() => setActForm({ id: uid("A"), date: t, leadId: l.id, contact: l.contactName || l.company, type: "Call", outcome: "", notes: "" })} className="shrink-0 text-xs font-medium bg-neutral-800 hover:bg-neutral-700 text-neutral-200 px-3 py-1.5 rounded-lg transition">Log</button>
                  <button onClick={() => setEdit(l)} className="shrink-0 text-xs font-medium bg-red-600 text-white hover:bg-red-500 px-3 py-1.5 rounded-lg transition">Open</button>
                </div>
              );
            })}
            {followUps.length === 0 && <div className="text-center text-neutral-600 py-10">No follow-ups scheduled. Open a contact and set a Next Follow-up date.</div>}
          </div>
        )}

        {tab === "templates" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div>
                <div className="text-lg font-semibold text-white">Message templates</div>
                <div className="text-xs text-neutral-500">Saved messages you can copy and reuse. Edit [name], [model], [price] before sending.</div>
              </div>
              <button onClick={() => setTplForm({ id: uid("T"), category: "General", title: "", body: "" })} className="flex items-center gap-1 bg-red-600 text-white text-sm px-3 py-2 rounded-lg hover:bg-red-500"><Plus size={16} /> Template</button>
            </div>
            {templates.length === 0 ? <div className="text-sm text-neutral-500 bg-neutral-950 border border-neutral-800 rounded-2xl p-8 text-center">No templates yet. Tap Template to save one.</div> : (
              <div className="space-y-4">
                {TPL_CATEGORIES.filter((cat) => templates.some((tp) => (tp.category || "General") === cat)).map((cat) => (
                  <div key={cat}>
                    <div className="text-[11px] uppercase tracking-wider text-neutral-500 mb-2">{cat}</div>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {templates.filter((tp) => (tp.category || "General") === cat).map((tp) => (
                        <button key={tp.id} onClick={() => setTplPreview(tp)} className="text-left bg-neutral-950 rounded-2xl border border-neutral-800 p-3 hover:border-neutral-700 transition flex flex-col">
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <div className="font-medium text-neutral-100 truncate">{tp.title || "Untitled"}</div>
                            <span className="text-[10px] text-red-400 shrink-0">Preview</span>
                          </div>
                          <div className="text-xs text-neutral-500 whitespace-pre-wrap line-clamp-3">{tp.body}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "dupes" && (
          <div className="space-y-3">
            <div><div className="text-lg font-semibold text-white">Possible duplicates</div><div className="text-xs text-neutral-500">Matched by email, phone, company, or name. Review only — nothing is merged or deleted automatically.</div></div>
            {dupGroups.length === 0 ? <div className="text-sm text-neutral-500 bg-neutral-950 border border-neutral-800 rounded-2xl p-8 text-center">No possible duplicates found. Your contacts look clean.</div> : (
              <div className="space-y-2">
                {dupGroups.map((g, i) => (
                  <div key={i} className="bg-neutral-950 rounded-2xl border border-amber-800/40 p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-xs text-amber-300 flex items-center gap-1.5"><AlertTriangle size={13} /> {g.leads.length} contacts · {g.reason}</div>
                      <button onClick={() => ignoreDupe(g)} className="text-xs text-neutral-500 hover:text-neutral-300">Ignore</button>
                    </div>
                    <div className="space-y-1.5">
                      {g.leads.map((l) => (
                        <div key={l.id} className="flex items-center gap-2 px-2 py-2 rounded-xl hover:bg-neutral-900 transition">
                          <div className="min-w-0 flex-1">
                            <div className="text-sm text-neutral-100 truncate">{l.contactName || l.company || "Unnamed"}</div>
                            <div className="text-xs text-neutral-500 truncate">{[l.company, l.phone, l.email].filter(Boolean).join(" · ") || "—"}</div>
                          </div>
                          <StatusPill s={l.status} />
                          <button onClick={() => setEdit(l)} className="shrink-0 text-xs font-medium bg-red-600 text-white hover:bg-red-500 px-3 py-1.5 rounded-lg">Open</button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {tab === "health" && (
          <div className="space-y-3">
            <div><div className="text-lg font-semibold text-white">Data health</div><div className="text-xs text-neutral-500">Records that may need attention. Click any item to open and fix it.</div></div>
            {(() => {
              const sections = [
                { key: "noContact", label: "Contacts with no phone and no email", items: health.noContact, kind: "lead" },
                { key: "noName", label: "Contacts with missing name", items: health.noName, kind: "lead" },
                { key: "unpaidNoDue", label: "Unpaid invoices with no due date", items: health.unpaidNoDue, kind: "invoice" },
                { key: "tplNoCat", label: "Templates with no category", items: health.tplNoCat, kind: "template" },
                { key: "emptyNotes", label: "Notes with empty text", items: health.emptyNotes, kind: "note" },
              ];
              const dupCount = health.dupPhones.length + health.dupEmails.length;
              const totalIssues = sections.reduce((n, sec) => n + sec.items.length, 0) + dupCount;
              if (totalIssues === 0) return <div className="text-sm text-neutral-500 bg-neutral-950 border border-neutral-800 rounded-2xl p-8 text-center">Everything looks healthy. No data issues found.</div>;
              return (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {[["No contact info", health.noContact.length], ["No name", health.noName.length], ["Unpaid, no due date", health.unpaidNoDue.length], ["Duplicate phones", health.dupPhones.length], ["Duplicate emails", health.dupEmails.length], ["Templates no category", health.tplNoCat.length], ["Empty notes", health.emptyNotes.length]].map(([lab, n]) => (
                      <div key={lab} className="bg-neutral-950 rounded-xl border border-neutral-800 p-3 text-center"><div className={`text-lg font-bold ${n > 0 ? "text-amber-400" : "text-neutral-600"}`}>{n}</div><div className="text-[10px] text-neutral-500 mt-0.5">{lab}</div></div>
                    ))}
                  </div>
                  {sections.filter((sec) => sec.items.length > 0).map((sec) => (
                    <div key={sec.key} className="bg-neutral-950 rounded-2xl border border-neutral-800 p-3">
                      <div className="text-xs text-amber-300 mb-2 flex items-center gap-1.5"><AlertTriangle size={13} /> {sec.items.length} · {sec.label}</div>
                      <div className="space-y-1.5">
                        {sec.items.slice(0, 15).map((it, i) => (
                          <div key={i} className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-neutral-900 transition">
                            <span className="text-sm text-neutral-200 truncate flex-1">{sec.kind === "lead" ? (it.contactName || it.company || it.phone || it.email || "Unnamed") : sec.kind === "invoice" ? (it.contact || it.number || "Invoice") : sec.kind === "template" ? (it.title || "Untitled template") : (it.contact || it.type || "Note")}</span>
                            {sec.kind === "lead" && <button onClick={() => setEdit(it)} className="shrink-0 text-xs font-medium bg-red-600 text-white hover:bg-red-500 px-3 py-1 rounded-lg">Open</button>}
                            {sec.kind === "invoice" && <button onClick={() => setInvForm({ ...it })} className="shrink-0 text-xs font-medium bg-red-600 text-white hover:bg-red-500 px-3 py-1 rounded-lg">Open</button>}
                            {sec.kind === "template" && <button onClick={() => setTplForm({ ...it })} className="shrink-0 text-xs font-medium bg-red-600 text-white hover:bg-red-500 px-3 py-1 rounded-lg">Open</button>}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  {dupCount > 0 && (
                    <div className="bg-neutral-950 rounded-2xl border border-neutral-800 p-3">
                      <div className="text-xs text-amber-300 mb-2 flex items-center gap-1.5"><AlertTriangle size={13} /> {dupCount} duplicate phone/email group(s)</div>
                      <button onClick={() => setTab("dupes")} className="text-sm font-medium bg-neutral-800 hover:bg-neutral-700 text-neutral-200 px-3 py-1.5 rounded-lg">Review in Duplicates</button>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        )}
        {tab === "log" && (
          <div className="space-y-3">
            <button onClick={() => setActForm({ id: uid("A"), date: t, leadId: "", contact: "", type: "Call", outcome: "", notes: "" })} className="flex items-center gap-1 text-sm bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-500"><Plus size={16} /> Log Activity</button>
            <div className="space-y-2">
              {acts.map((a) => (
                <div key={a.id} className="bg-neutral-950 rounded-xl border border-neutral-800 p-3">
                  <div className="flex items-center justify-between gap-2"><div className="flex items-center gap-2"><span className="text-xs px-2 py-0.5 rounded bg-neutral-800 text-neutral-300">{a.type}</span><span className="font-medium text-neutral-100 text-sm">{a.contact || "—"}</span></div><div className="flex items-center gap-2"><span className="text-xs text-neutral-500">{a.date}</span><button onClick={() => setActs((p) => p.filter((x) => x.id !== a.id))}><Trash2 size={14} className="text-neutral-600 hover:text-red-500" /></button></div></div>
                  {a.outcome && <div className="text-sm text-neutral-200 mt-1">{a.outcome}</div>}
                  {a.notes && <div className="text-xs text-neutral-500 mt-1">{a.notes}</div>}
                </div>
              ))}
              {acts.length === 0 && <div className="text-center text-neutral-600 py-10">No activity logged yet. Track calls, texts and quotes here.</div>}
            </div>
          </div>
        )}
      </div>

      {edit && <LeadEditor lead={edit} acts={acts} leads={leads} invoices={invoices} onSave={saveLead} onDelete={delLead} onLog={(l) => setActForm({ id: uid("A"), date: t, leadId: l.id, contact: l.contactName || l.company, type: "Call", outcome: "", notes: "" })} onAddInvoice={(l) => setInvForm({ id: uid("IV"), leadId: l.id, contact: l.contactName || l.company || "", number: "", model: l.asicModel || "", qty: 1, amount: "", cost: "", profit: "", supplier: "", date: t, dueDate: t, status: "Unpaid", notes: "" })} onPatch={patchLead} onFollow={setFollowDate} onAddNote={addNote} onCopy={copyText} onClose={() => setEdit(null)} />}
      {actForm && <ActForm act={actForm} leads={leads} onSave={saveAct} onClose={() => setActForm(null)} />}
      {invForm && <InvoiceForm inv={invForm} leads={leads} onSave={saveInv} onDelete={delInv} onClose={() => setInvForm(null)} />}
      {batchForm && <BatchForm batch={batchForm} onSave={saveBatch} onDelete={delBatch} onClose={() => setBatchForm(null)} />}
      {tplForm && <TemplateForm tpl={tplForm} onSave={saveTpl} onDelete={delTpl} onClose={() => setTplForm(null)} />}
      {importPrev && <ImportPreview prev={importPrev} mode={importMode} setMode={setImportMode} onConfirm={confirmImport} onClose={() => setImportPrev(null)} />}
      {restorePrev && <RestorePreview prev={restorePrev} onConfirm={confirmRestore} onClose={() => setRestorePrev(null)} />}
      {tplPreview && <TemplatePreview tpl={tplPreview} onCopy={() => { copyTpl(tplPreview); }} onEdit={() => { setTplForm({ ...tplPreview }); setTplPreview(null); }} copied={copiedId === tplPreview.id} onClose={() => setTplPreview(null)} />}
      </div>
      </div>
    </div>
  );
}

function Reach({ lead }) {
  const ph = digits(lead.phone); const em = lead.email && lead.email.includes("@") ? lead.email : "";
  const stop = (e) => e.stopPropagation();
  const btn = "p-1.5 rounded-md bg-neutral-800 hover:bg-neutral-700 text-neutral-300";
  return (
    <div className="flex items-center gap-1 shrink-0" onClick={stop}>
      {ph ? <a className={btn} href={`tel:${ph}`} title="Call"><Phone size={13} /></a> : null}
      {ph ? <a className={btn} href={`sms:${ph}`} title="Text"><MessageSquare size={13} /></a> : null}
      {em ? <a className={btn} href={gmailUrl(em)} target="_blank" rel="noopener noreferrer" title="Email (Gmail)"><Mail size={13} /></a> : null}
      {!ph && !em ? <span className="text-xs text-neutral-700">—</span> : null}
    </div>
  );
}

function PipeCard({ label, value, sub, accent, green }) {
  const c = green ? "text-green-400" : accent ? "text-red-400" : "text-white";
  return (
    <div className={`rounded-xl border p-4 ${accent ? "border-red-900/60 bg-red-950/20" : "border-neutral-800 bg-neutral-950"}`}>
      <div className="flex items-center gap-1.5 text-xs text-neutral-500"><DollarSign size={13} /> {label}</div>
      <div className={`text-2xl font-bold mt-1 ${c}`}>{value}</div>
      <div className="text-xs text-neutral-600 mt-0.5">{sub}</div>
    </div>
  );
}

function Card({ label, value, accent = "slate", icon: I, onClick }) {
  const c = { slate: "text-white", red: "text-red-400", amber: "text-amber-400", green: "text-emerald-400", blue: "text-blue-400" }[accent];
  const dot = { slate: "bg-neutral-600", red: "bg-red-500", amber: "bg-amber-500", green: "bg-emerald-500", blue: "bg-blue-500" }[accent];
  return (
    <button onClick={onClick} className="group bg-neutral-950 rounded-2xl border border-neutral-800 p-4 text-left hover:border-neutral-700 hover:bg-neutral-900/60 transition">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-neutral-500"><span className={`w-1.5 h-1.5 rounded-full ${dot}`} />{label}</div>
        {I && <I size={14} className="text-neutral-600 group-hover:text-neutral-400 transition" />}
      </div>
      <div className={`text-2xl font-bold mt-1.5 ${c}`}>{value}</div>
    </button>
  );
}

function InvPill({ status }) {
  const s = norm(status);
  const dot = s === "paid" ? "bg-emerald-400" : s === "sent" ? "bg-amber-400" : s === "quote" ? "bg-neutral-400" : s === "refund" ? "bg-sky-400" : "bg-red-400";
  return <span className="inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full border border-neutral-700/70 bg-neutral-800/40 text-neutral-300 whitespace-nowrap"><span className={`w-1.5 h-1.5 rounded-full ${dot}`} />{status || "Unpaid"}</span>;
}

function StatusPill({ s }) {
  const dot = { "New": "bg-neutral-400", "Contacted": "bg-blue-400", "Warm": "bg-amber-400", "Active Deal": "bg-green-400", "Won": "bg-emerald-400", "Lost": "bg-red-400", "Nurture": "bg-neutral-500", "Dormant": "bg-neutral-600" };
  return <span className="inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full border border-neutral-700/70 bg-neutral-800/40 text-neutral-300 whitespace-nowrap"><span className={`w-1.5 h-1.5 rounded-full ${dot[s] || "bg-neutral-400"}`} />{s}</span>;
}

function Field({ label, children }) { return <label className="block"><span className="text-xs text-neutral-500">{label}</span>{children}</label>; }
const inp = "w-full mt-0.5 px-2 py-1.5 rounded-lg border border-neutral-700 bg-neutral-900 text-neutral-100 placeholder-neutral-600 text-sm";

const NOTE_QUICK = ["Called", "No answer", "Sent quote", "Waiting reply", "Deal closed", "Repair update"];
function LeadEditor({ lead, acts, leads, invoices, onSave, onDelete, onLog, onAddInvoice, onPatch, onFollow, onAddNote, onCopy, onClose }) {
  const [f, setF] = useState({ ...lead });
  const [noteText, setNoteText] = useState("");
  const [tagText, setTagText] = useState("");
  const [copied, setCopied] = useState("");
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));
  const patch = (partial) => { setF((p) => ({ ...p, ...partial })); onPatch && onPatch(f.id, partial); };
  const history = (acts || []).filter((a) => a.leadId === f.id).sort((a, b) => (b.date || "").localeCompare(a.date || ""));
  const myInvoices = (invoices || []).filter((iv) => iv.leadId === f.id).sort((a, b) => (b.date || "").localeCompare(a.date || ""));
  const dup = (leads || []).find((l) => l.id !== f.id && ((phoneKey(l.phone).length >= 10 && phoneKey(l.phone) === phoneKey(f.phone)) || (f.email && f.email.includes("@") && norm(l.email) === norm(f.email))));
  const ph = digits(f.phone); const em = f.email && f.email.includes("@") ? f.email : "";
  const wa = ph ? ph.replace(/[^0-9]/g, "") : "";
  const chip = "text-xs px-2 py-1 rounded-md bg-neutral-800 hover:bg-neutral-700 text-neutral-200";
  const setFollow = (days) => { const d = days == null ? "" : (days === 0 ? todayISO() : addDays(days)); set("nextFollowUp", d); onFollow && onFollow(f.id, d); };
  const setFollow2 = (d) => { set("nextFollowUp", d); onFollow && onFollow(f.id, d); };
  const copy = (txt, what) => { onCopy && onCopy(txt); setCopied(what); setTimeout(() => setCopied(""), 1200); };
  const addNote = (text, type) => { onAddNote && onAddNote(f, text, type); if (type && !text) { /* keep */ } setNoteText(""); };
  const addTag = (tg) => { const v = (tg || "").trim(); if (!v) return; if ((f.tags || []).includes(v)) return; patch({ tags: [...(f.tags || []), v] }); setTagText(""); };
  const removeTag = (tg) => patch({ tags: (f.tags || []).filter((x) => x !== tg) });
  return (
    <div className="fixed inset-0 bg-black/70 z-40 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div className="bg-neutral-950 border border-neutral-800 w-full sm:max-w-2xl sm:rounded-2xl rounded-t-2xl max-h-[92vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="px-4 py-3 border-b border-neutral-800 sticky top-0 bg-neutral-950 z-10">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="text-[10px] uppercase tracking-widest text-neutral-500 mb-0.5">Contact</div>
              <div className="font-bold text-white text-xl leading-tight break-words">{f.contactName || "New Contact"}</div>
              {f.customer && <span className="inline-block mt-1 mr-1 text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">Customer</span>}
              {f.supplier && <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded bg-sky-500/20 text-sky-300">Supplier</span>}
              {f.repairClient && <span className="inline-block mt-1 ml-1 text-xs px-2 py-0.5 rounded bg-violet-500/20 text-violet-300">Repair client</span>}
              {f.company && <div className="text-sm text-neutral-400 break-words mt-0.5">{f.company}</div>}
              {f.phone && <div className="text-sm text-neutral-300 mt-1">{f.phone}</div>}
              {f.address && <div className="text-xs text-neutral-500 break-words mt-0.5">{f.address}</div>}
              {(f.contactType || f.leadSource) && <div className="text-xs text-neutral-600 mt-0.5">{[f.contactType, f.leadSource && "Source: " + f.leadSource].filter(Boolean).join(" · ")}</div>}
            </div>
            <button onClick={onClose} className="shrink-0 mt-1"><X size={20} className="text-neutral-500" /></button>
          </div>
        </div>
        {(ph || em) && (
          <div className="flex flex-wrap gap-2 px-4 pt-3">
            {ph && <a href={`tel:${ph}`} className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-100"><Phone size={14} /> Call</a>}
            {ph && <a href={`sms:${ph}`} className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-100"><MessageSquare size={14} /> Text</a>}
            {wa && <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg bg-emerald-700/40 hover:bg-emerald-700/60 text-emerald-200"><MessageSquare size={14} /> WhatsApp</a>}
            {em && <a href={gmailUrl(em)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-100"><Mail size={14} /> Email</a>}
            {ph && <button onClick={() => copy(f.phone, "phone")} className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-100">{copied === "phone" ? "Copied!" : "Copy phone"}</button>}
            {em && <button onClick={() => copy(em, "email")} className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-100">{copied === "email" ? "Copied!" : "Copy email"}</button>}
            <button onClick={() => onLog(f)} className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white ml-auto"><Activity size={14} /> Log activity</button>
          </div>
        )}
        <div className="px-4 pt-3 space-y-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] uppercase tracking-wider text-neutral-500 mr-1">Follow up</span>
            <button onClick={() => setFollow(0)} className={chip}>Today</button>
            <button onClick={() => setFollow(1)} className={chip}>Tomorrow</button>
            <button onClick={() => setFollow(7)} className={chip}>+7 days</button>
            <button onClick={() => setFollow(14)} className={chip}>+14 days</button>
            <button onClick={() => setFollow(30)} className={chip}>+30 days</button>
            <input type="date" value={f.nextFollowUp || ""} onChange={(e) => setFollow2(e.target.value)} className="text-xs px-2 py-1 rounded-md bg-neutral-900 border border-neutral-700 text-neutral-200" />
            {f.nextFollowUp && <button onClick={() => setFollow(null)} className="text-xs text-neutral-500 hover:text-red-400">Clear</button>}
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] uppercase tracking-wider text-neutral-500 mr-1">Mark</span>
            <button onClick={() => patch({ dealAlert: !f.dealAlert })} className={`text-xs px-2 py-1 rounded-md ${f.dealAlert ? "bg-red-600/25 text-red-300" : "bg-neutral-800 hover:bg-neutral-700 text-neutral-200"}`}>{f.dealAlert ? "Hot ✓" : "Mark hot"}</button>
            <button onClick={() => patch({ customer: !f.customer })} className={`text-xs px-2 py-1 rounded-md ${f.customer ? "bg-emerald-600/25 text-emerald-300" : "bg-neutral-800 hover:bg-neutral-700 text-neutral-200"}`}>{f.customer ? "Customer ✓" : "Mark customer"}</button>
            <button onClick={() => patch({ status: "Lost", dealAlert: false })} className="text-xs px-2 py-1 rounded-md bg-neutral-800 hover:bg-red-600/25 hover:text-red-300 text-neutral-200">Mark lost</button>
            <button onClick={() => onAddInvoice(f)} className="text-xs px-2 py-1 rounded-md bg-neutral-800 hover:bg-neutral-700 text-neutral-200 flex items-center gap-1"><FileText size={12} /> Create invoice</button>
          </div>
        </div>
        {dup && <div className="mx-4 mt-3 text-xs px-3 py-2 rounded-lg bg-amber-500/15 border border-amber-600/40 text-amber-300">Possible duplicate: {dup.contactName || dup.company || "another contact"} already has this phone or email.</div>}
        <div className="p-4 grid grid-cols-2 gap-3">
          <div className="col-span-2 text-[11px] uppercase tracking-wider text-neutral-500 border-b border-neutral-800 pb-1.5">Contact details</div>
          <Field label="Contact Name"><input className={inp} value={f.contactName} onChange={(e) => set("contactName", e.target.value)} /></Field>
          <Field label="Company"><input className={inp} value={f.company} onChange={(e) => set("company", e.target.value)} /></Field>
          <Field label="Type (individual or company)"><select className={inp} value={f.contactType} onChange={(e) => set("contactType", e.target.value)}><option value="">—</option>{TYPES.map((x) => <option key={x}>{x}</option>)}</select></Field>
          <Field label="Source (where this contact came from)"><select className={inp} value={f.leadSource} onChange={(e) => set("leadSource", e.target.value)}><option value="">—</option>{Array.from(new Set([...LEAD_SOURCES, f.leadSource].filter(Boolean))).map((x) => <option key={x}>{x}</option>)}</select></Field>
          <Field label="Phone"><input className={inp} value={f.phone} onChange={(e) => set("phone", e.target.value)} /></Field>
          <Field label="Email"><input className={inp} value={f.email} onChange={(e) => set("email", e.target.value)} /></Field>
          <div className="col-span-2 text-[11px] uppercase tracking-wider text-neutral-500 border-b border-neutral-800 pb-1.5 mt-1">Opportunity &amp; equipment</div>
          <Field label="Opportunity (buyer, seller, repair...)"><select className={inp} value={f.segment} onChange={(e) => set("segment", e.target.value)}><option value="">—</option>{OPPORTUNITY.map((x) => <option key={x}>{x}</option>)}</select></Field>
          <Field label="Operation Size"><input className={inp} value={f.operationSize} onChange={(e) => set("operationSize", e.target.value)} placeholder="e.g. 10 miners or 2 MW" /></Field>
          <Field label="ASIC Model"><input className={inp} value={f.asicModel} onChange={(e) => set("asicModel", e.target.value)} placeholder="e.g. S19J Pro 120T" /></Field>
          <Field label="City"><input className={inp} value={f.city} onChange={(e) => set("city", e.target.value)} /></Field>
          <Field label="Country"><input className={inp} value={f.country} onChange={(e) => set("country", e.target.value)} /></Field>
          <Field label="Language"><select className={inp} value={f.language} onChange={(e) => set("language", e.target.value)}><option value="">—</option>{LANGS.map((x) => <option key={x}>{x}</option>)}</select></Field>
          <div className="col-span-2"><Field label="Address"><input className={inp} value={f.address} onChange={(e) => set("address", e.target.value)} placeholder="Street, city, province, postal code" /></Field></div>
          <div className="col-span-2 text-[11px] uppercase tracking-wider text-neutral-500 border-b border-neutral-800 pb-1.5 mt-1">Pipeline &amp; follow-up</div>
          <Field label="Status"><select className={inp} value={f.status} onChange={(e) => set("status", e.target.value)}>{STATUS.map((x) => <option key={x}>{x}</option>)}</select></Field>
          <Field label="Priority"><select className={inp} value={f.priority} onChange={(e) => set("priority", e.target.value)}>{PRIO.map((x) => <option key={x}>{x}</option>)}</select></Field>
          <Field label="Last Contacted"><input type="date" className={inp} value={f.lastContacted} onChange={(e) => set("lastContacted", e.target.value)} /></Field>
          <Field label="Next Follow-up"><input type="date" className={inp} value={f.nextFollowUp} onChange={(e) => set("nextFollowUp", e.target.value)} /></Field>
          <div className="col-span-2 flex flex-wrap gap-1.5 -mt-1">
            <span className="text-xs text-neutral-600 self-center">Quick follow-up:</span>
            <button className={chip} onClick={() => set("nextFollowUp", todayISO())}>Today</button>
            <button className={chip} onClick={() => set("nextFollowUp", addDays(3))}>+3 days</button>
            <button className={chip} onClick={() => set("nextFollowUp", addDays(7))}>+1 week</button>
            <button className={chip} onClick={() => set("nextFollowUp", addDays(14))}>+2 weeks</button>
            <button className={chip} onClick={() => set("nextFollowUp", "")}>Clear</button>
          </div>
          <Field label="Last Result"><input className={inp} value={f.lastResult} onChange={(e) => set("lastResult", e.target.value)} /></Field>
          <Field label="Next Action"><input className={inp} value={f.nextAction} onChange={(e) => set("nextAction", e.target.value)} /></Field>
          <div className="col-span-2"><Field label="AI Summary (RingCentral call notes)"><textarea className={inp} rows={2} value={f.aiSummary} onChange={(e) => set("aiSummary", e.target.value)} placeholder="Will auto-fill from RingCentral once connected: what the caller wanted, key points discussed..." /></Field></div>
          <div className="col-span-2"><Field label="Notes"><textarea className={inp} rows={2} value={f.notes} onChange={(e) => set("notes", e.target.value)} /></Field></div>
          <div className="col-span-2 text-[11px] uppercase tracking-wider text-neutral-500 border-b border-neutral-800 pb-1.5 mt-1">Flags</div>
          <label className="col-span-2 flex items-center gap-2 text-sm text-neutral-300"><input type="checkbox" checked={f.dealAlert} onChange={(e) => set("dealAlert", e.target.checked)} /> Flag as deal alert (hot lead)</label>
          <label className="col-span-2 flex items-center gap-2 text-sm text-neutral-300"><input type="checkbox" checked={f.customer} onChange={(e) => set("customer", e.target.checked)} /> Existing customer (has bought from us)</label>
          <label className="col-span-2 flex items-center gap-2 text-sm text-neutral-300"><input type="checkbox" checked={f.supplier} onChange={(e) => set("supplier", e.target.checked)} /> Supplier (brings me batches)</label>
          <label className="col-span-2 flex items-center gap-2 text-sm text-neutral-300"><input type="checkbox" checked={f.repairClient} onChange={(e) => set("repairClient", e.target.checked)} /> Repair client (I serviced their miners)</label>
        </div>
        <div className="px-4 pb-2">
          <div className="text-[11px] uppercase tracking-wider text-neutral-500 mb-2">Tags</div>
          <div className="flex flex-wrap items-center gap-1.5">
            {(f.tags || []).map((tg) => <span key={tg} className="text-xs px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300 flex items-center gap-1">{tg}<button onClick={() => removeTag(tg)} className="text-neutral-500 hover:text-red-400"><X size={11} /></button></span>)}
            <input value={tagText} onChange={(e) => setTagText(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(tagText); } }} placeholder="Add tag + Enter" className="text-xs px-2 py-1 rounded-md bg-neutral-900 border border-neutral-700 text-neutral-200 w-32" />
          </div>
        </div>
        <div className="px-4 pb-2">
          <div className="flex items-center justify-between mb-2"><div className="text-xs text-neutral-500">Invoices ({myInvoices.length})</div><button onClick={() => onAddInvoice(f)} className="text-xs flex items-center gap-1 text-red-400 hover:text-red-300"><Plus size={13} /> Add invoice</button></div>
          {myInvoices.length === 0 ? <div className="text-xs text-neutral-700">No invoices for this contact yet.</div> : (
            <div className="space-y-1.5">{myInvoices.map((iv) => (<div key={iv.id} className="flex items-center gap-2 text-xs"><span className="text-neutral-600 shrink-0">{iv.date}</span><span className="text-neutral-300 truncate">{iv.model || iv.number || "Invoice"}</span><span className="text-neutral-200 ml-auto shrink-0">{iv.amount !== "" && iv.amount != null ? cad(numVal(iv.amount)) : "—"}</span><InvPill status={iv.status} /></div>))}</div>
          )}
        </div>
        <div className="px-4 pb-4">
          <div className="text-[11px] uppercase tracking-wider text-neutral-500 mb-2">Add note</div>
          <div className="flex flex-wrap gap-1.5 mb-2">{NOTE_QUICK.map((q) => <button key={q} onClick={() => addNote(q, "Note")} className={chip}>{q}</button>)}</div>
          <div className="flex gap-2">
            <input value={noteText} onChange={(e) => setNoteText(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && noteText.trim()) { e.preventDefault(); addNote(noteText.trim(), "Note"); } }} placeholder="Type a note and press Enter..." className="flex-1 text-sm px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-700 text-neutral-100 placeholder-neutral-600" />
            <button onClick={() => noteText.trim() && addNote(noteText.trim(), "Note")} disabled={!noteText.trim()} className="text-sm px-3 py-2 rounded-lg bg-red-600 text-white hover:bg-red-500 disabled:opacity-50">Add</button>
          </div>
          <div className="text-xs text-neutral-500 mt-4 mb-2">Timeline ({history.length})</div>
          {history.length === 0 ? <div className="text-xs text-neutral-700">No notes or activity yet.</div> : (
            <div className="relative pl-4 space-y-3 before:absolute before:left-1 before:top-1 before:bottom-1 before:w-px before:bg-neutral-800">
              {history.slice(0, 20).map((a) => (
                <div key={a.id} className="relative text-xs">
                  <span className="absolute -left-3 top-1 w-2 h-2 rounded-full bg-red-500 ring-2 ring-neutral-950" />
                  <div className="flex items-center gap-2"><span className="px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300">{a.type}</span><span className="text-neutral-600">{a.date}</span></div>
                  {(a.outcome || a.notes) && <div className="text-neutral-300 mt-0.5">{a.outcome}{a.outcome && a.notes ? " · " : ""}{a.notes}</div>}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center justify-between px-4 py-3 border-t border-neutral-800 sticky bottom-0 bg-neutral-950"><button onClick={() => onDelete(f.id)} className="text-sm text-red-500 hover:text-red-400 flex items-center gap-1.5 transition"><Trash2 size={16} /> Delete</button><div className="flex gap-2"><button onClick={onClose} className="text-sm font-medium px-4 py-2 rounded-xl border border-neutral-700 text-neutral-300 hover:bg-neutral-800 transition">Cancel</button><button onClick={() => onSave(f)} className="text-sm font-medium px-5 py-2 rounded-xl bg-red-600 text-white hover:bg-red-500 transition shadow-lg shadow-red-900/20">Save</button></div></div>
      </div>
    </div>
  );
}

function ActForm({ act, leads, onSave, onClose }) {
  const [f, setF] = useState({ ...act });
  const [adv, setAdv] = useState("");
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));
  const chip = "text-xs px-2 py-1 rounded-md bg-neutral-800 hover:bg-neutral-700 text-neutral-200";
  return (
    <div className="fixed inset-0 bg-black/70 z-40 flex items-end sm:items-center justify-center" onClick={onClose}>
      <div className="bg-neutral-950 border border-neutral-800 w-full sm:max-w-md sm:rounded-xl rounded-t-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800"><div className="font-semibold text-white">Log Activity</div><button onClick={onClose}><X size={20} className="text-neutral-500" /></button></div>
        <div className="p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Date"><input type="date" className={inp} value={f.date} onChange={(e) => set("date", e.target.value)} /></Field>
            <Field label="Type"><select className={inp} value={f.type} onChange={(e) => set("type", e.target.value)}>{ACT_TYPES.map((x) => <option key={x}>{x}</option>)}</select></Field>
          </div>
          <Field label="Contact"><select className={inp} value={f.leadId} onChange={(e) => { const l = leads.find((x) => x.id === e.target.value); set("leadId", e.target.value); if (l) set("contact", l.contactName || l.company); }}><option value="">— pick contact —</option>{leads.map((l) => <option key={l.id} value={l.id}>{l.contactName || l.company || l.phone}</option>)}</select></Field>
          <div>
            <div className="text-xs text-neutral-500 mb-1">Quick note</div>
            <div className="flex flex-wrap gap-1.5">{["Called", "No answer", "Sent quote", "Waiting reply", "Deal closed", "Repair update"].map((q) => <button key={q} type="button" onClick={() => set("outcome", q)} className={chip}>{q}</button>)}</div>
          </div>
          <Field label="Outcome"><input className={inp} value={f.outcome} onChange={(e) => set("outcome", e.target.value)} placeholder="e.g. Sent quote, wants 10 units" /></Field>
          <Field label="Notes"><textarea className={inp} rows={2} value={f.notes} onChange={(e) => set("notes", e.target.value)} /></Field>
          {f.leadId && (
            <div>
              <div className="text-xs text-neutral-500 mb-1">Set next follow-up {adv ? `→ ${adv}` : "(optional)"}</div>
              <div className="flex flex-wrap gap-1.5"><button className={chip} onClick={() => setAdv(addDays(3))}>+3 days</button><button className={chip} onClick={() => setAdv(addDays(7))}>+1 week</button><button className={chip} onClick={() => setAdv(addDays(14))}>+2 weeks</button><button className={chip} onClick={() => setAdv("")}>None</button></div>
            </div>
          )}
        </div>
        <div className="flex justify-end gap-2 px-4 py-3 border-t border-neutral-800"><button onClick={onClose} className="text-sm px-3 py-2 rounded-lg border border-neutral-700 text-neutral-300">Cancel</button><button onClick={() => onSave(f, adv || undefined)} className="text-sm px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-500">Save</button></div>
      </div>
    </div>
  );
}
function InvoiceForm({ inv, leads, onSave, onDelete, onClose }) {
  const [f, setF] = useState({ ...inv });
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));
  const pick = (id) => { const l = (leads || []).find((x) => x.id === id); set("leadId", id); if (l) set("contact", l.contactName || l.company || ""); };
  const isEdit = !!(inv.number || inv.contact || inv.model);
  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div className="bg-neutral-950 border border-neutral-800 w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl max-h-[92vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-neutral-800 sticky top-0 bg-neutral-950"><div className="font-semibold text-white">{isEdit ? "Edit Invoice" : "New Invoice"}</div><button onClick={onClose} className="text-neutral-400 hover:text-white"><X size={20} /></button></div>
        <div className="p-4 grid grid-cols-2 gap-3">
          <div className="col-span-2"><Field label="Link to contact (optional)"><select className={inp} value={f.leadId} onChange={(e) => pick(e.target.value)}><option value="">— not linked —</option>{[...(leads || [])].sort((a, b) => (a.contactName || a.company || "").localeCompare(b.contactName || b.company || "")).map((l) => <option key={l.id} value={l.id}>{l.contactName || l.company || l.phone || "Unnamed"}</option>)}</select></Field></div>
          <div className="col-span-2"><Field label="Contact name"><input className={inp} value={f.contact} onChange={(e) => set("contact", e.target.value)} /></Field></div>
          <Field label="Invoice #"><input className={inp} value={f.number} onChange={(e) => set("number", e.target.value)} /></Field>
          <Field label="Model"><input className={inp} value={f.model} onChange={(e) => set("model", e.target.value)} /></Field>
          <Field label="Quantity"><input className={inp} value={f.qty} onChange={(e) => set("qty", e.target.value)} /></Field>
          <Field label="Amount (CAD)"><input className={inp} value={f.amount} onChange={(e) => set("amount", e.target.value)} placeholder="e.g. 1250" /></Field>
          <Field label="Invoice date"><input type="date" className={inp} value={f.date} onChange={(e) => set("date", e.target.value)} /></Field>
          <Field label="Due date"><input type="date" className={inp} value={f.dueDate} onChange={(e) => set("dueDate", e.target.value)} /></Field>
          <Field label="Status"><select className={inp} value={f.status} onChange={(e) => set("status", e.target.value)}>{["Unpaid", "Sent", "Paid", "Quote", "Refund"].map((s) => <option key={s}>{s}</option>)}</select></Field>
          <Field label="Supplier"><input className={inp} value={f.supplier} onChange={(e) => set("supplier", e.target.value)} placeholder="Who supplied it" /></Field>
          <Field label="Cost (CAD)"><input className={inp} value={f.cost} onChange={(e) => set("cost", e.target.value)} /></Field>
          <Field label="Profit (CAD)"><input className={inp} value={f.profit} onChange={(e) => set("profit", e.target.value)} /></Field>
          <div className="col-span-2"><Field label="Notes"><textarea className={inp} rows={2} value={f.notes} onChange={(e) => set("notes", e.target.value)} /></Field></div>
        </div>
        <div className="flex items-center justify-between p-4 border-t border-neutral-800 sticky bottom-0 bg-neutral-950"><button onClick={() => onDelete(f.id)} className="text-red-400 text-sm hover:text-red-300 flex items-center gap-1"><Trash2 size={15} /> Delete</button><button onClick={() => onSave(f)} className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-500">Save Invoice</button></div>
      </div>
    </div>
  );
}
function BatchForm({ batch, onSave, onDelete, onClose }) {
  const [f, setF] = useState({ ...batch });
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));
  const isEdit = !!(batch.model || batch.source);
  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div className="bg-neutral-950 border border-neutral-800 w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl max-h-[92vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-neutral-800 sticky top-0 bg-neutral-950"><div className="font-semibold text-white">{isEdit ? "Edit Batch" : "New Batch"}</div><button onClick={onClose} className="text-neutral-400 hover:text-white"><X size={20} /></button></div>
        <div className="p-4 grid grid-cols-2 gap-3">
          <div className="col-span-2"><Field label="Model"><input className={inp} value={f.model} onChange={(e) => set("model", e.target.value)} placeholder="e.g. S19J Pro 104T" /></Field></div>
          <Field label="Quantity"><input className={inp} value={f.qty} onChange={(e) => set("qty", e.target.value)} placeholder="e.g. 50" /></Field>
          <Field label="Price (CAD each)"><input className={inp} value={f.price} onChange={(e) => set("price", e.target.value)} placeholder="e.g. 599" /></Field>
          <div className="col-span-2"><Field label="Who has it / source"><input className={inp} value={f.source} onChange={(e) => set("source", e.target.value)} placeholder="Name or company that has them" /></Field></div>
          <Field label="Where from"><select className={inp} value={f.sourceType} onChange={(e) => set("sourceType", e.target.value)}>{["Phone", "Email", "Broker", "Client", "Telegram", "Facebook", "Other"].map((s) => <option key={s}>{s}</option>)}</select></Field>
          <Field label="Their phone"><input className={inp} value={f.phone} onChange={(e) => set("phone", e.target.value)} placeholder="Phone number" /></Field>
          <Field label="Their email"><input className={inp} value={f.email} onChange={(e) => set("email", e.target.value)} placeholder="Email" /></Field>
          <Field label="Status"><select className={inp} value={f.status} onChange={(e) => set("status", e.target.value)}>{["Available", "Sold"].map((s) => <option key={s}>{s}</option>)}</select></Field>
          <Field label="Date"><input type="date" className={inp} value={f.date} onChange={(e) => set("date", e.target.value)} /></Field>
          <div className="col-span-2"><Field label="Notes"><textarea className={inp} rows={2} value={f.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Condition, location, anything useful" /></Field></div>
        </div>
        <div className="flex items-center justify-between p-4 border-t border-neutral-800 sticky bottom-0 bg-neutral-950"><button onClick={() => onDelete(f.id)} className="text-red-400 text-sm hover:text-red-300 flex items-center gap-1"><Trash2 size={15} /> Delete</button><button onClick={() => onSave(f)} className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-500">Save Batch</button></div>
      </div>
    </div>
  );
}

const TPL_CATEGORIES = ["Sales", "Repair", "Invoice", "Follow up", "Supplier", "Hosting", "General"];

const IMPORT_MODES = [
  { k: "skip", label: "Skip duplicates", desc: "Add only new contacts (recommended)" },
  { k: "fill", label: "Update empty fields only", desc: "Fill blanks on matched contacts, never overwrite" },
  { k: "new", label: "Add as new anyway", desc: "Import every row, even duplicates" },
];
function ImportPreview({ prev, mode, setMode, onConfirm, onClose }) {
  const willApply = mode === "new" ? prev.total : prev.toAdd + (mode === "fill" ? prev.dup : 0);
  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div className="bg-neutral-950 border border-neutral-800 w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl max-h-[92vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-neutral-800 sticky top-0 bg-neutral-950"><div className="font-semibold text-white">Import preview</div><button onClick={onClose} className="text-neutral-400 hover:text-white"><X size={20} /></button></div>
        <div className="p-4 space-y-4">
          <div className="text-sm text-neutral-400 truncate">File: <span className="text-neutral-200">{prev.fileName}</span></div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-2.5"><div className="text-lg font-bold text-emerald-400">{prev.toAdd}</div><div className="text-[10px] text-neutral-500 mt-0.5">New</div></div>
            <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-2.5"><div className="text-lg font-bold text-amber-400">{prev.dup}</div><div className="text-[10px] text-neutral-500 mt-0.5">Look duplicated</div></div>
            <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-2.5"><div className="text-lg font-bold text-white">{prev.total}</div><div className="text-[10px] text-neutral-500 mt-0.5">Rows read</div></div>
            <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-2.5"><div className="text-lg font-bold text-red-300">{prev.missing}</div><div className="text-[10px] text-neutral-500 mt-0.5">No phone/email</div></div>
            <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-2.5"><div className="text-lg font-bold text-red-300">{prev.noName}</div><div className="text-[10px] text-neutral-500 mt-0.5">Missing name</div></div>
            <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-2.5"><div className="text-lg font-bold text-neutral-200">{prev.withNotes}</div><div className="text-[10px] text-neutral-500 mt-0.5">Have notes</div></div>
          </div>
          <div className="flex flex-wrap gap-2 text-[11px]">
            {prev.hasInvoiceCols && <span className="px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-300 border border-sky-500/20">Invoice data detected</span>}
            {prev.hasNoteCols && <span className="px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/20">Notes detected</span>}
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider text-neutral-500 mb-1.5">Fields detected ({prev.detected.length}) · not mapped ({prev.unmapped.length})</div>
            <div className="space-y-1 max-h-36 overflow-y-auto">
              {prev.mapped.map((mm, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <span className="text-neutral-400 truncate flex-1">{mm.header}</span>
                  <ChevronRight size={12} className="text-neutral-600 shrink-0" />
                  <span className={`truncate flex-1 ${mm.field ? "text-neutral-200" : "text-neutral-600 italic"}`}>{mm.field || "not mapped"}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider text-neutral-500 mb-1.5">When a contact already exists</div>
            <div className="space-y-1.5">
              {IMPORT_MODES.map((mm) => (
                <label key={mm.k} className={`flex items-start gap-2 px-3 py-2 rounded-xl border cursor-pointer transition ${mode === mm.k ? "border-red-600 bg-red-600/10" : "border-neutral-800 bg-neutral-900 hover:bg-neutral-800"}`}>
                  <input type="radio" name="impmode" checked={mode === mm.k} onChange={() => setMode(mm.k)} className="mt-0.5" />
                  <span><span className="text-sm text-neutral-100">{mm.label}</span><span className="block text-[11px] text-neutral-500">{mm.desc}</span></span>
                </label>
              ))}
            </div>
          </div>
          <div className="text-xs text-neutral-500">Existing data is never overwritten except blank fields under "Update empty fields only". Your saved CRM stays safe.</div>
        </div>
        <div className="flex items-center justify-end gap-2 p-4 border-t border-neutral-800 sticky bottom-0 bg-neutral-950"><button onClick={onClose} className="text-sm font-medium px-4 py-2 rounded-xl border border-neutral-700 text-neutral-300 hover:bg-neutral-800 transition">Cancel</button><button onClick={onConfirm} disabled={willApply === 0} className="text-sm font-medium px-5 py-2 rounded-xl bg-red-600 text-white hover:bg-red-500 disabled:opacity-50 transition">Import {willApply} row{willApply === 1 ? "" : "s"}</button></div>
      </div>
    </div>
  );
}

function RestorePreview({ prev, onConfirm, onClose }) {
  const c = prev.counts;
  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div className="bg-neutral-950 border border-neutral-800 w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl max-h-[92vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-neutral-800 sticky top-0 bg-neutral-950"><div className="font-semibold text-white">Restore from backup</div><button onClick={onClose} className="text-neutral-400 hover:text-white"><X size={20} /></button></div>
        <div className="p-4 space-y-4">
          <div className="text-sm text-neutral-400 truncate">File: <span className="text-neutral-200">{prev.fileName}</span></div>
          <div className="grid grid-cols-3 gap-2 text-center">
            {[["Contacts", c.contacts], ["Invoices", c.invoices], ["Notes", c.notes], ["Templates", c.templates], ["Follow-ups", c.followups], ["Ignored dupes", c.ignored]].map(([lab, n]) => (
              <div key={lab} className="bg-neutral-900 rounded-xl border border-neutral-800 p-3"><div className="text-lg font-bold text-white">{n}</div><div className="text-[10px] text-neutral-500 mt-0.5">{lab}</div></div>
            ))}
          </div>
          <div className="text-xs px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-700/40 text-amber-300">This replaces your current CRM data with the backup. Tip: run Backup first to save what you have now.</div>
        </div>
        <div className="flex items-center justify-end gap-2 p-4 border-t border-neutral-800 sticky bottom-0 bg-neutral-950"><button onClick={onClose} className="text-sm font-medium px-4 py-2 rounded-xl border border-neutral-700 text-neutral-300 hover:bg-neutral-800 transition">Cancel</button><button onClick={onConfirm} className="text-sm font-medium px-5 py-2 rounded-xl bg-red-600 text-white hover:bg-red-500 transition">Restore {c.contacts} contacts</button></div>
      </div>
    </div>
  );
}

function TemplatePreview({ tpl, onCopy, onEdit, copied, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div className="bg-neutral-950 border border-neutral-800 w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl max-h-[92vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-neutral-800 sticky top-0 bg-neutral-950">
          <div className="min-w-0"><div className="font-semibold text-white truncate">{tpl.title || "Template"}</div><div className="text-[11px] text-neutral-500">{tpl.category || "General"}</div></div>
          <button onClick={onClose} className="text-neutral-400 hover:text-white"><X size={20} /></button>
        </div>
        <div className="p-4"><div className="text-sm text-neutral-200 whitespace-pre-wrap bg-neutral-900 border border-neutral-800 rounded-xl p-3">{tpl.body}</div></div>
        <div className="flex items-center justify-end gap-2 p-4 border-t border-neutral-800 sticky bottom-0 bg-neutral-950"><button onClick={onEdit} className="text-sm font-medium px-4 py-2 rounded-xl border border-neutral-700 text-neutral-300 hover:bg-neutral-800 transition">Edit</button><button onClick={onCopy} className="text-sm font-medium px-5 py-2 rounded-xl bg-red-600 text-white hover:bg-red-500 transition">{copied ? "Copied!" : "Copy"}</button></div>
      </div>
    </div>
  );
}

function TemplateForm({ tpl, onSave, onDelete, onClose }) {
  const [f, setF] = useState({ category: "General", ...tpl });
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));
  const isEdit = !!(tpl.title || tpl.body);
  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div className="bg-neutral-950 border border-neutral-800 w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl max-h-[92vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-neutral-800 sticky top-0 bg-neutral-950"><div className="font-semibold text-white">{isEdit ? "Edit Template" : "New Template"}</div><button onClick={onClose} className="text-neutral-400 hover:text-white"><X size={20} /></button></div>
        <div className="p-4 space-y-3">
          <Field label="Category"><select className={inp} value={f.category} onChange={(e) => set("category", e.target.value)}>{TPL_CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select></Field>
          <Field label="Title"><input className={inp} value={f.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. Bulk pricing reply" /></Field>
          <Field label="Message"><textarea className={inp} rows={10} value={f.body} onChange={(e) => set("body", e.target.value)} placeholder="Type your message. Use [name], [model], [price] as placeholders." /></Field>
        </div>
        <div className="flex items-center justify-between p-4 border-t border-neutral-800 sticky bottom-0 bg-neutral-950"><button onClick={() => onDelete(f.id)} className="text-red-400 text-sm hover:text-red-300 flex items-center gap-1"><Trash2 size={15} /> Delete</button><button onClick={() => onSave(f)} className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-500">Save Template</button></div>
      </div>
    </div>
  );
}
