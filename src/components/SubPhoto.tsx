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
      <div className="relative mx-auto mb-12 max-w-sm px-3 pb-2 pt-5 text-center">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 font-serif text-[72px] leading-none text-sky-200/70"
        >
          “
        </span>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-6 right-0 font-serif text-[72px] leading-none text-rose-200/75"
        >
          ”
        </span>
        <p
          className="relative z-10 px-3 text-[24px] leading-[1.85] text-stone-700 whitespace-pre-line md:text-[27px]"
          style={{
            fontFamily: "'Nanum Pen Script', cursive",
            fontWeight: 500,
            WebkitFontSmoothing: "antialiased",
          }}
        >
          {WEDDING.quote}
        </p>

        <div className="mt-5 flex items-center justify-center gap-2">
          <span className="h-px w-8 bg-gradient-to-r from-transparent to-stone-300" />
          <span className="text-[10px] text-rose-300">♥</span>
          <span className="h-px w-8 bg-gradient-to-l from-transparent to-stone-300" />
        </div>
      </div>

      {/* 폴라로이드 */}
      <div className="relative w-full max-w-md mx-auto -rotate-1 transform-gpu">
        <div className="absolute -inset-1 rounded-sm bg-stone-300/18 blur-sm pointer-events-none" />

        <div className="relative rounded-[3px] border border-stone-200/50 bg-[#faf9f7] p-2.5 pb-0 shadow-[0_8px_26px_rgba(0,0,0,0.075),inset_0_1px_1px_rgba(255,255,255,0.9)]">
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
              저희 결혼해요 ~ :)
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
