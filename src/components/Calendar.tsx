import { WEDDING } from "../lib/constants";

export default function Calendar() {
  const weddingDate = new Date(WEDDING.date);

  const year = weddingDate.getFullYear();
  const month = weddingDate.getMonth();
  const weddingDay = weddingDate.getDate();
  const weekday = weddingDate.getDay();

  const hours = weddingDate.getHours();
  const minutes = weddingDate.getMinutes();
  const ampm = hours >= 12 ? "오후" : "오전";
  const displayHour = hours % 12 || 12;
  const displayMinute = String(minutes).padStart(2, "0");
  const formattedTime = `${ampm} ${displayHour}:${displayMinute}`;

  const weekdaysKo = ["일", "월", "화", "수", "목", "금", "토"];
  const weekdayLabel = weekdaysKo[weekday];

  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  const days = ["S", "M", "T", "W", "T", "F", "S"];
  const dates = Array.from({ length: lastDate }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDay }, (_, i) => i);

  return (
    <section className="px-5 pt-28 pb-14 md:pt-24 md:pb-16">
      {/* 라벨 */}
      <div className="flex flex-col items-center mb-8">
        <p className="text-[11px] md:text-[12px] tracking-[0.28em] text-rose-400 font-bold">
          SAVE THE DATE
        </p>
        <span className="mt-2 w-6 h-px bg-rose-300/70" />
      </div>

      <div className="relative max-w-[380px] mx-auto">
        <div className="absolute -inset-1 rounded-[30px] bg-gradient-to-br from-rose-200/30 via-amber-100/20 to-sky-200/30 blur-lg pointer-events-none" />

        <div className="relative rounded-[28px] bg-white/65 backdrop-blur-2xl border border-white/80 shadow-[0_12px_36px_rgba(0,0,0,0.06),inset_0_1px_1px_rgba(255,255,255,0.95)] overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/90 to-transparent" />

          <div className="p-6 md:p-7">
            {/* 헤더 */}
            <div className="text-center mb-7">
              <p className="text-[21px] md:text-[23px] text-stone-800 font-light tracking-wide">
                {year}. {String(month + 1).padStart(2, "0")}
              </p>
              <p className="mt-1.5 text-[14px] text-stone-500 font-light">
                {weddingDay}일 · {weekdayLabel}요일
              </p>

              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/90 backdrop-blur-md border border-rose-200/70 px-4 py-1.5 shadow-[0_4px_14px_rgba(244,63,94,0.08)]">
                <span className="w-2 h-2 rounded-full bg-gradient-to-r from-sky-400 via-amber-400 to-rose-400" />
                <span className="text-[15px] md:text-[16px] font-semibold text-stone-800 tracking-wide">
                  {formattedTime}
                </span>
              </div>
            </div>

            {/* 요일 */}
            <div className="grid grid-cols-7 mb-3 border-b border-stone-200/40 pb-2">
              {days.map((d, i) => (
                <div
                  key={i}
                  className={`text-center text-[12px] font-medium tracking-wider ${
                    i === 0
                      ? "text-rose-400"
                      : i === 6
                        ? "text-sky-400"
                        : "text-stone-400"
                  }`}
                >
                  {d}
                </div>
              ))}
            </div>

            {/* 날짜 */}
            <div className="grid grid-cols-7 gap-y-1.5">
              {blanks.map((_, i) => (
                <div key={`blank-${i}`} className="h-10" />
              ))}

              {dates.map((date, idx) => {
                const isWedding = date === weddingDay;
                const dayOfWeek = (firstDay + idx) % 7;
                const isSunday = dayOfWeek === 0;
                const isSaturday = dayOfWeek === 6;

                return (
                  <div
                    key={date}
                    className="flex justify-center items-center h-10"
                  >
                    {isWedding ? (
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-rose-400 via-amber-300 to-sky-400 flex items-center justify-center shadow-[0_4px_14px_rgba(244,63,94,0.3)]">
                        <span className="text-white text-[14px] font-semibold">
                          {date}
                        </span>
                      </div>
                    ) : (
                      <span
                        className={`text-[14px] ${
                          isSunday
                            ? "text-rose-400/90 font-light"
                            : isSaturday
                              ? "text-sky-400/90 font-light"
                              : "text-stone-600 font-light"
                        }`}
                      >
                        {date}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
