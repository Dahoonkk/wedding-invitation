import { useState } from "react";
import confetti from "canvas-confetti";

export default function Greeting() {
  const [elementalStep, setElementalStep] = useState<
    "idle" | "water" | "found"
  >("idle");
  const [elementalHint, setElementalHint] = useState("");

  const handleElementTap = (element: "water" | "fire") => {
    if (elementalStep === "found") return;

    if (element === "water") {
      setElementalStep("water");
      setElementalHint(
        "푸른 물빛이 반짝였어요. 이제 따뜻한 불빛을 만나게 해주세요.",
      );
      return;
    }

    if (elementalStep !== "water") {
      setElementalHint("먼저 파란 말풍선을 눌러 물을 깨워보세요.");
      return;
    }

    setElementalStep("found");
    setElementalHint("두 원소가 만나 둘만의 무지개를 피워냈어요.");
    window.dispatchEvent(new Event("wedding:rainbow-bloom"));

    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      confetti({
        particleCount: 48,
        spread: 72,
        startVelocity: 28,
        gravity: 0.85,
        ticks: 110,
        origin: { x: 0.5, y: 0.58 },
        colors: ["#38bdf8", "#22d3ee", "#fb7185", "#fb923c", "#fde68a"],
        zIndex: 60,
      });
    }
  };

  return (
    <section className="px-6 pt-28 pb-14 md:pt-24 md:pb-16">
      {/* 라벨 */}
      <div className="flex flex-col items-center mb-10">
        <p className="text-[11px] md:text-[12px] tracking-[0.28em] text-rose-400 font-bold">
          INVITATION
        </p>
        <span className="mt-2 w-6 h-px bg-rose-300/70" />
      </div>

      {/* 말풍선 */}
      <div className="space-y-4 mb-10 max-w-[400px] mx-auto">
        {/* 오른쪽 - 물 문구 */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => handleElementTap("fire")}
            aria-label="따뜻한 불빛 깨우기"
            aria-pressed={elementalStep === "found"}
            className={`relative mr-2 max-w-[84%] cursor-pointer border-0 bg-transparent p-0 text-left drop-shadow-[0_10px_16px_rgba(180,83,9,0.12)] transition-transform duration-300 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 focus-visible:ring-offset-4 ${elementalStep === "found" ? "scale-[1.025]" : ""}`}
          >
            <span
              aria-hidden="true"
              className="absolute -right-[9px] top-[62%] z-0 h-6 w-5 -translate-y-1/2 bg-orange-50/90"
              style={{
                clipPath: "polygon(0 0, 100% 50%, 0 100%)",
                backgroundImage:
                  "radial-gradient(ellipse at 20% 0%, rgba(255,255,255,0.82), transparent 72%)",
              }}
            />
            <div className="relative z-10 overflow-hidden rounded-[22px] bg-orange-50/90 px-4 py-3.5 text-orange-950 backdrop-blur-2xl">
              <span className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[radial-gradient(ellipse_at_20%_0%,rgba(255,255,255,0.78),transparent_72%)]" />
              <span className="pointer-events-none absolute -right-5 -top-8 h-20 w-20 rounded-full bg-amber-200/25 blur-2xl" />
              <p className="relative text-[15px] md:text-[16px] leading-7 font-normal">
                💧 물처럼 부드럽게 감싸주는
                <br />
                사람을 만났습니다
              </p>
            </div>
          </button>
        </div>

        {/* 왼쪽 - 불 문구 */}
        <div className="flex justify-start">
          <button
            type="button"
            onClick={() => handleElementTap("water")}
            aria-label="푸른 물빛 깨우기"
            aria-pressed={
              elementalStep === "water" || elementalStep === "found"
            }
            className={`relative ml-2 max-w-[84%] cursor-pointer border-0 bg-transparent p-0 text-left drop-shadow-[0_10px_16px_rgba(3,105,161,0.12)] transition-transform duration-300 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-4 ${elementalStep === "water" || elementalStep === "found" ? "scale-[1.025]" : ""}`}
          >
            <span
              aria-hidden="true"
              className="absolute -left-[9px] top-[62%] z-0 h-6 w-5 -translate-y-1/2 bg-sky-50/90"
              style={{
                clipPath: "polygon(100% 0, 0 50%, 100% 100%)",
                backgroundImage:
                  "radial-gradient(ellipse at 80% 0%, rgba(255,255,255,0.84), transparent 72%)",
              }}
            />
            <div className="relative z-10 overflow-hidden rounded-[22px] bg-sky-50/90 px-4 py-3.5 text-sky-950 backdrop-blur-2xl">
              <span className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[radial-gradient(ellipse_at_80%_0%,rgba(255,255,255,0.8),transparent_72%)]" />
              <span className="pointer-events-none absolute -left-5 -top-8 h-20 w-20 rounded-full bg-cyan-200/25 blur-2xl" />
              <p className="relative text-[15px] md:text-[16px] leading-7 font-normal">
                🔥 불처럼 따뜻하게 비춰주는
                <br />
                사람을 만났습니다
              </p>
            </div>
          </button>
        </div>
      </div>

      {elementalHint && (
        <p
          aria-live="polite"
          className={`mx-auto -mt-5 mb-8 max-w-[330px] text-center text-[12px] leading-relaxed transition-all duration-500 ${elementalStep === "found" ? "elemental-rainbow-reveal font-medium text-rose-600" : "text-stone-500"}`}
        >
          {elementalStep === "found" && <span aria-hidden="true">🌈 </span>}
          {elementalHint}
          {elementalStep === "found" && <span aria-hidden="true"> 💧🔥</span>}
        </p>
      )}

      {/* 구분선 */}
      <div className="flex items-center justify-center gap-3 mb-10">
        <span className="w-10 h-px bg-gradient-to-r from-transparent to-stone-300" />
        <span className="text-[11px] text-rose-300">♥</span>
        <span className="w-10 h-px bg-gradient-to-l from-transparent to-stone-300" />
      </div>

      {/* 본문 */}
      <div className="text-center space-y-6 max-w-[350px] mx-auto">
        <p className="text-[16px] md:text-[17px] leading-[1.95] text-stone-700 font-light">
          투명한 물방울에 빛이 스며들어 영롱한 색을 내듯,
          <br />
          서로의 색을 온전히 품어내며
          <br />
          아름다운 무지개를 피워내려 합니다.
        </p>

        <p className="text-[16px] md:text-[17px] leading-[1.95] text-stone-700 font-light">
          서로를 빛내줄 저희의 첫 걸음에
          <br />
          소중한 분들을 모시고 싶습니다.
        </p>
      </div>
    </section>
  );
}
