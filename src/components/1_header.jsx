import React from "react";

const Header = () => {
  return (
    <header className="w-full h-[62px] bg-[#EFEFEF] flex items-center justify-center border-t-0">
      <div className="flex items-center gap-3">
        {/* 왼쪽 텍스트 */}
        <span
          className="text-[20px] text-[#3e3e3e]"
          style={{ fontFamily: "font-4" }}
        >
          기업을 운영하는 사람이라면 필수! 세금감면의 지름길
        </span>

        {/* 어울림 바로가기 (텍스트 이미지) */}
        <img
          src="/B1p/B_headertext.svg"
          alt="어울림 바로가기"
          className="h-[24px]"
        />

        {/* 로고 이미지 */}
        <img src="/B1p/B_logo.svg" alt="로고" className="h-[24px]" />

        {/* 화살표 아이콘 (SVG) */}
        <img
          src="/B1p/B_arrow.svg"
          alt="화살표"
          className="w-[14px] h-[14px]"
        />
      </div>
    </header>
  );
};

export default Header;
