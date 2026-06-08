// FastAPI 백엔드 타입드 클라이언트. PoC와 달리 frontend-next는 실제 엔드포인트를 호출한다.
const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8000";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// BYOK: 사용자 CLOVA 키가 있으면 요청별 헤더로 전달(env/mock 비파괴).
function buildHeaders(userKey?: string | null): HeadersInit {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (userKey) headers["X-Clova-Api-Key"] = userKey;
  return headers;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, init);
  if (!res.ok) {
    let detail = res.statusText;
    try {
      const body = await res.json();
      detail = body?.detail ?? detail;
    } catch {
      /* 본문 파싱 실패는 무시 */
    }
    throw new ApiError(res.status, detail);
  }
  return res.json() as Promise<T>;
}

// ─── 타입 ─────────────────────────────────────────────────────────────────────
export interface ClovaTestResult {
  ok: boolean;
  masked: string;
}

export interface ClovaSetting {
  has_key: boolean;
  masked: string;
}

export interface CoachingMessageResult {
  reply: string;
}

export interface ChatTurn {
  role: "user" | "assistant";
  content: string;
}

export interface WellbeingReport {
  score: number;
  emotion_score: number;
  behavior_score: number;
  signal_count: number;
}

export interface TrendPoint {
  label: string;
  score: number;
  signal_count: number;
}

export interface InsightResponse {
  period: string;
  start_date: string;
  end_date: string;
  report: WellbeingReport;
  trend: TrendPoint[];
}

// ─── API ──────────────────────────────────────────────────────────────────────
export const api = {
  testClovaKey: (apiKey: string) =>
    request<ClovaTestResult>("/api/v1/settings/clova/test", {
      method: "POST",
      headers: buildHeaders(),
      body: JSON.stringify({ api_key: apiKey }),
    }),

  saveClovaKey: (deviceId: string, apiKey: string) =>
    request<ClovaSetting>("/api/v1/settings/clova", {
      method: "PUT",
      headers: buildHeaders(),
      body: JSON.stringify({ device_id: deviceId, api_key: apiKey }),
    }),

  getClovaSetting: (deviceId: string) =>
    request<ClovaSetting>(`/api/v1/settings/clova?device_id=${encodeURIComponent(deviceId)}`, {
      headers: buildHeaders(),
    }),

  sendCoachingMessage: (
    args: { deviceId: string; message: string; history: ChatTurn[]; persona?: string | null },
    userKey?: string | null,
  ) =>
    request<CoachingMessageResult>("/api/v1/coaching/messages", {
      method: "POST",
      headers: buildHeaders(userKey),
      body: JSON.stringify({
        device_id: args.deviceId,
        message: args.message,
        history: args.history,
        persona: args.persona ?? null,
      }),
    }),

  getWeeklyInsight: (deviceId: string, week: string) =>
    request<InsightResponse>(
      `/api/v1/insights/weekly?device_id=${encodeURIComponent(deviceId)}&week=${encodeURIComponent(week)}`,
      { headers: buildHeaders() },
    ),
};
