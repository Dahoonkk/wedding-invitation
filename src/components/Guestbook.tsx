import { useEffect, useRef, useState } from "react";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../lib/firebase";

interface Message {
  id: string;
  name: string;
  content: string;
  createdAt: any;
  passwordHash?: string;
  element?: ElementSelection;
}

type ElementType = "water" | "fire" | "air" | "earth";
type ElementSelection = ElementType | "rainbow";

const ELEMENT_META: Record<
  ElementType,
  {
    label: string;
    emoji: string;
    bg: string;
    ring: string;
    soft: string;
  }
> = {
  water: {
    label: "물",
    emoji: "💧",
    bg: "from-sky-100/90 to-cyan-50/80",
    ring: "border-sky-200/90",
    soft: "bg-sky-50/50 border-sky-100/60 text-sky-950",
  },
  fire: {
    label: "불",
    emoji: "🔥",
    bg: "from-orange-100/90 to-rose-50/80",
    ring: "border-orange-200/90",
    soft: "bg-orange-50/50 border-orange-100/60 text-orange-950",
  },
  air: {
    label: "공기",
    emoji: "💨",
    bg: "from-violet-100/80 to-sky-50/80",
    ring: "border-violet-200/80",
    soft: "bg-violet-50/45 border-violet-100/60 text-violet-950",
  },
  earth: {
    label: "흙",
    emoji: "🌱",
    bg: "from-emerald-100/80 to-lime-50/80",
    ring: "border-emerald-200/80",
    soft: "bg-emerald-50/45 border-emerald-100/60 text-emerald-950",
  },
};

const RAINBOW_META = {
  label: "무지개",
  emoji: "🌈",
  bg: "from-rose-100/90 via-amber-50/90 to-sky-100/90",
  ring: "border-transparent",
  soft: "bg-gradient-to-r from-rose-50/75 via-amber-50/75 to-sky-50/75 border-violet-100/70 text-violet-950",
};

const LEGACY_EMOJI_META = [
  {
    emoji: "💧",
    bg: "from-sky-100/90 to-cyan-50/80",
    ring: "border-sky-200/90",
    soft: "bg-sky-50/50 border-sky-100/60 text-sky-950",
  },
  {
    emoji: "🔥",
    bg: "from-orange-100/90 to-rose-50/80",
    ring: "border-orange-200/90",
    soft: "bg-orange-50/50 border-orange-100/60 text-orange-950",
  },
  {
    emoji: "🌈",
    bg: "from-violet-100/80 via-rose-50/80 to-sky-50/80",
    ring: "border-rose-200/80",
    soft: "bg-rose-50/45 border-rose-100/60 text-rose-950",
  },
] as const;

function getEmojiMeta(id: string, element?: ElementSelection) {
  if (element === "rainbow") return RAINBOW_META;
  if (element) return ELEMENT_META[element];

  // 기존 방명록 문서에 원소 값이 없을 때만 예전 표시 방식을 유지합니다.
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash + id.charCodeAt(i)) % LEGACY_EMOJI_META.length;
  }
  return LEGACY_EMOJI_META[hash];
}

function formatDate(createdAt: any) {
  if (!createdAt?.toDate) return "";
  try {
    return createdAt.toDate().toLocaleDateString("ko-KR", {
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

async function hashPin(pin: string): Promise<string> {
  const text = `wedding-guestbook:${pin}`;

  if (typeof crypto !== "undefined" && crypto.subtle) {
    const data = new TextEncoder().encode(text);
    const buf = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  let hash = 5381;
  for (let i = 0; i < text.length; i++) {
    hash = (hash * 33) ^ text.charCodeAt(i);
  }
  let out = "";
  let h = hash >>> 0;
  for (let i = 0; i < 8; i++) {
    h = (h * 1664525 + 1013904223) >>> 0;
    out += h.toString(16).padStart(8, "0");
  }
  return out;
}

export default function Guestbook() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [allClosing, setAllClosing] = useState(false);
  const [showSheet, setShowSheet] = useState(false);
  const [sheetClosing, setSheetClosing] = useState(false);

  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [password, setPassword] = useState("");
  const [selectedElement, setSelectedElement] =
    useState<ElementSelection | null>(null);
  const [elementHint, setElementHint] = useState("");
  const [loading, setLoading] = useState(false);
  const elementPointerRef = useRef<ElementType | null>(null);
  const elementHintTimerRef = useRef<number | null>(null);
  const elementLongPressRef = useRef(false);
  const suppressElementClickRef = useRef(false);

  const [deleteTarget, setDeleteTarget] = useState<Message | null>(null);
  const [deletePin, setDeletePin] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    const q = query(collection(db, "guestbook"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as Message[];
      setMessages(list);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (showAll || showSheet || deleteTarget) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showAll, showSheet, deleteTarget]);

  // 미리보기 5개
  const previewMessages = messages.slice(0, 5);

  const selectElement = (element: ElementType) => {
    if (suppressElementClickRef.current) {
      suppressElementClickRef.current = false;
      return;
    }

    setSelectedElement(element);
    const hints: Record<ElementType, string> = {
      water:
        "투명한 물방울처럼 맑은 사랑이 영원하길 빌어요.\n무지개를 만들려면 물을 꾹 눌러 불 쪽으로 드래그해보세요.",
      fire: "따스한 불빛처럼 환할 앞날을 응원해요.\n무지개를 만들려면 불을 꾹 눌러 물 쪽으로 드래그해보세요.",
      air: "산들바람처럼 산뜻한 축복을 전해요.",
      earth: "새싹처럼 자라날 행복을 빌어요.",
    };
    setElementHint(hints[element]);
  };

  const beginElementGesture = (element: ElementType) => {
    suppressElementClickRef.current = false;
    elementLongPressRef.current = false;
    elementPointerRef.current = element;
    if (elementHintTimerRef.current) {
      window.clearTimeout(elementHintTimerRef.current);
    }

    if (element === "water" || element === "fire") {
      elementHintTimerRef.current = window.setTimeout(() => {
        elementLongPressRef.current = true;
        setElementHint("좋아요! 손을 떼지 말고 반대편 원소로 드래그하세요.");
      }, 520);
    }
  };

  const finishElementGesture = (
    event: React.PointerEvent<HTMLFieldSetElement>,
  ) => {
    if (elementHintTimerRef.current) {
      window.clearTimeout(elementHintTimerRef.current);
      elementHintTimerRef.current = null;
    }

    const source = elementPointerRef.current;
    elementPointerRef.current = null;
    if (source !== "water" && source !== "fire") return;

    // 물·불 조합은 길게 누른 뒤 실제로 드래그한 제스처에서만 허용합니다.
    if (!elementLongPressRef.current) return;

    suppressElementClickRef.current = true;

    const target = document
      .elementFromPoint(event.clientX, event.clientY)
      ?.closest<HTMLButtonElement>("[data-element]")?.dataset.element;
    const droppedOnOpposite =
      (source === "water" && target === "fire") ||
      (source === "fire" && target === "water");

    if (droppedOnOpposite) {
      event.preventDefault();
      setSelectedElement("rainbow");
      setElementHint("");
    } else {
      setSelectedElement(source);
      setElementHint("무지개를 만들려면 물과 불을 서로에게 드래그해보세요.");
    }
  };

  const cancelElementGesture = () => {
    elementPointerRef.current = null;
    elementLongPressRef.current = false;
    if (elementHintTimerRef.current) {
      window.clearTimeout(elementHintTimerRef.current);
      elementHintTimerRef.current = null;
    }
  };

  const openAll = () => {
    setAllClosing(false);
    setShowAll(true);
  };

  const closeAll = () => {
    setAllClosing(true);
    setTimeout(() => {
      setShowAll(false);
      setAllClosing(false);
    }, 320);
  };

  const openSheet = () => {
    setSheetClosing(false);
    setShowSheet(true);
  };

  const closeSheet = () => {
    setSheetClosing(true);
    setTimeout(() => {
      setShowSheet(false);
      setSheetClosing(false);
      setName("");
      setContent("");
      setPassword("");
      setSelectedElement(null);
      setElementHint("");
    }, 320);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !content.trim() || !selectedElement) return;
    if (!/^\d{4}$/.test(password)) {
      alert("비밀번호 4자리를 숫자로 입력해주세요");
      return;
    }

    setLoading(true);
    try {
      const passwordHash = await hashPin(password);
      await addDoc(collection(db, "guestbook"), {
        name: name.trim(),
        content: content.trim(),
        element: selectedElement,
        passwordHash,
        createdAt: serverTimestamp(),
      });
      closeSheet();
    } catch (err) {
      console.error("[guestbook] save failed:", err);
      alert(`등록 실패: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  const openDelete = (msg: Message) => {
    setDeleteTarget(msg);
    setDeletePin("");
    setDeleteError("");
  };

  const closeDelete = () => {
    setDeleteTarget(null);
    setDeletePin("");
    setDeleteError("");
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    if (!/^\d{4}$/.test(deletePin)) {
      setDeleteError("비밀번호 4자리를 입력해주세요");
      return;
    }

    setDeleteLoading(true);
    setDeleteError("");

    try {
      if (!deleteTarget.passwordHash) {
        setDeleteError("이 메시지는 비밀번호가 없어 삭제할 수 없습니다");
        setDeleteLoading(false);
        return;
      }

      const inputHash = await hashPin(deletePin);
      if (inputHash !== deleteTarget.passwordHash) {
        setDeleteError("비밀번호가 올바르지 않습니다");
        setDeleteLoading(false);
        return;
      }

      await deleteDoc(doc(db, "guestbook", deleteTarget.id));
      closeDelete();
    } catch {
      setDeleteError("삭제에 실패했습니다");
    } finally {
      setDeleteLoading(false);
    }
  };

  const MessageCard = ({ msg }: { msg: Message }) => {
    const meta = getEmojiMeta(msg.id, msg.element);
    const dateText = formatDate(msg.createdAt);

    return (
      <div className="relative">
        <div className="absolute -inset-0.5 rounded-[24px] bg-gradient-to-br from-white/40 via-rose-100/15 to-sky-100/20 blur-md opacity-70 pointer-events-none" />

        <div className="relative rounded-[20px] bg-white/65 backdrop-blur-2xl border border-white/80 shadow-[0_8px_28px_rgba(0,0,0,0.04)] overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/90 to-transparent pointer-events-none" />

          <div className="px-4 pt-3.5 pb-2.5 flex items-center gap-3">
            <div
              className={`shrink-0 rounded-full p-[1.5px] shadow-sm ${msg.element === "rainbow" ? "bg-gradient-to-br from-rose-400 via-amber-300 to-sky-400" : `border ${meta.ring} bg-gradient-to-br ${meta.bg}`}`}
            >
              <div
                className={`flex h-[33px] w-[33px] items-center justify-center rounded-full bg-gradient-to-br ${meta.bg} text-[15px]`}
              >
                {meta.emoji}
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[14px] font-medium text-stone-800 tracking-wide truncate">
                  {msg.name}
                </p>
                <div className="flex items-center gap-2 shrink-0">
                  {dateText && (
                    <span className="text-[10px] text-stone-400 font-mono tracking-wide">
                      {dateText}
                    </span>
                  )}
                  <button
                    onClick={() => openDelete(msg)}
                    aria-label={`${msg.name}님의 축하 메시지 삭제`}
                    className="rounded-full bg-stone-100/70 px-2 py-1 text-[10px] text-stone-400 transition active:bg-rose-50 active:text-rose-500"
                  >
                    삭제
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div
            className={`mx-3 mb-3 rounded-xl ${meta.soft} border px-3.5 py-3`}
          >
            <p className="text-[14px] leading-[1.85] font-light">
              {msg.content}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="px-5 pt-28 pb-14 md:pt-24 md:pb-16">
      <div className="flex flex-col items-center mb-8">
        <p className="text-[11px] md:text-[12px] tracking-[0.28em] text-rose-400 font-bold">
          GUESTBOOK
        </p>
        <span className="mt-2 w-6 h-px bg-rose-300/70" />
      </div>

      <div className="flex items-center justify-between mb-3 px-1 max-w-[380px] mx-auto">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-300" />
          <p className="text-[12px] tracking-wide text-stone-600 font-medium">
            축하의 마음
          </p>
        </div>
        {messages.length > 0 && (
          <span className="rounded-full bg-white/70 px-2.5 py-1 text-[10px] text-stone-400 font-mono">
            {messages.length}개의 메시지
          </span>
        )}
      </div>

      <div className="space-y-3 mb-6 max-w-[380px] mx-auto">
        {previewMessages.map((msg) => (
          <MessageCard key={msg.id} msg={msg} />
        ))}

        {messages.length === 0 && (
          <div className="relative">
            <div className="absolute -inset-1 rounded-[26px] bg-gradient-to-br from-rose-100/30 via-white/10 to-sky-100/30 blur-lg pointer-events-none" />
            <div className="relative flex flex-col items-center rounded-[22px] border border-white/80 bg-white/65 px-5 py-8 text-center shadow-[0_8px_28px_rgba(70,55,40,0.04)] backdrop-blur-2xl">
              <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-rose-100 to-sky-100 text-lg">
                💌
              </span>
              <p className="text-[14px] font-medium text-stone-700">
                첫 축하 메시지를 기다리고 있어요
              </p>
              <p className="mt-1.5 text-[12px] font-light leading-relaxed text-stone-400">
                따뜻한 한마디를 남겨 두 사람의 시작을 축복해 주세요.
              </p>
              <button
                onClick={openSheet}
                className="mt-4 inline-flex items-center gap-2 rounded-full border border-rose-200/80 bg-gradient-to-r from-rose-50 to-orange-50 px-4 py-2.5 text-[12px] font-medium text-rose-600 shadow-[0_4px_14px_rgba(244,114,182,0.1)] transition active:scale-95"
              >
                <span>축하 메시지 남기기</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {messages.length > 0 && (
        <div className="mx-auto max-w-[380px]">
          <p className="mb-2.5 flex items-center justify-center gap-1.5 text-[11px] font-light tracking-wide text-stone-400">
            <span aria-hidden="true" className="text-rose-300">
              ♡
            </span>
            두 분께 따뜻한 마음을 전해보세요
            <span aria-hidden="true" className="text-rose-300">
              ♡
            </span>
          </p>
          <div className="flex gap-2.5">
            <button
              onClick={openAll}
              className="flex-1 rounded-2xl border border-white/90 bg-white/75 py-3.5 text-[12px] font-medium tracking-wide text-stone-600 shadow-[0_4px_14px_rgba(70,55,40,0.045)] backdrop-blur-xl transition active:scale-[0.98]"
            >
              메시지 모아보기
            </button>
            <button
              onClick={openSheet}
              className="flex-[1.3] inline-flex items-center justify-center gap-2 rounded-full border border-rose-200/80 bg-gradient-to-r from-rose-50 to-orange-50 px-4 py-2.5 text-[12px] font-medium text-rose-600 shadow-[0_4px_14px_rgba(244,114,182,0.1)] transition active:scale-95"
            >
              <span>축하 메시지 남기기</span>
            </button>
          </div>
        </div>
      )}

      {/* 전체 목록 모달 */}
      {showAll && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div
            className={`absolute inset-0 bg-stone-950/60 backdrop-blur-sm transition-opacity duration-300 ${
              allClosing ? "opacity-0" : "opacity-100"
            }`}
            onClick={closeAll}
          />
          <div
            className={`relative w-full max-w-[430px] h-[80dvh] flex flex-col
                        bg-white/85 backdrop-blur-2xl rounded-t-[32px] border-t border-x border-white/80
                        shadow-[0_-10px_40px_rgba(0,0,0,0.1)]
                        ${
                          allClosing
                            ? "animate-[sheetOut_0.32s_ease-in_forwards]"
                            : "animate-[sheetIn_0.35s_ease-out]"
                        }`}
          >
            <div className="shrink-0 rounded-t-[32px] bg-white/40 backdrop-blur-xl border-b border-white/60 z-10">
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-12 h-1.5 bg-stone-300/60 rounded-full" />
              </div>
              <div className="px-5 pb-3 pt-1 flex items-center justify-between">
                <div className="w-8" />
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="w-1 h-1 rounded-full bg-sky-400/80" />
                    <p className="text-[10px] tracking-[0.25em] text-stone-400 font-bold font-mono">
                      GUESTBOOK
                    </p>
                    <span className="w-1 h-1 rounded-full bg-rose-400/80" />
                  </div>
                  <p className="text-[15px] text-stone-800 font-medium tracking-wide">
                    전체 메시지{" "}
                    {messages.length > 0 ? `(${messages.length})` : ""}
                  </p>
                </div>
                <button
                  onClick={closeAll}
                  className="w-8 h-8 rounded-full bg-white/70 border border-white/90
                             text-stone-500 flex items-center justify-center shadow-sm
                             active:scale-95 transition"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 pb-20">
              {messages.length === 0 ? (
                <p className="text-center text-[13px] text-stone-400 py-12 font-light">
                  아직 메시지가 없습니다
                </p>
              ) : (
                messages.map((msg, index) => (
                  <div
                    key={msg.id}
                    className="opacity-0 animate-[fadeUp_0.35s_ease-out_forwards]"
                    style={{ animationDelay: `${Math.min(index, 12) * 40}ms` }}
                  >
                    <MessageCard msg={msg} />
                  </div>
                ))
              )}
            </div>

            <button
              onClick={() => {
                closeAll();
                setTimeout(openSheet, 280);
              }}
              className="absolute bottom-5 right-5 z-20 inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full
                         text-[12px] font-medium text-white bg-rose-400/90
                         border border-rose-300/80 shadow-[0_8px_20px_rgba(244,63,94,0.3)]
                         active:scale-95 transition"
            >
              <span>✏️</span>
              <span>작성하기</span>
            </button>
          </div>
        </div>
      )}

      {/* 작성 시트 */}
      {showSheet && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div
            className={`absolute inset-0 bg-stone-950/60 backdrop-blur-sm transition-opacity duration-300 ${
              sheetClosing ? "opacity-0" : "opacity-100"
            }`}
            onClick={closeSheet}
          />
          <div
            className={`relative w-full max-w-[430px] flex flex-col
                        bg-white/85 backdrop-blur-2xl rounded-t-[32px] border-t border-x border-white/80
                        shadow-[0_-10px_40px_rgba(0,0,0,0.1)]
                        ${
                          sheetClosing
                            ? "animate-[sheetOut_0.32s_ease-in_forwards]"
                            : "animate-[sheetIn_0.35s_ease-out]"
                        }`}
          >
            <div className="shrink-0 rounded-t-[32px] bg-white/40 backdrop-blur-xl border-b border-white/60 z-10">
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-12 h-1.5 bg-stone-300/60 rounded-full" />
              </div>
              <div className="px-5 pb-3 pt-1 flex items-center justify-between">
                <div className="w-8" />
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="w-1 h-1 rounded-full bg-sky-400/80" />
                    <p className="text-[10px] tracking-[0.25em] text-stone-400 font-bold font-mono">
                      GUESTBOOK
                    </p>
                    <span className="w-1 h-1 rounded-full bg-rose-400/80" />
                  </div>
                  <h3 className="text-[15px] text-stone-800 font-medium tracking-wide">
                    축하 메시지 남기기
                  </h3>
                  <p className="mt-1 text-[10px] font-light text-stone-400">
                    원소를 고르고 마음을 남겨주세요
                  </p>
                </div>
                <button
                  onClick={closeSheet}
                  className="w-8 h-8 rounded-full bg-white/70 border border-white/90
                             text-stone-500 flex items-center justify-center shadow-sm
                             active:scale-95 transition"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-5 pb-8">
              <form onSubmit={handleSubmit} className="space-y-3">
                <fieldset
                  onPointerUp={finishElementGesture}
                  onPointerCancel={cancelElementGesture}
                  onPointerLeave={cancelElementGesture}
                  className="rounded-2xl border border-white/90 bg-white/45 p-3"
                >
                  <legend className="px-1 text-[11px] font-semibold tracking-wide text-stone-700">
                    여러분의 원소를 선택해주세요
                  </legend>
                  <div className="mt-1 grid grid-cols-4 gap-1.5">
                    {(
                      Object.entries(ELEMENT_META) as [
                        ElementType,
                        (typeof ELEMENT_META)[ElementType],
                      ][]
                    ).map(([element, meta]) => {
                      const selected =
                        selectedElement === element ||
                        (selectedElement === "rainbow" &&
                          (element === "water" || element === "fire"));
                      return (
                        <button
                          key={element}
                          type="button"
                          data-element={element}
                          aria-pressed={selected}
                          onClick={() => selectElement(element)}
                          onPointerDown={(event) => {
                            beginElementGesture(element);
                            event.currentTarget.setPointerCapture(
                              event.pointerId,
                            );
                          }}
                          onPointerUp={(event) => {
                            if (
                              event.currentTarget.hasPointerCapture(
                                event.pointerId,
                              )
                            ) {
                              event.currentTarget.releasePointerCapture(
                                event.pointerId,
                              );
                            }
                          }}
                          onContextMenu={(event) => event.preventDefault()}
                          className={`relative flex min-h-[58px] touch-none select-none flex-col items-center justify-center gap-1 rounded-xl border bg-gradient-to-br px-1.5 py-2 transition-all duration-200 active:scale-95 ${meta.bg} ${selected ? `${meta.ring} ring-2 ring-offset-1 ring-rose-200 shadow-[0_4px_12px_rgba(70,55,40,0.08)]` : "border-white/80 opacity-75"}`}
                        >
                          {selected && (
                            <span
                              className="absolute right-1 top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-white/90 text-[8px] text-rose-500 shadow-sm"
                              aria-hidden="true"
                            >
                              ✓
                            </span>
                          )}
                          <span
                            aria-hidden="true"
                            className="text-[16px] leading-none"
                          >
                            {meta.emoji}
                          </span>
                          <span className="text-[10px] font-medium text-stone-700">
                            {meta.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  {elementHint && selectedElement !== "rainbow" && (
                    <p
                      aria-live="polite"
                      className="mt-2 whitespace-pre-line text-center text-[10px] leading-relaxed text-stone-600"
                    >
                      {elementHint}
                    </p>
                  )}
                  {selectedElement === "rainbow" && (
                    <div className="elemental-rainbow-reveal mt-2 flex flex-col items-center gap-1 rounded-xl border border-violet-100/80 bg-gradient-to-r from-rose-100/70 via-amber-50/80 to-sky-100/70 px-3 py-2 text-center text-stone-800">
                      <p className="flex items-center justify-center gap-1.5 text-[11px] font-semibold">
                        <span aria-hidden="true">💧🔥</span>
                        <span>두 원소가 만나 무지개가 피어났어요!</span>
                        <span aria-hidden="true">🌈</span>
                      </p>
                      <p className="text-[10px] leading-relaxed text-stone-600">
                        저희를 축하해주신 모든 분들의 앞날도 무지개처럼 환하게
                        빛나길 축복해요.
                      </p>
                    </div>
                  )}
                </fieldset>

                <div className="space-y-1">
                  <label
                    htmlFor="guestbook-name"
                    className="block text-[11px] font-semibold tracking-wide text-stone-700"
                  >
                    이름
                  </label>
                  <input
                    id="guestbook-name"
                    type="text"
                    placeholder="이름"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={20}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/80 border border-white/90 text-base text-stone-800 outline-none focus:border-rose-300/80 focus:ring-2 focus:ring-rose-100 placeholder:text-stone-400"
                  />
                  <p className="text-right text-[10px] text-stone-400 font-mono">
                    {name.length}/20
                  </p>
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="guestbook-content"
                    className="block text-[11px] font-semibold tracking-wide text-stone-700"
                  >
                    축하 메시지
                  </label>
                  <textarea
                    id="guestbook-content"
                    placeholder="축하 메시지를 남겨주세요"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={3}
                    maxLength={200}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/80 border border-white/90 text-base text-stone-800 outline-none focus:border-rose-300/80 focus:ring-2 focus:ring-rose-100 placeholder:text-stone-400 resize-none"
                  />
                  <p className="text-right text-[10px] text-stone-400 font-mono">
                    {content.length}/200
                  </p>
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="guestbook-password"
                    className="block text-[11px] font-semibold tracking-wide text-stone-700"
                  >
                    삭제용 비밀번호
                  </label>
                  <input
                    id="guestbook-password"
                    type="password"
                    inputMode="numeric"
                    maxLength={4}
                    placeholder="삭제용 비밀번호 4자리"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value.replace(/\D/g, "").slice(0, 4))
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-white/80 border border-white/90 text-base text-stone-800 outline-none focus:border-rose-300/80 focus:ring-2 focus:ring-rose-100 placeholder:text-stone-400 tracking-[0.3em]"
                  />
                  <p className="text-[10px] leading-relaxed text-stone-400">
                    나중에 메시지를 삭제할 때 사용해요 · 숫자 4자리
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={
                    loading ||
                    !name.trim() ||
                    !content.trim() ||
                    !selectedElement ||
                    password.length !== 4
                  }
                  className="w-full rounded-xl bg-stone-800/90 py-3.5 text-[13px] font-medium text-white shadow-md transition active:scale-[0.99] disabled:opacity-50"
                >
                  {loading ? "등록 중..." : "메시지 등록하기"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 삭제 시트 */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center">
          <div
            className="absolute inset-0 bg-stone-950/60 backdrop-blur-sm"
            onClick={closeDelete}
          />
          <div className="relative w-full max-w-[430px] bg-white/90 backdrop-blur-2xl rounded-t-[28px] border-t border-x border-white/80 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] animate-[sheetIn_0.3s_ease-out] p-5 pb-8">
            <div className="flex justify-center mb-3">
              <div className="w-12 h-1.5 bg-stone-300/60 rounded-full" />
            </div>

            <p className="text-center text-[15px] text-stone-800 font-medium mb-1">
              메시지 삭제
            </p>
            <p className="text-center text-[13px] text-stone-500 mb-5">
              작성 시 입력한 비밀번호 4자리를 입력해주세요
            </p>

            <input
              type="password"
              inputMode="numeric"
              maxLength={4}
              placeholder="••••"
              value={deletePin}
              onChange={(e) => {
                setDeletePin(e.target.value.replace(/\D/g, "").slice(0, 4));
                setDeleteError("");
              }}
              className="w-full px-4 py-3 rounded-xl bg-white border border-stone-200 text-[18px] text-center tracking-[0.4em] text-stone-800 outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 mb-2"
            />

            {deleteError && (
              <p className="text-center text-[12px] text-rose-500 mb-3">
                {deleteError}
              </p>
            )}

            <div className="flex gap-2.5 mt-3">
              <button
                onClick={closeDelete}
                className="flex-1 py-3 rounded-xl text-[13px] text-stone-600 bg-white border border-stone-200 active:scale-[0.99] transition"
              >
                취소
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteLoading || deletePin.length !== 4}
                className="flex-1 py-3 rounded-xl text-[13px] text-white bg-rose-500 disabled:opacity-50 active:scale-[0.99] transition"
              >
                {deleteLoading ? "삭제 중..." : "삭제하기"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes sheetIn {
          from { transform: translateY(100%); opacity: 0.6; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes sheetOut {
          from { transform: translateY(0); opacity: 1; }
          to { transform: translateY(100%); opacity: 0.6; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
