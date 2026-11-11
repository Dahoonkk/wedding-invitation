import { useEffect, useRef, useState } from "react";
import { WEDDING } from "../../lib/constants";

interface CinematicIntroProps {
  onComplete: () => void;
}

export default function CinematicIntro({ onComplete }: CinematicIntroProps) {
  const [phase, setPhase] = useState<"fog" | "photo" | "text" | "exit">("fog");
  const completedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const photoDelay = reducedMotion ? 500 : 700;
    const textDelay = reducedMotion ? 850 : 1650;
    const exitDelay = reducedMotion ? 2000 : 4300;
    const completeDelay = reducedMotion ? 2300 : 5000;
    const timers = [
      setTimeout(() => setPhase("photo"), photoDelay),
      setTimeout(() => setPhase("text"), textDelay),
      setTimeout(() => setPhase("exit"), exitDelay),
      setTimeout(() => {
        if (completedRef.current) return;
        completedRef.current = true;
        onCompleteRef.current();
      }, completeDelay),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const handleSkip = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    onComplete();
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-700 motion-reduce:transition-none ${
        phase === "exit" ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      style={{ background: "#f5f2ed" }}
    >
      <div className="relative h-dvh w-full max-w-107.5 overflow-hidden bg-[#f7f4ef]">
        {/* 사진 */}
        <div
          className={`absolute inset-0 transform-gpu transition-all duration-1000 ease-out motion-reduce:transition-none ${
            phase === "fog" ? "opacity-0 scale-105" : "opacity-100 scale-100"
          }`}
        >
          <img
            src={`${import.meta.env.BASE_URL}images/2.jpeg`}
            alt="다훈과 은하의 웨딩 사진"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-linear-to-t from-stone-950/45 via-stone-900/10 to-stone-900/5" />
        </div>

        {/* 사진보다 먼저 나타나는 원형 오로라 안개 */}
        <div
          aria-hidden="true"
          className={`absolute inset-0 pointer-events-none transform-gpu overflow-hidden transition-opacity duration-1000 motion-reduce:transition-none ${
            phase === "fog" ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="absolute inset-0 bg-[#f8f5f0]/75" />

          <div className="intro-aurora absolute -left-20 -top-16 h-80 w-80 rounded-full bg-rose-300/35 blur-3xl" />

          <div className="intro-aurora intro-aurora--delayed absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-sky-300/35 blur-3xl" />

          <div className="intro-aurora absolute -right-12 top-1/4 h-64 w-64 rounded-full bg-amber-200/35 blur-3xl" />

          <div className="intro-aurora intro-aurora--delayed absolute -left-12 bottom-1/4 h-64 w-64 rounded-full bg-emerald-200/30 blur-3xl" />

          <div className="absolute inset-0 bg-linear-to-tr from-rose-100/25 via-sky-100/20 to-amber-50/35 mix-blend-multiply" />

          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.36)_0%,rgba(255,255,255,0.76)_82%)] backdrop-blur-[2px]" />
        </div>

        {/* 문구 가독성을 위한 은은한 중앙 음영 */}
        <div
          aria-hidden="true"
          className={`absolute inset-0 pointer-events-none transition-opacity duration-700 motion-reduce:transition-none ${
            phase === "text" || phase === "exit" ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(49,39,35,0.32)_0%,rgba(49,39,35,0.12)_48%,transparent_78%)]" />
        </div>

        <button
          type="button"
          onClick={handleSkip}
          className="absolute inset-0 z-10 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-[-6px] focus-visible:outline-white"
          aria-label="화면을 누르면 인트로를 건너뜁니다"
        />

        <div
          aria-hidden="true"
          className={`pointer-events-none absolute right-5 top-[max(1.25rem,env(safe-area-inset-top))] z-20 px-1 py-2 text-[11px] tracking-[0.12em] transition-colors duration-500 motion-reduce:transition-none ${
            phase === "fog"
              ? "text-stone-700/80"
              : "text-white/90 [text-shadow:0_1px_8px_rgba(0,0,0,0.55)]"
          }`}
        >
          <span>탭하여 건너뛰기</span>
          <span aria-hidden="true" className="ml-1 text-[13px]">
            ›
          </span>
        </div>

        {/* 문구 */}
        <div
          className={`absolute inset-0 flex items-center justify-center pointer-events-none transform-gpu transition-all duration-1000 motion-reduce:transition-none ${
            phase === "text"
              ? "opacity-100 translate-y-0"
              : phase === "exit"
                ? "opacity-0 -translate-y-4"
                : "opacity-0 translate-y-6"
          }`}
        >
          <div className="relative z-10 px-6 text-center">
            <p className="mb-5 flex items-center justify-center gap-2 text-[15px] font-medium tracking-[0.2em]">
              <span className="text-sky-100 drop-shadow-[0_2px_8px_rgba(0,0,0,0.75)]">
                {WEDDING.groom.name}
              </span>
              <span
                aria-hidden="true"
                className="text-[12px] text-white/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.75)]"
              >
                ×
              </span>
              <span className="text-orange-100 drop-shadow-[0_2px_8px_rgba(0,0,0,0.75)]">
                {WEDDING.bride.name}
              </span>
            </p>

            <h1
              aria-label={`${WEDDING.groom.name}과 ${WEDDING.bride.name}의 결혼식`}
              className="intro-handwriting whitespace-nowrap text-[clamp(28px,8.5vw,38px)] leading-tight tracking-wide text-white"
              style={{
                fontFamily: "'Great Vibes', cursive",
                textShadow: "0 4px 20px rgba(0,0,0,0.7)",
              }}
            >
              {Array.from("We are getting Married").map((character, index) => (
                <span
                  key={`${character}-${index}`}
                  aria-hidden="true"
                  className={`intro-letter ${
                    phase === "text" ? "intro-letter--active" : ""
                  }`}
                  style={{ animationDelay: `${index * 45}ms` }}
                >
                  {character === " " ? "\u00a0" : character}
                </span>
              ))}
            </h1>

            <p className="mt-3 text-[12px] tracking-[0.12em] text-white/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)]">
              저희의 새로운 시작에 초대합니다
            </p>

            <div className="mt-5 flex items-center justify-center gap-2">
              <span className="h-px w-8 bg-linear-to-r from-transparent to-sky-300/90" />
              <span className="text-[10px] text-rose-100/90">♥</span>
              <span className="h-px w-8 bg-linear-to-l from-transparent to-orange-300/90" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
