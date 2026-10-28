import { useEffect, useRef, useState } from "react";
import { AURA_ITEMS } from "../data/auraItems";

export default function BackgroundAura() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rainbowMode, setRainbowMode] = useState<"off" | "mode" | "bloom">(
    "off",
  );

  // 스크롤 시 패럴랙스 가속 처리 (GPU 60fps)
  useEffect(() => {
    let animationFrameId: number;

    const handleScroll = () => {
      animationFrameId = requestAnimationFrame(() => {
        if (containerRef.current) {
          containerRef.current.style.setProperty(
            "--scroll-y",
            `${window.scrollY}px`,
          );
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  useEffect(() => {
    let rainbowTimer: number | null = null;
    let bloomTimer: number | null = null;
    const activateRainbowMode = () => {
      setRainbowMode("mode");
      if (rainbowTimer) window.clearTimeout(rainbowTimer);
      if (bloomTimer) window.clearTimeout(bloomTimer);
      rainbowTimer = window.setTimeout(() => setRainbowMode("off"), 5000);
    };
    const bloomRainbow = () => {
      setRainbowMode("bloom");
      if (rainbowTimer) window.clearTimeout(rainbowTimer);
      if (bloomTimer) window.clearTimeout(bloomTimer);
      bloomTimer = window.setTimeout(() => setRainbowMode("off"), 1100);
    };

    window.addEventListener("wedding:rainbow-mode", activateRainbowMode);
    window.addEventListener("wedding:rainbow-bloom", bloomRainbow);
    return () => {
      window.removeEventListener("wedding:rainbow-mode", activateRainbowMode);
      window.removeEventListener("wedding:rainbow-bloom", bloomRainbow);
      if (rainbowTimer) window.clearTimeout(rainbowTimer);
      if (bloomTimer) window.clearTimeout(bloomTimer);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none overflow-hidden z-0"
    >
      {/* 부드러운 아이보리 미색 베이스 */}
      <div className="absolute inset-0 bg-[#faf9f6]" />
      <div
        aria-hidden="true"
        className={`rainbow-mode-wash absolute inset-0 z-[1] ${rainbowMode === "mode" ? "rainbow-mode-wash--active" : rainbowMode === "bloom" ? "rainbow-mode-wash--bloom" : "opacity-0"}`}
      />

      {/* 패럴랙스 유영 레이어 */}
      <div
        className="absolute inset-0 transform-gpu transition-transform duration-100 ease-out"
        style={{
          transform: "translateY(calc(var(--scroll-y, 0px) * -0.06))",
        }}
      >
        {AURA_ITEMS.map((item, index) => {
          const durationMatch = item.anim.match(/_(\d+(?:\.\d+)?)s_infinite/);
          const isSmallParticle = item.size.startsWith("h-");
          const baseDuration = durationMatch ? Number(durationMatch[1]) : 10;

          return (
            <div
              key={index}
              className={`aura-particle absolute ${item.size} ${item.shape === "diamond" ? "rotate-45 rounded-[1px]" : "rounded-full"} ${item.color} ${item.blur ?? "blur-xl"} ${item.anim}`}
              style={{
                top: item.top,
                left: item.left,
                right: item.right,
                animationDelay: `-${(index * 0.83) % 6}s`,
                animationDuration: `${isSmallParticle ? Math.max(3, baseDuration * 0.62) : baseDuration}s`,
                boxShadow: item.glow?.replace("shadow-[", "").replace("]", ""),
              }}
            />
          );
        })}
      </div>

      {/* 입체감과 투명도 파동(Breath)을 만드는 키프레임 */}
      <style>{`
        @keyframes auraFloat1 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.8; }
          33% { transform: translate(36px, -42px) scale(1.18); opacity: 1; }
          66% { transform: translate(-30px, 28px) scale(0.85); opacity: 0.6; }
        }
        @keyframes auraFloat2 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.7; }
          33% { transform: translate(-40px, 32px) scale(0.82); opacity: 0.5; }
          66% { transform: translate(34px, -36px) scale(1.15); opacity: 1; }
        }
        @keyframes auraFloat3 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.85; }
          50% { transform: translate(42px, 36px) scale(1.12); opacity: 0.6; }
        }
        @keyframes auraSparkle {
          0%, 100% { transform: translate3d(0, 0, 0) scale(0.78); opacity: 0.42; }
          35% { transform: translate3d(10px, -14px, 0) scale(1.08); opacity: 0.78; }
          70% { transform: translate3d(-8px, -22px, 0) scale(1.28); opacity: 1; }
        }
        @keyframes auraDrift1 {
          0%, 100% { transform: translate3d(0, 0, 0) scale(0.9); opacity: 0.48; }
          50% { transform: translate3d(18px, -26px, 0) scale(1.12); opacity: 0.92; }
        }
        @keyframes auraDrift2 {
          0%, 100% { transform: translate3d(0, 0, 0) scale(0.82); opacity: 0.42; }
          50% { transform: translate3d(-16px, 22px, 0) scale(1.16); opacity: 0.9; }
        }
        @media (prefers-reduced-motion: reduce) {
          .aura-particle { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
