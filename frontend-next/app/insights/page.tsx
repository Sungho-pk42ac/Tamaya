"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Mascot } from "@/components/Mascot";
import { PhoneShell } from "@/components/PhoneShell";
import { ApiError, type InsightResponse, api } from "@/lib/api";
import { getDeviceId } from "@/lib/deviceId";
import { currentIsoWeek, weekdayLabel } from "@/lib/week";

type Load = { state: "loading" } | { state: "ok"; data: InsightResponse } | { state: "err"; msg: string };

export default function InsightsPage() {
  const [load, setLoad] = useState<Load>({ state: "loading" });
  const [week, setWeek] = useState("");

  useEffect(() => {
    const w = currentIsoWeek();
    setWeek(w);
    api
      .getWeeklyInsight(getDeviceId(), w)
      .then((data) => setLoad({ state: "ok", data }))
      .catch((e) =>
        setLoad({
          state: "err",
          msg:
            e instanceof ApiError
              ? `리포트를 불러오지 못했어요 (${e.status}).`
              : "백엔드에 연결할 수 없어요. 서버를 확인해줘요.",
        }),
      );
  }, []);

  return (
    <main className="flex flex-col items-center px-5 pt-12 pb-20">
      <PhoneShell mode="day">
        <div className="h-full flex flex-col px-[21px] pt-[42px] pb-[18px] overflow-y-auto">
          <div className="flex justify-between items-center text-xs font-semibold text-coffee">
            <span>이번 주</span>
            <span>📊 {week}</span>
          </div>

          <div className="flex justify-between items-start mt-4">
            <div>
              <div className="font-hand text-[15px] text-terracotta-deep">주간 웰빙 리포트</div>
              <h2 className="font-serif font-bold text-[25px] leading-snug text-coffee-deep mt-1">
                이번 주<br />흐름이에요
              </h2>
            </div>
            <Mascot className="w-[78px] h-[78px] text-coffee-deep animate-bob" />
          </div>

          {load.state === "loading" && (
            <p className="mt-8 text-center text-coffee/70 text-sm">불러오는 중…</p>
          )}

          {load.state === "err" && (
            <p className="mt-8 text-center text-red-700 text-sm leading-relaxed">{load.msg}</p>
          )}

          {load.state === "ok" && <Report data={load.data} />}

          <div className="flex justify-around items-center mt-auto pt-3 border-t border-dashed border-ink/25 text-[11px]">
            <Link href="/onboarding" className="text-coffee-deep">
              온보딩
            </Link>
            <Link href="/coach" className="text-coffee-deep">
              건강냥
            </Link>
            <span className="font-serif font-bold text-terracotta-deep">리포트</span>
          </div>
          <p className="text-[10px] text-center text-coffee/70 mt-2">
            자기보고 기반 방향 지표예요 · 진단·처방이 아니에요
          </p>
        </div>
      </PhoneShell>
    </main>
  );
}

function Report({ data }: { data: InsightResponse }) {
  const { report, trend } = data;
  const empty = report.signal_count === 0;
  const maxScore = 100;

  return (
    <div className="mt-5">
      {/* 스코어 카드 */}
      <div className="bg-paper border border-ink/10 rounded-card p-4 text-center">
        <div className="font-hand text-[14px] text-coffee">웰빙 스코어</div>
        <div className="font-serif font-bold text-[44px] leading-none text-terracotta-deep mt-1">
          {report.score}
        </div>
        <div className="text-[11.5px] text-coffee/70 mt-1">
          정서 {fmt(report.emotion_score)} · 행동 {fmt(report.behavior_score)} · 신호{" "}
          {report.signal_count}건
        </div>
      </div>

      {/* 일별 trend */}
      <div className="mt-4">
        <div className="font-serif font-bold text-[13.5px] text-coffee-deep mb-2">일별 흐름</div>
        <div className="flex items-end justify-between gap-1.5 h-[96px]">
          {trend.map((p, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full bg-[#cdbb98] rounded-md overflow-hidden flex items-end h-[72px]">
                <div
                  className="w-full rounded-md bg-gradient-to-t from-terracotta-deep to-terracotta transition-all"
                  style={{ height: `${Math.round((p.score / maxScore) * 100)}%` }}
                  title={`${p.label}: ${p.score}`}
                />
              </div>
              <span className="text-[10px] text-coffee/70">{weekdayLabel(p.label)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 건강냥 한마디 */}
      <div className="font-hand text-[15px] text-coffee mt-4 px-3.5 py-3 leading-relaxed border-l-[3px] border-terracotta bg-terracotta/[0.08] rounded-r-lg">
        {empty
          ? "아직 기록이 충분하지 않아요. 밤에 건강냥과 몇 마디 나눠볼까요?"
          : report.score >= 55
            ? "이번 주, 꽤 잘 보냈어요. 그 흐름 그대로 가요. 🌱"
            : report.score <= 45
              ? "조금 고단한 한 주였네요. 작은 것 하나만 같이 챙겨봐요."
              : "그럭저럭 흘러간 한 주예요. 오늘 밤도 가볍게 이야기 나눠요."}
      </div>
    </div>
  );
}

function fmt(n: number): string {
  return n > 0 ? `+${n}` : `${n}`;
}
