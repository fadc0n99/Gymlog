"use strict";
/* Дневник тренировок — офлайн PWA. Все данные хранятся в localStorage на устройстве. */

const KEY = "gymlog.v1";
const $ = (s, r = document) => r.querySelector(s);
const uid = () => Math.random().toString(36).slice(2, 10);
const clone = o => JSON.parse(JSON.stringify(o));
const MONTHS = ["янв", "фев", "мар", "апр", "мая", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"];
const MONTHS_FULL = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
const WD = ["вс", "пн", "вт", "ср", "чт", "пт", "сб"];
const DAY = 864e5;

/* ---------- исходная программа ---------- */
function ex(name, sets, note = "") { return { id: uid(), name, note, sets: sets.map(([w, r]) => ({ w, r })) }; }
const n = (k, w, r) => Array.from({ length: k }, () => [w, r]);

function defaultProgram() {
  return { days: [
    { id: uid(), name: "День 1", exercises: [
      ex("Жим лежа", [[20, "8-12"], ...n(3, 30, "8-12")], "Первый подход разминочный"),
      ex("Жим гантелей от груди на наклонной скамье (30°)", n(3, 8, "10-12"), "Вес одной гантели"),
      ex("Сгибания рук с гантелями", n(4, 6, "макс"), "2 подхода молот, 2 с разворотом кисти"),
      ex("Гиперэкстензия", n(3, 0, "10-15")),
      ex("Скручивания на пресс на коврике", n(3, 0, "10-15")),
    ]},
    { id: uid(), name: "День 2", exercises: [
      ex("Подтягивания с резиной", n(4, 0, "макс"), "Не более 12 повторений, если больше — резину слабее"),
      ex("Приседания со штангой", [[20, "10-15"], ...n(3, 25, "10-15")]),
      ex("Выпады с гантелями", n(3, 4, "10 на ногу"), "Вес одной гантели"),
      ex("Жим гантелей стоя", n(3, 6, "10-15")),
      ex("Тяга штанги в наклоне", n(3, 20, "8-10")),
      ex("Скручивания на брусьях на пресс", n(3, 0, "8-12")),
    ]},
    { id: uid(), name: "День 3", exercises: [
      ex("Жим лежа", [[20, "10-15"], ...n(3, 35, "6-9")], "Первый подход разминочный"),
      ex("Тяга гантелей лёжа грудью на наклонной скамье", n(3, 8, "10-12"), "Вес одной гантели. Грудь от скамьи не отрываем"),
      ex("Жим гантелей над головой", n(3, 6, "8-12")),
      ex("Гиперэкстензия", n(3, 0, "10-15")),
      ex("Разгибания рук из-за головы в блоке с канатом", n(3, 8, "12-15"), "Локти смотрят вперёд"),
      ex("Скручивания на пресс на коврике", n(3, 0, "10-15")),
    ]},
    { id: uid(), name: "День 4", exercises: [
      ex("Румынская тяга с гантелями", n(3, 8, "10-12"), "Вес одной гантели. Спина ровная"),
      ex("Приведение рук в блоке (пуловер)", n(4, 20, "10-12")),
      ex("Тяга блока горизонтальная", n(3, 55, "8-12"), "Вес проверь на лёгком: тренажёры разные"),
      ex("Сгибания рук в блоке", n(3, 20, "10-15")),
      ex("Скручивания на брусьях на пресс", n(3, 0, "8-12")),
    ]},
    { id: uid(), name: "День 5", exercises: [
      ex("Отжимания на брусьях с резиной", n(4, 0, "макс"), "Не более 12 повторений, если больше — резину слабее"),
      ex("Жим гантелей от груди на наклонной скамье (45°)", n(4, 8, "10-12"), "Вес одной гантели"),
      ex("Тяга каната к лицу в блоке (face pull)", n(3, 12, "12-15")),
      ex("Разгибания рук в блоке стоя", n(3, 20, "10-15")),
      ex("Гиперэкстензия", n(3, 0, "10-15")),
      ex("Колесо на пресс (с колен)", n(3, 0, "10-15")),
    ]},
    { id: uid(), name: "День 6", exercises: [
      ex("Приседания со штангой", [[20, "8-12"], ...n(3, 30, "8-12")]),
      ex("Тяга блока вертикальная", n(4, 60, "10-12"), "Вес проверь на лёгком: тренажёры разные"),
      ex("Тяга блока горизонтальная", n(3, 60, "8-12")),
      ex("Сгибания рук со штангой (Z-гриф)", [[5, "6-10"], [2.5, "6-10"], [5, "6-10"], [2.5, "6-10"]], "Вес — блины на гриф. 5 кг нижним хватом, 2,5 кг верхним"),
      ex("Скручивания на брусьях на пресс", n(3, 0, "8-12")),
    ]},
  ]};
}

function defaultLog() {
  const s = (k, w, r) => Array.from({ length: k }, () => ({ w, r }));
  return [{
    id: uid(), date: "2026-10-05", dayName: "Свободная", dayId: null, minutes: null, note: "",
    exercises: [
      { name: "Жим гантелей от груди на наклонной скамье (30°)", note: "Гантели по 8 кг", sets: s(4, 8, 12) },
      { name: "Сгибания рук в блоке с канатом", note: "На 30 кг шло тяжело, снизил до 15", sets: [...s(2, 30, 10), ...s(2, 15, 10)] },
      { name: "Гиперэкстензия", note: "Сильно жгло поясницу", sets: s(3, 0, 10) },
    ],
  }];
}

/* ---------- состояние ---------- */
let S;
function load() {
  try { const raw = localStorage.getItem(KEY); if (raw) return JSON.parse(raw); } catch (e) { }
  return null;
}
function save() {
  try { localStorage.setItem(KEY, JSON.stringify(S)); }
  catch (e) { toast("Не удалось сохранить: память браузера переполнена или недоступна"); }
}
S = load() || { program: defaultProgram(), log: defaultLog(), active: null, settings: { rest: 120 }, nextDayId: null };
S.settings ||= { rest: 120 };
save();
try { navigator.storage?.persist?.(); } catch (e) { }

let view = { tab: "today" };
const armed = new Map();

/* ---------- утилиты ---------- */
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const pad = x => String(x).padStart(2, "0");
const isoOf = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const parse = iso => new Date(iso + "T12:00:00");
const today = () => isoOf(new Date());
const fmtDate = iso => { const d = parse(iso); return `${WD[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]}`; };
const short = iso => { const d = parse(iso); return `${d.getDate()}.${pad(d.getMonth() + 1)}`; };
const fnum = v => v == null || v === "" ? "" : (Number.isInteger(v) ? String(v) : String(+(+v).toFixed(2)).replace(".", ","));
const toNum = v => { if (v == null) return null; const s = String(v).replace(",", ".").trim(); if (s === "") return null; const x = parseFloat(s); return isFinite(x) ? x : null; };
const kg = v => v >= 1000 ? fnum(Math.round(v / 100) / 10) + " т" : fnum(Math.round(v)) + " кг";
const e1rm = (w, r) => r <= 1 ? w : w * (1 + r / 30);
const firstInt = s => { const m = String(s ?? "").match(/\d+/); return m ? +m[0] : null; };
const plural = (x, a, b, c) => { const m = x % 10, h = x % 100; return m === 1 && h !== 11 ? a : m >= 2 && m <= 4 && (h < 12 || h > 14) ? b : c; };
const keyOf = name => name.trim().toLowerCase().replace(/ё/g, "е");
const vol = w => w.exercises.reduce((s, e) => s + e.sets.reduce((t, x) => t + (x.w || 0) * (x.r || 0), 0), 0);
const setsN = w => w.exercises.reduce((s, e) => s + e.sets.length, 0);

function getPath(obj, path) { return path.split(".").reduce((o, k) => o?.[k], obj); }
function setPath(obj, path, val) { const ks = path.split("."); const last = ks.pop(); const o = ks.reduce((o, k) => o[k], obj); o[last] = val; }

let toastT;
function toast(msg) { const t = $("#toast"); t.textContent = msg; t.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => t.hidden = true, 2600); }

function confirmBtn(act, label, extra = "") {
  return `<button class="danger" data-act="${act}" data-confirm="1" data-label="${esc(label)}" ${extra}>${esc(label)}</button>`;
}

/* ---------- история упражнений ---------- */
function sessionsOf(name) {
  const k = keyOf(name), out = [];
  [...S.log].sort((a, b) => a.date.localeCompare(b.date)).forEach(w => {
    w.exercises.forEach(e => {
      if (keyOf(e.name) !== k || !e.sets.length) return;
      const ws = e.sets.filter(s => s.r > 0);
      if (!ws.length) return;
      const top = ws.reduce((a, b) => (b.w || 0) > (a.w || 0) || ((b.w || 0) === (a.w || 0) && b.r > a.r) ? b : a);
      out.push({ date: w.date, wid: w.id, sets: e.sets, top, v: Math.max(...ws.map(s => e1rm(s.w || 0, s.r))),
        vol: ws.reduce((t, s) => t + (s.w || 0) * s.r, 0), maxR: Math.max(...ws.map(s => s.r)) });
    });
  });
  return out;
}
const lastText = name => {
  const ss = sessionsOf(name); const l = ss.at(-1); if (!l) return "";
  return `Прошлый раз ${short(l.date)}: ` + l.sets.map(s => (s.w ? fnum(s.w) + "×" : "") + s.r).join(", ");
};

/* ---------- следующий день ---------- */
function nextDay() {
  const days = S.program.days; if (!days.length) return null;
  return days.find(d => d.id === S.nextDayId) || days[0];
}
function advanceFrom(dayId) {
  const days = S.program.days, i = days.findIndex(d => d.id === dayId);
  if (i >= 0) S.nextDayId = days[(i + 1) % days.length].id;
}

/* ---------- запуск тренировки ---------- */
function startWorkout(dayId) {
  const d = S.program.days.find(x => x.id === dayId);
  S.active = {
    id: uid(), date: today(), dayId: d ? d.id : null, dayName: d ? d.name : "Свободная", startedAt: Date.now(), note: "", editingId: null,
    exercises: d ? d.exercises.map(e => ({ name: e.name, note: "", hint: e.note || "", sets: e.sets.map(s => ({ w: s.w, r: null, t: s.r, done: false })) })) : [],
  };
  save(); requestWake(); render(); scrollTo(0, 0);
}

function editWorkout(id) {
  if (S.active) { toast("Сначала заверши текущую тренировку"); return; }
  const w = S.log.find(x => x.id === id); if (!w) return;
  S.active = { ...clone(w), editingId: w.id, startedAt: null,
    exercises: w.exercises.map(e => ({ name: e.name, note: e.note || "", hint: "", sets: e.sets.map(s => ({ w: s.w, r: s.r, t: "", done: true })) })) };
  save(); view = { tab: "today" }; render(); scrollTo(0, 0);
}

function finishWorkout() {
  const a = S.active;
  const exercises = a.exercises.map(e => ({ name: e.name.trim() || "Упражнение", note: e.note.trim(),
    sets: e.sets.filter(s => s.done && s.r > 0).map(s => ({ w: s.w ?? 0, r: s.r })) })).filter(e => e.sets.length);
  if (!exercises.length) { toast("Нет ни одного отмеченного подхода. Отметь подходы галочкой."); return; }
  const rec = { id: a.editingId || a.id, date: a.date, dayId: a.dayId, dayName: a.dayName, note: (a.note || "").trim(), exercises,
    minutes: a.startedAt ? Math.max(1, Math.round((Date.now() - a.startedAt) / 60000)) : (S.log.find(x => x.id === a.editingId)?.minutes ?? null) };
  if (a.editingId) { const i = S.log.findIndex(x => x.id === a.editingId); if (i >= 0) S.log[i] = rec; else S.log.push(rec); }
  else { S.log.push(rec); if (a.dayId) advanceFrom(a.dayId); }
  S.active = null; stopRest(); save(); releaseWake();
  toast(a.editingId ? "Изменения сохранены" : `Тренировка сохранена: ${setsN(rec)} ${plural(setsN(rec), "подход", "подхода", "подходов")}`);
  view = { tab: "history", open: rec.id }; render(); scrollTo(0, 0);
}

/* ---------- таймер отдыха ---------- */
let rest = null, restTick = null, audioCtx = null;
function ensureAudio() { try { audioCtx ||= new (window.AudioContext || window.webkitAudioContext)(); if (audioCtx.state === "suspended") audioCtx.resume(); } catch (e) { } }
function beep() {
  try { if (!audioCtx) return; [0, .25, .5].forEach(t => { const o = audioCtx.createOscillator(), g = audioCtx.createGain(); o.frequency.value = 880; o.connect(g); g.connect(audioCtx.destination); g.gain.setValueAtTime(.0001, audioCtx.currentTime + t); g.gain.exponentialRampToValueAtTime(.3, audioCtx.currentTime + t + .02); g.gain.exponentialRampToValueAtTime(.0001, audioCtx.currentTime + t + .18); o.start(audioCtx.currentTime + t); o.stop(audioCtx.currentTime + t + .2); }); } catch (e) { }
  try { navigator.vibrate?.([200, 100, 200]); } catch (e) { }
}
function startRest(sec = S.settings.rest) { rest = { end: Date.now() + sec * 1000, beeped: false }; clearInterval(restTick); restTick = setInterval(drawRest, 250); drawRest(); }
function stopRest() { rest = null; clearInterval(restTick); $("#rest").hidden = true; }
function drawRest() {
  const el = $("#rest"); if (!rest) { el.hidden = true; return; }
  const left = Math.round((rest.end - Date.now()) / 1000), over = left <= 0;
  if (over && !rest.beeped) { rest.beeped = true; beep(); }
  if (left < -60) { stopRest(); return; }
  const a = Math.abs(left), t = `${Math.floor(a / 60)}:${pad(a % 60)}`;
  el.hidden = false; el.classList.toggle("over", over);
  el.innerHTML = `<div class="in"><div class="t">${over ? "+" + t : t}<small>${over ? "пора работать" : "отдых"}</small></div>
    <button data-act="rest-add">+30 с</button><button data-act="rest-stop">Стоп</button></div>`;
}

/* ---------- экран не гаснет во время тренировки ---------- */
let wake = null;
async function requestWake() { try { if (S.active && "wakeLock" in navigator && !wake) { wake = await navigator.wakeLock.request("screen"); wake.addEventListener("release", () => wake = null); } } catch (e) { } }
function releaseWake() { try { wake?.release(); } catch (e) { } wake = null; }
document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible") { requestWake(); drawRest(); } });

/* ---------- графики ---------- */
function niceStep(range, ticks = 4) { const raw = range / ticks || 1, p = 10 ** Math.floor(Math.log10(raw)), f = raw / p; return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10) * p; }
function spark(vals) {
  if (vals.length < 2) return "";
  const W = 600, H = 30, p = 3, mn = Math.min(...vals), mx = Math.max(...vals), sp = mx - mn || 1;
  const pts = vals.map((v, i) => [p + i * (W - 2 * p) / (vals.length - 1), H - p - (v - mn) / sp * (H - 2 * p)]);
  const d = pts.map((q, i) => (i ? "L" : "M") + q[0].toFixed(1) + " " + q[1].toFixed(1)).join(" ");
  return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" aria-hidden="true"><path d="${d} L${pts.at(-1)[0]} ${H} L${pts[0][0]} ${H}Z" fill="var(--accent-soft)"/><path d="${d}" fill="none" stroke="var(--accent)" stroke-width="2" vector-effect="non-scaling-stroke"/></svg>`;
}
function lineChart(pts, label) { // pts: [{x:iso, y}]
  const W = 600, H = 170, L = 40, R = 14, T = 12, B = 22;
  const ys = pts.map(p => p.y), lo = Math.min(...ys), hi = Math.max(...ys), padY = Math.max((hi - lo) * .15, 2.5);
  const y0 = Math.max(0, lo - padY), y1 = hi + padY, st = niceStep(y1 - y0, 3);
  const X = i => pts.length < 2 ? (L + W - R) / 2 : L + i * (W - L - R) / (pts.length - 1), Y = v => T + (H - T - B) * (1 - (v - y0) / (y1 - y0));
  let s = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(label)}">`;
  for (let v = Math.ceil(y0 / st) * st; v <= y1 + 1e-9; v += st) s += `<line x1="${L}" x2="${W - R}" y1="${Y(v)}" y2="${Y(v)}" stroke="var(--line)"/><text x="${L - 6}" y="${Y(v) + 4}" text-anchor="end">${fnum(+v.toFixed(2))}</text>`;
  if (pts.length > 1) s += `<path d="${pts.map((p, i) => (i ? "L" : "M") + X(i) + " " + Y(p.y)).join(" ")}" fill="none" stroke="var(--accent)" stroke-width="2.5" stroke-linejoin="round"/>`;
  pts.forEach((p, i) => s += `<circle cx="${X(i)}" cy="${Y(p.y)}" r="${i === pts.length - 1 ? 5 : 3.5}" fill="var(--accent)"/>`);
  [...new Set([0, pts.length - 1])].forEach(i => s += `<text x="${X(i)}" y="${H - 5}" text-anchor="${pts.length < 2 ? "middle" : i ? "end" : "start"}">${short(pts[i].x)}</text>`);
  return s + "</svg>";
}
function weeksChart() {
  const N = 10, mon = d => { const x = new Date(d); x.setHours(12, 0, 0, 0); x.setDate(x.getDate() - (x.getDay() + 6) % 7); return x; };
  const start = mon(new Date()); start.setDate(start.getDate() - 7 * (N - 1));
  const wk = Array.from({ length: N }, (_, i) => { const d = new Date(start); d.setDate(d.getDate() + 7 * i); return { d, n: 0 }; });
  S.log.forEach(w => { const i = Math.round((mon(parse(w.date)) - start) / DAY / 7); if (i >= 0 && i < N) wk[i].n++; });
  const top = Math.max(3, ...wk.map(w => w.n)), W = 600, H = 120, L = 24, B = 20, T = 8, cw = (W - L) / N, Y = v => T + (H - T - B) * (1 - v / top);
  let s = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Тренировок в неделю">`;
  for (let v = 0; v <= top; v++) s += `<line x1="${L}" x2="${W}" y1="${Y(v)}" y2="${Y(v)}" stroke="var(--line)"/><text x="${L - 6}" y="${Y(v) + 4}" text-anchor="end">${v}</text>`;
  wk.forEach((w, i) => {
    const x = L + i * cw + cw * .2, bw = cw * .6, last = i === N - 1;
    if (w.n) s += `<rect x="${x}" y="${Y(w.n)}" width="${bw}" height="${Y(0) - Y(w.n)}" rx="3" fill="${last ? "var(--accent)" : "color-mix(in srgb,var(--accent) 55%,var(--surface))"}"/>`;
    if (i % 3 === 0 || last) s += `<text x="${x + bw / 2}" y="${H - 5}" text-anchor="middle">${last ? "эта" : `${w.d.getDate()}.${pad(w.d.getMonth() + 1)}`}</text>`;
  });
  return s + "</svg>";
}

/* ---------- экраны ---------- */
function render() {
  document.querySelectorAll("#tabs button").forEach(b => b.classList.toggle("on", b.dataset.v === view.tab));
  const m = $("#main");
  m.innerHTML = view.tab === "today" ? (S.active ? vSession() : vToday())
    : view.tab === "history" ? (view.open ? vWorkout(view.open) : vHistory())
    : view.tab === "progress" ? (view.ex ? vExercise(view.ex) : vProgress())
    : (view.day ? vDayEdit(view.day) : vProgram());
}

function vToday() {
  const d = nextDay();
  const last = [...S.log].sort((a, b) => b.date.localeCompare(a.date))[0];
  let h = `<div class="head"><h1>Тренировка</h1>${last ? `<span class="muted small">Последняя: ${fmtDate(last.date)}</span>` : ""}</div>`;
  if (d) {
    h += `<section class="hero"><div><div class="muted small">Следующая по программе</div><div class="day">${esc(d.name)}</div></div>
      <ul class="plan">${d.exercises.map(e => `<li><span>${esc(e.name)}</span><span>${e.sets.length}×${esc(e.sets.at(-1)?.r ?? "")}${e.sets.at(-1)?.w ? " · " + fnum(e.sets.at(-1).w) + " кг" : ""}</span></li>`).join("")}</ul>
      <button class="primary wide" data-act="start" data-id="${d.id}">Начать ${esc(d.name.toLowerCase())}</button></section>`;
  }
  h += `<section><h2>Другой день</h2><div class="chips">${S.program.days.filter(x => x !== d).map(x => `<button data-act="start" data-id="${x.id}">${esc(x.name)}</button>`).join("")}
    <button data-act="start" data-id="">Без программы</button></div></section>`;
  return h;
}

function vSession() {
  const a = S.active;
  const done = a.exercises.reduce((s, e) => s + e.sets.filter(x => x.done).length, 0), all = a.exercises.reduce((s, e) => s + e.sets.length, 0);
  const names = [...new Set([...S.program.days.flatMap(d => d.exercises.map(e => e.name)), ...S.log.flatMap(w => w.exercises.map(e => e.name))])];
  let h = `<div class="head"><div><div class="muted small">${a.editingId ? "Редактирование" : "Идёт тренировка"}</div><h1>${esc(a.dayName)}</h1></div>
    <span class="num muted">${done}/${all}</span></div>
    <label class="f">Дата<input type="date" value="${a.date}" data-bind="active.date" data-type="date" id="s-date"></label>`;
  h += a.exercises.map((e, ei) => {
    const complete = e.sets.length && e.sets.every(s => s.done);
    const lt = lastText(e.name);
    return `<section class="ex${complete ? " complete" : ""}" id="ex-${ei}">
      <div class="ex-top"><input class="ex-name" value="${esc(e.name)}" data-bind="active.exercises.${ei}.name" aria-label="Название" id="s-n-${ei}" style="border-color:transparent;background:transparent;padding:0;min-height:0;font-weight:650">
      ${e.hint || lt ? `<div class="ex-sub">${[esc(e.hint), esc(lt)].filter(Boolean).join("<br>")}</div>` : ""}</div>
      <div class="sets">${e.sets.map((s, si) => `<div class="set${s.done ? " done" : ""}">
        <span class="i">${si + 1}</span>
        <span class="unit" data-u="кг"><input inputmode="decimal" value="${fnum(s.w)}" placeholder="вес" data-bind="active.exercises.${ei}.sets.${si}.w" data-type="num" id="s-w-${ei}-${si}" aria-label="Вес, подход ${si + 1}"></span>
        <span class="x">×</span>
        <input inputmode="numeric" value="${fnum(s.r)}" placeholder="${esc(s.t || "повт.")}" data-bind="active.exercises.${ei}.sets.${si}.r" data-type="int" id="s-r-${ei}-${si}" aria-label="Повторы, подход ${si + 1}">
        <button class="check" data-act="done" data-e="${ei}" data-s="${si}" aria-label="Подход выполнен">✓</button></div>`).join("")}</div>
      <input placeholder="Заметка: как шло, самочувствие" value="${esc(e.note)}" data-bind="active.exercises.${ei}.note" id="s-note-${ei}">
      <div class="ex-actions"><button class="ghost" data-act="set-add" data-e="${ei}">+ подход</button>
        ${e.sets.length ? `<button class="ghost" data-act="set-del" data-e="${ei}">− подход</button>` : ""}
        ${ei > 0 ? `<button class="ghost" data-act="ex-up" data-e="${ei}" aria-label="Выше">↑</button>` : ""}
        ${confirmBtn("ex-del", "Убрать", `data-e="${ei}"`)}</div>
    </section>`;
  }).join("");
  h += `<section class="card"><h3>Добавить упражнение</h3>
    <div class="add-ex"><input list="exnames" id="newEx" placeholder="Название"><button data-act="ex-add">Добавить</button></div>
    <datalist id="exnames">${names.map(x => `<option value="${esc(x)}">`).join("")}</datalist></section>
    <label class="f">Заметка к тренировке<textarea data-bind="active.note" id="s-wnote" placeholder="Самочувствие, что поменять в следующий раз">${esc(a.note)}</textarea></label>
    <div class="bar-actions"><button class="primary" data-act="finish">${a.editingId ? "Сохранить изменения" : "Завершить и сохранить"}</button>
      ${confirmBtn("cancel", a.editingId ? "Отменить изменения" : "Удалить эту тренировку")}</div>`;
  return h;
}

function vHistory() {
  const L = [...S.log].sort((a, b) => b.date.localeCompare(a.date));
  if (!L.length) return `<h1>История</h1><div class="empty">Здесь появятся сохранённые тренировки.</div>`;
  let h = `<h1>История</h1>`, cur = "";
  L.forEach(w => {
    const d = parse(w.date), m = `${MONTHS_FULL[d.getMonth()]} ${d.getFullYear()}`;
    if (m !== cur) { if (cur) h += `</div></section>`; cur = m; h += `<section><h2>${m}</h2><div class="stack">`; }
    const v = vol(w);
    h += `<article class="card tap" data-act="open-w" data-id="${w.id}"><div class="head"><h3>${fmtDate(w.date)}</h3><span class="muted small">${esc(w.dayName)}</span></div>
      <p class="muted small">${w.exercises.map(e => esc(e.name)).join(" · ")}</p>
      <p class="small num">${setsN(w)} подх.${v ? " · " + kg(v) : ""}${w.minutes ? " · " + w.minutes + " мин" : ""}</p></article>`;
  });
  return h + `</div></section>`;
}

function vWorkout(id) {
  const w = S.log.find(x => x.id === id); if (!w) { view = { tab: "history" }; return vHistory(); }
  const v = vol(w);
  return `<button class="ghost back" data-act="back">‹ История</button>
    <div class="head"><div><div class="muted small">${esc(w.dayName)}</div><h1>${fmtDate(w.date)}</h1></div></div>
    <div class="tiles"><div class="tile"><b>${setsN(w)}</b><span>подходов</span></div><div class="tile"><b>${v ? kg(v) : "—"}</b><span>тоннаж</span></div><div class="tile"><b>${w.minutes ?? "—"}</b><span>минут</span></div></div>
    <section class="card"><div class="wlines">${w.exercises.map(e => `<div class="wl"><span>${esc(e.name)}</span><span class="s">${e.sets.map(s => (s.w ? fnum(s.w) + "×" : "") + s.r).join(" · ")}</span>${e.note ? `<span class="n">${esc(e.note)}</span>` : ""}</div>`).join("")}</div>
    ${w.note ? `<p class="muted small"><i>${esc(w.note)}</i></p>` : ""}</section>
    <div class="bar-actions"><button data-act="edit-w" data-id="${w.id}">Изменить</button>${confirmBtn("del-w", "Удалить тренировку", `data-id="${w.id}"`)}</div>`;
}

function vProgress() {
  const now = Date.now(), ago = iso => (now - parse(iso)) / DAY;
  const wkVol = S.log.filter(w => ago(w.date) < 7).reduce((s, w) => s + vol(w), 0);
  const map = new Map();
  S.log.forEach(w => w.exercises.forEach(e => { const k = keyOf(e.name); if (!map.has(k)) map.set(k, e.name); }));
  const exs = [...map.values()].map(name => ({ name, ss: sessionsOf(name) })).filter(x => x.ss.length)
    .sort((a, b) => b.ss.at(-1).date.localeCompare(a.ss.at(-1).date));
  let h = `<h1>Прогресс</h1>
    <div class="tiles"><div class="tile"><b>${S.log.length}</b><span>всего тренировок</span></div>
    <div class="tile"><b>${S.log.filter(w => ago(w.date) <= 30).length}</b><span>за 30 дней</span></div>
    <div class="tile"><b>${kg(wkVol)}</b><span>тоннаж за 7 дней</span></div></div>
    <section><h2>Тренировок в неделю</h2><div class="card chart">${weeksChart()}</div></section>`;
  if (!exs.length) return h + `<div class="empty">Графики по упражнениям появятся после первой тренировки.</div>`;
  h += `<section><h2>Упражнения</h2><div class="list">${exs.map(x => {
    const l = x.ss.at(-1);
    return `<div class="li" data-act="open-ex" data-name="${esc(x.name)}"><div><div>${esc(x.name)}</div><div class="muted small">${x.ss.length} трен. · ${short(l.date)}</div></div>
      <div class="r">${l.top.w ? fnum(l.top.w) + "<span class='muted small'> кг × </span>" : ""}${l.top.r}</div>${spark(x.ss.map(s => s.top.w ? s.v : s.maxR))}</div>`;
  }).join("")}</div></section>`;
  return h;
}

function vExercise(name) {
  const ss = sessionsOf(name); if (!ss.length) { view = { tab: "progress" }; return vProgress(); }
  const weighted = ss.some(s => s.top.w > 0);
  const best = (f) => ss.reduce((a, s) => f(s) > f(a) ? s : a);
  const mW = best(s => s.top.w || 0), m1 = best(s => s.v), mR = best(s => s.maxR), mV = best(s => s.vol);
  return `<button class="ghost back" data-act="back">‹ Прогресс</button><h1>${esc(name)}</h1>
    <div class="prs">${weighted ? `<div class="pr"><b>${fnum(mW.top.w)} кг × ${mW.top.r}</b><span>макс. вес · ${short(mW.date)}</span></div>
      <div class="pr"><b>${fnum(Math.round(m1.v * 10) / 10)} кг</b><span>расчётный 1ПМ · ${short(m1.date)}</span></div>` : ""}
      <div class="pr"><b>${mR.maxR}</b><span>макс. повторов · ${short(mR.date)}</span></div>
      ${weighted ? `<div class="pr"><b>${kg(mV.vol)}</b><span>лучший тоннаж · ${short(mV.date)}</span></div>` : `<div class="pr"><b>${ss.length}</b><span>тренировок</span></div>`}</div>
    <section><h2>${weighted ? "Рабочий вес" : "Повторы в лучшем подходе"}</h2><div class="card chart">${lineChart(ss.map(s => ({ x: s.date, y: weighted ? s.top.w : s.maxR })), name)}</div></section>
    <section><h2>Все подходы</h2><div class="card"><div class="wlines">${[...ss].reverse().map(s => `<div class="wl"><span>${fmtDate(s.date)}</span><span class="s">${s.sets.map(x => (x.w ? fnum(x.w) + "×" : "") + x.r).join(" · ")}</span></div>`).join("")}</div></div></section>`;
}

function vProgram() {
  const nd = nextDay();
  return `<h1>Программа</h1>
    <section class="stack">${S.program.days.map(d => `<article class="card tap" data-act="open-day" data-id="${d.id}">
      <div class="head"><h3>${esc(d.name)}</h3>${d === nd ? `<span class="small" style="color:var(--accent)">следующий</span>` : ""}</div>
      <p class="muted small">${d.exercises.map(e => esc(e.name)).join(" · ") || "Пусто"}</p></article>`).join("")}
      <button data-act="day-add">+ Добавить день</button></section>
    <section class="card"><h3>Настройки</h3>
      <label class="f">Таймер отдыха по умолчанию<select id="restSel" data-act-change="rest">${[60, 90, 120, 150, 180, 240].map(x => `<option value="${x}"${x === S.settings.rest ? " selected" : ""}>${Math.floor(x / 60)}:${pad(x % 60)}</option>`).join("")}</select></label>
      <label class="f">Следующий день по программе<select id="nextSel" data-act-change="next">${S.program.days.map(d => `<option value="${d.id}"${d === nd ? " selected" : ""}>${esc(d.name)}</option>`).join("")}</select></label>
    </section>
    <section class="card"><h3>Данные</h3>
      <p class="muted small">Всё хранится только на этом телефоне. Делай резервную копию раз в пару недель.</p>
      <button data-act="export">Сохранить резервную копию</button>
      <button data-act="import">Восстановить из копии</button>
      <button data-act="claude">Скопировать тренировки для Claude</button>
      ${confirmBtn("reset-prog", "Вернуть исходную программу")}
    </section>`;
}

function vDayEdit(id) {
  const di = S.program.days.findIndex(d => d.id === id); if (di < 0) { view = { tab: "program" }; return vProgram(); }
  const d = S.program.days[di];
  return `<button class="ghost back" data-act="back">‹ Программа</button>
    <label class="f">Название дня<input value="${esc(d.name)}" data-bind="program.days.${di}.name" data-rerender-tabs id="d-name"></label>
    ${d.exercises.map((e, ei) => `<section class="pex">
      <label class="f">Упражнение<input value="${esc(e.name)}" data-bind="program.days.${di}.exercises.${ei}.name" id="p-n-${ei}"></label>
      <label class="f">Подсказка<input value="${esc(e.note)}" placeholder="Техника, хват, вес одной гантели…" data-bind="program.days.${di}.exercises.${ei}.note" id="p-note-${ei}"></label>
      <div class="phead"><span>#</span><span>Вес, кг</span><span>Повторы</span><span></span></div>
      ${e.sets.map((s, si) => `<div class="pset"><span class="i">${si + 1}</span>
        <input inputmode="decimal" value="${fnum(s.w)}" placeholder="—" data-bind="program.days.${di}.exercises.${ei}.sets.${si}.w" data-type="num" id="p-w-${ei}-${si}" aria-label="Вес">
        <input value="${esc(s.r)}" placeholder="8-12" data-bind="program.days.${di}.exercises.${ei}.sets.${si}.r" id="p-r-${ei}-${si}" aria-label="Повторы">
        <button data-act="pset-del" data-e="${ei}" data-s="${si}" aria-label="Удалить подход">✕</button></div>`).join("")}
      <div class="ex-actions"><button class="ghost" data-act="pset-add" data-e="${ei}">+ подход</button>
        ${ei > 0 ? `<button class="ghost" data-act="pex-up" data-e="${ei}">↑ выше</button>` : ""}
        ${ei < d.exercises.length - 1 ? `<button class="ghost" data-act="pex-down" data-e="${ei}">↓ ниже</button>` : ""}
        ${confirmBtn("pex-del", "Удалить", `data-e="${ei}"`)}</div></section>`).join("")}
    <button data-act="pex-add">+ Добавить упражнение</button>
    <div class="bar-actions">${confirmBtn("day-del", "Удалить день")}</div>`;
}

/* ---------- ввод ---------- */
document.addEventListener("input", e => {
  const el = e.target, path = el.dataset.bind; if (!path) return;
  let v = el.value;
  if (el.dataset.type === "num") v = toNum(v);
  else if (el.dataset.type === "int") { const x = toNum(v); v = x == null ? null : Math.round(x); }
  else if (el.dataset.type === "date") { if (!v) return; }
  setPath(S, path, v); save();
});
document.addEventListener("change", e => {
  const el = e.target;
  if (el.id === "restSel") { S.settings.rest = +el.value; save(); toast("Таймер отдыха: " + el.selectedOptions[0].text); }
  if (el.id === "nextSel") { S.nextDayId = el.value; save(); toast("Следующий: " + el.selectedOptions[0].text); }
  if (el.id === "importFile") importFile(el.files[0]);
});

document.addEventListener("click", e => {
  ensureAudio();
  const b = e.target.closest("[data-act]"); if (!b) return;
  const act = b.dataset.act;
  if (b.dataset.confirm) {
    if (!armed.get(b.dataset.act + (b.dataset.e || b.dataset.id || ""))) {
      const k = b.dataset.act + (b.dataset.e || b.dataset.id || "");
      armed.set(k, true); b.classList.add("armed"); b.textContent = "Точно? Нажми ещё раз";
      setTimeout(() => { armed.delete(k); if (b.isConnected) { b.classList.remove("armed"); b.textContent = b.dataset.label; } }, 3000);
      return;
    }
    armed.clear();
  }
  const ei = +b.dataset.e, si = +b.dataset.s, a = S.active;
  const day = view.day && S.program.days.find(d => d.id === view.day);
  switch (act) {
    case "tab": view = { tab: b.dataset.v }; render(); scrollTo(0, 0); break;
    case "back": view = { tab: view.tab }; render(); scrollTo(0, 0); break;
    case "start": startWorkout(b.dataset.id); break;
    case "done": {
      const s = a.exercises[ei].sets[si];
      if (!s.done && !(s.r > 0)) {
        const t = firstInt(s.t);
        if (t && !/макс/i.test(s.t)) s.r = t; else { const inp = $(`#s-r-${ei}-${si}`); inp.focus(); toast("Впиши, сколько повторов сделал"); return; }
      }
      s.done = !s.done; save();
      if (s.done) startRest();
      const y = scrollY; render(); scrollTo(0, y);
      break;
    }
    case "set-add": { const ss = a.exercises[ei].sets, l = ss.at(-1); ss.push({ w: l?.w ?? null, r: null, t: l?.t || "", done: false }); save(); const y = scrollY; render(); scrollTo(0, y); break; }
    case "set-del": { a.exercises[ei].sets.pop(); save(); const y = scrollY; render(); scrollTo(0, y); break; }
    case "ex-up": { const x = a.exercises; [x[ei - 1], x[ei]] = [x[ei], x[ei - 1]]; save(); render(); break; }
    case "ex-del": { a.exercises.splice(ei, 1); save(); const y = scrollY; render(); scrollTo(0, y); break; }
    case "ex-add": {
      const name = $("#newEx").value.trim(); if (!name) { $("#newEx").focus(); return; }
      const ss = sessionsOf(name).at(-1);
      a.exercises.push({ name, note: "", hint: "", sets: (ss ? ss.sets : [{ w: null }, { w: null }, { w: null }]).map(s => ({ w: s.w ?? null, r: null, t: s.r ? String(s.r) : "", done: false })) });
      save(); render(); $(`#ex-${a.exercises.length - 1}`)?.scrollIntoView({ block: "center" }); break;
    }
    case "finish": finishWorkout(); break;
    case "cancel": S.active = null; stopRest(); releaseWake(); save(); render(); toast("Тренировка не сохранена"); break;
    case "rest-add": if (rest) { rest.end = Math.max(rest.end, Date.now()) + 30000; rest.beeped = false; drawRest(); } break;
    case "rest-stop": stopRest(); break;
    case "open-w": view = { tab: "history", open: b.dataset.id }; render(); scrollTo(0, 0); break;
    case "edit-w": editWorkout(b.dataset.id); break;
    case "del-w": S.log = S.log.filter(w => w.id !== b.dataset.id); save(); view = { tab: "history" }; render(); toast("Тренировка удалена"); break;
    case "open-ex": view = { tab: "progress", ex: b.dataset.name }; render(); scrollTo(0, 0); break;
    case "open-day": view = { tab: "program", day: b.dataset.id }; render(); scrollTo(0, 0); break;
    case "day-add": { const d = { id: uid(), name: `День ${S.program.days.length + 1}`, exercises: [] }; S.program.days.push(d); save(); view = { tab: "program", day: d.id }; render(); break; }
    case "day-del": S.program.days = S.program.days.filter(d => d.id !== view.day); if (S.nextDayId === view.day) S.nextDayId = null; save(); view = { tab: "program" }; render(); toast("День удалён"); break;
    case "pset-add": { const ss = day.exercises[ei].sets, l = ss.at(-1); ss.push({ w: l?.w ?? null, r: l?.r ?? "8-12" }); save(); const y = scrollY; render(); scrollTo(0, y); break; }
    case "pset-del": day.exercises[ei].sets.splice(si, 1); save(); { const y = scrollY; render(); scrollTo(0, y); } break;
    case "pex-up": case "pex-down": { const x = day.exercises, j = act === "pex-up" ? ei - 1 : ei + 1; [x[j], x[ei]] = [x[ei], x[j]]; save(); const y = scrollY; render(); scrollTo(0, y); break; }
    case "pex-del": day.exercises.splice(ei, 1); save(); { const y = scrollY; render(); scrollTo(0, y); } break;
    case "pex-add": { day.exercises.push({ id: uid(), name: "", note: "", sets: [{ w: null, r: "10-12" }, { w: null, r: "10-12" }, { w: null, r: "10-12" }] }); save(); render(); const i = day.exercises.length - 1; const el = $(`#p-n-${i}`); el?.scrollIntoView({ block: "center" }); el?.focus(); break; }
    case "export": exportData(); break;
    case "import": $("#importFile").value = ""; $("#importFile").click(); break;
    case "claude": copyForClaude(); break;
    case "reset-prog": S.program = defaultProgram(); S.nextDayId = null; save(); render(); toast("Программа сброшена к исходной"); break;
    case "import-ok": if (pendingImport) { S = pendingImport; S.active = null; pendingImport = null; save(); view = { tab: "history" }; render(); toast("Данные восстановлены"); } break;
  }
});

/* ---------- резервная копия ---------- */
async function exportData() {
  const data = JSON.stringify({ app: "gymlog", version: 1, exportedAt: new Date().toISOString(), program: S.program, log: S.log, settings: S.settings, nextDayId: S.nextDayId }, null, 1);
  const name = `trenirovki-${today()}.json`;
  const file = new File([data], name, { type: "application/json" });
  try {
    if (navigator.canShare?.({ files: [file] })) { await navigator.share({ files: [file], title: "Резервная копия тренировок" }); return; }
  } catch (e) { if (e.name === "AbortError") return; }
  const url = URL.createObjectURL(file), a = document.createElement("a");
  a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
  toast("Файл сохранён");
}
let pendingImport = null;
async function importFile(f) {
  if (!f) return;
  try {
    const d = JSON.parse(await f.text());
    if (!d || d.app !== "gymlog" || !d.program?.days || !Array.isArray(d.log)) throw new Error();
    pendingImport = { program: d.program, log: d.log, settings: d.settings || { rest: 120 }, nextDayId: d.nextDayId || null, active: null };
    $("#main").insertAdjacentHTML("afterbegin", `<div class="card" style="border-color:var(--warn)"><h3>Заменить данные?</h3>
      <p class="small">В копии ${d.log.length} ${plural(d.log.length, "тренировка", "тренировки", "тренировок")} и ${d.program.days.length} дн. программы. Текущие данные на телефоне будут заменены.</p>
      <div class="row"><button class="primary" data-act="import-ok">Заменить</button><button data-act="tab" data-v="program">Отмена</button></div></div>`);
    scrollTo(0, 0);
  } catch (e) { toast("Это не файл резервной копии этого приложения"); }
}
async function copyForClaude() {
  const L = [...S.log].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 10).reverse();
  const txt = "Запиши в дневник тренировок:\n" + L.map(w => `${w.date} (${w.dayName}): ` + w.exercises.map(e => `${e.name} ${e.sets.map(s => (s.w ? fnum(s.w) + "×" : "") + s.r).join(", ")}${e.note ? ` [${e.note}]` : ""}`).join("; ") + (w.note ? `. ${w.note}` : "")).join("\n");
  try { await navigator.clipboard.writeText(txt); toast("Скопировано. Вставь в чат с Claude"); }
  catch (e) {
    $("#main").insertAdjacentHTML("afterbegin", `<div class="card"><h3>Скопируй текст</h3><textarea readonly style="min-height:160px">${esc(txt)}</textarea></div>`);
    scrollTo(0, 0); $("#main textarea").select();
  }
}

/* ---------- старт ---------- */
if (S.active) { requestWake(); }
render();
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => { }));
}
