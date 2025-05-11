import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const MobileNavMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menus = [
    { name: '휴대폰', path: '/' },
    { name: '인터넷/TV', path: '/2page' },
    { name: '디바이스', path: '/3page' },
    { name: '특별기획전', path: '/4page' },
  ];

  return (
    <div className="relative">
      {/* 상단 바: 로고 + 햄버거 */}
      <div className="w-full h-[65px] bg-white z-50 flex items-center justify-between border-y border-black">
        <div className="pr-[93px] shrink-0 ml-[20px] min-ml-[20px]">
          <Link to="/">
            <img src="/Mtitle.svg" alt="kt바로샵" className="h-[33px]" />
          </Link>
        </div>
        <div className="pl-[93px] shrink-0 mr-[20px] min-mr-[16px]">
          <button onClick={() => setIsOpen(true)}>
            <img src="/Mburger.svg" alt="menu" className="h-[26px]" />
          </button>
        </div>
      </div>

      {/* 오버레이 */}
      <div
        className={`absolute inset-0 z-40 bg-black bg-opacity-40 transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
      />

      {/* 슬라이드 메뉴 - 오른쪽에서 등장 */}
      <nav
        className={`absolute right-0 w-[270px] max-h-screen overflow-y-auto z-50 bg-[#00A9A4] mt-[-65px] px-[24px] pt-[24px] pb-[40px] flex flex-col gap-[22px] transform transition-transform duration-300 border-y border-black ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* X 버튼 - 오른쪽 상단 고정 */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-[20px] right-[20px] text-white text-[28px] z-50 hover:text-[#FFD400] transition-colors"
          aria-label="닫기"
        >
          ×
        </button>
        {/* 로고 상단 표시 */}
        <div className="mb-[50px]" style={{ marginTop: '50px' }}>
          <img src="/Mlogo.svg" alt="kt바로샵" className="h-[35px] ml-auto mr-[30px]" />
        </div>

        {/* 메뉴 항목들 */}
        {menus.map((menu, idx) => (
          <Link
            key={idx}
            to={menu.path}
            onClick={() => setIsOpen(false)}
            className="text-white text-[26px]"
            style={{ fontFamily: 'font-6' }}
          >
            {menu.name}
          </Link>
        ))}

        <Link
          to="/callcenter"
          onClick={() => setIsOpen(false)}
          className="text-white text-[19px] mt-[20px]"
          style={{ fontFamily: 'font-6' }}
        >
          문의하기
        </Link>
      </nav>
    </div>
  );
};

export default MobileNavMenu;