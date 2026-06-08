"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Mascot } from "@/components/Mascot";
import { PhoneShell } from "@/components/PhoneShell";
import { ApiError, type ChatTurn, api } from "@/lib/api";
import { getDeviceId, getPersona, getUserKey } from "@/lib/deviceId";

const HISTORY_KEY = "tamaya.coachHistory";
const GREETING: ChatTurn = {
  role: "assistant",
  content: "하루, 잘 보냈어요? 오늘 마음에 남는 일이 있었나요?",
};

const STARS = [
  { top: 54, left: 40, d: 0 },
  { top: 96, left: 250, d: 0.6 },
  { top: 138, left: 70, d: 1.2 },
  { top: 80, left: 300, d: 0.3 },
  { top: 170, left: 296, d: 0.9 },
];

export default function CoachPage() {
  const [messages, setMessages] = useState<ChatTurn[]>([GREETING]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const raw = typeof window !== "undefined" ? window.localStorage.getItem(HISTORY_KEY) : null;
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as ChatTurn[];
        if (Array.isArray(parsed) && parsed.length) setMessages(parsed);
      } catch {
        /* 손상된 저장본은 무시 */
      }
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(messages));
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    const text = input.trim();
    if (!text || sending) return;
    setInput("");
    setSending(true);

    // 백엔드는 현재 메시지를 직접 받으므로 history엔 직전까지의 대화만 보낸다.
    const history = messages;
    setMessages((prev) => [...prev, { role: "user", content: text }]);

    try {
      const { reply } = await api.sendCoachingMessage(
        { deviceId: getDeviceId(), message: text, history, persona: getPersona() },
        getUserKey(),
      );
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (e) {
      const msg =
        e instanceof ApiError
          ? "지금은 답하기 어려워요. 잠시 후 다시 시도해줘요."
          : "건강냥이 아직 깨어나지 못했어요(서버 연결 확인).";
      setMessages((prev) => [...prev, { role: "assistant", content: msg }]);
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="flex flex-col items-center px-5 pt-12 pb-20">
      <PhoneShell mode="night">
        {/* 달 + 별 */}
        <div
          className="absolute top-[50px] right-[26px] w-[34px] h-[34px] rounded-full opacity-85 z-0"
          style={{ boxShadow: "inset -9px -4px 0 0 #efe4ce" }}
        />
        {STARS.map((s, i) => (
          <i
            key={i}
            className="absolute w-[3px] h-[3px] rounded-full bg-amber animate-pulse"
            style={{ top: s.top, left: s.left, animationDelay: `${s.d}s` }}
          />
        ))}

        <div className="h-full flex flex-col px-[21px] pt-[42px] pb-[18px] relative z-[1]">
          <div className="flex justify-between items-center text-xs font-semibold text-amber-soft">
            <span>23:08</span>
            <span>🌙 나이트 모드</span>
          </div>

          <div className="flex justify-between items-start mt-4">
            <div>
              <div className="font-hand text-[15px] text-amber">건강냥이 깨어났어요</div>
              <h2 className="font-serif font-bold text-[25px] leading-snug text-night-cream mt-1">
                하루, 잘
                <br />
                보냈어요?
              </h2>
            </div>
            <Mascot className="w-[86px] h-[86px] text-amber animate-bob" sleepy />
          </div>

          {/* 채팅 */}
          <div ref={scrollRef} className="flex flex-col mt-3 flex-1 overflow-y-auto">
            {messages.map((m, i) => (
              <div
                key={i}
                data-role={m.role}
                className={`max-w-[80%] px-3.5 py-2.5 text-[13.5px] leading-relaxed rounded-2xl mt-2.5 ${
                  m.role === "assistant"
                    ? "self-start rounded-bl-[5px] bg-espresso-card text-night-cream border border-amber/35"
                    : "self-end rounded-br-[5px] text-[#2a1f12] font-semibold bg-gradient-to-br from-amber to-amber-soft"
                }`}
              >
                {m.content}
              </div>
            ))}
            {sending && (
              <div className="self-start mt-2.5 px-3.5 py-2.5 text-[13.5px] rounded-2xl rounded-bl-[5px] bg-espresso-card text-amber-soft border border-amber/35">
                …
              </div>
            )}
          </div>

          {/* 입력바 */}
          <div className="mt-3 flex items-center gap-2.5 rounded-3xl px-4 py-2 bg-espresso-card border border-amber/30">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") send();
              }}
              placeholder="마음을 편하게 적어보세요…"
              className="flex-1 bg-transparent text-[13px] text-night-cream placeholder:text-amber-soft/70 outline-none"
            />
            <button
              onClick={send}
              disabled={sending || !input.trim()}
              aria-label="전송"
              className="w-[33px] h-[33px] rounded-full grid place-items-center bg-amber text-[#2a1f12] disabled:opacity-40"
            >
              ↑
            </button>
          </div>

          <div className="flex justify-around items-center mt-3 pt-3 border-t border-dashed border-amber/25 text-[11px]">
            <Link href="/onboarding" className="text-night-cream/80">
              온보딩
            </Link>
            <Link href="/insights" className="text-night-cream/80">
              리포트
            </Link>
            <span className="font-serif font-bold text-amber">건강냥</span>
          </div>
          <p className="text-[10px] text-center text-amber-soft/80 mt-2">
            웰니스 코칭이며 진단·처방이 아니에요 · 응급 시 119
          </p>
        </div>
      </PhoneShell>
    </main>
  );
}
