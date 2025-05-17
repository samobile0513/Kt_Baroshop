import React from "react";

const Header = ({ scale = 1 }) => {
  return (
    <div
      className="w-full bg-[#EFEFEF] flex flex-col items-center justify-center"
      style={{ height: `${62 * scale}px` }}
    >
      {/* 첫 줄 텍스트 */}
      <span
        style={{
          fontFamily: "font-4",
          fontSize: `${9 * scale}px`,
          lineHeight: `${18 * scale}px`,
        }}
        className="text-[#3e3e3e]"
      >
        기업을 운영하는 사람이라면 필수! 세금감면의 지름길
      </span>

      {/* 둘째 줄: 어울림 바로가기 + 로고 + 화살표 */}
      <a
        href="https://www.어울림.net"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-[6px] mt-[2px] cursor-pointer"
      >
        <span
          style={{
            fontFamily: "font-7",
            fontSize: `${16 * scale}px`,
            lineHeight: `${20 * scale}px`,
          }}
          className="text-[#00A9A4] font-bold"
        >
          어울림 바로가기
        </span>

        <img
          src="/B1p/B_logo.svg"
          alt="로고"
          style={{ height: `${20 * scale}px` }}
        />
        <img
          src="/B1p/B_arrow.svg"
          alt="화살표"
          style={{ width: `${14 * scale}px`, height: `${14 * scale}px` }}
        />
      </a>
    </div>
  );
};

export default Header;
