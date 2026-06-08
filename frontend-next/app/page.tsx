import Link from "next/link";
import { Mascot } from "@/components/Mascot";

const ENTRIES = [
  { href: "/onboarding", emoji: "☀️", title: "온보딩", desc: "비서 톤 고르고 CLOVA 키 연결" },
  { href: "/coach", emoji: "🌙", title: "밤 코칭", desc: "건강냥과 하루를 함께 돌아보기" },
  { href: "/insights", emoji: "📊", title: "주간 리포트", desc: "이번 주 웰빙 흐름 살펴보기" },
];

export default function Home() {
  return (
    <main className="flex flex-col items-center px-5 pt-14 pb-20">
      <span className="inline-block font-hand text-base text-terracotta-deep bg-terracotta/[0.12] px-4 py-1 rounded-full -rotate-1">
        건강냥 · 밤에 깨어나는 비서
      </span>
      <h1 className="font-serif font-bold text-coffee-deep text-center text-[clamp(30px,6vw,47px)] leading-tight tracking-tight mt-3 mb-2">
        오늘 하루, 같이 정리해요
      </h1>
      <p className="text-center text-coffee/90 text-sm leading-relaxed max-w-[470px]">
        낮엔 가볍게 기록하고, 밤엔 건강냥이 깨어나 하루를 함께 돌아봐요. 1인 가구를 위한 따뜻한 웰니스
        동반자.
      </p>
      <div className="w-[60px] h-[2px] bg-ink/50 rounded my-6" />

      <Mascot className="w-24 h-24 text-coffee-deep animate-bob" />

      <div className="grid gap-4 mt-8 w-full max-w-[440px]">
        {ENTRIES.map((e) => (
          <Link
            key={e.href}
            href={e.href}
            className="flex items-center gap-4 bg-paper border border-ink/15 rounded-card p-4 transition-transform hover:-translate-y-1"
          >
            <span className="text-2xl">{e.emoji}</span>
            <div>
              <div className="font-serif font-bold text-coffee-deep">{e.title}</div>
              <div className="text-sm text-coffee/80">{e.desc}</div>
            </div>
          </Link>
        ))}
      </div>

      <p className="mt-10 text-[11px] text-center text-coffee/70 leading-relaxed">
        웰니스 코칭이며 진단·처방이 아니에요 · 응급 시 119
      </p>
    </main>
  );
}
