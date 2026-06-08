import Link from "next/link";

// G004-4에서 주간 리포트 화면으로 대체될 자리.
export default function InsightsPlaceholder() {
  return (
    <main className="flex flex-col items-center justify-center min-h-dvh px-6 text-center gap-4">
      <h1 className="font-serif font-bold text-2xl text-coffee-deep">📊 주간 리포트</h1>
      <p className="text-coffee/80 text-sm">이번 주 웰빙 흐름을 곧 보여줄게요.</p>
      <Link href="/" className="text-terracotta-deep underline text-sm">
        홈으로
      </Link>
    </main>
  );
}
