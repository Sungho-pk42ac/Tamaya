"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Mascot } from "@/components/Mascot";
import { PhoneShell } from "@/components/PhoneShell";
import { ApiError, api } from "@/lib/api";
import { getDeviceId, getPersona, setPersona, setUserKey } from "@/lib/deviceId";

// DESIGN.md 4가지 페르소나 톤. value는 백엔드로 보낼 한국어 톤 라벨.
const PERSONAS = [
  { value: "부모님", label: "부모님 톤", desc: "따뜻하고 챙겨주는" },
  { value: "친척", label: "친척 톤", desc: "현실적이고 솔직한" },
  { value: "친구", label: "친구 톤", desc: "가볍고 편안한" },
  { value: "코치", label: "코치 톤", desc: "차분하고 단단한" },
];

export default function OnboardingPage() {
  const [deviceId, setDeviceId] = useState("");
  const [persona, setPersonaState] = useState<string>("친구");
  const [apiKey, setApiKey] = useState("");
  const [status, setStatus] = useState<{ kind: "idle" | "ok" | "err"; msg: string }>({
    kind: "idle",
    msg: "",
  });
  const [existing, setExisting] = useState<string>("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const id = getDeviceId();
    setDeviceId(id);
    const savedPersona = getPersona();
    if (savedPersona) setPersonaState(savedPersona);
    // 기존 저장된 마스킹 키가 있으면 보여준다(재방문 지속성).
    api
      .getClovaSetting(id)
      .then((s) => {
        if (s.has_key) setExisting(s.masked);
      })
      .catch(() => {
        /* 백엔드 미기동 등은 조용히 무시 */
      });
  }, []);

  const choosePersona = (value: string) => {
    setPersonaState(value);
    setPersona(value);
  };

  const testKey = async () => {
    if (!apiKey.trim()) return;
    setBusy(true);
    setStatus({ kind: "idle", msg: "" });
    try {
      const r = await api.testClovaKey(apiKey.trim());
      setStatus({
        kind: r.ok ? "ok" : "err",
        msg: r.ok ? `연결 성공 · ${r.masked}` : "키를 다시 확인해줘요.",
      });
    } catch (e) {
      setStatus({ kind: "err", msg: errorMessage(e) });
    } finally {
      setBusy(false);
    }
  };

  const saveKey = async () => {
    if (!apiKey.trim() || !deviceId) return;
    setBusy(true);
    setStatus({ kind: "idle", msg: "" });
    try {
      const s = await api.saveClovaKey(deviceId, apiKey.trim());
      setUserKey(apiKey.trim());
      setPersona(persona);
      setExisting(s.masked);
      setStatus({ kind: "ok", msg: `저장 완료 · ${s.masked}` });
    } catch (e) {
      setStatus({ kind: "err", msg: errorMessage(e) });
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="flex flex-col items-center px-5 pt-12 pb-20">
      <PhoneShell mode="day">
        <div className="h-full flex flex-col px-[21px] pt-[42px] pb-[22px] overflow-y-auto">
          <div className="flex justify-between items-center text-xs font-semibold text-coffee">
            <span>9:24</span>
            <span>☕ 시작해볼까요</span>
          </div>

          <div className="flex justify-between items-start mt-4">
            <div>
              <div className="font-hand text-[15px] text-terracotta-deep">처음 만나는 건강냥</div>
              <h2 className="font-serif font-bold text-[25px] leading-snug text-coffee-deep mt-1">
                어떤 톤으로
                <br />
                함께할까요?
              </h2>
            </div>
            <Mascot className="w-[86px] h-[86px] text-coffee-deep animate-bob" />
          </div>

          {/* 페르소나 선택 */}
          <div className="grid grid-cols-2 gap-2.5 mt-5">
            {PERSONAS.map((p) => {
              const on = persona === p.value;
              return (
                <button
                  key={p.value}
                  onClick={() => choosePersona(p.value)}
                  className={`text-left rounded-xl p-3 border transition-all ${
                    on
                      ? "border-terracotta bg-terracotta/[0.1] -translate-y-0.5"
                      : "border-ink/15 bg-paper"
                  }`}
                >
                  <div className="font-serif font-bold text-[13.5px] text-coffee-deep">
                    {p.label}
                  </div>
                  <div className="text-[11.5px] text-coffee/80 mt-0.5">{p.desc}</div>
                </button>
              );
            })}
          </div>

          {/* CLOVA 키 (BYOK) */}
          <div className="mt-5">
            <div className="font-serif font-bold text-[14px] text-coffee-deep mb-1.5">
              CLOVA 키 연결{" "}
              <span className="font-sans font-normal text-[11px] text-coffee/70">(선택)</span>
            </div>
            <p className="text-[11.5px] text-coffee/75 leading-relaxed mb-2">
              내 키를 넣으면 실제 CLOVA로, 없으면 미리보기(mock)로 동작해요. 키는 마스킹되어
              안전하게 다뤄져요.
            </p>
            {existing && (
              <p className="text-[11.5px] text-terracotta-deep mb-2">현재 저장됨 · {existing}</p>
            )}
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="nv-..."
              className="w-full bg-paper border border-ink/30 rounded-xl px-3 py-2 text-[13px] text-coffee outline-none focus:border-terracotta"
            />
            <div className="flex gap-2 mt-2">
              <button
                onClick={testKey}
                disabled={busy || !apiKey.trim()}
                className="flex-1 border border-ink/30 rounded-xl py-2 text-[12.5px] text-coffee-deep disabled:opacity-40"
              >
                연결 테스트
              </button>
              <button
                onClick={saveKey}
                disabled={busy || !apiKey.trim()}
                className="flex-1 bg-terracotta text-white rounded-xl py-2 text-[12.5px] font-semibold disabled:opacity-40"
              >
                저장
              </button>
            </div>
            {status.kind !== "idle" && (
              <p
                className={`text-[12px] mt-2 ${
                  status.kind === "ok" ? "text-terracotta-deep" : "text-red-700"
                }`}
              >
                {status.msg}
              </p>
            )}
          </div>

          <div className="mt-auto pt-4">
            <Link
              href="/coach"
              className="block text-center bg-coffee-deep text-cream rounded-xl py-2.5 text-[13px] font-serif font-bold"
            >
              밤 코칭 시작하기 →
            </Link>
            <p className="text-[10.5px] text-center text-coffee/70 mt-3 leading-relaxed">
              웰니스 코칭이며 진단·처방이 아니에요 · 응급 시 119
            </p>
          </div>
        </div>
      </PhoneShell>
    </main>
  );
}

function errorMessage(e: unknown): string {
  if (e instanceof ApiError) {
    if (e.status === 400) return "키가 비어 있어요.";
    return `오류가 났어요 (${e.status}).`;
  }
  return "백엔드에 연결할 수 없어요. 서버가 켜져 있는지 확인해줘요.";
}
