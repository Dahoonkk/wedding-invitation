import { useEffect, useRef } from "react";
import { AURA_ITEMS } from "../data/auraItems";

export default function BackgroundAura() {
  const containerRef = useRef<HTMLDivElement>(null);

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

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none overflow-hidden z-0"
    >
      {/* 부드러운 아이보리 미색 베이스 */}
      <div className="absolute inset-0 bg-[#faf9f6]" />

      {/* 패럴랙스 유영 레이어 */}
      <div
        className="absolute inset-0 transform-gpu transition-transform duration-100 ease-out"
        style={{
          transform: "translateY(calc(var(--scroll-y, 0px) * -0.06))",
        }}
      >
        {AURA_ITEMS.map((item, index) => (
          <div
            key={index}
            className={`absolute ${item.size} ${item.shape === "diamond" ? "rotate-45 rounded-[1px]" : "rounded-full"} ${item.color} ${item.blur ?? "blur-xl"} ${item.anim} transform-gpu will-change-transform`}
            style={{
              top: item.top,
              left: item.left,
              right: item.right,
              animationDelay: `-${(index * 1.3) % 7}s`,
              boxShadow: item.glow?.replace("shadow-[", "").replace("]", ""),
            }}
          />
        ))}
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
          0%, 100% { transform: translate3d(0, 0, 0) scale(0.72); opacity: 0.28; }
          50% { transform: translate3d(7px, -11px, 0) scale(1.2); opacity: 0.82; }
        }
        @keyframes auraDrift1 {
          0%, 100% { transform: translate3d(0, 0, 0); opacity: 0.4; }
          50% { transform: translate3d(12px, -18px, 0); opacity: 0.76; }
        }
        @keyframes auraDrift2 {
          0%, 100% { transform: translate3d(0, 0, 0) scale(0.85); opacity: 0.38; }
          50% { transform: translate3d(-10px, 14px, 0) scale(1.08); opacity: 0.7; }
        }
        @media (prefers-reduced-motion: reduce) {
          .will-change-transform { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
