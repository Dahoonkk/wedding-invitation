import { useEffect, useState } from "react";
import { WEDDING } from "../lib/constants";

export default function Hero() {
  const [visible, setVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
  });
  const [photoOpen, setPhotoOpen] = useState(false);
  const [photoClosing, setPhotoClosing] = useState(false);

  useEffect(() => {
    const target = new Date(WEDDING.date).getTime();

    const update = () => {
      const distance = target - Date.now();

      if (distance <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        ),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
      });
    };

    update();
    const timer = setInterval(update, 1000 * 30);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 150);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (photoOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [photoOpen]);

  const openPhoto = () => {
    setPhotoClosing(false);
    setPhotoOpen(true);
  };

  const closePhoto = () => {
    setPhotoClosing(true);
    setTimeout(() => {
      setPhotoOpen(false);
      setPhotoClosing(false);
    }, 280);
  };

  const weddingDate = new Date(WEDDING.date);
  const dateStr = weddingDate.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const coupleSrc = `${import.meta.env.BASE_URL}images/no_gallery/22.png`;

  return (
    <section className="relative">
      {/* 메인 커버 */}
      <div className="relative w-full h-[58vh] min-h-[320px] max-h-[480px] overflow-hidden">
        <img
          src={`${import.meta.env.BASE_URL}images/1.png`}
          alt="Main Cover"
          className="w-full h-full object-cover object-center scale-105 transform-gpu animate-[slowZoom_18s_ease-out_forwards]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/55 via-stone-900/15 to-transparent" />
      </div>

      {/* 글래스 카드 */}
      <div className="px-5 -mt-16 relative z-10">
        <div
          className={`relative rounded-3xl bg-white/65 backdrop-blur-2xl border border-white/80
                      shadow-[0_18px_50px_rgba(0,0,0,0.08),inset_0_1px_1px_rgba(255,255,255,0.95)]
                      px-6 pt-5 pb-5 text-center
                      transition-all duration-700 ease-out ${
                        visible
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-4"
                      }`}
        >
          <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-white to-transparent" />

          <p
            className="mb-3 text-[23px] text-stone-700"
            style={{ fontFamily: "'Great Vibes', cursive" }}
          >
            Our Beginning
          </p>

          {/* 프로필 */}
          <button
            type="button"
            onClick={openPhoto}
            className="relative mx-auto mb-3 h-[104px] w-[104px] rounded-full
                       p-[3px] bg-gradient-to-br from-cyan-300 via-rose-300 to-orange-300
                       shadow-[0_8px_24px_rgba(244,114,182,0.25)]
                       active:scale-95 transition-transform duration-200"
            aria-label="프로필 사진 보기"
          >
            <div className="w-full h-full rounded-full overflow-hidden border-[2.5px] border-white bg-white">
              <img
                src={coupleSrc}
                alt="Couple"
                className="w-full h-full object-cover"
              />
            </div>
          </button>

          {/* 이름 */}
          <h1 className="text-[22px] font-medium tracking-[0.04em] text-stone-800">
            <span className="text-sky-600">{WEDDING.groom.name}</span>
            <span className="mx-2.5 text-rose-400">♥</span>
            <span className="text-orange-500">{WEDDING.bride.name}</span>
          </h1>

          {/* 날짜 */}
          <p className="mt-1.5 text-[13px] md:text-[14px] text-stone-500 tracking-wide">
            {dateStr}
          </p>

          {/* D-DAY 라벨 */}
          <div className="mt-4 flex items-center justify-center gap-2.5">
            <span className="w-10 h-px bg-gradient-to-r from-transparent to-sky-300/80" />
            <span className="text-[10px] md:text-[11px] tracking-[0.22em] text-stone-400 font-semibold">
              D-DAY
            </span>
            <span className="w-10 h-px bg-gradient-to-l from-transparent to-orange-300/80" />
          </div>

          <p className="mt-2.5 text-[12px] md:text-[13px] tracking-[0.12em] text-stone-500">
            우리의 무지개가 피어나기까지
          </p>

          {/* 박스 없는 카운트다운 */}
          <div className="mt-4 flex items-end justify-center gap-4">
            {[
              { label: "DAYS", value: timeLeft.days, color: "text-sky-500" },
              { label: "HRS", value: timeLeft.hours, color: "text-rose-500" },
              {
                label: "MIN",
                value: timeLeft.minutes,
                color: "text-orange-500",
              },
            ].map((item, i) => (
              <div key={item.label} className="flex items-end gap-4">
                <div className="flex min-w-[58px] flex-col items-center">
                  <p
                    className={`text-[22px] md:text-[24px] font-semibold tabular-nums leading-none ${item.color}`}
                  >
                    {String(item.value).padStart(2, "0")}
                  </p>
                  <p className="mt-1.5 text-[10px] md:text-[11px] tracking-[0.18em] text-stone-400">
                    {item.label}
                  </p>
                </div>

                {i < 2 && (
                  <span className="mb-5 text-[12px] text-stone-300 select-none">
                    :
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 프로필 사진 확대 모달 */}
      {photoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className={`absolute inset-0 bg-stone-950/70 backdrop-blur-md transition-opacity duration-300 ${
              photoClosing ? "opacity-0" : "opacity-100"
            }`}
            onClick={closePhoto}
          />

          <div
            className={`relative z-10 w-full max-w-[340px] ${
              photoClosing
                ? "animate-[photoOut_0.28s_ease-in_forwards]"
                : "animate-[photoIn_0.32s_ease-out]"
            }`}
          >
            <div className="bg-[#faf9f7] rounded-xl border border-white/40 shadow-[0_25px_60px_rgba(0,0,0,0.35)] p-3 pb-0">
              <div className="relative w-full aspect-[4/5] overflow-hidden rounded-lg bg-stone-100">
                <img
                  src={coupleSrc}
                  alt="Couple large"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="h-[68px] flex items-center justify-center px-3">
                <p
                  className="text-[19px] text-stone-700 text-center"
                  style={{ fontFamily: "'Nanum Pen Script', cursive" }}
                >
                  웨딩 촬영 날 ♥
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={closePhoto}
            className={`absolute top-6 right-6 w-10 h-10 rounded-full
                        bg-white/20 border border-white/30 text-white
                        flex items-center justify-center z-20 active:scale-95 transition-all
                        ${photoClosing ? "opacity-0" : "opacity-100"}`}
            aria-label="닫기"
          >
            ✕
          </button>
        </div>
      )}

      <style>{`
        @keyframes slowZoom {
          from { transform: scale(1.05); }
          to { transform: scale(1); }
        }
        @keyframes photoIn {
          from { opacity: 0; transform: scale(0.7); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes photoOut {
          from { opacity: 1; transform: scale(1); }
          to { opacity: 0; transform: scale(0.7); }
        }
      `}</style>
    </section>
  );
}
