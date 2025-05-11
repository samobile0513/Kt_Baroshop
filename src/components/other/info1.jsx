import React, { useEffect, useState, useRef } from "react";
import TermsModal from "../TermsModal";

const Info1 = () => {
  const [termsText, setTermsText] = useState("");
  const [scale, setScale] = useState(1);
  const contentRef = useRef(null);
  const [adjustedHeight, setAdjustedHeight] = useState('auto');
  const [loaded, setLoaded] = useState(false);
  const [openModal, setOpenModal] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setScale(width <= 1200 ? 1.4 : 1);
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (contentRef.current) {
      const baseHeight = contentRef.current.offsetHeight;
      const paddedHeight = baseHeight + 0;
      setAdjustedHeight(paddedHeight * scale);
      setLoaded(true);
    }
  }, [scale]);

  useEffect(() => {
    fetch("/info1.txt")
      .then((res) => res.text())
      .then((text) => setTermsText(text))
      .catch((err) => {
        console.error("이용약관을 불러오는 중 오류 발생:", err);
        setTermsText("이용약관을 불러오지 못했습니다.");
      });
  }, []);

  const closeModal = () => {
    setOpenModal(null);
  };

  return (
    <div className="w-full flex justify-center overflow-x-visible" style={{ minHeight: adjustedHeight, backgroundColor: "white" }}>
      <div
        ref={contentRef}
        className="w-[820px] flex flex-col items-center"
        style={{
          zoom: scale,
          transformOrigin: 'top center',
          marginTop: "20px",
          padding: "0 20px",
          paddingTop: window.innerWidth <= 1200 ? "300px" : "0",
        }}
      >
        <h1
          onClick={() => setOpenModal("info1")}
          style={{
            fontFamily: "Paperlogy-5Medium",
            fontSize: "48px",
            marginBottom: "100px",
            cursor: "pointer",
          }}
        >
          이용약관
        </h1>

        <div
          style={{
            fontFamily: "Paperlogy-4Regular",
            fontSize: "12px",
            maxWidth: "800px",
            whiteSpace: "pre-wrap",
            marginBottom: "150px",
            lineHeight: "1.6",
          }}
        >
          {termsText}
        </div>
      </div>

      <TermsModal
        key="info1"
        isOpen={openModal === "info1"}
        onClose={closeModal}
        style={{ top: window.innerWidth <= 1200 ? "300px" : "0" }}
      >
        <div className="max-h-[80vh] overflow-y-auto p-4 font-[Paperlogy] text-[15px]">
          <Info1 />
        </div>
      </TermsModal>
    </div>
  );
};

export default Info1;