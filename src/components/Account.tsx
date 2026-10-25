import { useState, useRef } from "react";
import { WEDDING } from "../lib/constants";

interface AccountItem {
  bank: string;
  number: string;
  holder: string;
}

async function tryCopy(text: string): Promise<boolean> {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // fallback
    }
  }

  try {
    const el = document.createElement("textarea");
    el.value = text;
    el.style.fontSize = "16px";
    el.style.position = "fixed";
    el.style.top = "0";
    el.style.left = "0";
    el.style.width = "2em";
    el.style.height = "2em";
    el.style.padding = "0";
    el.style.border = "none";
    el.style.outline = "none";
    el.style.boxShadow = "none";
    el.style.background = "transparent";
    el.style.opacity = "0.01";

    document.body.appendChild(el);
    el.focus();
    el.select();
    el.setSelectionRange(0, text.length);

    const successful = document.execCommand("copy");
    document.body.removeChild(el);
    return successful;
  } catch {
    return false;
  }
}

function AccountRow({
  bank,
  number,
  holder,
  accent,
}: AccountItem & { accent: "sky" | "orange" }) {
  const [copied, setCopied] = useState(false);
  const [showManual, setShowManual] = useState(false);
  const numberRef = useRef<HTMLParagraphElement>(null);

  const cleanNumber = number.replace(/-/g, "");

  const handleCopy = async () => {
    const success = await tryCopy(cleanNumber);

    if (success) {
      setCopied(true);
      setShowManual(false);
      setTimeout(() => setCopied(false), 2000);
    } else {
      setShowManual(true);
      setTimeout(() => {
        if (numberRef.current) {
          const range = document.createRange();
          range.selectNodeContents(numberRef.current);
          const sel = window.getSelection();
          sel?.removeAllRanges();
          sel?.addRange(range);
        }
      }, 50);
    }
  };

  const copiedStyle =
    accent === "sky"
      ? "bg-sky-50/90 border-sky-200 text-sky-600 shadow-sm"
      : "bg-rose-50/90 border-rose-200 text-rose-600 shadow-sm";

  return (
    <div className="py-3.5 border-b border-stone-200/40 last:border-0">
      <div className="flex items-center justify-between gap-3">
        <div className="text-left min-w-0 flex-1">
          <p className="text-[12px] font-medium text-stone-500 tracking-wide">
            {bank}
          </p>

          <p
            ref={numberRef}
            className="mt-1 text-[15px] text-stone-800 tracking-[0.04em] font-medium select-all truncate"
          >
            {number}
          </p>

          <p className="mt-1 text-[13px] text-stone-600">
            예금주 <span className="font-medium text-stone-800">{holder}</span>
          </p>
        </div>

        <button
          onClick={handleCopy}
          className={`shrink-0 min-w-[62px] px-3 py-2 rounded-full
                      text-[11px] tracking-wide font-medium
                      border transition-all duration-300 active:scale-95
                      ${
                        copied
                          ? copiedStyle
                          : "bg-white/85 border-white/90 text-stone-600 shadow-sm"
                      }`}
        >
          {copied ? "복사됨" : "복사"}
        </button>
      </div>

      {showManual && (
        <div className="mt-3 rounded-xl bg-white/70 border border-white/80 px-4 py-3">
          <p className="text-[12px] text-stone-500 mb-2 leading-relaxed">
            자동 복사가 지원되지 않는 기기입니다.{" "}
            <span className="text-stone-700 font-medium">길게 눌러 복사</span>
            해주세요.
          </p>
          <p className="text-[15px] text-stone-800 tracking-wider font-medium select-all">
            {cleanNumber}
          </p>
          <button
            onClick={() => setShowManual(false)}
            className="mt-2.5 text-[11px] text-stone-400 font-medium underline underline-offset-2"
          >
            닫기
          </button>
        </div>
      )}
    </div>
  );
}

function AccordionItem({
  title,
  icon,
  accounts,
  accent = "sky",
  defaultOpen = false,
}: {
  title: string;
  icon: string;
  accounts: readonly AccountItem[];
  accent?: "sky" | "orange";
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  const styles = {
    sky: {
      glow: "from-sky-200/25 via-white/10 to-cyan-100/20",
      badge: "bg-sky-50/90 border-sky-200/80 text-sky-600",
    },
    orange: {
      glow: "from-orange-200/25 via-white/10 to-rose-100/20",
      badge: "bg-orange-50/90 border-orange-200/80 text-orange-600",
    },
  };

  const s = styles[accent];

  return (
    <div className="relative max-w-[380px] mx-auto">
      <div
        className={`absolute -inset-1 rounded-[26px] bg-gradient-to-br ${s.glow} blur-lg pointer-events-none`}
      />

      <div className="relative rounded-[22px] overflow-hidden bg-white/60 backdrop-blur-2xl border border-white/80 shadow-[0_10px_36px_rgba(0,0,0,0.05),inset_0_1px_1px_rgba(255,255,255,0.9)]">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/90 to-transparent pointer-events-none" />

        <button
          onClick={() => setOpen((prev) => !prev)}
          className="w-full flex items-center justify-between px-5 py-4 text-left active:bg-white/40 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-8 h-8 rounded-full border shadow-sm
                          flex items-center justify-center text-[14px] ${s.badge}`}
            >
              {icon}
            </div>
            <span className="text-[13px] md:text-[14px] font-medium text-stone-800 tracking-wide">
              {title}
            </span>
          </div>

          <span
            className={`w-7 h-7 rounded-full bg-white/80 border border-white/90 shadow-sm
                        text-stone-400 text-[10px] flex items-center justify-center
                        transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          >
            ▼
          </span>
        </button>

        <div
          className={`transition-all duration-300 ease-out overflow-hidden ${
            open ? "max-h-[520px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-4 pb-4 pt-1">
            <div className="rounded-2xl bg-white/50 border border-white/80 px-4">
              {accounts.map((acc, i) => (
                <AccountRow key={i} {...acc} accent={accent} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Account() {
  return (
    <section className="px-5 pt-28 pb-14 md:pt-24 md:pb-16">
      <div className="flex flex-col items-center mb-8">
        <p className="text-[11px] md:text-[12px] tracking-[0.28em] text-rose-400 font-bold">
          ACCOUNT
        </p>
        <span className="mt-2 w-6 h-px bg-rose-300/70" />
      </div>

      <div className="text-center space-y-3.5 max-w-[320px] mx-auto mb-8">
        <p className="text-[15px] md:text-[16px] leading-[1.85] text-stone-600 font-light">
          직접 모시지 못하는 아쉬운 마음을 담아
          <br />
          멀리서 축하를 전해주시는 분들을 위해
          <br />
          마음 전하실 곳을 안내해 드립니다.
        </p>
        <p className="text-[15px] md:text-[16px] leading-[1.85] text-stone-600 font-light">
          보내주신 소중한 사랑 깊이 간직하여
          <br />
          서로를 온전히 품어주며 예쁘게 살겠습니다.
        </p>
      </div>

      <div className="space-y-4">
        <AccordionItem
          title="신랑측 마음 전하기"
          icon="💧"
          accent="sky"
          accounts={WEDDING.accounts.groom}
        />
        <AccordionItem
          title="신부측 마음 전하기"
          icon="🔥"
          accent="orange"
          accounts={WEDDING.accounts.bride}
        />
      </div>
    </section>
  );
}
