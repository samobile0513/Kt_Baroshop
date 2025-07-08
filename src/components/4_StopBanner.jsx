import React, { useEffect, useState } from "react";
import StopBanner3 from "./5_StopBanner3.jsx";
import { useNavigate } from "react-router-dom";
import ConsultPopup from "./other/ConsultPopup.jsx";

const StopBanner = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showConsultPopup, setShowConsultPopup] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 1200);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handlePopupClick = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleConsultClick = () => {
    setShowConsultPopup(true);
  };

  const handleCloseConsultPopup = () => {
    setShowConsultPopup(false);
  };

  return (
    <>
      <div className="fixed top-[310px] left-[20px] z-50">
        {isMobile ? (
          <StopBanner3 />
        ) : (
          <div className="flex flex-col items-center">
            <a
              href="http://pf.kakao.com/_BxmFin"
              target="_blank"
              rel="noopener noreferrer"
              className="group mb-[20px]"
              onTouchStart={() => {}}
              style={{ cursor: "pointer" }}
            >
              <img src="/stop_banner_1.svg" alt="배너1" />
            </a>
            <div onClick={handlePopupClick} className="group mb-[20px] clickable">
              <img src="/stop_banner_2.svg" alt="배너2" />
            </div>
            <div onClick={handleConsultClick} className="group mb-[20px] clickable">
              <img src="/stop_banner_3.svg" alt="배너3" />
            </div>
          </div>
        )}
      </div>

      {/* 팝업창 (전화 상담) */}
      {showPopup && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#FFFFFF",
            padding: "30px",
            borderRadius: "20px",
            boxShadow: "0 4px 15px rgba(255, 51, 51, 0.3)",
            zIndex: 100,
            animation: "sparkle 1.5s infinite",
            border: "2px solid #FD3941",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <p
              style={{
                fontFamily: "Paperlogy-5Medium",
                fontSize: "20px",
                color: "#333333",
                marginBottom: "20px",
              }}
            >
              1551-1531 연락 주시면
              <br />
              친절하게 상담해드립니다 ✨
            </p>
            <button
              onClick={handleClosePopup}
              style={{
                backgroundColor: "#333333",
                color: "white",
                padding: "10px 20px",
                borderRadius: "10px",
                border: "none",
                cursor: "pointer",
                fontFamily: "Paperlogy-5Medium",
                fontSize: "16px",
              }}
            >
              닫기
            </button>
          </div>
        </div>
      )}

      {/* 팝업창 (상담 신청 선택) - ConsultPopup 사용 */}
      <ConsultPopup
        isOpen={showConsultPopup}
        onClose={handleCloseConsultPopup}
      />

      {/* 팝업 오버레이 */}
      {showPopup && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 99,
          }}
          onClick={handleClosePopup}
        />
      )}

      <style jsx>{`
        .clickable {
          cursor: pointer;
        }
        a.group {
          cursor: pointer;
        }
        @keyframes sparkle {
          0%,
          100% {
            box-shadow: 0 4px 15px rgba(255, 51, 51, 0.3);
          }
          50% {
            box-shadow: 0 4px 25px rgba(255, 51, 51, 0.6);
          }
        }
      `}</style>
    </>
  );
};

export default StopBanner;
