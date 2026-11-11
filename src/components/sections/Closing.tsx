import { useEffect, useState, useRef } from "react";
import confetti from "canvas-confetti";
import { doc, getDoc, setDoc, updateDoc, increment } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { WEDDING } from "../../lib/constants";
import { kakaoJavaScriptKey, loadKakaoShare } from "../../lib/kakao";
import { openLoveTerminal } from "../interactive/LoveTerminal";

const baseColors = [
  "#38bdf8",
  "#22d3ee",
  "#fb7185",
  "#fb923c",
  "#a78bfa",
  "#f472b6",
  "#fde68a",
];

let cachedEmojiShapes: confetti.Shape[] = [];
if (typeof window !== "undefined") {
  try {
    const water = confetti.shapeFromText({ text: "💧", scalar: 2 });
    const fire = confetti.shapeFromText({ text: "🔥", scalar: 2 });
    const rainbow = confetti.shapeFromText({ text: "🌈", scalar: 1.9 });
    const heart = confetti.shapeFromText({ text: "❤️", scalar: 1.9 });
    const sparkle = confetti.shapeFromText({ text: "✨", scalar: 1.8 });
    cachedEmojiShapes = [water, fire, rainbow, heart, sparkle];
  } catch {
    // ignore
  }
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

const LIKE_DOC = doc(db, "stats", "likes");
// 테스트 시 5000으로 줄여서 확인 가능
const FLUSH_INTERVAL_MS = 60_000;

export default function Closing() {
  const [likes, setLikes] = useState(0);
  const [copied, setCopied] = useState(false);
  const [showManualCopy, setShowManualCopy] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [showSpecialImage, setShowSpecialImage] = useState(false);
  const [shareReady, setShareReady] = useState(false);
  const [shareError, setShareError] = useState("");

  const lastBurstRef = useRef(0);
  const likeTapCountRef = useRef(0);
  const likeTapResetTimerRef = useRef<number | null>(null);
  const specialImageTimerRef = useRef<number | null>(null);
  const pendingRef = useRef(0);
  const flushTimerRef = useRef<number | null>(null);
  const lastFlushAtRef = useRef(0);
  const terminalTapCountRef = useRef(0);
  const terminalResetTimerRef = useRef<number | null>(null);

  const pageUrl = typeof window !== "undefined" ? window.location.href : "";

  useEffect(() => {
    if (!kakaoJavaScriptKey) return;
    let active = true;
    loadKakaoShare()
      .then(() => {
        if (active) setShareReady(true);
      })
      .catch(() => {
        if (active)
          setShareError(
            "카카오톡 공유를 준비하지 못했어요. 버튼을 눌러 다시 시도하거나 링크를 복사해 주세요.",
          );
      });
    return () => {
      active = false;
    };
  }, []);

  const handleKakaoShare = () => {
    if (!shareReady || !window.Kakao) {
      setShareError("공유 기능을 준비하고 있어요. 잠시 후 다시 눌러주세요.");
      loadKakaoShare()
        .then(() => {
          setShareReady(true);
          setShareError("준비됐어요. 공유 버튼을 한 번 더 눌러주세요.");
        })
        .catch(() => {
          setShareError(
            "카카오톡 공유를 불러오지 못했어요. 링크 복사를 이용해 주세요.",
          );
        });
      return;
    }

    const productionUrl = "https://dahoonkk.github.io/wedding-invitation/";
    const invitationUrl = import.meta.env.DEV
      ? new URL(import.meta.env.BASE_URL, window.location.origin).href
      : productionUrl;
    const link = { mobileWebUrl: invitationUrl, webUrl: invitationUrl };
    const kakaoMapUrl = `${invitationUrl}?open=kakaomap`;
    const locationLink = {
      mobileWebUrl: kakaoMapUrl,
      webUrl: kakaoMapUrl,
    };
    const dateLabel = new Intl.DateTimeFormat("ko-KR", {
      timeZone: "Asia/Seoul",
      dateStyle: "full",
      timeStyle: "short",
    }).format(new Date(`${WEDDING.date}+09:00`));

    try {
      window.Kakao.Share.sendDefault({
        objectType: "feed",
        content: {
          title: `${WEDDING.groom.name} ♥ ${WEDDING.bride.name} 결혼합니다`,
          description: `${dateLabel}\n${WEDDING.location.name}`,
          imageUrl: `${productionUrl}images/2.jpeg`,
          imageWidth: 1500,
          imageHeight: 2100,
          link,
        },
        buttons: [
          { title: "청첩장 보기", link },
          { title: "위치 보기", link: locationLink },
        ],
      });
      setShareError("");
    } catch (error) {
      console.error("[kakao share] failed:", error);
      setShareError(
        "카카오톡 공유를 열지 못했어요. 링크 복사를 이용해 주세요.",
      );
    }
  };

  const handleCreatorMarkTap = () => {
    terminalTapCountRef.current += 1;
    if (terminalResetTimerRef.current) {
      window.clearTimeout(terminalResetTimerRef.current);
    }

    if (terminalTapCountRef.current >= 5) {
      terminalTapCountRef.current = 0;
      openLoveTerminal();
      return;
    }

    terminalResetTimerRef.current = window.setTimeout(() => {
      terminalTapCountRef.current = 0;
    }, 1800);
  };

  // 초기 카운트 로드
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const snap = await getDoc(LIKE_DOC);
        if (!mounted) return;

        if (snap.exists()) {
          setLikes(Number(snap.data().count) || 0);
        } else {
          await setDoc(LIKE_DOC, { count: 0 });
          if (mounted) setLikes(0);
        }
        console.log("[likes] loaded");
      } catch (err) {
        console.error("[likes] load failed:", err);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const flushLikes = async () => {
    const n = pendingRef.current;
    if (n <= 0) return;

    pendingRef.current = 0;
    lastFlushAtRef.current = Date.now();

    try {
      const snap = await getDoc(LIKE_DOC);
      if (!snap.exists()) {
        await setDoc(LIKE_DOC, { count: n });
      } else {
        await updateDoc(LIKE_DOC, { count: increment(n) });
      }
      console.log("[likes] flushed +", n);
    } catch (err) {
      pendingRef.current += n;
      console.error("[likes] flush failed:", err);
    }
  };

  const scheduleFlush = () => {
    const now = Date.now();
    const elapsed = now - lastFlushAtRef.current;
    const wait = Math.max(FLUSH_INTERVAL_MS - elapsed, 0);

    if (flushTimerRef.current) {
      window.clearTimeout(flushTimerRef.current);
    }

    flushTimerRef.current = window.setTimeout(() => {
      flushLikes();
    }, wait);

    console.log(
      "[likes] scheduled flush in",
      wait,
      "ms, pending=",
      pendingRef.current,
    );
  };

  // 페이지 이탈 시 남은 값 저장 시도
  useEffect(() => {
    const onLeave = () => {
      if (pendingRef.current > 0) {
        flushLikes();
      }
    };

    window.addEventListener("pagehide", onLeave);
    window.addEventListener("beforeunload", onLeave);

    return () => {
      window.removeEventListener("pagehide", onLeave);
      window.removeEventListener("beforeunload", onLeave);
      if (flushTimerRef.current) window.clearTimeout(flushTimerRef.current);
    };
  }, []);

  useEffect(
    () => () => {
      if (likeTapResetTimerRef.current) {
        window.clearTimeout(likeTapResetTimerRef.current);
      }
      if (specialImageTimerRef.current) {
        window.clearTimeout(specialImageTimerRef.current);
      }
    },
    [],
  );

  const handleCopyLink = async () => {
    const success = await tryCopy(pageUrl);

    if (success) {
      setCopied(true);
      setShowManualCopy(false);
      setTimeout(() => setCopied(false), 2000);
    } else {
      setShowManualCopy(true);
    }
  };

  const fireSideBurst = () => {
    const shortLife = {
      ticks: 60,
      gravity: 1.4,
      decay: 0.9,
      zIndex: 9999,
    };

    confetti({
      ...shortLife,
      particleCount: 35,
      angle: 60,
      spread: 55,
      startVelocity: 45,
      origin: { x: 0, y: 0.75 },
      colors: baseColors,
    });

    confetti({
      ...shortLife,
      particleCount: 35,
      angle: 120,
      spread: 55,
      startVelocity: 45,
      origin: { x: 1, y: 0.75 },
      colors: baseColors,
    });

    if (cachedEmojiShapes.length > 0) {
      confetti({
        ...shortLife,
        particleCount: 20,
        angle: 65,
        spread: 50,
        startVelocity: 40,
        origin: { x: 0.02, y: 0.72 },
        shapes: cachedEmojiShapes,
        scalar: 1.5,
      });

      confetti({
        ...shortLife,
        particleCount: 20,
        angle: 115,
        spread: 50,
        startVelocity: 40,
        origin: { x: 0.98, y: 0.72 },
        shapes: cachedEmojiShapes,
        scalar: 1.5,
      });
    }
  };

  const handleLike = () => {
    setIsLiking(true);
    setTimeout(() => setIsLiking(false), 300);

    likeTapCountRef.current += 1;
    if (likeTapResetTimerRef.current) {
      window.clearTimeout(likeTapResetTimerRef.current);
    }

    if (likeTapCountRef.current >= 5) {
      likeTapCountRef.current = 0;
      likeTapResetTimerRef.current = null;
      setShowSpecialImage(true);
      if (specialImageTimerRef.current) {
        window.clearTimeout(specialImageTimerRef.current);
      }
      specialImageTimerRef.current = window.setTimeout(() => {
        setShowSpecialImage(false);
        specialImageTimerRef.current = null;
      }, 4000);
    } else {
      likeTapResetTimerRef.current = window.setTimeout(() => {
        likeTapCountRef.current = 0;
        likeTapResetTimerRef.current = null;
      }, 2500);
    }

    // UI 즉시 +1
    setLikes((prev) => prev + 1);
    pendingRef.current += 1;

    // DB는 1분 간격으로 모아서 저장
    scheduleFlush();

    const now = Date.now();
    if (now - lastBurstRef.current > 200) {
      lastBurstRef.current = now;
      fireSideBurst();
    }
  };

  return (
    <section className="relative px-5 pt-10 pb-8 flex flex-col items-center overflow-hidden">
      <div className="absolute bottom-0 left-0 right-0 h-80 bg-gradient-to-t from-sky-100/35 via-rose-50/20 to-transparent blur-3xl pointer-events-none" />

      <div className="flex flex-col items-center mb-8">
        <p className="section-heading-label text-[12px] md:text-[13px] tracking-[0.28em] text-rose-400 font-extrabold">
          THANK YOU
        </p>
        <span className="mt-2 w-6 h-px bg-rose-300/70" />
      </div>

      <div className="relative w-full max-w-[380px] mb-8">
        <div className="absolute -inset-2 rounded-[32px] bg-gradient-to-br from-rose-200/30 via-white/10 to-sky-200/30 blur-xl pointer-events-none" />
        <div className="relative rounded-[28px] overflow-hidden border border-white/80 shadow-[0_12px_36px_rgba(0,0,0,0.06)] aspect-[4/3] bg-white">
          <img
            src={`${import.meta.env.BASE_URL}images/no_gallery/23.png`}
            alt={showSpecialImage ? "" : "Together forever"}
            aria-hidden={showSpecialImage}
            width={1575}
            height={2100}
            loading="lazy"
            decoding="async"
            sizes="(max-width: 380px) 100vw, 380px"
            className={`block h-full w-full object-cover object-center transition-opacity duration-[1200ms] ease-in-out ${showSpecialImage ? "opacity-0" : "opacity-100"}`}
          />
          <img
            src={`${import.meta.env.BASE_URL}images/no_gallery/last_disney.png`}
            alt={showSpecialImage ? "Together forever special photo" : ""}
            aria-hidden={!showSpecialImage}
            width={1575}
            height={2100}
            loading="lazy"
            decoding="async"
            sizes="(max-width: 380px) 100vw, 380px"
            className={`absolute inset-0 h-full w-full object-cover object-center transition-all duration-[1200ms] ease-in-out ${showSpecialImage ? "scale-100 opacity-100" : "scale-[1.02] opacity-0"}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
        </div>
      </div>

      <div className="text-center space-y-3 mb-8">
        <p
          className="text-[30px] md:text-[34px] leading-tight
                     bg-clip-text text-transparent
                     bg-gradient-to-r from-sky-500 via-rose-400 to-orange-400 font-medium"
          style={{ fontFamily: "var(--font-script-en)" }}
        >
          Together, forever.
        </p>

        <div className="w-8 h-px bg-gradient-to-r from-transparent via-stone-300 to-transparent mx-auto" />

        <div className="flex flex-col items-center gap-1.5 text-[9px] uppercase tracking-[0.2em] text-stone-400">
          <button
            type="button"
            onClick={handleCreatorMarkTap}
            aria-label="숨겨진 개발자 이스터에그 열기"
            className="rounded-sm text-[10px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-rose-300"
          >
            Made by us, with love
          </button>
          <span className="font-medium text-stone-700 normal-case tracking-wide flex items-center gap-1.5 text-[12px]">
            <span>다훈</span>
            <span className="text-[10px]">💧</span>
            <span className="text-[10px]">×</span>
            <span className="text-[10px]">🔥</span>
            <span>은하</span>
          </span>
        </div>
      </div>

      <div
        className={`mb-3 grid w-full max-w-95 gap-2.5 sm:gap-3 ${
          kakaoJavaScriptKey ? "grid-cols-3" : "grid-cols-2"
        }`}
      >
        {kakaoJavaScriptKey && (
          <button
            type="button"
            onClick={handleKakaoShare}
            aria-label="카카오톡으로 청첩장 공유하기"
            className="flex min-h-14 min-w-0 flex-col items-center justify-center gap-1 rounded-2xl border border-amber-100/80 bg-amber-50/70 px-1 py-2 text-stone-700 shadow-[0_4px_16px_rgba(87,65,48,0.04)] transition hover:bg-amber-50 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-5 w-5 text-amber-700/80"
              fill="currentColor"
            >
              <path d="M12 3.5c-5.3 0-9.5 3.4-9.5 7.6 0 2.7 1.8 5 4.5 6.4l-.9 3.3a.45.45 0 0 0 .66.5l4-2.4c.4.05.82.08 1.24.08 5.3 0 9.5-3.4 9.5-7.6S17.3 3.5 12 3.5Z" />
            </svg>
            <span className="whitespace-nowrap text-[11px] font-medium tracking-wide sm:text-[12px]">
              카카오톡 공유
            </span>
          </button>
        )}
        <button
          type="button"
          onClick={handleCopyLink}
          aria-label={copied ? "청첩장 링크 복사 완료" : "청첩장 링크 복사"}
          className={`flex min-h-14 min-w-0 flex-col items-center justify-center gap-1 rounded-2xl border px-1 py-2
                      shadow-[0_4px_16px_rgba(87,65,48,0.04)] transition duration-300 active:scale-95
                      focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-300
                      ${
                        copied
                          ? "border-rose-200/80 bg-rose-50/80 text-rose-600"
                          : "border-white/90 bg-white/70 text-stone-700 hover:bg-white/90"
                      }`}
        >
          {copied ? (
            <span
              aria-hidden="true"
              className="flex h-5 w-5 items-center justify-center text-base text-rose-500"
            >
              ✓
            </span>
          ) : (
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              className="h-5 w-5 text-stone-500"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10 13.5a4 4 0 0 0 5.7 0l2.8-2.8a4 4 0 0 0-5.7-5.7l-1.6 1.6" />
              <path d="M14 10.5a4 4 0 0 0-5.7 0l-2.8 2.8a4 4 0 0 0 5.7 5.7l1.6-1.6" />
            </svg>
          )}
          <span className="whitespace-nowrap text-[11px] font-medium tracking-wide sm:text-[12px]">
            {copied ? "복사 완료" : "링크 복사"}
          </span>
        </button>

        <button
          type="button"
          onClick={handleLike}
          aria-label={`좋아요 ${likes}개`}
          className={`group flex min-h-14 min-w-0 flex-col items-center justify-center gap-1 rounded-2xl border border-rose-100/80 bg-rose-50/50 px-1 py-2
                     shadow-[0_4px_16px_rgba(87,65,48,0.04)] text-stone-700 transition duration-300 hover:bg-rose-50/80 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-300 ${
                       isLiking ? "scale-105" : ""
                     }`}
        >
          <span
            aria-hidden="true"
            className={`flex h-5 items-center justify-center text-[18px] leading-none text-rose-400 transition-transform duration-200 ${
              isLiking ? "scale-125 rotate-12" : "group-hover:scale-110"
            }`}
          >
            ♥
          </span>
          <span className="max-w-full truncate text-[11px] font-medium tracking-wide tabular-nums sm:text-[12px]">
            좋아요{" "}
            <span className="text-rose-400">{likes.toLocaleString()}</span>
          </span>
        </button>
      </div>

      {shareError && (
        <p
          role="status"
          className="mb-3 px-3 text-center text-[12px] text-stone-600"
        >
          {shareError}
        </p>
      )}

      {showManualCopy && (
        <div className="w-full max-w-sm mt-3 rounded-2xl bg-white/80 backdrop-blur-md border border-white/90 px-4 py-3.5 text-center shadow-sm">
          <p className="text-[12px] text-stone-500 mb-2 leading-relaxed">
            자동 복사가 지원되지 않는 기기입니다.{" "}
            <span className="font-medium text-stone-700">길게 눌러 복사</span>
            해주세요.
          </p>
          <p className="text-[12px] text-stone-800 break-all select-all leading-relaxed font-mono">
            {pageUrl}
          </p>
          <button
            onClick={() => setShowManualCopy(false)}
            className="mt-2.5 text-[11px] text-stone-400 font-medium underline underline-offset-2"
          >
            닫기
          </button>
        </div>
      )}
    </section>
  );
}
