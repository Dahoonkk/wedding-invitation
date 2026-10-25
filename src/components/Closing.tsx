import { useEffect, useState, useRef } from "react";
import confetti from "canvas-confetti";
import { doc, getDoc, setDoc, updateDoc, increment } from "firebase/firestore";
import { db } from "../lib/firebase";

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

  const lastBurstRef = useRef(0);
  const pendingRef = useRef(0);
  const flushTimerRef = useRef<number | null>(null);
  const lastFlushAtRef = useRef(0);

  const pageUrl = typeof window !== "undefined" ? window.location.href : "";

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
        <p className="text-[11px] md:text-[12px] tracking-[0.28em] text-rose-400 font-bold">
          THE END
        </p>
        <span className="mt-2 w-6 h-px bg-rose-300/70" />
      </div>

      <div className="relative w-full max-w-[380px] mb-8">
        <div className="absolute -inset-2 rounded-[32px] bg-gradient-to-br from-rose-200/30 via-white/10 to-sky-200/30 blur-xl pointer-events-none" />
        <div className="relative rounded-[28px] overflow-hidden border border-white/80 shadow-[0_12px_36px_rgba(0,0,0,0.06)] aspect-[4/3] bg-white">
          <img
            src={`${import.meta.env.BASE_URL}images/no_gallery/23.png`}
            alt="Together forever"
            width={1575}
            height={2100}
            loading="lazy"
            decoding="async"
            sizes="(max-width: 380px) 100vw, 380px"
            className="block w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
        </div>
      </div>

      <div className="text-center space-y-3 mb-8">
        <p
          className="text-[30px] md:text-[34px] leading-tight
                     bg-clip-text text-transparent
                     bg-gradient-to-r from-sky-500 via-rose-400 to-orange-400 font-medium"
          style={{ fontFamily: "'Great Vibes', cursive" }}
        >
          Together, forever.
        </p>

        <div className="w-8 h-px bg-gradient-to-r from-transparent via-stone-300 to-transparent mx-auto" />

        <div className="flex items-center justify-center gap-1.5 text-[10px] uppercase tracking-[0.22em] text-stone-400">
          <span>Made with love by</span>
          <span className="font-medium text-stone-700 normal-case tracking-wide flex items-center gap-1">
            <span>다훈</span>
            <span className="text-[9px]">💧</span>
            <span className="text-[9px]">🔥</span>
            <span>은하</span>
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2.5 mb-3">
        <button
          onClick={handleCopyLink}
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full
                      text-[12px] tracking-wide font-medium
                      backdrop-blur-xl border transition-all duration-300
                      ${
                        copied
                          ? "bg-rose-50/90 border-rose-200/80 text-rose-600 shadow-sm"
                          : "bg-white/70 border-white/90 text-stone-700 shadow-sm active:scale-95"
                      }`}
        >
          <span className="text-sm">{copied ? "✓" : "🔗"}</span>
          <span>{copied ? "링크 복사 완료" : "청첩장 링크 복사"}</span>
        </button>

        <button
          onClick={handleLike}
          className={`group inline-flex items-center gap-2 px-4.5 py-2.5 rounded-full
                     bg-white/70 backdrop-blur-xl border border-white/90
                     shadow-sm text-stone-700
                     active:scale-95 transition-all duration-300 ${
                       isLiking ? "scale-105" : ""
                     }`}
        >
          <span
            className={`text-base transition-transform duration-200 ${
              isLiking ? "scale-125 rotate-12" : "group-hover:scale-110"
            }`}
          >
            ❤️
          </span>
          <span className="text-[12px] font-medium tabular-nums font-mono min-w-[1.2rem]">
            {likes}
          </span>
        </button>
      </div>

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
