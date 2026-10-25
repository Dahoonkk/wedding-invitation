export default function Greeting() {
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
        {/* 오른쪽 - 물 */}
        <div className="flex justify-end">
          <div className="relative mr-2 max-w-[84%] drop-shadow-[0_10px_16px_rgba(180,83,9,0.12)]">
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
          </div>
        </div>

        {/* 왼쪽 - 불 */}
        <div className="flex justify-start">
          <div className="relative ml-2 max-w-[84%] drop-shadow-[0_10px_16px_rgba(3,105,161,0.12)]">
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
          </div>
        </div>
      </div>

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
