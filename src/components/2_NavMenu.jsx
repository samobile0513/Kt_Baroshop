import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const NavMenu = () => {
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState("");

  useEffect(() => {
    // 경로에 따라 활성 메뉴 설정
    const currentPath = location.pathname;
    const menu = menus.find((menu) => menu.path === currentPath);
    if (menu) {
      setActiveMenu(menu.name);
    } else {
      setActiveMenu(""); // 경로가 메뉴에 없으면 활성 메뉴 초기화
    }
  }, [location]);

  const menus = [
    { name: "휴대폰", path: "/" },
    { name: "인터넷/TV", path: "/2page" },
    { name: "디바이스", path: "/3page" },
    { name: "특별기획전", path: "/4page" },
  ];

  return (
    <nav className="w-full bg-white flex justify-center overflow-hidden border-t border-b border-black">
      <div className="w-[1920px] h-[95px] flex items-center px-[426px] whitespace-nowrap">
        {/* 로고 */}
        <div className="pr-[93px] shrink-0 ml-[-93px]">
          <Link to="/">
            <img
              src="/B1p/B_title.svg"
              alt="kt바로샵"
              className="h-[30px] object-contain"
            />
          </Link>
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
            className="text-[#3E3E3E] text-[13px]"
            style={{ fontFamily: "font-6" }}
          >
            문의하기
          </Link>
        </div>
      </div>

      <style jsx>{`
        .hover\\:text-primary:hover {
          color: #fd3941; /* text-primary 색상, 필요 시 조정 */
        }
        .hover\\:font-bold:hover {
          font-weight: bold;
        }
        .hover\\:border-b-2:hover {
          border-bottom-width: 2px;
        }
        .hover\\:border-primary:hover {
          border-color: #fd3941; /* border-primary 색상, 필요 시 조정 */
        }
        .text-primary {
          color: #fd3941; /* 클릭 시 색상 */
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
