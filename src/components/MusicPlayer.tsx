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
      <div className="relative w-full max-w-[430px] flex justify-end px-4 pt-2 pointer-events-auto">
        {/* 문구와 버튼을 같은 높이의 중앙축에 맞춤 */}
        <div
          className={`absolute right-14 top-2 flex h-9 items-center transition-all duration-500 whitespace-nowrap
                      ${
                        showHint && isPlaying
                          ? "opacity-100 translate-x-0"
                          : "opacity-0 translate-x-2 pointer-events-none"
                      }`}
        >
          <span className="text-[11px] tracking-wide text-stone-800 bg-white/70 backdrop-blur-md border border-white/60 px-2.5 py-1 rounded-full shadow-sm">
            음악이 재생 중이에요
          </span>
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
