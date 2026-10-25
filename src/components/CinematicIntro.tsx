import { useEffect, useState } from "react";

interface CinematicIntroProps {
  onComplete: () => void;
}

export default function CinematicIntro({ onComplete }: CinematicIntroProps) {
  const [phase, setPhase] = useState<"fog" | "photo" | "text" | "exit">("fog");

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase("photo"), 700),
      setTimeout(() => setPhase("text"), 2000),
      setTimeout(() => setPhase("exit"), 4200),
      setTimeout(() => onComplete(), 5000),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  const handleSkip = () => {
    onComplete();
  };

  return (
    <div
      onClick={handleSkip}
      className={`fixed inset-0 z-50 flex items-center justify-center cursor-pointer transition-opacity duration-700 ${
        phase === "exit" ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      style={{
        background: "linear-gradient(to bottom, #fff1f2, #f0f9ff, #fffbeb)",
      }}
    >
      <div className="relative w-full max-w-[430px] h-[100dvh] overflow-hidden bg-black">
        {/* 사진 */}
        <div
          className={`absolute inset-0 transition-all duration-1000 ease-out transform-gpu ${
            phase === "fog" ? "opacity-0 scale-105" : "opacity-100 scale-100"
          }`}
        >
          <img
            src={`${import.meta.env.BASE_URL}images/1.png`}
            alt="Main Cover"
            className="w-full h-full object-cover object-center"
          />
          {/* 기본 오버레이 */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/25 to-black/20" />
        </div>

        {/* 다채로운 엘리멘탈 수채화 안개 레이어 */}
        <div
          className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 transform-gpu overflow-hidden ${
            phase === "fog" ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* 소프트 라이트 베이스 */}
          <div className="absolute inset-0 bg-stone-100/40" />

          {/* 1. 불 & 원소 핑크 오라 (좌상단) */}
          <div className="absolute -top-16 -left-16 w-80 h-80 rounded-full bg-rose-400/50 blur-3xl animate-pulse" />

          {/* 2. 물 & 신비 푸른 오라 (우하단) */}
          <div
            className="absolute -bottom-16 -right-16 w-80 h-80 rounded-full bg-sky-400/50 blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          />

          {/* 3. 빛 & 따뜻한 앰버 오라 (우상단) */}
          <div className="absolute top-1/4 -right-12 w-64 h-64 rounded-full bg-amber-300/45 blur-3xl" />

          {/* 4. 자연 & 생명 에메랄드 오라 (좌하단) */}
          <div className="absolute bottom-1/4 -left-12 w-64 h-64 rounded-full bg-emerald-300/40 blur-3xl" />

          {/* 수채화 믹스 오버레이 (물감이 연하게 번진 느낌) */}
          <div className="absolute inset-0 bg-gradient-to-tr from-rose-200/40 via-sky-200/35 to-amber-100/45 mix-blend-multiply" />

          {/* 중앙 부드러운 유백색 안개 필터 */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.4)_0%,rgba(255,255,255,0.85)_80%)] backdrop-blur-[2px]" />
        </div>

        {/* 문구 등장 시 중앙 딤 (박스 없이) */}
        <div
          className={`absolute inset-0 pointer-events-none transition-opacity duration-700 ${
            phase === "text" || phase === "exit" ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.55)_0%,rgba(0,0,0,0.15)_55%,transparent_75%)]" />
        </div>

        {/* 문구 */}
        <div
          className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-all duration-1000 transform-gpu ${
            phase === "text"
              ? "opacity-100 translate-y-0"
              : phase === "exit"
                ? "opacity-0 -translate-y-4"
                : "opacity-0 translate-y-6"
          }`}
        >
          <div className="relative z-10 px-6 text-center">
            <p className="mb-3 text-[11px] tracking-[0.35em] text-white/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              DAHOON × EUNHA
            </p>

            <h1
              className={`intro-handwriting text-white text-[36px] md:text-[38px] leading-tight tracking-wide
                         drop-shadow-[0_6px_24px_rgba(0,0,0,0.85)] ${
                           phase === "text" ? "intro-handwriting--active" : ""
                         }`}
              style={{ fontFamily: "'Great Vibes', cursive" }}
            >
              We are getting Married
            </h1>

            <div className="mt-5 flex items-center justify-center gap-2">
              <span className="w-8 h-px bg-gradient-to-r from-transparent to-sky-300/90" />
              <span className="text-[10px] text-white/85">♥</span>
              <span className="w-8 h-px bg-gradient-to-l from-transparent to-orange-300/90" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
