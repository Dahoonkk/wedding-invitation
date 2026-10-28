import { useEffect, useRef, useState } from "react";

export default function TitleBar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("WEDDINGRAM");
  const [rainbowHint, setRainbowHint] = useState(false);
  const titleTapCountRef = useRef(0);
  const titleTapTimerRef = useRef<number | null>(null);
  const hintTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      setScrolled(scrollY > 16);

      if (scrollY < 100) {
        setActiveSection("WEDDINGRAM");
        return;
      }

      const sections = Array.from(
        document.querySelectorAll<HTMLElement>("#root section"),
      );
      const currentSection = sections.find((section) => {
        const bounds = section.getBoundingClientRect();
        return bounds.top <= 110 && bounds.bottom > 110;
      });

      if (currentSection) {
        const heading = currentSection
          .querySelector("p")
          ?.textContent?.replace(/\s+/g, " ")
          .trim();
        if (heading) setActiveSection(heading.slice(0, 22));
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 상단 바 터치 시 최상단으로 부드럽게 이동
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    titleTapCountRef.current += 1;
    if (titleTapTimerRef.current) {
      window.clearTimeout(titleTapTimerRef.current);
    }

    if (titleTapCountRef.current >= 3) {
      titleTapCountRef.current = 0;
      window.dispatchEvent(new Event("wedding:rainbow-mode"));
      setRainbowHint(true);
      if (hintTimerRef.current) window.clearTimeout(hintTimerRef.current);
      hintTimerRef.current = window.setTimeout(
        () => setRainbowHint(false),
        2600,
      );
      return;
    }

    titleTapTimerRef.current = window.setTimeout(() => {
      titleTapCountRef.current = 0;
    }, 1400);
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-40 flex justify-center pointer-events-none">
        <div
          className={`pointer-events-auto w-full max-w-[430px] h-12 flex items-center px-4 transition-all duration-300 ${
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
            <button
              type="button"
              onClick={scrollToTop}
              aria-label="청첩장 맨 위로 이동. 빠르게 세 번 누르면 무지개 모드가 열립니다."
              className="rounded-full px-3 py-1 text-[11px] md:text-[12px] text-stone-600 tracking-[0.22em] font-mono font-medium uppercase transition-colors hover:bg-white/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300/70"
            >
              <span className="block max-w-[190px] truncate transition-all duration-200">
                {activeSection}
              </span>
            </button>
          </div>

          {/* 우측 엘리멘탈 물(Cyan) × 불(Rose) 포인트 */}
          <div className="w-[56px] flex justify-end items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 shadow-[0_0_4px_rgba(6,182,212,0.6)]" />
            <span className="text-[8px] text-gray-400">♥</span>
            <span className="w-1.5 h-1.5 rounded-full bg-rose-300 shadow-[0_0_4px_rgba(244,63,94,0.6)]" />
          </div>
        </div>
      </div>

      <p
        aria-live="polite"
        className={`pointer-events-none fixed left-1/2 top-14 z-40 -translate-x-1/2 rounded-full border border-white/75 bg-white/80 px-4 py-2 text-[11px] font-medium tracking-wide text-rose-600 shadow-[0_8px_24px_rgba(70,55,40,0.12)] backdrop-blur-xl transition-all duration-500 ${rainbowHint ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"}`}
      >
        🌈 무지개가 잠시 피어납니다 💧🔥
      </p>
    </>
  );
}
