// 현재 ISO 주차를 'YYYY-Www'로 — 백엔드 parse_iso_week 형식과 일치.
export function currentIsoWeek(now: Date = new Date()): string {
  const d = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
  const dayNum = d.getUTCDay() || 7; // 월=1 … 일=7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum); // 해당 주 목요일로 이동
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

const WEEKDAYS = ["월", "화", "수", "목", "금", "토", "일"];

// trend label(YYYY-MM-DD)을 요일 한 글자로.
export function weekdayLabel(isoDate: string): string {
  const d = new Date(`${isoDate}T00:00:00Z`);
  const idx = (d.getUTCDay() + 6) % 7; // 일=0 → 6, 월=1 → 0
  return WEEKDAYS[idx] ?? "";
}
