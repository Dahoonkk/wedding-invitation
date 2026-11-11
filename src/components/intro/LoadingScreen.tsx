import { useEffect, useState, useRef } from "react";

interface LoadingScreenProps {
  onComplete: () => void;
}

const lines = [
  { text: "> npm install love --save", delay: 18 },
  { text: '> npm run "우리"', delay: 18 },
  { text: "> loading hearts... done", delay: 15 },
  { text: "> drawing 다훈 💧 × 은하 🔥", delay: 15 },
];

const finalLines = [
  {
    text: "> compiling wedding invitation...",
    delay: 15,
    color: "text-green-400",
  },
  { text: "✓ deploy success 🌈", delay: 18, color: "text-rose-400" },
];

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [phase, setPhase] = useState<"lines" | "image" | "final" | "done">(
    "lines",
  );
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [finalIndex, setFinalIndex] = useState(0);
  const [finalCharIndex, setFinalCharIndex] = useState(0);
  const [displayedFinal, setDisplayedFinal] = useState<
    { text: string; color?: string }[]
  >([]);
  const [showCursor, setShowCursor] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);

  const totalSteps = lines.length + 1 + finalLines.length;
  const currentStep =
    phase === "lines"
      ? lineIndex
      : phase === "image"
        ? lines.length
        : phase === "final"
          ? lines.length + 1 + finalIndex
          : totalSteps;
  const progress = Math.min(100, Math.round((currentStep / totalSteps) * 100));

  useEffect(() => {
    const t = setInterval(() => setShowCursor((p) => !p), 450);
    return () => clearInterval(t);
  }, []);

  // 1단계 타이핑
  useEffect(() => {
    if (phase !== "lines") return;
    if (lineIndex >= lines.length) {
      setPhase("image");
      return;
    }

    const current = lines[lineIndex].text;
    if (charIndex <= current.length) {
      const timer = setTimeout(() => {
        setDisplayedLines((prev) => {
          const next = [...prev];
          next[lineIndex] = current.slice(0, charIndex);
          return next;
        });
        setCharIndex((c) => c + 1);
      }, lines[lineIndex].delay);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      setLineIndex((i) => i + 1);
      setCharIndex(0);
    }, 100);
    return () => clearTimeout(timer);
  }, [phase, lineIndex, charIndex]);

  // 이미지
  useEffect(() => {
    if (phase !== "image") return;
    setShowImage(true);
    const timer = setTimeout(() => setPhase("final"), 1100);
    return () => clearTimeout(timer);
  }, [phase]);

  // 최종 타이핑
  useEffect(() => {
    if (phase !== "final") return;
    if (finalIndex >= finalLines.length) {
      setPhase("done");
      return;
    }

    const current = finalLines[finalIndex].text;
    if (finalCharIndex <= current.length) {
      const timer = setTimeout(() => {
        setDisplayedFinal((prev) => {
          const next = [...prev];
          next[finalIndex] = {
            text: current.slice(0, finalCharIndex),
            color: finalLines[finalIndex].color,
          };
          return next;
        });
        setFinalCharIndex((c) => c + 1);
      }, finalLines[finalIndex].delay);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      setFinalIndex((i) => i + 1);
      setFinalCharIndex(0);
    }, 110);
    return () => clearTimeout(timer);
  }, [phase, finalIndex, finalCharIndex]);

  // 종료
  useEffect(() => {
    if (phase !== "done") return;
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(onComplete, 550);
    }, 900);
    return () => clearTimeout(timer);
  }, [phase, onComplete]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [displayedLines, displayedFinal, showImage]);

  const handleSkip = () => {
    setFadeOut(true);
    setTimeout(onComplete, 400);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-stone-200 transition-opacity duration-500 ${
        fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="w-full max-w-[430px] h-[100dvh] bg-black flex items-center justify-center">
        <div className="w-full px-5">
          {/* 상단 바 */}
          <div className="flex items-center gap-2 px-3 py-2 mb-4">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <div
              className="w-2.5 h-2.5 rounded-full bg-yellow-500 animate-pulse"
              style={{ animationDelay: "0.2s" }}
            />
            <div
              className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"
              style={{ animationDelay: "0.4s" }}
            />
            <span className="ml-2 text-[11px] text-stone-500 font-mono">
              love_terminal
            </span>
          </div>

          {/* 터미널 본문 */}
          <div
            ref={terminalRef}
            className="h-[390px] overflow-y-auto font-mono text-[13px] leading-relaxed
                       rounded-2xl border border-stone-800 bg-stone-950/70 px-4 py-3 pr-2"
          >
            {displayedLines.map((text, i) => (
              <div key={`l-${i}`} className="text-green-400 mb-1.5">
                {text}
                {phase === "lines" && i === lineIndex && showCursor && (
                  <span className="inline-block w-2 h-3.5 bg-green-400 ml-0.5 align-middle" />
                )}
              </div>
            ))}

            {showImage && (
              <div className="my-4 relative overflow-hidden rounded-xl">
                <img
                  src={`${import.meta.env.BASE_URL}images/no_gallery/amber-wade.png`}
                  alt="Ember & Wade"
                  className="w-full max-w-[280px] mx-auto block animate-[terminalPrint_1.2s_ease-out_forwards]"
                />
              </div>
            )}

            {displayedFinal.map((line, i) => (
              <div
                key={`f-${i}`}
                className={`${line.color || "text-green-400"} mb-1.5`}
              >
                {line.text}
                {phase === "final" && i === finalIndex && showCursor && (
                  <span className="inline-block w-2 h-3.5 bg-green-400 ml-0.5 align-middle" />
                )}
              </div>
            ))}
          </div>

          {/* 진행률 바 */}
          <div className="mt-4 mb-2">
            <div className="flex justify-between text-[10px] text-stone-500 font-mono mb-1">
              <span>deploying...</span>
              <span>{progress}%</span>
            </div>
            <div className="h-0.5 w-full bg-stone-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 via-green-400 to-rose-400 transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* 하단 */}
          <div className="mt-4 relative">
            <p className="text-center text-[11px] tracking-[0.25em] text-stone-500 font-mono">
              DAHOON ❤️ EUNHA
            </p>
            <button
              onClick={handleSkip}
              className="absolute right-0 top-1/2 -translate-y-1/2 
                         px-3 py-1 text-[10px] tracking-widest 
                         text-stone-500 border border-stone-700 rounded-full
                         hover:text-white hover:border-stone-400 
                         transition-all duration-300 active:scale-95"
            >
              SKIP
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes terminalPrint {
          0% { clip-path: inset(0 0 100% 0); opacity: 0.6; }
          100% { clip-path: inset(0 0 0 0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
