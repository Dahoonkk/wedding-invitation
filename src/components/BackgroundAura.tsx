import { useEffect, useRef } from "react";

// 수채화 보케 빛방울 20개 배치 데이터 (위치 / 크기 / 색상 / 애니메이션)
const AURA_ITEMS = [
  // 1. 인트로 (0% ~ 15%)
  {
    top: "2%",
    left: "6%",
    size: "w-20 h-20",
    color: "bg-sky-300/30",
    anim: "animate-[auraFloat1_9s_infinite_ease-in-out]",
  },
  {
    top: "5%",
    right: "8%",
    size: "w-24 h-24",
    color: "bg-rose-300/25",
    anim: "animate-[auraFloat2_11s_infinite_ease-in-out]",
  },
  {
    top: "9%",
    left: "42%",
    size: "w-16 h-16",
    color: "bg-amber-200/30",
    anim: "animate-[auraFloat3_8s_infinite_ease-in-out]",
  },
  {
    top: "14%",
    right: "28%",
    size: "w-18 h-18",
    color: "bg-cyan-200/25",
    anim: "animate-[auraFloat1_10s_infinite_ease-in-out]",
  },

  // 2. 인사말 & 사진 (15% ~ 35%)
  {
    top: "19%",
    left: "10%",
    size: "w-22 h-22",
    color: "bg-rose-300/20",
    anim: "animate-[auraFloat2_12s_infinite_ease-in-out]",
  },
  {
    top: "25%",
    right: "6%",
    size: "w-24 h-24",
    color: "bg-sky-300/25",
    anim: "animate-[auraFloat3_9s_infinite_ease-in-out]",
  },
  {
    top: "31%",
    left: "38%",
    size: "w-16 h-16",
    color: "bg-emerald-200/25",
    anim: "animate-[auraFloat1_11s_infinite_ease-in-out]",
  },

  // 3. 혼주 & 달력 (35% ~ 55%)
  {
    top: "37%",
    left: "8%",
    size: "w-24 h-24",
    color: "bg-sky-200/30",
    anim: "animate-[auraFloat2_10s_infinite_ease-in-out]",
  },
  {
    top: "43%",
    right: "12%",
    size: "w-20 h-20",
    color: "bg-amber-200/30",
    anim: "animate-[auraFloat3_13s_infinite_ease-in-out]",
  },
  {
    top: "49%",
    left: "48%",
    size: "w-18 h-18",
    color: "bg-rose-300/20",
    anim: "animate-[auraFloat1_8s_infinite_ease-in-out]",
  },

  // 4. 오시는길 (55% ~ 70%)
  {
    top: "56%",
    right: "8%",
    size: "w-22 h-22",
    color: "bg-cyan-300/25",
    anim: "animate-[auraFloat2_11s_infinite_ease-in-out]",
  },
  {
    top: "62%",
    left: "12%",
    size: "w-20 h-20",
    color: "bg-rose-200/25",
    anim: "animate-[auraFloat3_9s_infinite_ease-in-out]",
  },
  {
    top: "68%",
    right: "36%",
    size: "w-16 h-16",
    color: "bg-emerald-200/20",
    anim: "animate-[auraFloat1_12s_infinite_ease-in-out]",
  },

  // 5. 갤러리 & 계좌 (70% ~ 88%)
  {
    top: "74%",
    left: "6%",
    size: "w-24 h-24",
    color: "bg-sky-300/25",
    anim: "animate-[auraFloat2_10s_infinite_ease-in-out]",
  },
  {
    top: "80%",
    right: "10%",
    size: "w-20 h-20",
    color: "bg-amber-300/25",
    anim: "animate-[auraFloat3_11s_infinite_ease-in-out]",
  },
  {
    top: "86%",
    left: "38%",
    size: "w-18 h-18",
    color: "bg-rose-300/25",
    anim: "animate-[auraFloat1_9s_infinite_ease-in-out]",
  },

  // 6. 방명록 & 마감 (88% ~ 100%)
  {
    top: "91%",
    left: "14%",
    size: "w-20 h-20",
    color: "bg-cyan-200/25",
    anim: "animate-[auraFloat2_12s_infinite_ease-in-out]",
  },
  {
    top: "96%",
    right: "8%",
    size: "w-22 h-22",
    color: "bg-sky-200/30",
    anim: "animate-[auraFloat3_10s_infinite_ease-in-out]",
  },
];

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
            className={`absolute ${item.size} rounded-full ${item.color} blur-xl ${item.anim} transform-gpu will-change-transform`}
            style={{
              top: item.top,
              left: item.left,
              right: item.right,
              animationDelay: `-${(index * 1.3) % 7}s`,
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
      `}</style>
    </div>
  );
}
