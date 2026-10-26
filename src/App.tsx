import { useState } from "react";
import LoadingScreen from "./components/LoadingScreen";
import CinematicIntro from "./components/CinematicIntro";
import TitleBar from "./components/TitleBar";
import Hero from "./components/Hero";
import SubPhoto from "./components/SubPhoto";
import Greeting from "./components/Greeting";
import Family from "./components/Family";
import Calendar from "./components/Calendar";
import Location from "./components/Location";
import Account from "./components/Account";
import Guestbook from "./components/Guestbook";
import Closing from "./components/Closing";
import FloatingBot from "./components/FloatingBot";
import MusicPlayer from "./components/MusicPlayer";
import BackgroundAura from "./components/BackgroundAura"; // 추가
import Gallery2 from "./components/EditorialGallery";

type Stage = "loading" | "cinematic" | "main";

function App() {
  const [stage, setStage] = useState<Stage>("loading");

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
