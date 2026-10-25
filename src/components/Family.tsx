import { useState, useEffect } from "react";
import { WEDDING } from "../lib/constants";

const cleanPhone = (phone?: string) => phone?.replace(/-/g, "") || "";

type ContactPerson = {
  name: string;
  phone?: string;
  role?: string;
};

type ModalData = {
  side: "groom" | "bride";
  people: ContactPerson[];
} | null;

export default function Family() {
  const [modal, setModal] = useState<ModalData>(null);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (modal) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [modal]);

  const openGroomModal = () => {
    const people: ContactPerson[] = [
      {
        name: WEDDING.groom.fullName,
        phone: WEDDING.contacts.groom.groomPhone,
        role: "신랑",
      },
      {
        name: WEDDING.groom.fatherName,
        phone: WEDDING.contacts.groom.groomFatherPhone,
        role: "아버지",
      },
      {
        name: WEDDING.groom.motherName,
        phone: WEDDING.contacts.groom.groomMotherPhone,
        role: "어머니",
      },
    ].filter((p) => p.phone);

    setClosing(false);
    setModal({ side: "groom", people });
  };

  const openBrideModal = () => {
    const people: ContactPerson[] = [
      {
        name: WEDDING.bride.fullName,
        phone: WEDDING.contacts.bride.bridePhone,
        role: "신부",
      },
      {
        name: WEDDING.bride.fatherName,
        phone: WEDDING.contacts.bride.brideFatherPhone,
        role: "아버지",
      },
      {
        name: WEDDING.bride.motherName,
        phone: WEDDING.contacts.bride.brideMotherPhone,
        role: "어머니",
      },
    ].filter((p) => p.phone);

    setClosing(false);
    setModal({ side: "bride", people });
  };

  const closeModal = () => {
    setClosing(true);
    setTimeout(() => {
      setModal(null);
      setClosing(false);
    }, 320);
  };

  return (
    <>
      <section className="px-6 pt-28 pb-14 md:pt-24 md:pb-16">
        <div className="flex flex-col items-center mb-8">
          <p className="text-[11px] md:text-[12px] tracking-[0.28em] text-rose-400 font-bold">
            FAMILY
          </p>
          <span className="mt-2 w-6 h-px bg-rose-300/70" />
        </div>

        <div className="space-y-6 max-w-[360px] mx-auto">
          {/* 신랑측 */}
          <div className="text-center">
            <p className="text-[11px] tracking-[0.22em] text-sky-600/90 mb-2 font-medium">
              GROOM
            </p>
            <p className="text-[15px] md:text-[16px] text-stone-500 font-light leading-7">
              {WEDDING.groom.parents}
            </p>
            <p className="mt-1.5 text-[18px] md:text-[19px] text-stone-800 tracking-wide">
              {WEDDING.groom.fullName}
            </p>

            <button
              onClick={openGroomModal}
              className="mt-3.5 inline-flex items-center gap-1.5 px-4 py-2 rounded-full
                         text-[12px] text-sky-700 font-medium
                         bg-sky-50/70 backdrop-blur-md border border-sky-200/80
                         shadow-sm active:scale-95 transition"
            >
              <span className="text-[13px]">📞</span>
              <span>연락하기</span>
            </button>
          </div>

          <div className="flex flex-col items-center gap-1.5 py-1">
            <div className="w-px h-4 bg-gradient-to-b from-sky-200 to-rose-200" />
            <span className="text-rose-300 text-[11px]">♥</span>
            <div className="w-px h-4 bg-gradient-to-b from-rose-200 to-orange-200" />
          </div>

          {/* 신부측 */}
          <div className="text-center">
            <p className="text-[11px] tracking-[0.22em] text-orange-600/90 mb-2 font-medium">
              BRIDE
            </p>
            <p className="text-[15px] md:text-[16px] text-stone-500 font-light leading-7">
              {WEDDING.bride.parents}
            </p>
            <p className="mt-1.5 text-[18px] md:text-[19px] text-stone-800 tracking-wide">
              {WEDDING.bride.fullName}
            </p>

            <button
              onClick={openBrideModal}
              className="mt-3.5 inline-flex items-center gap-1.5 px-4 py-2 rounded-full
                         text-[12px] text-orange-700 font-medium
                         bg-orange-50/70 backdrop-blur-md border border-orange-200/80
                         shadow-sm active:scale-95 transition"
            >
              <span className="text-[13px]">📞</span>
              <span>연락하기</span>
            </button>
          </div>
        </div>
      </section>

      {/* 연락 모달 */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div
            className={`absolute inset-0 bg-stone-950/60 backdrop-blur-sm transition-opacity duration-300 ${
              closing ? "opacity-0" : "opacity-100"
            }`}
            onClick={closeModal}
          />

          <div
            className={`relative w-full max-w-[430px] flex flex-col
                        bg-white/85 backdrop-blur-2xl rounded-t-[32px] border-t border-x border-white/80
                        shadow-[0_-10px_40px_rgba(0,0,0,0.1),inset_0_1px_1px_rgba(255,255,255,0.9)]
                        transform-gpu
                        ${
                          closing
                            ? "animate-[sheetOut_0.32s_ease-in_forwards]"
                            : "animate-[sheetIn_0.35s_ease-out]"
                        }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 상단바 */}
            <div className="shrink-0 rounded-t-[32px] bg-white/40 backdrop-blur-xl border-b border-white/60 shadow-[0_4px_16px_rgba(0,0,0,0.03)] z-10">
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-12 h-1.5 bg-stone-300/60 rounded-full" />
              </div>

              <div className="px-5 pb-3 pt-1 flex items-center justify-between">
                <div className="w-8" />
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span
                      className={`w-1 h-1 rounded-full ${
                        modal.side === "groom"
                          ? "bg-sky-400/80"
                          : "bg-orange-400/80"
                      }`}
                    />
                    <p className="text-[10px] tracking-[0.25em] text-stone-400 font-bold font-mono">
                      FAMILY
                    </p>
                    <span
                      className={`w-1 h-1 rounded-full ${
                        modal.side === "groom"
                          ? "bg-sky-400/80"
                          : "bg-orange-400/80"
                      }`}
                    />
                  </div>
                  <p className="text-[15px] text-stone-800 font-medium tracking-wide">
                    {modal.side === "groom"
                      ? "신랑측 연락하기"
                      : "신부측 연락하기"}
                  </p>
                </div>
                <button
                  onClick={closeModal}
                  aria-label="닫기"
                  className="w-8 h-8 rounded-full bg-white/70 border border-white/90
                             text-stone-500 flex items-center justify-center shadow-sm
                             active:scale-95 transition"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* 연락처 리스트 */}
            <div className="px-4 py-4 space-y-2.5 max-h-[55dvh] overflow-y-auto pb-6">
              {modal.people.map((person, idx) => {
                const hasSeparateName =
                  !!person.role && person.name !== person.role;

                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-3 px-4 py-3.5 rounded-2xl
                               bg-white/70 border border-white/90 backdrop-blur-md
                               shadow-[0_4px_14px_rgba(0,0,0,0.03)]"
                  >
                    {/* 역할(옅은 회색·작게) + 이름(검정·크게) */}
                    <div className="min-w-0 flex items-baseline gap-1.5">
                      {hasSeparateName ? (
                        <>
                          <span className="text-[14px] text-stone-400 tracking-wide shrink-0">
                            {person.role}
                          </span>
                          <span className="text-[12px] text-stone-300">·</span>
                          <span className="text-[15px] font-medium text-stone-800 tracking-wide truncate">
                            {person.name}
                          </span>
                        </>
                      ) : (
                        <span className="text-[15px] font-medium text-stone-800 tracking-wide truncate">
                          {person.name}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={`tel:${cleanPhone(person.phone)}`}
                        className={`w-11 h-11 text-[15px] rounded-full flex items-center justify-center
                                    border active:scale-95 transition
                                    ${
                                      modal.side === "groom"
                                        ? "bg-sky-50/90 border-sky-200/80 text-sky-600"
                                        : "bg-orange-50/90 border-orange-200/80 text-orange-600"
                                    }`}
                      >
                        📞
                      </a>
                      <a
                        href={`sms:${cleanPhone(person.phone)}`}
                        className={`w-11 h-11 text-[15px] rounded-full flex items-center justify-center
                                    border active:scale-95 transition
                                    ${
                                      modal.side === "groom"
                                        ? "bg-sky-50/90 border-sky-200/80 text-sky-600"
                                        : "bg-orange-50/90 border-orange-200/80 text-orange-600"
                                    }`}
                      >
                        💬
                      </a>
                    </div>
                  </div>
                );
              })}

              {modal.people.length === 0 && (
                <p className="text-center text-[13px] text-stone-400 py-8 font-light">
                  등록된 연락처가 없습니다
                </p>
              )}
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
      `}</style>
    </>
  );
}
