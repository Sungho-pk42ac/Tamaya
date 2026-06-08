import Link from "next/link";

// G004-3에서 밤 코칭 화면으로 대체될 자리.
export default function CoachPlaceholder() {
  return (
    <main className="flex flex-col items-center justify-center min-h-dvh px-6 text-center gap-4">
      <h1 className="font-serif font-bold text-2xl text-coffee-deep">🌙 밤 코칭</h1>
      <p className="text-coffee/80 text-sm">곧 건강냥과 대화할 수 있어요.</p>
      <Link href="/" className="text-terracotta-deep underline text-sm">
        홈으로
      </Link>
    </main>
  );
}
