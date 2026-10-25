import { useState, useRef, useEffect } from "react";
import { WEDDING } from "../lib/constants";

export default function Gallery() {
  const images = WEDDING.gallery;
  const [activeIndex, setActiveIndex] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const [closing, setClosing] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const startX = useRef(0);
  const deltaX = useRef(0);
  const isDragging = useRef(false);

  const getSrc = (src: string, index: number) =>
    `${import.meta.env.BASE_URL}${String(src || `images/${index + 1}.png`).replace(/^\//, "")}`;

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

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

  const onStart = (clientX: number) => {
    isDragging.current = true;
    startX.current = clientX;
    deltaX.current = 0;
  };

  const onMove = (clientX: number) => {
    if (!isDragging.current) return;
    deltaX.current = clientX - startX.current;
  };

  const onEnd = () => {
    if (!isDragging.current) return;
    const diff = deltaX.current;
    if (diff > 40) handlePrev();
    else if (diff < -40) handleNext();
    isDragging.current = false;
    deltaX.current = 0;
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

  return (
    <section className="px-5 py-12 overflow-hidden">
      {/* 라벨 (기존 유지) */}
      <div className="flex flex-col items-center mb-8">
        <p className="text-[11px] md:text-[12px] tracking-[0.28em] text-rose-400 font-bold">
          GALLERY
        </p>
        <span className="mt-2 w-6 h-px bg-rose-300/70" />
      </div>

      {/* 커버플로우 */}
      <div className="relative">
        <div
          className="relative h-[340px] flex items-center justify-center perspective-[1000px] touch-pan-y select-none"
          onMouseDown={(e) => onStart(e.clientX)}
          onMouseMove={(e) => onMove(e.clientX)}
          onMouseUp={onEnd}
          onMouseLeave={onEnd}
          onTouchStart={(e) => onStart(e.touches[0].clientX)}
          onTouchMove={(e) => onMove(e.touches[0].clientX)}
          onTouchEnd={onEnd}
        >
          {images.map((src, index) => {
            const offset = index - activeIndex;
            let transform = "translateX(0) scale(1) rotateY(0deg)";
            let zIndex = 10;
            let opacity = 1;
            let boxShad = "0 12px 32px rgba(0,0,0,0.12)";

            if (offset === 0) {
              transform = "translateX(0) scale(1) rotateY(0deg)";
              zIndex = 20;
              boxShad =
                "0 16px 40px rgba(0,0,0,0.15), inset 0 1px 1px rgba(255,255,255,0.9)";
            } else if (offset === -1) {
              transform = "translateX(-120px) scale(0.78) rotateY(26deg)";
              opacity = 0.75;
            } else if (offset === 1) {
              transform = "translateX(120px) scale(0.78) rotateY(-26deg)";
              opacity = 0.75;
            } else if (offset < -1) {
              transform = "translateX(-200px) scale(0.62) rotateY(34deg)";
              opacity = 0;
              zIndex = 5;
            } else {
              transform = "translateX(200px) scale(0.62) rotateY(-34deg)";
              opacity = 0;
              zIndex = 5;
            }

            return (
              <div
                key={index}
                className="absolute w-[210px] aspect-[3/4] rounded-2xl overflow-hidden
                           border border-white/80 bg-white/40
                           transition-all duration-500 ease-out cursor-grab active:cursor-grabbing transform-gpu"
                style={{ transform, zIndex, opacity, boxShadow: boxShad }}
                onClick={() => {
                  if (Math.abs(deltaX.current) < 8) setLightboxIndex(index);
                }}
              >
                <img
                  src={getSrc(src, index)}
                  alt={`gallery-${index + 1}`}
                  className="w-full h-full object-cover pointer-events-none"
                  draggable={false}
                />
              </div>
            );
          })}
        </div>

        {/* 좌우 화살표 */}
        <button
          onClick={handlePrev}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full
                     bg-white/60 backdrop-blur-md border border-white/90
                     text-stone-600 text-lg flex items-center justify-center
                     shadow-[0_2px_12px_rgba(0,0,0,0.06)] active:scale-95 transition transform-gpu cursor-pointer"
          aria-label="이전 사진"
        >
          ‹
        </button>
        <button
          onClick={handleNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full
                     bg-white/60 backdrop-blur-md border border-white/90
                     text-stone-600 text-lg flex items-center justify-center
                     shadow-[0_2px_12px_rgba(0,0,0,0.06)] active:scale-95 transition transform-gpu cursor-pointer"
          aria-label="다음 사진"
        >
          ›
        </button>
      </div>

      {/* 인디케이터 */}
      <div className="flex justify-center gap-1.5 mt-5">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            aria-label={`${index + 1}번째 사진 보기`}
            className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
              index === activeIndex
                ? "bg-gradient-to-r from-rose-400 via-amber-300 to-sky-400 w-5"
                : "bg-stone-300/60 w-1.5"
            }`}
          />
        ))}
      </div>

      {/* 전체보기 버튼 */}
      <div className="mt-7 flex justify-center">
        <button
          onClick={openAll}
          className="group inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full
                     text-[11px] tracking-[0.2em] font-medium text-stone-600
                     bg-white/60 backdrop-blur-md border border-white/90
                     shadow-[0_4px_16px_rgba(0,0,0,0.05),inset_0_1px_1px_rgba(255,255,255,0.9)]
                     active:scale-95 transition transform-gpu cursor-pointer"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-rose-300/90" />
          전체보기
          <span className="w-1.5 h-1.5 rounded-full bg-sky-300/90" />
        </button>
      </div>

      {/* 전체보기 바텀 시트 모달 */}
      {showAll && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          {/* 딤드 배경 */}
          <div
            className={`absolute inset-0 bg-stone-950/60 backdrop-blur-sm transition-opacity duration-300 ${
              closing ? "opacity-0" : "opacity-100"
            }`}
            onClick={closeAll}
          />

          {/* 모달 컨테이너 (flex-col로 상단바 고정 및 내부 스크롤 완벽 처리) */}
          <div
            className={`relative w-full max-w-[430px] h-[85dvh] flex flex-col
                        bg-white/85 backdrop-blur-2xl border-t border-x border-white/80 rounded-t-[32px]
                        shadow-[0_-10px_40px_rgba(0,0,0,0.1),inset_0_1px_1px_rgba(255,255,255,0.9)]
                        transform-gpu
                        ${
                          closing
                            ? "animate-[sheetOut_0.32s_ease-in_forwards]"
                            : "animate-[sheetIn_0.35s_ease-out]"
                        }`}
          >
            {/* 개선된 상단바 (Sticky Header) */}
            <div className="shrink-0 rounded-t-[32px] bg-white/40 backdrop-blur-xl border-b border-white/60 shadow-[0_4px_16px_rgba(0,0,0,0.03)] z-10">
              {/* 드래그 손잡이 */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-12 h-1.5 bg-stone-300/60 rounded-full" />
              </div>

              {/* 중앙 정렬된 타이틀과 닫기 버튼 */}
              <div className="px-5 pb-3 pt-1 flex items-center justify-between">
                <div className="w-8" /> {/* 좌우 대칭을 위한 더미 공간 */}
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="w-1 h-1 rounded-full bg-rose-400/80" />
                    <p className="text-[10px] tracking-[0.25em] text-stone-400 font-bold font-mono">
                      GALLERY
                    </p>
                    <span className="w-1 h-1 rounded-full bg-sky-400/80" />
                  </div>
                  <p className="text-[16px] text-stone-800 font-medium tracking-wide">
                    전체 사진
                  </p>
                </div>
                <button
                  onClick={closeAll}
                  aria-label="닫기"
                  className="w-8 h-8 rounded-full bg-white/70 border border-white/90
                             text-stone-500 flex items-center justify-center shadow-sm
                             active:scale-95 transition cursor-pointer transform-gpu"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* 스크롤되는 사진 목록 영역 */}
            <div className="flex-1 overflow-y-auto p-4 pb-10">
              <div className="grid grid-cols-2 gap-2.5">
                {images.map((src, index) => (
                  <button
                    key={index}
                    onClick={() => setLightboxIndex(index)}
                    aria-label={`${index + 1}번째 사진 크게보기`}
                    className="aspect-[3/4] rounded-2xl overflow-hidden border border-white/80
                               shadow-[0_2px_8px_rgba(0,0,0,0.04)] opacity-0 animate-[fadeUp_0.4s_ease-out_forwards]
                               active:scale-[0.98] transition cursor-pointer transform-gpu"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <img
                      src={getSrc(src, index)}
                      alt={`gallery-${index + 1}`}
                      className="w-full h-full object-cover pointer-events-none"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 라이트박스 (전체화면 사진 보기) */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-stone-950/95 backdrop-blur-lg touch-none">
          <button
            onClick={() => setLightboxIndex(null)}
            aria-label="닫기"
            className="absolute top-5 right-5 w-10 h-10 rounded-full
                       bg-white/10 backdrop-blur-md border border-white/20
                       text-white/90 text-lg flex items-center justify-center z-10
                       active:scale-95 transition cursor-pointer transform-gpu"
          >
            ✕
          </button>

          <button
            onClick={() =>
              setLightboxIndex((prev) =>
                prev === null ? 0 : prev === 0 ? images.length - 1 : prev - 1,
              )
            }
            aria-label="이전"
            className="absolute left-3 w-11 h-11 rounded-full
                       bg-white/10 backdrop-blur-md border border-white/20
                       text-white/90 text-2xl flex items-center justify-center z-10
                       active:scale-95 transition cursor-pointer transform-gpu"
          >
            ‹
          </button>

          <div className="flex flex-col items-center gap-4 px-14">
            <img
              src={getSrc(images[lightboxIndex], lightboxIndex)}
              alt="preview"
              className="max-w-full max-h-[75dvh] object-contain rounded-xl shadow-2xl animate-[fadeIn_0.25s_ease-out]"
            />
            <p className="text-[12px] tracking-widest font-mono text-white/70">
              {String(lightboxIndex + 1).padStart(2, "0")} /{" "}
              {String(images.length).padStart(2, "0")}
            </p>
          </div>

          <button
            onClick={() =>
              setLightboxIndex((prev) =>
                prev === null ? 0 : prev === images.length - 1 ? 0 : prev + 1,
              )
            }
            aria-label="다음"
            className="absolute right-3 w-11 h-11 rounded-full
                       bg-white/10 backdrop-blur-md border border-white/20
                       text-white/90 text-2xl flex items-center justify-center z-10
                       active:scale-95 transition cursor-pointer transform-gpu"
          >
            ›
          </button>
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
