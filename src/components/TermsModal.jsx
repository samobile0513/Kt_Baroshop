import React, { useEffect, useRef, useLayoutEffect } from "react";

const TermsModal = ({ isOpen, onClose, children }) => {
  const modalRef = useRef(null);
  const scrollRef = useRef(null);

  useLayoutEffect(() => {
    if (isOpen && modalRef.current) {
      // 크롬에서 모달 위치 강제 계산 + GPU 가속
      modalRef.current.getBoundingClientRect();
      modalRef.current.style.transform = "translateZ(0)";
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    const preventScrollPropagation = (e) => {
      e.stopPropagation();
    };

    const preventTouchPropagation = (e) => {
      const target = scrollRef.current;
      if (!target) return;

      const { scrollTop, scrollHeight, clientHeight } = target;
      const touchDelta = e.touches[0].clientY;
      const atTop = scrollTop === 0;
      const atBottom = scrollTop + clientHeight >= scrollHeight;

      if ((atTop && touchDelta > 0) || (atBottom && touchDelta < 0)) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const preventOuterScroll = (e) => {
      if (window.__isModalOpen) {
        e.preventDefault();
      }
    };

    if (isOpen) {
      // html과 body 모두에 스크롤 차단
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";

      window.__isModalOpen = true;

      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = 0;
          scrollRef.current.focus();
        }
        if (modalRef.current) {
          modalRef.current.scrollTop = 0;
          modalRef.current.style.visibility = "hidden";
          requestAnimationFrame(() => {
            modalRef.current.style.visibility = "visible";
          });
        }
      }, 0);

      document.addEventListener("keydown", handleKeyDown);
      scrollRef.current?.addEventListener("wheel", preventScrollPropagation, {
        passive: true,
      });
      scrollRef.current?.addEventListener(
        "touchmove",
        preventTouchPropagation,
        { passive: false }
      );
      window.addEventListener("wheel", preventOuterScroll, { passive: false });
      window.addEventListener("touchmove", preventOuterScroll, {
        passive: false,
      });
    } else {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      window.__isModalOpen = false;

      document.removeEventListener("keydown", handleKeyDown);
      scrollRef.current?.removeEventListener("wheel", preventScrollPropagation);
      scrollRef.current?.removeEventListener(
        "touchmove",
        preventTouchPropagation
      );
      window.removeEventListener("wheel", preventOuterScroll);
      window.removeEventListener("touchmove", preventOuterScroll);
    }

    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      window.__isModalOpen = false;

      document.removeEventListener("keydown", handleKeyDown);
      scrollRef.current?.removeEventListener("wheel", preventScrollPropagation);
      scrollRef.current?.removeEventListener(
        "touchmove",
        preventTouchPropagation
      );
      window.removeEventListener("wheel", preventOuterScroll);
      window.removeEventListener("touchmove", preventOuterScroll);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center animate-fade"
      style={{ paddingBottom: "0vh", top: "-600px" }}
      tabIndex={-1}
      onClick={handleOverlayClick}
    >
      <div
        ref={modalRef}
        className="relative bg-white w-[90%] max-w-[900px] rounded-lg shadow-lg outline-none"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 text-2xl font-bold z-10"
          onClick={onClose}
        >
          ×
        </button>

        <div
          ref={scrollRef}
          className="p-6 overflow-y-auto max-h-[100vh] focus:outline-none"
          tabIndex={0}
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default TermsModal;
