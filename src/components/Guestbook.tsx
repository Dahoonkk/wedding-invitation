import { useEffect, useState } from "react";
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
}

const EMOJI_META = [
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

function getEmojiMeta(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash + id.charCodeAt(i)) % 3;
  return EMOJI_META[hash];
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
  const [loading, setLoading] = useState(false);

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
    }, 320);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) return;
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
    const meta = getEmojiMeta(msg.id);
    const dateText = formatDate(msg.createdAt);

    return (
      <div className="relative">
        <div className="absolute -inset-0.5 rounded-[24px] bg-gradient-to-br from-white/40 via-rose-100/15 to-sky-100/20 blur-md opacity-70 pointer-events-none" />

        <div className="relative rounded-[20px] bg-white/65 backdrop-blur-2xl border border-white/80 shadow-[0_8px_28px_rgba(0,0,0,0.04)] overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/90 to-transparent pointer-events-none" />

          <div className="px-4 pt-3.5 pb-2.5 flex items-center gap-3">
            <div
              className={`shrink-0 w-9 h-9 rounded-full bg-gradient-to-br ${meta.bg}
                          border ${meta.ring} shadow-sm
                          flex items-center justify-center text-[15px]`}
            >
              {meta.emoji}
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
                    className="text-[11px] text-stone-400 hover:text-rose-500 transition"
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
        <p className="text-[12px] tracking-wide text-stone-500 font-medium">
          최근 메시지
        </p>
        {messages.length > 0 && (
          <p className="text-[11px] text-stone-400 font-mono">
            전체 {messages.length}개
          </p>
        )}
      </div>

      <div className="space-y-3 mb-6 max-w-[380px] mx-auto">
        {previewMessages.map((msg) => (
          <MessageCard key={msg.id} msg={msg} />
        ))}

        {messages.length === 0 && (
          <div className="relative">
            <div className="absolute -inset-1 rounded-[26px] bg-gradient-to-br from-rose-100/25 to-sky-100/25 blur-lg pointer-events-none" />
            <div className="relative rounded-[22px] bg-white/60 backdrop-blur-2xl border border-white/80 px-4 py-12 text-center">
              <p className="text-[14px] text-stone-500 font-light">
                첫 번째 축하 메시지를 남겨보세요 💌
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2.5 max-w-[380px] mx-auto">
        <button
          onClick={openAll}
          className="flex-1 py-3.5 rounded-2xl text-[12px] tracking-wide font-medium
                     text-stone-700 bg-white/70 backdrop-blur-xl
                     border border-white/90 shadow-sm active:scale-[0.98] transition"
        >
          전체 보기
        </button>
        <button
          onClick={openSheet}
          className="flex-[1.3] py-3.5 rounded-2xl text-[12px] tracking-wide font-medium
                     text-white bg-rose-400/90 border border-rose-300/80
                     shadow-[0_4px_16px_rgba(244,63,94,0.2)] active:scale-[0.98] transition"
        >
          작성하기
        </button>
      </div>

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
                    <span className="w-1 h-1 rounded-full bg-rose-400/80" />
                    <p className="text-[10px] tracking-[0.25em] text-stone-400 font-bold font-mono">
                      GUESTBOOK
                    </p>
                    <span className="w-1 h-1 rounded-full bg-sky-400/80" />
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
                    <span className="w-1 h-1 rounded-full bg-rose-400/80" />
                    <p className="text-[10px] tracking-[0.25em] text-stone-400 font-bold font-mono">
                      GUESTBOOK
                    </p>
                    <span className="w-1 h-1 rounded-full bg-sky-400/80" />
                  </div>
                  <h3 className="text-[15px] text-stone-800 font-medium tracking-wide">
                    축하 메시지 남기기
                  </h3>
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
              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div>
                  <input
                    type="text"
                    placeholder="이름"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={20}
                    className="w-full px-4 py-3 rounded-xl bg-white/80 border border-white/90 text-[16px] text-stone-800 outline-none focus:border-rose-300/80 focus:ring-2 focus:ring-rose-100 placeholder:text-stone-400"
                  />
                  <p className="mt-1 text-right text-[10px] text-stone-400 font-mono">
                    {name.length}/20
                  </p>
                </div>

                <div>
                  <textarea
                    placeholder="축하 메시지를 남겨주세요"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={4}
                    maxLength={200}
                    className="w-full px-4 py-3 rounded-xl bg-white/80 border border-white/90 text-[16px] text-stone-800 outline-none focus:border-rose-300/80 focus:ring-2 focus:ring-rose-100 placeholder:text-stone-400 resize-none"
                  />
                  <p className="mt-1 text-right text-[10px] text-stone-400 font-mono">
                    {content.length}/200
                  </p>
                </div>

                <div>
                  <input
                    type="password"
                    inputMode="numeric"
                    maxLength={4}
                    placeholder="삭제용 비밀번호 4자리"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value.replace(/\D/g, "").slice(0, 4))
                    }
                    className="w-full px-4 py-3 rounded-xl bg-white/80 border border-white/90 text-[16px] text-stone-800 outline-none focus:border-rose-300/80 focus:ring-2 focus:ring-rose-100 placeholder:text-stone-400 tracking-[0.3em]"
                  />
                  <p className="mt-1.5 text-[11px] text-stone-400 leading-relaxed">
                    메시지 삭제 시 필요합니다. 숫자 4자리를 입력해주세요.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={
                    loading ||
                    !name.trim() ||
                    !content.trim() ||
                    password.length !== 4
                  }
                  className="w-full py-3.5 rounded-xl bg-stone-800/90 text-white text-[13px] font-medium disabled:opacity-50 active:scale-[0.99] transition shadow-md"
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
