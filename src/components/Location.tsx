import { useState } from "react";
import { WEDDING } from "../lib/constants";

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
    el.setAttribute("readonly", "");
    el.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 1px;
      height: 1px;
      padding: 0;
      border: none;
      outline: none;
      opacity: 0;
      font-size: 16px;
    `;
    document.body.appendChild(el);
    el.focus();
    el.select();
    el.setSelectionRange(0, text.length);

    const ok = document.execCommand("copy");
    document.body.removeChild(el);
    return ok;
  } catch {
    return false;
  }
}

function KakaoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="6" fill="#FEE500" />
      <path
        d="M12 6.2c-3.4 0-6.1 2.2-6.1 4.9 0 1.8 1.2 3.3 3 4.2l-.8 2.9c-.1.3.2.5.4.4l3.3-1.8c.2 0 .4.1.6.1 3.4 0 6.1-2.2 6.1-4.9S15.4 6.2 12 6.2z"
        fill="#3C1E1E"
      />
    </svg>
  );
}

function NaverIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="6" fill="#03C75A" />
      <path d="M7.2 7h3.4l3 5.1V7H16.8v10h-3.4l-3-5.1V17H7.2V7z" fill="#fff" />
    </svg>
  );
}

function TmapIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="6" fill="#1A73E8" />
      <path d="M6.8 8.2h10.4v2.4h-3.8V17h-2.8V10.6H6.8V8.2z" fill="#fff" />
    </svg>
  );
}

const GUIDE_ITEMS = [
  {
    id: "train",
    label: "기차",
    icon: "🚇",
    lines: [
      "군산역 → 은파호수공원",
      "군산역에서 83번 승차",
      "은파호수공원 정류장 하차 후 도보 약 10분",
    ],
  },
  {
    id: "bus",
    label: "버스",
    icon: "🚌",
    lines: [
      "고속/시외버스터미널 → 은파호수공원",
      "팔마광장: 41 · 42 · 43 · 44번",
      "시외버스정류장: 8~17번",
      "은파호수공원 하차 후 도보 약 10분",
    ],
  },
  {
    id: "car",
    label: "자가용",
    icon: "🚗",
    lines: ["건물 주차 타워 이용 가능 (2시간 무료)"],
  },
] as const;

export default function Location() {
  const [copied, setCopied] = useState(false);
  const [showManualCopy, setShowManualCopy] = useState(false);

  const handleCopyAddress = async () => {
    const success = await tryCopy(WEDDING.location.address);

    if (success) {
      setCopied(true);
      setShowManualCopy(false);
      setTimeout(() => setCopied(false), 1800);
    } else {
      setShowManualCopy(true);
    }
  };

  const openKakaoMap = () => {
    window.open(
      `https://map.kakao.com/link/search/${encodeURIComponent(
        WEDDING.location.name2,
      )}`,
      "_blank",
    );
  };

  const openNaverMap = () => {
    window.open(
      `https://map.naver.com/v5/search/${encodeURIComponent(
        WEDDING.location.name2,
      )}`,
      "_blank",
    );
  };

  const openTMap = () => {
    const appUrl = `tmap://search?name=${encodeURIComponent(
      WEDDING.location.name2,
    )}`;
    const webUrl = `https://www.tmap.co.kr/tmap2/mobile/route.jsp?name=${encodeURIComponent(
      WEDDING.location.name2,
    )}`;
    window.location.href = appUrl;
    setTimeout(() => window.open(webUrl, "_blank"), 500);
  };

  return (
    <section className="px-5 pt-28 pb-14 md:pt-24 md:pb-16">
      <div className="flex flex-col items-center mb-8">
        <p className="text-[11px] md:text-[12px] tracking-[0.28em] text-rose-400 font-bold">
          LOCATION
        </p>
        <span className="mt-2 w-6 h-px bg-rose-300/70" />
      </div>

      <div className="relative max-w-[380px] mx-auto">
        <div className="absolute -inset-1 rounded-[30px] bg-gradient-to-br from-rose-200/25 via-white/15 to-sky-200/25 blur-lg pointer-events-none" />

        <div className="relative rounded-[28px] bg-white/70 backdrop-blur-2xl border border-white/80 shadow-[0_12px_36px_rgba(0,0,0,0.06),inset_0_1px_1px_rgba(255,255,255,0.95)] overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/90 to-transparent" />

          {/* 지도 */}
          <div className="w-full aspect-[16/10] bg-stone-100 relative border-b border-stone-200/40">
            <iframe
              src={`https://maps.google.com/maps?q=${encodeURIComponent(
                WEDDING.location.name,
              )}&t=&z=16&ie=UTF8&iwloc=&output=embed`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
              title="오시는 길"
            />
          </div>

          <div className="p-5 md:p-6">
            {/* 장소 / 주소 */}
            <div className="text-center mb-5 pb-5 border-b border-stone-200/40">
              <p className="text-[17px] md:text-[18px] font-semibold text-stone-800 tracking-wide">
                {WEDDING.location.name}
              </p>

              <div className="mt-2 flex items-center justify-center gap-1.5 flex-wrap px-1">
                <p className="text-[14px] md:text-[15px] text-stone-600 leading-relaxed font-light">
                  {WEDDING.location.address}
                </p>
                <button
                  onClick={handleCopyAddress}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full
                             text-[11px] font-medium transition active:scale-95
                             ${
                               copied
                                 ? "bg-rose-50 text-rose-600 border border-rose-200"
                                 : "bg-white/90 text-stone-600 border border-stone-200/80"
                             }`}
                >
                  <span className="text-[11px]">{copied ? "✓" : "📋"}</span>
                  <span>{copied ? "복사됨" : "복사"}</span>
                </button>
              </div>

              {showManualCopy && (
                <div className="mt-3 rounded-xl bg-white/80 border border-white/90 px-3.5 py-3 text-left">
                  <p className="text-[12px] text-stone-500 mb-1.5 leading-relaxed">
                    자동 복사가 지원되지 않습니다.{" "}
                    <span className="font-medium text-stone-700">
                      길게 눌러 복사
                    </span>
                    해주세요.
                  </p>
                  <p className="text-[13px] text-stone-800 break-all select-all leading-relaxed">
                    {WEDDING.location.address}
                  </p>
                  <button
                    onClick={() => setShowManualCopy(false)}
                    className="mt-2 text-[11px] text-stone-400 underline"
                  >
                    닫기
                  </button>
                </div>
              )}

              <div className="mt-4 flex items-center justify-center gap-2 flex-wrap">
                <button
                  onClick={openKakaoMap}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
                             text-[12px] font-medium text-stone-700 bg-white/80 border border-white/90
                             shadow-sm active:scale-95 transition"
                >
                  <KakaoIcon />
                  카카오맵
                </button>
                <button
                  onClick={openNaverMap}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
                             text-[12px] font-medium text-stone-700 bg-white/80 border border-white/90
                             shadow-sm active:scale-95 transition"
                >
                  <NaverIcon />
                  네이버지도
                </button>
                <button
                  onClick={openTMap}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
                             text-[12px] font-medium text-stone-700 bg-white/80 border border-white/90
                             shadow-sm active:scale-95 transition"
                >
                  <TmapIcon />
                  T맵
                </button>
              </div>
            </div>

            {/* 교통 안내 - 미니멀 */}
            <div className="space-y-4">
              {GUIDE_ITEMS.map((item, index) => (
                <div key={item.id}>
                  {index > 0 && (
                    <div className="mb-4 h-px bg-gradient-to-r from-transparent via-stone-200/80 to-transparent" />
                  )}

                  <div className="flex items-center gap-2 mb-2.5">
                    <span className="text-[14px] leading-none opacity-80">
                      {item.icon}
                    </span>
                    <span className="text-[12px] tracking-[0.18em] text-stone-500 font-medium">
                      {item.label}
                    </span>
                  </div>

                  <div className="pl-6 space-y-1">
                    {item.lines.map((line) => (
                      <p
                        key={line}
                        className="text-[14px] md:text-[15px] text-stone-700 leading-[1.75] font-light"
                      >
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
