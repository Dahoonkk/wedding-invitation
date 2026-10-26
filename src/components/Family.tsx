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
            <div className="relative shrink-0 overflow-hidden rounded-t-[32px] bg-white/55 backdrop-blur-xl border-b border-white/60 shadow-[0_4px_16px_rgba(0,0,0,0.03)] z-10">
              <div
                className={`pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b ${
                  modal.side === "groom"
                    ? "from-sky-100/65 via-sky-50/30 to-transparent"
                    : "from-orange-100/65 via-orange-50/30 to-transparent"
                }`}
              />
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-12 h-1.5 bg-stone-300/60 rounded-full" />
              </div>

              <div className="relative px-5 pb-6 pt-4 flex items-start justify-between">
                <div className="w-8" />
                <div className="flex flex-col items-center">
                  <div className="mb-1 flex items-center gap-1.5">
                    <span
                      className={`h-1 w-1 rounded-full ${
                        modal.side === "groom" ? "bg-sky-400" : "bg-orange-400"
                      }`}
                    />
                    <p
                      className={`text-[10px] font-semibold tracking-[0.24em] ${
                        modal.side === "groom"
                          ? "text-sky-600"
                          : "text-orange-600"
                      }`}
                    >
                      {modal.side === "groom"
                        ? "GROOM'S FAMILY"
                        : "BRIDE'S FAMILY"}
                    </p>
                    <span
                      className={`h-1 w-1 rounded-full ${
                        modal.side === "groom" ? "bg-sky-400" : "bg-orange-400"
                      }`}
                    />
                  </div>
                  <p className="text-[19px] font-semibold tracking-wide text-stone-800">
                    {modal.side === "groom"
                      ? "신랑 측 연락처"
                      : "신부 측 연락처"}
                  </p>
                  <p className="mt-1.5 text-[12px] text-stone-500">
                    전화 또는 문자로 마음을 전해 보세요
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
            <div className="px-4 pb-8 pt-5 space-y-3 max-h-[55dvh] overflow-y-auto">
              {modal.people.map((person, idx) => {
                const hasSeparateName =
                  !!person.role && person.name !== person.role;

                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-3 rounded-[22px] border border-white/80 bg-gradient-to-br from-white/90 to-stone-50/75 px-4 py-3.5 shadow-[0_8px_24px_rgba(70,55,40,0.055),inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-md"
                  >
                    <div className="min-w-0 flex items-center gap-2.5">
                      <span
                        aria-label={person.role}
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[19px] ${
                          modal.side === "groom"
                            ? "bg-sky-100/75 text-sky-700"
                            : "bg-orange-100/75 text-orange-700"
                        }`}
                      >
                        {person.role === "아버지"
                          ? "👨🏻"
                          : person.role === "어머니"
                            ? "👩🏻"
                            : modal.side === "groom"
                              ? "🤵🏻"
                              : "👰🏻"}
                      </span>
                      <div className="flex min-w-0 items-center gap-2">
                        {hasSeparateName && (
                          <span className="text-[11px] text-stone-400">
                            {person.role}
                          </span>
                        )}
                        <p className="truncate text-[15px] font-semibold tracking-wide text-stone-800">
                          {person.name}
                        </p>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <a
                        href={`tel:${cleanPhone(person.phone)}`}
                        aria-label={`${person.name}에게 전화하기`}
                        className={`flex h-10 items-center gap-1.5 rounded-full px-3 text-[12px] font-medium
                                    border active:scale-95 transition
                                    ${
                                      modal.side === "groom"
                                        ? "bg-sky-50/90 border-sky-200/70 text-sky-700"
                                        : "bg-orange-50/90 border-orange-200/70 text-orange-700"
                                    }`}
                      >
                        📞
                        <span>전화</span>
                      </a>
                      <a
                        href={`sms:${cleanPhone(person.phone)}`}
                        aria-label={`${person.name}에게 문자하기`}
                        className={`flex h-10 items-center gap-1.5 rounded-full border px-3 text-[12px] font-medium active:scale-95 transition ${
                          modal.side === "groom"
                            ? "border-sky-200/70 bg-white/85 text-sky-700"
                            : "border-orange-200/70 bg-white/85 text-orange-700"
                        }`}
                      >
                        💬
                        <span>문자</span>
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
