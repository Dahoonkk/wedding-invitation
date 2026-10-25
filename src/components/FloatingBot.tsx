import { useState, useRef, useEffect } from "react";

const QA_DATA = {
  "💬 둘은 어떻게 만났어?":
    "처음은 학과에서 만났어요.\n학과 홍보 동영상을 찍으면서 친해지게 되었죠 😃",
  "🔥 누가 먼저 고백했어?":
    "웨이드가 앰버 생일에 먼저 고백했어요.\n사실 한 번 까이고 두 번째 고백이었죠 😂",
  "🍯 서로 부르는 애칭은?":
    "웨이드는 앰버를 공주(씨)라고 불러요 ㅋㅋ\n앰버는 그냥 오빠? 자기?",
  "🌈 청첩장 컨셉이 엘리멘탈인 이유가 있어?":
    "영화에 나오는 두 주인공의 모습이 꼭 저희 같았어요.\n'완전 우리 같다' 하면서 울컥했던 추억이 있어요!\n그래서 저희만의 새로운 무지개를 피우기 위해 컨셉을\n<엘리멘탈>로 잡아보았습니다 🔥💧",
  "💡 또 다른 TMI가 있어?":
    "사실 어머니들끼리 생일이 똑같아요!\n이런게 또 인연인거겠죠??",
};

export default function FloatingBot() {
  const [open, setOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      text: "반가워요! 저는 두 사람의 이야기가 담긴 무지개봇이에요 🌈 형식적인 정보는 없지만, 두 사람의 TMI를 알려드릴 수 있어요! 궁금한 질문을 선택해보세요.",
    },
  ]);

  const [isTyping, setIsTyping] = useState(false);
  const [askedQuestions, setAskedQuestions] = useState<string[]>([]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const chipContainerRef = useRef<HTMLDivElement>(null);

  // PC 마우스 드래그 스크롤 상태관리
  const isMouseDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const dragDistanceRef = useRef(0);

  // 모달이 열려있을 때 바깥 화면 배경 스크롤 차단
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleQuestionClick = (question: string) => {
    if (dragDistanceRef.current > 5) return;
    if (askedQuestions.includes(question)) return;

    setAskedQuestions((prev) => [...prev, question]);
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), type: "user", text: question },
    ]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          type: "bot",
          text: QA_DATA[question as keyof typeof QA_DATA],
        },
      ]);
    }, 800);
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setOpen(false);
      setIsClosing(false);
    }, 300);
  };

  // PC 마우스 드래그 이벤트 핸들러
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!chipContainerRef.current) return;
    isMouseDownRef.current = true;
    startXRef.current = e.pageX - chipContainerRef.current.offsetLeft;
    scrollLeftRef.current = chipContainerRef.current.scrollLeft;
    dragDistanceRef.current = 0;
  };

  const handleMouseLeave = () => {
    isMouseDownRef.current = false;
  };

  const handleMouseUp = () => {
    isMouseDownRef.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDownRef.current || !chipContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - chipContainerRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.4;
    dragDistanceRef.current = Math.abs(walk);
    chipContainerRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!chipContainerRef.current) return;
    if (e.deltaY !== 0) {
      chipContainerRef.current.scrollLeft += e.deltaY;
    }
  };

  return (
    <>
      {/* 선명한 원형 아이콘 플로팅 버튼 (Q&A 텍스트 제거) */}
      <button
        onClick={() => setOpen(true)}
        aria-label="무지개봇 열기"
        className="fixed bottom-6 right-5 z-40 group w-14 h-14 rounded-full
                   bg-white/90 backdrop-blur-2xl 
                   border border-white 
                   shadow-[0_8px_30px_rgba(14,165,233,0.22),0_4px_14px_rgba(244,63,94,0.15)] 
                   flex items-center justify-center
                   active:scale-95 transition-all duration-300 transform-gpu
                   hover:bg-white cursor-pointer"
      >
        <span className="absolute inset-0 rounded-full bg-gradient-to-r from-sky-300/30 via-rose-300/30 to-amber-300/30 animate-ping pointer-events-none" />

        <span className="relative text-2xl z-10 group-hover:rotate-12 transition-transform">
          🌈
        </span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center pointer-events-auto">
          {/* 모달 딤드 배경 */}
          <div
            className={`absolute inset-0 bg-stone-950/60 backdrop-blur-sm ${
              isClosing
                ? "animate-[fadeOut_0.3s_forwards]"
                : "animate-[fadeIn_0.3s_forwards]"
            }`}
            onClick={handleClose}
          />

          {/* 챗봇 프레임 컨테이너 */}
          <div
            className={`relative w-full sm:max-w-[400px] h-[85vh] sm:h-[620px] sm:mx-4
                       bg-white/85 backdrop-blur-2xl 
                       border-t border-x sm:border border-white/80 
                       rounded-t-[32px] sm:rounded-[32px] 
                       shadow-[0_-10px_40px_rgba(0,0,0,0.1),inset_0_1px_1px_rgba(255,255,255,0.9)] 
                       flex flex-col overflow-hidden transform-gpu overscroll-contain
                       ${
                         isClosing
                           ? "animate-[slideDown_0.3s_ease-in-out_forwards]"
                           : "animate-[slideUp_0.4s_cubic-bezier(0.16,1,0.3,1)_forwards]"
                       }`}
          >
            {/* 상단바 헤더 */}
            <div className="shrink-0 rounded-t-[32px] bg-white/40 backdrop-blur-xl border-b border-white/60 shadow-[0_4px_16px_rgba(0,0,0,0.03)] z-10 relative">
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-sky-300/60 via-rose-300/70 to-orange-300/60" />

              <div className="flex justify-center pt-3 pb-1">
                <div className="w-12 h-1.5 bg-stone-300/60 rounded-full" />
              </div>

              <div className="px-5 pb-3 pt-0.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-9 h-9 rounded-full 
                                bg-gradient-to-br from-sky-100 to-rose-100 
                                border border-white/90 shadow-sm
                                flex items-center justify-center"
                  >
                    <span className="text-base">🌈</span>
                  </div>
                  <div>
                    <p className="text-[14px] font-medium text-stone-800 tracking-wide">
                      무지개봇
                    </p>
                    <p className="text-[10px] text-stone-400 tracking-wide font-light">
                      우리 둘의 TMI 대방출
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleClose}
                  aria-label="닫기"
                  className="w-8 h-8 rounded-full 
                             bg-white/70 border border-white/90
                             text-stone-500 text-sm
                             flex items-center justify-center shadow-sm
                             active:scale-95 transition cursor-pointer transform-gpu"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* 대화 메시지 영역 */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scroll-smooth bot-scroll bg-gradient-to-b from-transparent to-sky-50/20 overscroll-contain"
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`
                      max-w-[88%] px-3.5 py-2.5 shadow-[0_2px_8px_rgba(0,0,0,0.03)] text-[13px] leading-relaxed font-light whitespace-pre-line transform-gpu
                      ${
                        msg.type === "user"
                          ? "bg-gradient-to-br from-rose-400/90 via-rose-400 to-orange-400/90 text-white rounded-2xl rounded-tr-xs"
                          : "bg-white/80 backdrop-blur-md border border-white/90 text-stone-700 rounded-2xl rounded-tl-xs shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)]"
                      }
                    `}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/80 backdrop-blur-md border border-white/90 rounded-2xl rounded-tl-xs px-3.5 py-2.5 shadow-sm flex gap-1.5 items-center">
                    <span className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-rose-400 rounded-full animate-bounce [animation-delay:75ms]" />
                    <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce [animation-delay:150ms]" />
                  </div>
                </div>
              )}
            </div>

            {/* 질문 선택 스크롤 영역 */}
            <div className="p-3.5 sm:p-4 border-t border-white/60 bg-white/65 backdrop-blur-md pb-7 sm:pb-6 shrink-0">
              <div className="flex items-center justify-between mb-2 px-0.5 select-none">
                <p className="text-[10.5px] text-stone-500 font-medium tracking-wide">
                  궁금한 질문을 선택해보세요
                </p>
                <span className="text-[10px] text-stone-400 font-mono">
                  드래그/스와이프 👈
                </span>
              </div>

              <div
                ref={chipContainerRef}
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                onWheel={handleWheel}
                className="flex gap-2 overflow-x-auto bot-scroll py-0.5 px-0.5 touch-pan-x cursor-grab active:cursor-grabbing select-none"
              >
                {Object.keys(QA_DATA).map((q, i) => {
                  const isAsked = askedQuestions.includes(q);
                  return (
                    <button
                      key={i}
                      onClick={() => handleQuestionClick(q)}
                      disabled={isAsked}
                      className={`
                        shrink-0 px-4 py-2 rounded-full border text-[12px] font-medium 
                        transition-all duration-300 transform-gpu whitespace-nowrap shadow-xs
                        ${
                          isAsked
                            ? "bg-stone-100/40 border-transparent text-stone-400/60 cursor-not-allowed"
                            : "bg-white/90 backdrop-blur-sm border-white/90 text-stone-700 shadow-sm hover:border-rose-200/80 active:scale-95 cursor-pointer"
                        }
                      `}
                    >
                      {q}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes slideDown {
          from { transform: translateY(0); opacity: 1; }
          to { transform: translateY(100%); opacity: 0; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }

        .bot-scroll {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .bot-scroll::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
}
