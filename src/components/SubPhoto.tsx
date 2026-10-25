import { WEDDING } from "../lib/constants";

export default function SubPhoto() {
  return (
    <section className="px-6 pt-28 pb-14 md:pt-24 md:pb-16">
      {/* 라벨 */}
      <div className="flex flex-col items-center mb-10">
        <p className="text-[11px] md:text-[12px] tracking-[0.28em] text-rose-400 font-bold">
          OUR STORY
        </p>
        <span className="mt-2 w-6 h-px bg-rose-300/70" />
      </div>

      {/* 인용 문구 */}
      <div className="relative text-center mb-12 max-w-sm mx-auto">
        <span
          className="absolute -top-7 left-1/2 -translate-x-1/2 text-5xl text-rose-300/60 leading-none select-none pointer-events-none"
          style={{ fontFamily: "'Great Vibes', cursive" }}
        >
          “
        </span>

        <p
          className="relative z-10 text-[23px] leading-[1.9] text-stone-500 whitespace-pre-line px-1"
          style={{
            fontFamily: "'Nanum Pen Script', cursive",
            fontWeight: 400,
            WebkitFontSmoothing: "antialiased",
          }}
        >
          {WEDDING.quote}
        </p>

        <div className="mt-8 flex items-center justify-center gap-3">
          <span className="w-8 h-px bg-gradient-to-r from-transparent to-stone-300" />
          <span className="text-[10px] text-rose-300">♥</span>
          <span className="w-8 h-px bg-gradient-to-l from-transparent to-stone-300" />
        </div>
      </div>

      {/* 폴라로이드 */}
      <div className="relative w-full max-w-md mx-auto -rotate-1 transform-gpu">
        <div className="absolute -inset-1 rounded-sm bg-stone-300/25 blur-md pointer-events-none" />

        <div className="relative bg-[#faf9f7] rounded-[3px] border border-stone-200/50 shadow-[0_10px_36px_rgba(0,0,0,0.1),inset_0_1px_1px_rgba(255,255,255,0.9)] p-2.5 pb-0">
          <div className="relative w-full aspect-[16/10] overflow-hidden bg-stone-100 rounded-[2px]">
            <img
              src={`${import.meta.env.BASE_URL}images/9.png`}
              alt="wedding"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-amber-50/10 pointer-events-none" />
          </div>

          <div className="h-[64px] flex items-center justify-center px-3">
            <p
              className="text-[19px] md:text-[21px] text-stone-600 text-center"
              style={{ fontFamily: "'Nanum Pen Script', cursive" }}
            >
              우리 결혼해요 ~ :)
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
