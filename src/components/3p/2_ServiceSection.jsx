import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const phoneImages = [
  { src: "/B3p/b3_21.png", link: "/1d" },
  { src: "/B3p/b3_22.png", link: "/2d" },
  { src: "/B3p/b3_23.png", link: "/3d" },
];

const PopularModels = () => {
  const [scale, setScale] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 1200);
      setScale(width <= 1200 ? 1 : 1);
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="w-full flex justify-center">
      <div
        style={{
          width: "820px",
          zoom: scale,
        }}
      >
        <div className="flex flex-col items-center pt-[150px]">
          {/* 위 텍스트 장식 */}
          <div className="w-full relative mb-[40px]">
            <img
              src="/B3p/B3_2title.svg"
              className={`absolute ${
                isMobile
                  ? "left-[70px] top-[-60px]"
                  : "left-[-145px] top-[-30px]"
              }`}
              alt="left-text"
              style={{
                width: "auto",
                height: "auto",
                transform: "none",
                position: "absolute",
                zIndex: 10,
                scale: isMobile ? "2" : "1",
              }}
            />
          </div>

          {/* 휴대폰 이미지 */}
          <div className="flex gap-[17px] justify-center">
            {phoneImages.map((item, i) => (
              <Link key={i} to={item.link} style={{ display: "contents" }}>
                <img src={item.src} alt={`phone-${i}`} />
              </Link>
            ))}
          </div>

          {/* 하단 여백 */}
          <div className="mt-[50px]" />
        </div>
      </div>
    </div>
  );
};

export default PopularModels;