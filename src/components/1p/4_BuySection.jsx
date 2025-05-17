import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const phoneImages = [
  { src: "/B1p/b_31.png", link: "/5m" },
  { src: "/B1p/b_32.png", link: "/6m" },
  { src: "/B1p/b_33.png", link: "/7m" },
  { src: "/B1p/b_34.png", link: "/8m" },
];

const PopularModels = () => {
  const [scale, setScale] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 1200);
      setScale(width <= 1200 ? 1.8 : 1);
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleClick = () => {
    navigate("/2_Surveyform");
  };

  return (
    <div
      className="w-full flex justify-center"
      style={{ backgroundColor: "#EBEBEB" }}
    >
      <div
        style={{
          width: "820px",
          zoom: scale,
          paddingTop: "22px",
        }}
      >
        <div className="flex flex-col items-center pt-[100px]">
          {/* 위 텍스트 장식 */}
          <div className="w-full relative mb-[40px]">
            <img
              src="/B1p/B_text31.svg"
              className={`absolute ${
                isMobile
                  ? "left-[177px] top-[-60px]"
                  : "left-[-150px] top-[-50px]"
              }`}
              alt="left-text"
              style={{
                width: "auto",
                height: "auto",
                transform: "none",
                position: "absolute",
                zIndex: 10,
                scale: "1.25",
              }}
            />

          </div>

          {/* 휴대폰 이미지 */}
          {isMobile ? (
            <div className="grid grid-cols-2 gap-x-[20px] gap-y-[30px]">
              {phoneImages.map((item, i) => (
                <Link key={i} to={item.link}>
                  <img src={item.src} alt={`phone-${i}`} />
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex gap-[17px] justify-center">
              {phoneImages.map((item, i) => (
                <Link key={i} to={item.link}>
                  <img src={item.src} alt={`phone-${i}`} />
                </Link>
              ))}
            </div>
          )}

          {/* 하단 여백 */}
          <div className="mt-[100px]" />
        </div>
      </div>
    </div>
  );
};

export default PopularModels;