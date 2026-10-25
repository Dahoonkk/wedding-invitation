import { useEffect, useState } from "react";

export default function TitleBar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 상단 바 터치 시 최상단으로 부드럽게 이동
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-40 flex justify-center pointer-events-none">
      <div
        onClick={scrollToTop}
        className={`pointer-events-auto cursor-pointer w-full max-w-[430px] h-12 flex items-center px-4 transition-all duration-300 ${
          scrolled
            ? "bg-white/70 backdrop-blur-2xl border-b border-white/60 shadow-[0_4px_20px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,0.7)]"
            : "bg-white/35 backdrop-blur-xl border-b border-white/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]"
        }`}
      >
        {/* 트래픽 라이트 (macOS 스타일) */}
        <div className="flex items-center gap-1.5 w-[56px]">
          <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57] shadow-[0_0_0_1px_rgba(0,0,0,0.04)]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E] shadow-[0_0_0_1px_rgba(0,0,0,0.04)]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#28C840] shadow-[0_0_0_1px_rgba(0,0,0,0.04)]" />
        </div>

        {/* 메인 타이틀 */}
        <div className="flex-1 text-center">
          <span className="text-[11px] md:text-[12px] text-stone-600 tracking-[0.22em] font-mono font-medium uppercase">
            OUR WEDDING
          </span>
        </div>

        {/* 우측 엘리멘탈 물(Cyan) × 불(Rose) 포인트 */}
        <div className="w-[56px] flex justify-end items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 shadow-[0_0_4px_rgba(6,182,212,0.6)]" />
          <span className="text-[8px] text-gray-400">♥</span>
          <span className="w-1.5 h-1.5 rounded-full bg-rose-300 shadow-[0_0_4px_rgba(244,63,94,0.6)]" />
        </div>
      </div>
    </div>
  );
}
