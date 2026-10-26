import { useState, useEffect, useRef, type TouchEvent } from "react";
import { WEDDING } from "../lib/constants";

export default function Gallery() {
  const images = WEDDING.gallery;
  const [showAll, setShowAll] = useState(false);
  const [closing, setClosing] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const swipeStartX = useRef<number | null>(null);

  const getSrc = (src: string, index: number) =>
    `${import.meta.env.BASE_URL}${String(
      src || `images/${index + 1}.png`,
    ).replace(/^\//, "")}`;

  const openAll = () => {
    setClosing(false);
    setShowAll(true);
  };

  const closeAll = () => {
    setClosing(true);
    setTimeout(() => {
      setShowAll(false);
      setClosing(false);
    }, 320);
  };

  const handleSwipeStart = (event: TouchEvent<HTMLDivElement>) => {
    swipeStartX.current = event.touches[0]?.clientX ?? null;
  };

  const handleSwipeEnd = (event: TouchEvent<HTMLDivElement>) => {
    const startX = swipeStartX.current;
    swipeStartX.current = null;
    if (startX === null) return;

    const deltaX = event.changedTouches[0].clientX - startX;
    if (Math.abs(deltaX) < 45) return;

    setLightboxIndex((current) => {
      if (current === null) return current;
      return deltaX < 0
        ? (current + 1) % images.length
        : (current - 1 + images.length) % images.length;
    });
  };

  useEffect(() => {
    if (showAll || lightboxIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showAll, lightboxIndex]);

  // 핀치 줌 방지 (라이트박스 / 전체보기 공통)
  useEffect(() => {
    if (lightboxIndex === null && !showAll) return;

    const preventGesture = (e: Event) => e.preventDefault();

    document.addEventListener("gesturestart", preventGesture, {
      passive: false,
    });
    document.addEventListener("gesturechange", preventGesture, {
      passive: false,
    });
    document.addEventListener("gestureend", preventGesture, {
      passive: false,
    });

    return () => {
      document.removeEventListener("gesturestart", preventGesture);
      document.removeEventListener("gesturechange", preventGesture);
      document.removeEventListener("gestureend", preventGesture);
    };
  }, [lightboxIndex, showAll]);

  const previewImages = images.slice(0, 5);

  return (
    <section className="px-5 pt-28 pb-14 md:pt-24 md:pb-16 overflow-hidden">
      {/* 라벨 */}
      <div className="flex flex-col items-center mb-8">
        <p className="text-[11px] md:text-[12px] tracking-[0.28em] text-rose-400 font-bold">
          GALLERY
        </p>
        <span className="mt-2 w-6 h-px bg-rose-300/70" />
      </div>

      {/* 미리보기 그리드 */}
      <div className="relative max-w-[340px] mx-auto">
        <div className="absolute -inset-4 bg-gradient-to-br from-rose-200/20 via-white/5 to-sky-200/20 blur-2xl pointer-events-none rounded-[36px]" />

        <div className="relative space-y-2.5">
          {previewImages[0] && (
            <button
              type="button"
              onClick={() => setLightboxIndex(0)}
              aria-label="대표 사진 크게 보기"
              className="group relative block w-full overflow-hidden rounded-[24px]
                         border border-white/70 bg-white/30 shadow-[0_14px_34px_rgba(70,55,40,0.09)]
                         aspect-[4/4.6] cursor-pointer transition duration-500 hover:shadow-[0_18px_40px_rgba(70,55,40,0.14)] active:scale-[0.99]"
            >
              <img
                src={getSrc(previewImages[0], 0)}
                alt="gallery-main"
                draggable={false}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 pointer-events-none select-none"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-stone-950/20 pointer-events-none" />
            </button>
          )}

          {previewImages.length > 1 && (
            <div className="grid grid-cols-2 gap-2.5">
              {previewImages.slice(1, 3).map((src, idx) => {
                const actualIndex = idx + 1;
                return (
                  <button
                    type="button"
                    key={actualIndex}
                    onClick={() => setLightboxIndex(actualIndex)}
                    aria-label={`사진 ${actualIndex + 1} 크게 보기`}
                    className="group relative block w-full overflow-hidden rounded-[18px]
                               border border-white/70 bg-white/25 shadow-[0_8px_22px_rgba(70,55,40,0.07)]
                               aspect-[3/3.6] cursor-pointer transition duration-500 hover:shadow-[0_12px_28px_rgba(70,55,40,0.12)] active:scale-[0.98]"
                  >
                    <img
                      src={getSrc(src, actualIndex)}
                      alt={`gallery-${actualIndex + 1}`}
                      draggable={false}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 pointer-events-none select-none"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/10 pointer-events-none" />
                  </button>
                );
              })}
            </div>
          )}

          {previewImages.length > 3 && (
            <div className="grid grid-cols-2 gap-2.5">
              {previewImages.slice(3, 5).map((src, idx) => {
                const actualIndex = idx + 3;
                return (
                  <button
                    type="button"
                    key={actualIndex}
                    onClick={() => setLightboxIndex(actualIndex)}
                    aria-label={`사진 ${actualIndex + 1} 크게 보기`}
                    className="group relative block w-full overflow-hidden rounded-[18px]
                               border border-white/70 bg-white/25 shadow-[0_8px_22px_rgba(70,55,40,0.07)]
                               aspect-[3/3.6] cursor-pointer transition duration-500 hover:shadow-[0_12px_28px_rgba(70,55,40,0.12)] active:scale-[0.98]"
                  >
                    <img
                      src={getSrc(src, actualIndex)}
                      alt={`gallery-${actualIndex + 1}`}
                      draggable={false}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 pointer-events-none select-none"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/10 pointer-events-none" />
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 전체보기 버튼 */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={openAll}
          className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full
                     text-[12px] tracking-[0.18em] font-medium text-stone-700
                     bg-white/70 backdrop-blur-xl border border-white/80
                     shadow-[0_4px_16px_rgba(0,0,0,0.04)]
                     active:scale-95 transition"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
          전체 사진보기 ({images.length})
          <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
        </button>
      </div>

      {/* 전체보기 시트 */}
      {showAll && (
        <div className="fixed inset-0 z-50 flex items-end justify-center touch-none">
          <div
            className={`absolute inset-0 bg-stone-950/60 backdrop-blur-sm transition-opacity duration-300 ${
              closing ? "opacity-0" : "opacity-100"
            }`}
            onClick={closeAll}
          />

          <div
            className={`relative w-full max-w-[430px] h-[85dvh] flex flex-col
                        bg-white/85 backdrop-blur-2xl border-t border-x border-white/80 rounded-t-[32px]
                        shadow-[0_-10px_40px_rgba(0,0,0,0.1)] touch-pan-y
                        ${
                          closing
                            ? "animate-[sheetOut_0.32s_ease-in_forwards]"
                            : "animate-[sheetIn_0.35s_ease-out]"
                        }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="shrink-0 rounded-t-[32px] bg-white/40 backdrop-blur-xl border-b border-white/60 z-10">
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-12 h-1.5 bg-stone-300/60 rounded-full" />
              </div>

              <div className="px-5 pb-3 pt-1 flex items-center justify-between">
                <div className="w-8" />
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="w-1 h-1 rounded-full bg-sky-400/80" />
                    <p className="text-[10px] tracking-[0.25em] text-stone-400 font-bold font-mono">
                      GALLERY
                    </p>
                    <span className="w-1 h-1 rounded-full bg-rose-400/80" />
                  </div>
                  <p className="text-[16px] text-stone-800 font-medium tracking-wide">
                    전체 사진 ({images.length})
                  </p>
                </div>
                <button
                  onClick={closeAll}
                  className="w-8 h-8 rounded-full bg-white/70 border border-white/90
                             text-stone-500 flex items-center justify-center shadow-sm
                             active:scale-95 transition"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 pb-10 overscroll-contain">
              <div className="grid grid-cols-2 gap-2.5">
                {images.map((src, index) => (
                  <button
                    key={index}
                    onClick={() => setLightboxIndex(index)}
                    className="aspect-[3/4] rounded-2xl overflow-hidden border border-white/40 relative
                               shadow-sm opacity-0 animate-[fadeUp_0.4s_ease-out_forwards]
                               active:scale-[0.98] transition"
                    style={{ animationDelay: `${Math.min(index, 12) * 40}ms` }}
                  >
                    <img
                      src={getSrc(src, index)}
                      alt={`gallery-${index + 1}`}
                      draggable={false}
                      className="w-full h-full object-cover pointer-events-none select-none"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/10 pointer-events-none" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 라이트박스 */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-stone-950/95 backdrop-blur-lg
                     touch-none select-none"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex(null);
            }}
            className="absolute top-5 right-5 w-10 h-10 rounded-full
                       bg-white/10 border border-white/20
                       text-white/90 text-lg flex items-center justify-center z-10
                       active:scale-95 transition"
          >
            ✕
          </button>

          <div
            className="flex w-auto max-w-full flex-col items-center gap-3 px-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="relative flex w-auto max-w-full items-center justify-center"
              onTouchStart={handleSwipeStart}
              onTouchEnd={handleSwipeEnd}
            >
              <button
                aria-label="이전 사진"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((current) =>
                    current === null || current === 0
                      ? images.length - 1
                      : current - 1,
                  );
                }}
                className="absolute left-2 top-1/2 z-10 flex h-12 w-8 -translate-y-1/2 items-center justify-center
                           text-white/90 text-4xl font-light leading-none drop-shadow-[0_1px_5px_rgba(0,0,0,0.75)]
                           active:scale-90 transition sm:left-3"
              >
                ‹
              </button>
              <img
                src={getSrc(images[lightboxIndex], lightboxIndex)}
                alt="preview"
                draggable={false}
                className="max-h-[82dvh] max-w-full object-contain rounded-xl shadow-2xl animate-[fadeIn_0.25s_ease-out]
                           pointer-events-none select-none"
                style={{
                  WebkitUserSelect: "none",
                  userSelect: "none",
                  WebkitTouchCallout: "none",
                }}
              />
              <button
                aria-label="다음 사진"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((current) =>
                    current === null || current === images.length - 1
                      ? 0
                      : current + 1,
                  );
                }}
                className="absolute right-2 top-1/2 z-10 flex h-12 w-8 -translate-y-1/2 items-center justify-center
                           text-white/90 text-4xl font-light leading-none drop-shadow-[0_1px_5px_rgba(0,0,0,0.75)]
                           active:scale-90 transition sm:right-3"
              >
                ›
              </button>
            </div>
            <p className="text-[13px] tracking-widest font-mono text-white/70">
              {String(lightboxIndex + 1).padStart(2, "0")} /{" "}
              {String(images.length).padStart(2, "0")}
            </p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes sheetIn {
          from { transform: translateY(100%); opacity: 0.6; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes sheetOut {
          from { transform: translateY(0); opacity: 1; }
          to { transform: translateY(100%); opacity: 0.6; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </section>
  );
}
