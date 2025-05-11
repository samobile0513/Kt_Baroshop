import React, { useState } from 'react';
import ConsultPopup from './other/ConsultPopup.jsx';

const StopBanner3 = () => {
  const [showConsultPopup, setShowConsultPopup] = useState(false);

  const handleConsultSelect = (type) => {
    console.log(`${type} 상담 선택됨`);
    setShowConsultPopup(false);
  };

  const handleCloseConsultPopup = () => {
    setShowConsultPopup(false);
  };

  return (
    <>
      {/* 버튼 영역 */}
      <div
        className="fixed bottom-[20px] right-[20px] flex flex-col gap-[14px] z-50"
      >
        <a href="tel:1551-1531">
          <img src="/stopm1.svg" alt="전화" className="w-[50px] h-[50px]" />
        </a>
        <a href="http://pf.kakao.com/_DWxdsn" target="_blank" rel="noopener noreferrer">
          <img src="/stopm2.svg" alt="카카오톡" className="w-[50px] h-[50px]" />
        </a>
        <button onClick={() => setShowConsultPopup(true)}>
          <img src="/stopm3.svg" alt="상담신청" className="w-[50px] h-[50px]" />
        </button>
      </div>

      {/* 팝업창 (상담 신청 선택) - ConsultPopup 사용 */}
      <ConsultPopup
        isOpen={showConsultPopup}
        onClose={handleCloseConsultPopup}
      />
    </>
  );
};

export default StopBanner3;