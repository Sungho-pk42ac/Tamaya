// 폰 프레임 셸 — Day/Night 모드. geongangnyang-ui.html .phone/.screen 포팅.
import type { ReactNode } from "react";

const DAY_PHONE: React.CSSProperties = {
  background: "linear-gradient(158deg, #d2bd92, #b59a6c 72%)",
  boxShadow:
    "0 34px 70px -30px rgba(58,46,36,.6), inset 0 3px 0 rgba(255,255,255,.45), inset 0 -3px 8px rgba(0,0,0,.18)",
};

const NIGHT_PHONE: React.CSSProperties = {
  background: "linear-gradient(158deg, #30241a, #120e09 72%)",
  boxShadow:
    "0 34px 80px -28px rgba(20,12,6,.75), inset 0 2px 0 rgba(255,210,140,.18), inset 0 -3px 8px rgba(0,0,0,.4)",
};

const NIGHT_SCREEN: React.CSSProperties = {
  background: "radial-gradient(125% 80% at 72% 6%, #36281c 0%, #221a14 56%)",
};

export function PhoneShell({ mode, children }: { mode: "day" | "night"; children: ReactNode }) {
  const isNight = mode === "night";
  return (
    <div
      className="relative w-[350px] h-[716px] rounded-[44px] p-[13px] max-[760px]:w-[332px] max-[760px]:h-[690px]"
      style={isNight ? NIGHT_PHONE : DAY_PHONE}
    >
      <div
        className="absolute top-[13px] left-1/2 -translate-x-1/2 w-[112px] h-[27px] rounded-2xl z-10"
        style={{ background: isNight ? "#120e09" : "#b59a6c" }}
      />
      <div
        className="w-full h-full rounded-[33px] overflow-hidden relative border border-black/[0.16]"
        style={isNight ? NIGHT_SCREEN : { background: "var(--cream)" }}
      >
        {children}
      </div>
    </div>
  );
}
