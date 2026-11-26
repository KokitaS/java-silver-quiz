// Java Silver 解答ページの画面。ロジックは app.js。
"use strict";

const STORE_KEY = "java-silver-quiz.v1";
const app = document.getElementById("app");
let bank = null;
let data = loadData();
let view = null; // 進行中の画面の状態

function loadData() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    return raw ? Object.assign(emptyData(), JSON.parse(raw)) : emptyData();
  } catch (e) {
    return emptyData();
  }
}

function saveData() {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(data));
  } catch (e) {
    /* 保存できない環境でも解くことはできる */
  }
}

function el(tag, attrs, ...children) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (k === "class") node.className = v;
    else if (k.startsWith("on")) node.addEventListener(k.slice(2), v);
    else node.setAttribute(k, v);
  }
  for (const c of children.flat()) node.append(c instanceof Node ? c : document.createTextNode(c));
  return node;
}

let timer = null; // モックの残り時間を1秒ごとに更新する

function show(...nodes) {
  clearInterval(timer);
  app.replaceChildren(...nodes);
  window.scrollTo(0, 0);
}

const today = () => dateKey(new Date());
const fmtMin = (sec) => `${Math.floor(sec / 60)}分${String(Math.round(sec % 60)).padStart(2, "0")}秒`;

function home() {
  const t = today();
  const day = data.days[t] || { n: 0, right: 0, sec: 0 };
  const week = weekMinutes(data, t);
  const answered = Object.keys(data.answers).length;
  const due = bank.questions.filter((q) => data.answers[q.id] && data.answers[q.id].due && data.answers[q.id].due <= t).length;
  const lastMock = data.mocks[data.mocks.length - 1];
  show(
    el("h1", {}, "Java Silver"),
    el("div", { class: "cards" },
      el("div", { class: "card" }, el("div", { class: "num" }, String(streak(data, t))), el("div", { class: "label" }, "連続日数")),
      el("div", { class: "card" }, el("div", { class: "num" }, `${day.n}`), el("div", { class: "label" }, "今日の問題数")),
      el("div", { class: "card" }, el("div", { class: "num" }, `${answered}`), el("div", { class: "label" }, `解いた / ${bank.questions.length}`))),
    el("div", { class: "weekbox" },
      el("div", { class: "weektext" }, `今週 ${week}分 / 目標 ${WEEK_GOAL_MIN}分`),
      el("div", { class: "bar" }, el("div", { class: "fill", style: `width:${Math.min(100, (week / WEEK_GOAL_MIN) * 100)}%` }))),
    el("h2", {}, "今日はどれにする？"),
    ...Object.entries(MODES).map(([key, m]) =>
      el("button", { class: "mode", onclick: () => startSession(key) }, el("span", { class: "modename" }, m.label), el("span", { class: "modesub" }, m.sub))),
    due > 0 ? el("p", { class: "note" }, `復習の期限が来た問題が ${due} 問あります（出題に混ざります）`) : "",
    el("h2", {}, "本番形式"),
    el("button", { class: "mode alt", onclick: startMock }, el("span", { class: "modename" }, "モック"), el("span", { class: "modesub" }, `${MOCK_N}問・${MOCK_MINUTES}分`)),
    lastMock ? el("p", { class: "note" }, `前回 ${lastMock.date}: ${lastMock.correct}/${lastMock.total}（${Math.round((lastMock.correct / lastMock.total) * 100)}%）`) : "",
    el("p", { class: "note" }, "合格の目安: モックで全体80%以上・全カテゴリ70%以上を2回続けて"),
    el("h2", {}, "教材"),
    el("a", { class: "mode", href: `https://github.com/${REPO}/blob/main/textbook/README.md`, target: "_blank", rel: "noopener" }, el("span", { class: "modename" }, "教材を読む"), el("span", { class: "modesub" }, "24単元")),
    el("div", { class: "links" },
      el("button", { class: "link", onclick: stats }, "分野ごとの正答率"),
      el("button", { class: "link", onclick: backup }, "記録のバックアップ")));
}

function startSession(modeKey) {
  view = { mode: modeKey, used: new Set(), count: 0, lastKind: null, startedSec: data.days[today()] ? data.days[today()].sec : 0, sessionSec: 0 };
  nextQuestion();
}

function sessionDone() {
  const m = MODES[view.mode];
  return m.questions ? view.count >= m.questions : view.sessionSec >= m.minutes * 60;
}

function nextQuestion() {
  if (sessionDone() && !view.extended) return finish();
  const picked = pickNext(data, bank, today(), view);
  if (!picked) return finish();
  const q = shuffleOptions(picked);
  view.used.add(q.id);
  view.current = q;
  view.shownAt = Date.now();
  renderQuestion(q);
}

function progressText(n) {
  const m = MODES[view.mode];
  return m.questions ? `${n} / ${m.questions}` : `${Math.floor(view.sessionSec / 60)}分 / ${m.minutes}分（${n}問目）`;
}

function questionBlock(q, label) {
  return [
    el("div", { class: "meta" }, el("span", {}, label), el("span", { class: "tag" }, q.topic)),
    el("p", { class: "question" }, q.question),
    q.code ? el("pre", {}, el("code", {}, q.code)) : "",
  ];
}

function renderQuestion(q) {
  const buttons = q.options.map((opt, i) => el("button", { class: "option", onclick: () => answer(i + 1) }, el("span", { class: "no" }, String(i + 1)), el("span", { class: "text" }, opt)));
  show(
    el("div", { class: "topbar" }, el("button", { class: "link", onclick: quit }, "やめる"), el("span", {}, progressText(view.count + 1))),
    ...questionBlock(q, q.kind === "deep" ? "じっくり" : "サクッと"),
    el("div", { class: "options" }, ...buttons));
}

function answer(choice) {
  const q = view.current;
  const seconds = (Date.now() - view.shownAt) / 1000;
  const correct = choice === q.answer;
  recordAnswer(data, q, correct, today(), seconds);
  saveData();
  view.count += 1;
  view.sessionSec += Math.min(seconds, 300);
  view.lastKind = q.kind;
  const file = (bank.topics.find((t) => t.topic === q.topic) || {}).file;
  const buttons = q.options.map((opt, i) => {
    const n = i + 1;
    const cls = n === q.answer ? "option right" : n === choice ? "option wrong" : "option dim";
    return el("div", { class: cls }, el("span", { class: "no" }, String(n)), el("span", { class: "text" }, opt));
  });
  show(
    el("div", { class: "topbar" }, el("button", { class: "link", onclick: quit }, "やめる"), el("span", {}, progressText(view.count))),
    el("div", { class: correct ? "result ok" : "result ng" }, correct ? "正解" : `不正解（正解は ${q.answer}）`),
    ...questionBlock(q, ""),
    el("div", { class: "options" }, ...buttons),
    el("div", { class: "explain" }, q.explanation),
    file ? el("a", { class: "textbook", href: `https://github.com/${REPO}/blob/main/textbook/${file}`, target: "_blank", rel: "noopener" }, "教材を読む") : "",
    el("button", { class: "primary", onclick: nextQuestion }, "次へ"));
}

function finish() {
  const t = today();
  const day = data.days[t] || { n: 0, right: 0, sec: 0 };
  const m = MODES[view.mode];
  show(
    el("h1", {}, "今日は完了"),
    el("p", { class: "big" }, `${view.count}問 / ${fmtMin(view.sessionSec)}`),
    el("p", { class: "note" }, `今日の合計 ${day.n}問・正解 ${day.right}問。連続 ${streak(data, t)} 日。`),
    el("button", { class: "primary", onclick: () => { view.extended = true; nextQuestion(); } }, "もう少し続ける"),
    el("button", { class: "secondary", onclick: home }, "ホームへ"));
}

function quit() {
  home();
}

function stats() {
  const s = topicAccuracy(data, bank);
  const rows = bank.topics.map((t) => {
    const x = s[t.topic];
    const total = x ? x.right + x.wrong : 0;
    const pct = total ? Math.round((x.right / total) * 100) : null;
    return el("div", { class: "row" },
      el("div", { class: "rowtop" }, el("span", {}, t.topic), el("span", {}, pct === null ? "-" : `${pct}%（${total}回）`)),
      el("div", { class: "bar" }, el("div", { class: pct !== null && pct < 70 ? "fill warn" : "fill", style: `width:${pct || 0}%` })));
  });
  show(el("div", { class: "topbar" }, el("button", { class: "link", onclick: home }, "戻る"), el("span", {}, "分野ごとの正答率")), ...rows);
}

function backup() {
  const area = el("textarea", { rows: "6", spellcheck: "false" });
  area.value = JSON.stringify(data);
  show(
    el("div", { class: "topbar" }, el("button", { class: "link", onclick: home }, "戻る"), el("span", {}, "記録のバックアップ")),
    el("p", { class: "note" }, "記録はこの端末のブラウザにだけ保存されています。機種変更やデータ削除の前に、下の文字列をコピーして保管してください。復元するときは、ここに貼り付けて「復元」を押します。"),
    area,
    el("button", { class: "secondary", onclick: () => { area.select(); document.execCommand("copy"); } }, "コピー"),
    el("button", { class: "primary", onclick: () => {
      try {
        const parsed = JSON.parse(area.value);
        if (!parsed || typeof parsed !== "object" || !parsed.days || !parsed.answers || !Array.isArray(parsed.mocks)) throw new Error("形式が違う");
        data = Object.assign(emptyData(), parsed);
        saveData();
        home();
      } catch (e) {
        alert("読み込めませんでした");
      }
    } }, "復元"));
}

// 本番形式モック（途中で答えは見せず、最後にまとめて採点する）
function startMock() {
  const questions = pickMock(bank).map((q) => shuffleOptions(q));
  view = { mock: true, questions, answers: [], index: 0, endAt: Date.now() + MOCK_MINUTES * 60 * 1000 };
  mockQuestion();
}

function mockQuestion() {
  const q = view.questions[view.index];
  const left = Math.max(0, Math.round((view.endAt - Date.now()) / 1000));
  if (left === 0) return mockFinish();
  const buttons = q.options.map((opt, i) => el("button", { class: "option", onclick: () => { view.answers[view.index] = i + 1; view.index += 1; view.index >= view.questions.length ? mockFinish() : mockQuestion(); } },
    el("span", { class: "no" }, String(i + 1)), el("span", { class: "text" }, opt)));
  const remain = el("span", {}, `残り ${fmtMin(left)}`);
  const quitMock = el("button", { class: "link", onclick: () => {
    if (quitMock.dataset.sure) return home();
    quitMock.dataset.sure = "1";
    quitMock.textContent = "本当に中断？（記録されません）もう一度押す";
  } }, "中断");
  show(
    el("div", { class: "topbar" }, quitMock, el("span", {}, `${view.index + 1} / ${view.questions.length}`), remain),
    ...questionBlock(q, ""),
    el("div", { class: "options" }, ...buttons),
    el("button", { class: "link", onclick: () => { view.index += 1; view.index >= view.questions.length ? mockFinish() : mockQuestion(); } }, "分からない（飛ばす）"));
  timer = setInterval(() => {
    const rest = Math.max(0, Math.round((view.endAt - Date.now()) / 1000));
    remain.textContent = `残り ${fmtMin(rest)}`;
    if (rest === 0) mockFinish();
  }, 1000);
}

function mockFinish() {
  const r = mockResult(bank, view.questions, view.answers);
  const t = today();
  data.mocks.push({ date: t, correct: r.correct, total: r.total });
  view.questions.forEach((q, i) => recordAnswer(data, q, view.answers[i] === q.answer, t, 60));
  saveData();
  const pct = Math.round((r.correct / r.total) * 100);
  const rows = Object.entries(r.byCat).map(([cat, c]) => {
    const p = Math.round((c.right / c.total) * 100);
    return el("div", { class: "row" }, el("div", { class: "rowtop" }, el("span", {}, cat), el("span", {}, `${c.right}/${c.total}（${p}%）`)), el("div", { class: "bar" }, el("div", { class: p < 70 ? "fill warn" : "fill", style: `width:${p}%` })));
  });
  show(
    el("h1", {}, "モック結果"),
    el("p", { class: "big" }, `${r.correct} / ${r.total}（${pct}%）`),
    el("p", { class: "note" }, pct >= 65 ? "本番の合格ライン(65%)は超えています。目安は80%以上です。" : "本番の合格ライン(65%)にはまだ届いていません。"),
    ...rows,
    el("button", { class: "primary", onclick: home }, "ホームへ"));
}

async function main() {
  try {
    const res = await fetch("bank.json", { cache: "no-cache" });
    bank = await res.json();
  } catch (e) {
    show(el("p", { class: "note" }, "問題を読み込めませんでした。通信できる場所で一度開いてください。"));
    return;
  }
  home();
}

if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(() => {});
main();
