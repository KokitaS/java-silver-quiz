// Java Silver 解答ページのロジック。出題の選び方・間隔反復・連続日数は、画面から切り離して node でも試せるようにしてある。
"use strict";

const REPO = "KokitaS/java-silver-quiz";
const REVIEW_INTERVALS = [1, 3, 7, 14];
const MIN_QUESTIONS = 5;          // この問題数に達した日は「やった日」
const WEEK_GOAL_MIN = 150;        // 週の目標（分）
const MOCK_N = 60;
const MOCK_MINUTES = 90;
const MODES = {
  min: { label: "最低ライン", sub: "5問", questions: MIN_QUESTIONS },
  std: { label: "標準", sub: "約30分", minutes: 30 },
  heavy: { label: "がっつり", sub: "約60分", minutes: 60 },
};

function dateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function addDays(key, days) {
  const [y, m, d] = key.split("-").map(Number);
  return dateKey(new Date(y, m - 1, d + days));
}

function emptyData() {
  return { answers: {}, days: {}, mocks: [] };
}

// answers[id] = { right, wrong, box, due }  box: 復習中の段階(null=復習なし)  due: 次に出す日
function recordAnswer(data, question, correct, today, seconds) {
  const a = data.answers[question.id] || (data.answers[question.id] = { right: 0, wrong: 0, box: null, due: null });
  if (correct) {
    a.right += 1;
    if (a.box !== null) {
      a.box += 1;
      if (a.box >= REVIEW_INTERVALS.length) {
        a.box = null;
        a.due = null;
      } else {
        a.due = addDays(today, REVIEW_INTERVALS[a.box]);
      }
    }
  } else {
    a.wrong += 1;
    a.box = 0;
    a.due = addDays(today, REVIEW_INTERVALS[0]);
  }
  const day = data.days[today] || (data.days[today] = { n: 0, right: 0, sec: 0 });
  day.n += 1;
  day.right += correct ? 1 : 0;
  day.sec += Math.min(seconds, 300);
}

function topicAccuracy(data, bank) {
  const stats = {};
  for (const q of bank.questions) {
    const a = data.answers[q.id];
    if (!a) continue;
    const s = stats[q.topic] || (stats[q.topic] = { right: 0, wrong: 0 });
    s.right += a.right;
    s.wrong += a.wrong;
  }
  return stats;
}

// 次に出す問題を選ぶ。期限が来た復習を3問に1問の割合で混ぜ、それ以外は未回答をレッスン順に出す。
// 全部解いたあとは、正答率の低いテーマから出す。
function pickNext(data, bank, today, session) {
  const used = session.used;
  const questions = bank.questions;
  const due = questions
    .filter((q) => !used.has(q.id) && data.answers[q.id] && data.answers[q.id].due && data.answers[q.id].due <= today)
    .sort((x, y) => data.answers[x.id].due.localeCompare(data.answers[y.id].due));
  const fresh = questions.filter((q) => !used.has(q.id) && !data.answers[q.id]);
  const preferShort = session.mode === "min";
  const wantReview = due.length > 0 && (session.count % 3 === 2 || fresh.length === 0);
  if (wantReview) return due[0];
  if (fresh.length > 0) {
    const wantKind = preferShort ? "phone" : session.lastKind === "deep" ? "phone" : null;
    return (wantKind && fresh.find((q) => q.kind === wantKind)) || fresh[0];
  }
  const stats = topicAccuracy(data, bank);
  const weight = (q) => {
    const s = stats[q.topic] || { right: 0, wrong: 0 };
    return (s.wrong + 1) / (s.right + s.wrong + 2);
  };
  const pool = questions.filter((q) => !used.has(q.id));
  if (pool.length === 0) return null;
  pool.sort((x, y) => weight(y) - weight(x));
  return pool[Math.floor(Math.random() * Math.min(pool.length, 20))];
}

function dayDone(data, key) {
  const d = data.days[key];
  return !!d && d.n >= MIN_QUESTIONS;
}

// 連続日数。1日だけ休んでも途切れず、2日続けて休むと途切れる。
function streak(data, today) {
  let count = 0;
  let missed = 0;
  let key = dayDone(data, today) ? today : addDays(today, -1);
  for (let i = 0; i < 400; i++) {
    if (dayDone(data, key)) {
      count += 1;
      missed = 0;
    } else {
      missed += 1;
      if (missed >= 2) break;
    }
    key = addDays(key, -1);
  }
  return count;
}

function weekStart(key) {
  const [y, m, d] = key.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  const offset = (date.getDay() + 6) % 7; // 月曜始まり
  return addDays(key, -offset);
}

function weekMinutes(data, today) {
  const start = weekStart(today);
  let sec = 0;
  for (let i = 0; i < 7; i++) sec += (data.days[addDays(start, i)] || { sec: 0 }).sec;
  return Math.round(sec / 60);
}

// 本番形式のモック: 全カテゴリからまんべんなく60問。
// 解説や選択肢が番号・並び順を指している問題は、並びを変えると解説が合わなくなるので固定する（疑わしければ固定）
const ORDER_BOUND = /選択肢の?\s*[1-4１-４]|[1-4１-４]\s*番|[①②③④]|(?:^|[。．）)]|誤り。)\s*[1-4１-４]\s*(?:は|を|が|も|と(?:答|考|する|し))|(?:最初|最後|残り|つ目)の選択肢|並び|上記|上の選択肢|下の選択肢|以上のすべて|すべて正し|どれでもない|いずれでもない|前者|後者/;

function shuffleOptions(q, random = Math.random) {
  if (ORDER_BOUND.test(q.explanation) || q.options.some((o) => ORDER_BOUND.test(o))) return q;
  const order = [0, 1, 2, 3];
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return Object.assign({}, q, { options: order.map((i) => q.options[i]), answer: order.indexOf(q.answer - 1) + 1 });
}

function pickMock(bank) {
  const byCat = {};
  const catOf = Object.fromEntries(bank.topics.map((t) => [t.topic, t.cat]));
  for (const q of bank.questions) (byCat[catOf[q.topic]] = byCat[catOf[q.topic]] || []).push(q);
  const cats = Object.keys(byCat);
  const picked = [];
  const share = MOCK_N / cats.length;
  for (const cat of cats) {
    const pool = byCat[cat].slice().sort(() => Math.random() - 0.5);
    picked.push(...pool.slice(0, Math.round(share)));
  }
  const rest = bank.questions.filter((q) => !picked.includes(q)).sort(() => Math.random() - 0.5);
  while (picked.length < MOCK_N && rest.length) picked.push(rest.pop());
  return picked.slice(0, MOCK_N).sort(() => Math.random() - 0.5);
}

function mockResult(bank, questions, answers) {
  const catOf = Object.fromEntries(bank.topics.map((t) => [t.topic, t.cat]));
  const byCat = {};
  let correct = 0;
  questions.forEach((q, i) => {
    const ok = answers[i] === q.answer;
    correct += ok ? 1 : 0;
    const c = byCat[catOf[q.topic]] || (byCat[catOf[q.topic]] = { right: 0, total: 0 });
    c.total += 1;
    c.right += ok ? 1 : 0;
  });
  return { correct, total: questions.length, byCat };
}

if (typeof module !== "undefined") {
  module.exports = { emptyData, recordAnswer, pickNext, streak, weekMinutes, dayDone, pickMock, mockResult, shuffleOptions, addDays, dateKey, topicAccuracy };
}
