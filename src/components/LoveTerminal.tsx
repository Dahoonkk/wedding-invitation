import { useEffect, useState } from "react";
import { WEDDING } from "../lib/constants";

const TERMINAL_EVENT = "wedding:open-terminal";

export function openLoveTerminal() {
  window.dispatchEvent(new Event(TERMINAL_EVENT));
}

type TerminalLine = {
  prompt?: string;
  text: string;
  color?: string;
  href?: string;
};

const escapeTerminalText = (value: string) =>
  value.replace(/[<>]/g, (character) => (character === "<" ? "‹" : "›"));

function getScheduleText() {
  const [date, time = "12:10"] = WEDDING.date.split("T");
  const [year, month, day] = date.split("-");
  const [hourText, minute = "00"] = time.split(":");
  const hour = Number(hourText);
  const period = hour >= 12 ? "오후" : "오전";
  const displayHour = hour % 12 || 12;
  const weekday = new Date(`${date}T12:00:00+09:00`).toLocaleDateString(
    "ko-KR",
    {
      weekday: "short",
      timeZone: "Asia/Seoul",
    },
  );

  return `${year}년 ${Number(month)}월 ${Number(day)}일 (${weekday}) ${period} ${displayHour}시 ${minute}분`;
}

function TerminalPixelPortrait() {
  const [pixels, setPixels] = useState<string[]>([]);
  const columns = 32;
  const rows = 42;

  useEffect(() => {
    const image = new Image();
    image.src = `${import.meta.env.BASE_URL}images/no_gallery/22.png`;
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = columns;
      canvas.height = rows;
      const context = canvas.getContext("2d");
      if (!context) return;

      const scale = Math.max(columns / image.width, rows / image.height);
      const width = image.width * scale;
      const height = image.height * scale;
      context.fillStyle = "#171923";
      context.fillRect(0, 0, columns, rows);
      context.drawImage(
        image,
        (columns - width) / 2,
        (rows - height) / 2,
        width,
        height,
      );

      const { data } = context.getImageData(0, 0, columns, rows);
      const colors: string[] = [];
      for (let i = 0; i < data.length; i += 4) {
        const quantize = (channel: number) =>
          Math.min(255, Math.round(channel / 32) * 32);
        colors.push(
          `rgb(${quantize(data[i])} ${quantize(data[i + 1])} ${quantize(data[i + 2])})`,
        );
      }
      setPixels(colors);
    };
  }, []);

  return (
    <figure
      className="my-3 flex flex-col items-center gap-2"
      role="img"
      aria-label="신랑과 신부의 터미널 도트 초상화"
    >
      <div className="rounded-lg border border-white/10 bg-black/25 p-2 shadow-[0_0_28px_rgba(125,211,252,0.08)]">
        <div
          className="grid h-[168px] w-[128px] gap-[1px] sm:h-[210px] sm:w-[160px]"
          style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
          aria-hidden="true"
        >
          {pixels.map((color, index) => (
            <span
              key={index}
              className="rounded-[1px]"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>
      <figcaption className="text-center text-[10px] tracking-wide text-sky-200/80">
        [IMAGE] couple.png · pixel render complete
      </figcaption>
    </figure>
  );
}

export default function LoveTerminal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const showTerminal = () => setOpen(true);
    window.addEventListener(TERMINAL_EVENT, showTerminal);
    return () => window.removeEventListener(TERMINAL_EVENT, showTerminal);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  if (!open) return null;

  const mapUrl = `https://map.kakao.com/link/search/${encodeURIComponent(WEDDING.location.name2)}`;
  const lines: TerminalLine[] = [
    {
      prompt: "$",
      text: "./wedding-invitation.sh --initialize",
      color: "text-sky-300",
    },
    {
      prompt: "[BOOT]",
      text: "WEDDING SYSTEM INITIALIZED [OK]",
      color: "text-emerald-300",
    },
    {
      prompt: "[LOAD]",
      text: "Loading couple profiles... [OK]",
      color: "text-emerald-300",
    },
    { text: "" },
    {
      prompt: "$",
      text: 'git checkout -b "our-forever"',
      color: "text-sky-300",
    },
    {
      prompt: ">",
      text: "branch created: our-forever",
      color: "text-stone-300",
    },
    {
      prompt: "$",
      text: "git add groom.yml bride.yml",
      color: "text-sky-300",
    },
    {
      prompt: "$",
      text: 'git commit -m "we are getting married"',
      color: "text-sky-300",
    },
    {
      prompt: "[COMMIT]",
      text: `${WEDDING.groom.fullName} + ${WEDDING.bride.fullName} · forever begins`,
      color: "text-rose-200",
    },
    {
      prompt: ">",
      text: "two different elements · one shared future",
      color: "text-stone-300",
    },
    { text: "" },
    {
      prompt: "$",
      text: 'git merge --no-ff our-forever -m "one shared future"',
      color: "text-sky-300",
    },
    {
      prompt: ">",
      text: "merge complete · all conflicts resolved with love",
      color: "text-emerald-300",
    },
    {
      prompt: "$",
      text: "git push origin our-forever",
      color: "text-sky-300",
    },
    {
      prompt: ">",
      text: "our next chapter is ready to deploy ✨",
      color: "text-rose-200",
    },
    { text: "" },
    { prompt: "$", text: "cat schedule.yml", color: "text-sky-300" },
    { prompt: "date:", text: getScheduleText(), color: "text-amber-100" },
    { prompt: "venue:", text: WEDDING.location.name, color: "text-stone-200" },
    {
      prompt: "address:",
      text: WEDDING.location.address,
      color: "text-stone-300",
    },
    {
      prompt: "$",
      text: "open map --provider kakao",
      color: "text-sky-300",
      href: mapUrl,
    },
    {
      text: "↗ 카카오맵에서 위치 열기",
      color: "text-sky-200",
      href: mapUrl,
    },
    { text: "" },
    { prompt: "$", text: "cat getting-there.md", color: "text-sky-300" },
    { prompt: "train:", text: "군산역 → 83번 버스 → 은파호수공원" },
    { prompt: "walk:", text: "정류장에서 도보 약 10분" },
    { prompt: "parking:", text: "건물 주차 타워 · 2시간 무료" },
    { text: "" },
    { prompt: "$", text: "cat accounts.yml", color: "text-sky-300" },
    { text: "# groom · 마음 전하실 곳", color: "text-sky-200" },
    ...WEDDING.accounts.groom.map((account) => ({
      text: `${account.holder} : ${account.bank} ${account.number}`,
      color: "text-stone-300",
    })),
    { text: "# bride · 마음 전하실 곳", color: "text-orange-200" },
    ...WEDDING.accounts.bride.map((account) => ({
      text: `${account.holder} : ${account.bank} ${account.number}`,
      color: "text-stone-300",
    })),
    { text: "" },
    {
      prompt: "$",
      text: "open guestbook --leave-message",
      color: "text-sky-300",
    },
    {
      prompt: ">",
      text: "축하의 한마디를 남겨주세요 · guestbook is ready",
      color: "text-emerald-200",
    },
    { text: "" },
    {
      prompt: "$",
      text: 'git tag -a v1.0.0 -m "the beginning of forever"',
      color: "text-sky-300",
    },
    {
      prompt: "[DEPLOY]",
      text: "ALL SYSTEMS READY · SEE YOU THERE!",
      color: "text-emerald-300",
    },
  ];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-950/70 p-2 backdrop-blur-sm sm:p-5"
      onClick={() => setOpen(false)}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="love-terminal-title"
        className="flex h-[min(92dvh,820px)] w-full max-w-[760px] flex-col overflow-hidden rounded-[20px] border border-white/15 bg-[#141720] shadow-[0_24px_80px_rgba(0,0,0,0.4)] animate-[terminalIn_0.28s_ease-out] sm:rounded-[24px]"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="flex h-11 shrink-0 items-center justify-between border-b border-white/10 bg-white/[0.04] px-3 sm:px-4">
          <div className="flex items-center gap-1.5" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          </div>
          <h2
            id="love-terminal-title"
            className="text-[11px] font-mono tracking-wide text-stone-300"
          >
            WEDDING_INVITATION.sh — terminal
          </h2>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="터미널 닫기"
            className="flex h-7 w-7 items-center justify-center rounded-full text-sm text-stone-400 transition hover:bg-white/10 hover:text-white"
          >
            ×
          </button>
        </header>

        <div className="flex-1 space-y-0.5 overflow-y-auto px-4 py-5 font-mono text-[11px] leading-[1.75] sm:px-7 sm:py-6 sm:text-[13px]">
          {lines.map((line, index) => {
            const rowContent = (
              <>
                {line.prompt && (
                  <span className="mr-2 text-rose-300">{line.prompt}</span>
                )}
                <span className={line.color ?? "text-stone-200"}>
                  {escapeTerminalText(line.text)}
                </span>
              </>
            );

            return (
              <div key={`${line.text}-${index}`}>
                {index === 3 && <TerminalPixelPortrait />}
                <p
                  className={`terminal-line min-h-[1em] break-words ${line.href ? "text-sky-200 underline decoration-sky-300/40 underline-offset-4" : ""}`}
                  style={{ animationDelay: `${Math.min(index, 22) * 65}ms` }}
                >
                  {line.href ? (
                    <a
                      href={line.href}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(event) => event.stopPropagation()}
                    >
                      {rowContent}
                    </a>
                  ) : (
                    rowContent
                  )}
                </p>
              </div>
            );
          })}
          <p className="pt-1 text-rose-200">
            <span className="mr-2 text-rose-300">$</span>
            <span className="terminal-cursor">▋</span>
          </p>
        </div>

        <footer className="flex shrink-0 items-center justify-between gap-2 border-t border-white/10 px-4 py-3 text-[10px] tracking-wide text-stone-500 sm:px-7">
          <span>handcrafted with love · D & E</span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-full border border-white/10 px-3 py-1.5 text-stone-300 transition hover:bg-white/10"
          >
            청첩장으로 돌아가기
          </button>
        </footer>
      </section>

      <style>{`
        @keyframes terminalIn {
          from { opacity: 0; transform: translateY(12px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes terminalLineIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes terminalCursorBlink {
          0%, 45% { opacity: 1; }
          46%, 100% { opacity: 0; }
        }
        .terminal-line {
          opacity: 0;
          animation: terminalLineIn 320ms ease-out forwards;
        }
        .terminal-cursor {
          animation: terminalCursorBlink 1s steps(1) infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .terminal-line { opacity: 1; animation: none; }
          .terminal-cursor { animation: none; }
        }
      `}</style>
    </div>
  );
}
