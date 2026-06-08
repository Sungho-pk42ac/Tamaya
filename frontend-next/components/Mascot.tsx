// 건강냥 마스코트 — geongangnyang-ui.html SVG 포팅. stroke=currentColor로 부모 색을 따른다.
export function Mascot({
  className = "",
  sleepy = false,
}: {
  className?: string;
  sleepy?: boolean;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      strokeWidth={3.4}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-label="건강냥"
    >
      <path d="M34 32 Q31 16 44 27" />
      <path d="M66 32 Q69 16 56 27" />
      <circle cx="50" cy="46" r="20" />
      <path d="M31 60 Q26 88 50 86 Q74 88 69 60" />
      {sleepy ? (
        <>
          <path d="M39 45 q4 4 8 0" strokeWidth={2.6} />
          <path d="M53 45 q4 4 8 0" strokeWidth={2.6} />
        </>
      ) : (
        <>
          <circle cx="43" cy="45" r="2.2" />
          <circle cx="57" cy="45" r="2.2" />
        </>
      )}
      <path d="M50 50 l-3 3 h6 z" strokeWidth={2.4} />
      <path d="M50 53 v4" strokeWidth={2} />
      <circle cx="38" cy="52" r="3.4" fill="currentColor" stroke="none" opacity={0.42} />
      <circle cx="62" cy="52" r="3.4" fill="currentColor" stroke="none" opacity={0.42} />
      <path d="M70 80 Q88 74 80 58" />
      {!sleepy && (
        <>
          <line x1="30" y1="47" x2="20" y2="45" strokeWidth={1.6} />
          <line x1="30" y1="51" x2="21" y2="52" strokeWidth={1.6} />
          <line x1="70" y1="47" x2="80" y2="45" strokeWidth={1.6} />
          <line x1="70" y1="51" x2="79" y2="52" strokeWidth={1.6} />
        </>
      )}
    </svg>
  );
}
