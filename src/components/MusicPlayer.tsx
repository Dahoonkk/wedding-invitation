import { useRef, useState, useEffect } from "react";

let globalAudio: HTMLAudioElement | null = null;

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [visible, setVisible] = useState(true);
  const [showHint, setShowHint] = useState(false);
  const initialized = useRef(false);
  const hintTimer = useRef<number | null>(null);

  const revealHint = () => {
    setShowHint(true);
    if (hintTimer.current) window.clearTimeout(hintTimer.current);
    hintTimer.current = window.setTimeout(() => setShowHint(false), 3000);
  };

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    if (!globalAudio) {
      globalAudio = new Audio(`${import.meta.env.BASE_URL}steal_the_show.mp3`);
      globalAudio.loop = true;
      globalAudio.volume = 0.5;
    }

    const audio = globalAudio;

    const tryAutoPlay = async () => {
      try {
        await audio.play();
        setIsPlaying(true);
        revealHint();
      } catch {
        const unlock = async () => {
          try {
            await audio.play();
            setIsPlaying(true);
            revealHint();
          } catch (e) {
            console.log(e);
          }
          document.removeEventListener("click", unlock);
          document.removeEventListener("touchstart", unlock);
        };
        document.addEventListener("click", unlock, { once: true });
        document.addEventListener("touchstart", unlock, { once: true });
      }
    };

    tryAutoPlay();

    const onPlay = () => {
      setIsPlaying(true);
      revealHint();
    };
    const onPause = () => {
      setIsPlaying(false);
      setShowHint(false);
    };

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);

    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      if (hintTimer.current) window.clearTimeout(hintTimer.current);
    };
  }, []);

  useEffect(() => {
    let lastScrollY = 0;

    const onScroll = () => {
      const currentY = window.scrollY;
      if (currentY < 50 || currentY < lastScrollY) {
        setVisible(true);
      } else {
        setVisible(false);
      }
      lastScrollY = currentY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleMusic = async () => {
    if (!globalAudio) return;

    if (isPlaying) {
      globalAudio.pause();
      setIsPlaying(false);
      setShowHint(false);
    } else {
      try {
        await globalAudio.play();
        setIsPlaying(true);
        revealHint();
      } catch (e) {
        console.log(e);
      }
    }
  };

  return (
    <div
      className={`fixed top-12 left-0 right-0 z-30 flex justify-center pointer-events-none
                  transition-all duration-300 ${
                    visible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 -translate-y-2"
                  }`}
    >
      <div className="relative w-full max-w-[430px] flex justify-end px-4 pt-1 pointer-events-auto">
        {/* 한 줄 음악 안내와 플레이어 버튼 */}
        <div
          className={`absolute right-14 top-1 flex h-9 max-w-[calc(100%-4.5rem)] items-center transition-all duration-500
                      ${
                        showHint && isPlaying
                          ? "opacity-100 translate-x-0"
                          : "pointer-events-none translate-x-1 opacity-0"
                      }`}
        >
          <div className="flex h-8 min-w-0 items-center gap-2 rounded-full border border-white/75 bg-white/75 px-2.5 shadow-[0_3px_12px_rgba(70,55,40,0.07)] backdrop-blur-lg">
            <div
              aria-hidden="true"
              className="flex h-5 w-5 shrink-0 items-center justify-center gap-[2px] rounded-full bg-gradient-to-br from-sky-100 to-rose-100"
            >
              <span className="h-1.5 w-[2px] rounded-full bg-sky-500/80 animate-pulse" />
              <span className="h-3 w-[2px] rounded-full bg-rose-400/90 animate-pulse [animation-delay:120ms]" />
              <span className="h-2 w-[2px] rounded-full bg-orange-400/80 animate-pulse [animation-delay:240ms]" />
            </div>
            <div className="flex min-w-0 items-center gap-1.5 whitespace-nowrap leading-none">
              <span className="truncate text-[10px] font-semibold text-stone-800">
                Steal The Show
              </span>
              <span className="text-[9px] text-stone-400">·</span>
              <span className="shrink-0 text-[9px] text-stone-500">Lauv</span>
            </div>
          </div>
        </div>

        {/* 버튼 위치는 항상 동일 */}
        <button
          onClick={toggleMusic}
          className="w-9 h-9 rounded-full
                     bg-white/40 backdrop-blur-md border border-white/40
                     shadow-sm flex items-center justify-center
                     active:scale-95 transition"
          aria-label={isPlaying ? "음악 끄기" : "음악 켜기"}
        >
          <span className="text-sm opacity-80">{isPlaying ? "🔊" : "🔇"}</span>
        </button>
      </div>
    </div>
  );
}
