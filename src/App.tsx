import { useEffect, useState } from "react";
import LoadingScreen from "./components/intro/LoadingScreen";
import CinematicIntro from "./components/intro/CinematicIntro";
import TitleBar from "./components/layout/TitleBar";
import Hero from "./components/sections/Hero";
import SubPhoto from "./components/sections/SubPhoto";
import Greeting from "./components/sections/Greeting";
import Family from "./components/sections/Family";
import Calendar from "./components/sections/Calendar";
import Location from "./components/sections/Location";
import Account from "./components/sections/Account";
import Guestbook from "./components/sections/Guestbook";
import Closing from "./components/sections/Closing";
import FloatingBot from "./components/interactive/FloatingBot";
import MusicPlayer from "./components/interactive/MusicPlayer";
import BackgroundAura from "./components/layout/BackgroundAura";
import Gallery2 from "./components/gallery/EditorialGallery";
import LoveTerminal from "./components/interactive/LoveTerminal";
import { WEDDING } from "./lib/constants";

type Stage = "loading" | "cinematic" | "main";

function App() {
  const isKakaoMapLink =
    new URLSearchParams(window.location.search).get("open") === "kakaomap";
  const [stage, setStage] = useState<Stage>(() =>
    window.location.hash === "#location" ? "main" : "loading",
  );

  useEffect(() => {
    if (!isKakaoMapLink) return;

    const webUrl = `https://place.map.kakao.com/${WEDDING.location.kakaoPlaceId}`;
    const appUrl = `kakaomap://place?id=${WEDDING.location.kakaoPlaceId}`;
    let appOpened = false;
    let fallbackTimeout: number | undefined;
    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") appOpened = true;
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    const startTimeout = window.setTimeout(() => {
      if (!/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        window.location.replace(webUrl);
        return;
      }
      try {
        window.location.href = appUrl;
      } catch {
        window.location.replace(webUrl);
        return;
      }
      fallbackTimeout = window.setTimeout(() => {
        if (
          !appOpened &&
          document.visibilityState === "visible" &&
          document.hasFocus()
        ) {
          window.location.replace(webUrl);
        }
      }, 2500);
    }, 0);

    return () => {
      window.clearTimeout(startTimeout);
      if (fallbackTimeout) window.clearTimeout(fallbackTimeout);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [isKakaoMapLink]);

  useEffect(() => {
    if (stage !== "main") return;
    const scrollToLocation = () => {
      if (window.location.hash === "#location") {
        document
          .getElementById("location")
          ?.scrollIntoView({ behavior: "instant" });
      }
    };
    const frame = requestAnimationFrame(scrollToLocation);
    window.addEventListener("hashchange", scrollToLocation);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", scrollToLocation);
    };
  }, [stage]);

  useEffect(() => {
    const preventImageContextMenu = (event: MouseEvent) => {
      if (event.target instanceof Element && event.target.closest("img")) {
        event.preventDefault();
      }
    };
    const preventImageDrag = (event: DragEvent) => {
      if (event.target instanceof Element && event.target.closest("img")) {
        event.preventDefault();
      }
    };

    document.addEventListener("contextmenu", preventImageContextMenu, true);
    document.addEventListener("dragstart", preventImageDrag, true);

    return () => {
      document.removeEventListener(
        "contextmenu",
        preventImageContextMenu,
        true,
      );
      document.removeEventListener("dragstart", preventImageDrag, true);
    };
  }, []);

  if (isKakaoMapLink) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-[#faf9f7] px-6 text-center">
        <div className="w-full max-w-sm rounded-3xl border border-white bg-white/80 px-6 py-10 shadow-sm">
          <p className="text-[12px] font-semibold tracking-[0.2em] text-rose-400">
            LOCATION
          </p>
          <h1 className="mt-4 text-lg font-medium text-stone-800">
            카카오맵에서 위치 보기
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-stone-500">
            카카오맵을 열고 있어요.
            <br />
            자동으로 열리지 않으면 아래에서 선택해 주세요.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <a
              className="rounded-full bg-[#FEE500] px-5 py-3 text-sm font-medium text-[#3C1E1E]"
              href={`kakaomap://place?id=${WEDDING.location.kakaoPlaceId}`}
            >
              카카오맵 앱 열기
            </a>
            <a
              className="rounded-full border border-stone-200 bg-white px-5 py-3 text-sm text-stone-700"
              href={`https://place.map.kakao.com/${WEDDING.location.kakaoPlaceId}`}
            >
              웹에서 위치 보기
            </a>
          </div>
        </div>
      </main>
    );
  }

  return (
    <>
      {stage === "loading" && (
        <LoadingScreen onComplete={() => setStage("cinematic")} />
      )}

      {stage === "cinematic" && (
        <CinematicIntro onComplete={() => setStage("main")} />
      )}

      {stage === "main" && (
        // PC 화면 바깥 프레임
        <div className="min-h-screen bg-stone-100 animate-[fadeIn_0.7s_ease-out]">
          {/* 모바일 430px 메인 프레임 */}
          <div className="relative max-w-[430px] mx-auto min-h-screen shadow-[0_0_40px_rgba(0,0,0,0.06)] overflow-hidden">
            {/* 은은한 수채화 오라 배경 (z-0) */}
            <BackgroundAura />

            {/* 본문 콘텐츠 레이어 (z-10 위로 배치) */}
            <div className="relative z-10">
              <TitleBar />
              <MusicPlayer />

              <div className="pt-11 pb-28">
                <Hero />
                <SubPhoto />
                <Greeting />
                <Family />
                <Calendar />
                <Location />
                {/* <Gallery /> */}
                <Gallery2 />
                <Account />
                <Guestbook />
                <Closing />
              </div>

              <FloatingBot />
            </div>
          </div>
        </div>
      )}

      <LoveTerminal />

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </>
  );
}

export default App;
