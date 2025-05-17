import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const NavMenu = () => {
  const location = useLocation();
  const navigate = useNavigate(); // ✅ 추가
  const [activeMenu, setActiveMenu] = useState("");

  const menus = [
    { name: "휴대폰", path: "/" },
    { name: "인터넷/TV", path: "/2page" },
    { name: "디바이스", path: "/3page" },
    { name: "특별기획전", path: "/4page" },
  ];

  useEffect(() => {
    const currentPath = location.pathname;
    const menu = menus.find((menu) => menu.path === currentPath);
    if (menu) {
      setActiveMenu(menu.name);
    } else {
      setActiveMenu("");
    }
  }, [location]);

const handleLogoClick = () => {
  // 현재 페이지 경로를 기준으로 새로고침
  window.location.href = window.location.pathname;
};

  return (
    <nav className="w-full bg-white flex justify-center overflow-hidden border-t border-b border-black">
      <div className="w-[1920px] h-[65px] flex items-center px-[426px] whitespace-nowrap">
        {/* 로고 */}
        <div className="pr-[93px] shrink-0 ml-[-93px]">
          <img
            src="/B1p/B_title.svg"
            alt="kt바로샵"
            className="h-[30px] object-contain cursor-pointer"
            onClick={handleLogoClick}
          />
        </div>

        {/* 메뉴들 */}
        <div className="flex gap-[35px] shrink-0">
          {menus.map((menu, idx) => (
            <Link
              key={idx}
              to={menu.path}
              className={`text-[#3E3E3E] text-[20px] hover:text-primary hover:font-bold hover:border-b-2 hover:border-primary ${
                activeMenu === menu.name
                  ? "text-primary font-bold border-b-2 border-primary"
                  : ""
              }`}
              style={{ fontFamily: "font-6" }}
            >
              {menu.name}
            </Link>
          ))}
        </div>

        {/* flex 여백 */}
        <div className="flex-grow" />

        {/* 문의하기 */}
        <div className="shrink-0 ml-[50px]">
          <Link
            to="callcenter"
            className="text-[#3E3E3E] text-[20px] hover:text-primary hover:font-bold hover:border-b-2 hover:border-primary"
            style={{ fontFamily: "font-6" }}
          >
            문의하기
          </Link>
        </div>
      </div>

      <style jsx>{`
        .hover\\:text-primary:hover {
          color: #fd3941;
        }
        .hover\\:font-bold:hover {
          font-weight: bold;
        }
        .hover\\:border-b-2:hover {
          border-bottom-width: 2px;
        }
        .hover\\:border-primary:hover {
          border-color: #fd3941;
        }
        .text-primary {
          color: #fd3941;
        }
        .font-bold {
          font-weight: bold;
        }
        .border-b-2 {
          border-bottom-width: 2px;
        }
        .border-primary {
          border-color: #fd3941;
        }
      `}</style>
    </nav>
  );
};

export default NavMenu;
