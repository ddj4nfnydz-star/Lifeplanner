// Lifeplanner-Widget für Scriptable (iPhone-Homescreen)
// Einrichtung: Skript in Scriptable einfügen, Widget auf den Homescreen legen,
// Widget bearbeiten → Script: "Lifeplanner-Widget", Parameter: die Adresse aus der App
// (Profil → iPhone-Widget). Optional am Ende des Parameters "|kalorien", "|tag",
// "|training" oder "|einkauf", um bei kleinen Widgets den Inhalt festzulegen.

const DEMO = {
  name: "Maik", kcal: 1240, kcalTarget: 2650, protein: 82, proteinTarget: 152,
  carbs: 160, carbsTarget: 470, fat: 45, fatTarget: 90, trainingDay: true,
  phase: { name: "Aufbau", daysLeft: 182, next: "Diät (Cut)", nextFrom: "2027-05-17" },
  water: 4, waterGoal: 11,
  alarm: { time: "06:30", day: "Morgen", label: "Aufstehen" },
  training: { name: "Push", day: "Heute", time: "18:00" },
  today: [
    { time: "09:00", title: "Teammeeting", type: "termin", done: true },
    { time: "12:30", title: "Hähnchen-Reis-Bowl", type: "essen", done: false },
    { time: "18:00", title: "Training: Push", type: "gym", done: false },
    { time: "", title: "Steuerunterlagen sortieren", type: "aufgabe", done: false }
  ],
  shopping: ["Hähnchenbrust", "Paprika", "Magerquark", "Bananen"], shoppingOpen: 5,
  appUrl: ""
};

const C = {
  bg: Color.dynamic(new Color("#FFFFFF"), new Color("#141A24")),
  ink: Color.dynamic(new Color("#101827"), new Color("#E9EEF6")),
  muted: Color.dynamic(new Color("#5A6577"), new Color("#97A3B6")),
  track: Color.dynamic(new Color("#E6EAF0"), new Color("#262F3E")),
  accent: Color.dynamic(new Color("#1E56F0"), new Color("#5C8BFF")),
  termin: Color.dynamic(new Color("#1E56F0"), new Color("#5C8BFF")),
  gym: Color.dynamic(new Color("#E8571F"), new Color("#FF7A45")),
  essen: Color.dynamic(new Color("#128A5E"), new Color("#2FBF88")),
  aufgabe: Color.dynamic(new Color("#7D45D1"), new Color("#A97CF2"))
};

const param = (args.widgetParameter || "").trim();
const [url, mode] = param.split("|").map(s => (s || "").trim());
const fm = FileManager.local();
const cachePath = fm.joinPath(fm.documentsDirectory(), "lifeplanner-widget.json");

async function loadData() {
  if (!url) return { ...DEMO, demo: true };
  try {
    const req = new Request(url + (url.includes("?") ? "&" : "?") + "t=" + Date.now());
    req.timeoutInterval = 10;
    const d = await req.loadJSON();
    fm.writeString(cachePath, JSON.stringify(d));
    return d;
  } catch (e) {
    if (fm.fileExists(cachePath)) return { ...JSON.parse(fm.readString(cachePath)), stale: true };
    return { ...DEMO, demo: true, error: true };
  }
}

function text(stack, str, size, color, weight) {
  const t = stack.addText(String(str));
  t.font = weight === "bold" ? Font.boldRoundedSystemFont(size)
    : weight === "semi" ? Font.semiboldSystemFont(size) : Font.systemFont(size);
  t.textColor = color || C.ink;
  t.lineLimit = 1;
  t.minimumScaleFactor = 0.7;
  return t;
}
function label(stack, str, color) {
  const t = text(stack, str.toUpperCase(), 10, color || C.muted, "semi");
  return t;
}
function bar(stack, value, max, color, width) {
  const h = 6, p = Math.max(0, Math.min(1, max ? value / max : 0));
  const ctx = new DrawContext();
  ctx.size = new Size(width, h); ctx.opaque = false; ctx.respectScreenScale = true;
  const bg = new Path(); bg.addRoundedRect(new Rect(0, 0, width, h), 3, 3);
  ctx.addPath(bg); ctx.setFillColor(C.track); ctx.fillPath();
  if (p > 0) {
    const fg = new Path(); fg.addRoundedRect(new Rect(0, 0, Math.max(h, width * p), h), 3, 3);
    ctx.addPath(fg); ctx.setFillColor(color); ctx.fillPath();
  }
  const img = stack.addImage(ctx.getImage());
  img.imageSize = new Size(width, h);
}
const fmt = n => Math.round(n).toLocaleString("de-DE");
const typeColor = t => C[t] || C.accent;

function nutrition(stack, d, width, macros) {
  const left = Math.max(0, d.kcalTarget - d.kcal);
  label(stack, "Ernährung", C.essen);
  stack.addSpacer(2);
  text(stack, fmt(left), 26, C.ink, "bold");
  text(stack, "kcal übrig", 11, C.muted);
  stack.addSpacer(6);
  bar(stack, d.kcal, d.kcalTarget, C.essen, width);
  stack.addSpacer(5);
  text(stack, `Protein ${fmt(d.protein)}/${fmt(d.proteinTarget)} g`, 11, C.muted);
  stack.addSpacer(3);
  bar(stack, d.protein, d.proteinTarget, C.termin, width);
  if (macros && d.carbsTarget) {
    stack.addSpacer(5);
    text(stack, `KH ${fmt(d.carbs)}/${fmt(d.carbsTarget)} · Fett ${fmt(d.fat)}/${fmt(d.fatTarget)} g`, 10, C.muted);
  }
}
function training(stack, d) {
  label(stack, "Training", C.gym);
  stack.addSpacer(2);
  if (d.training) {
    text(stack, d.training.name, 22, C.gym, "bold");
    text(stack, d.training.day + (d.training.time ? ", " + d.training.time : ""), 12, C.muted);
  } else text(stack, "Nichts geplant", 14, C.muted, "semi");
  stack.addSpacer(8);
  label(stack, "Wecker");
  stack.addSpacer(2);
  if (d.alarm) {
    text(stack, d.alarm.time, 20, C.ink, "bold");
    text(stack, d.alarm.day + " · " + d.alarm.label, 11, C.muted);
  } else text(stack, "Aus", 14, C.muted, "semi");
}
function dayList(stack, d, max) {
  label(stack, "Dein Tag", C.accent);
  stack.addSpacer(5);
  const items = (d.today || []).filter(x => !x.done);
  if (!items.length) { text(stack, "Alles erledigt 🎉", 13, C.muted, "semi"); return; }
  items.slice(0, max).forEach((x, i) => {
    const row = stack.addStack(); row.centerAlignContent(); row.spacing = 6;
    const dot = row.addStack(); dot.size = new Size(4, 16); dot.cornerRadius = 2; dot.backgroundColor = typeColor(x.type);
    const tm = text(row, x.time || "–", 12, C.muted, "semi"); tm.lineLimit = 1;
    text(row, x.title, 13, C.ink, "semi");
    if (i < Math.min(max, items.length) - 1) stack.addSpacer(4);
  });
  if (items.length > max) { stack.addSpacer(3); text(stack, `+${items.length - max} weitere`, 11, C.muted); }
}
function shopping(stack, d, max) {
  label(stack, `Einkauf · ${d.shoppingOpen || 0} offen`, C.essen);
  stack.addSpacer(5);
  const list = d.shopping || [];
  if (!list.length) { text(stack, "Liste ist leer", 13, C.muted, "semi"); return; }
  list.slice(0, max).forEach(n => { text(stack, "○ " + n, 13, C.ink); stack.addSpacer(2); });
}

async function build() {
  const d = await loadData();
  const fam = config.widgetFamily || "large";
  const w = new ListWidget();
  w.backgroundColor = C.bg;
  w.setPadding(14, 14, 14, 14);
  if (d.appUrl) w.url = d.appUrl;
  w.refreshAfterDate = new Date(Date.now() + 15 * 60 * 1000);

  if (fam === "small") {
    const m = mode || "kalorien";
    if (m === "tag") dayList(w, d, 4);
    else if (m === "training") training(w, d);
    else if (m === "einkauf") shopping(w, d, 5);
    else nutrition(w, d, 120);
  } else if (fam === "medium") {
    const row = w.addStack(); row.spacing = 14;
    const l = row.addStack(); l.layoutVertically(); l.size = new Size(125, 0);
    nutrition(l, d, 120);
    const r = row.addStack(); r.layoutVertically();
    dayList(r, d, 4);
    r.addSpacer();
  } else {
    const top = w.addStack(); top.spacing = 14;
    const l = top.addStack(); l.layoutVertically(); l.size = new Size(150, 0);
    nutrition(l, d, 140, true);
    const r = top.addStack(); r.layoutVertically();
    training(r, d);
    w.addSpacer(12);
    dayList(w, d, 5);
    w.addSpacer(12);
    shopping(w, d, 3);
  }
  w.addSpacer();
  const foot = w.addStack();
  const note = d.demo ? (d.error ? "Keine Verbindung · Beispiel" : "Beispieldaten · Adresse fehlt")
    : d.stale ? "Offline · letzter Stand" : "Lifeplanner";
  const ph = d.phase ? `${d.phase.name}${d.phase.daysLeft != null ? " · noch " + d.phase.daysLeft + " Tage" : ""}${d.trainingDay ? " · Trainingstag" : ""} · ` : "";
  text(foot, ph + note, 9, C.muted);
  return w;
}

const widget = await build();
if (config.runsInWidget) Script.setWidget(widget);
else await widget.presentLarge();
Script.complete();
