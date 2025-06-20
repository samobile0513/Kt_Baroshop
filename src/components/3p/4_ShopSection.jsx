import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const phoneImagesSet1 = [
  { src: "/B3p/b3_41.png", link: "/4d" },
  { src: "/B3p/b3_42.png", link: "/5d" },
  { src: "/B3p/b3_43.png", link: "/6d" },
];

const phoneImagesSet2 = [
  { src: "/B3p/b3_44.png", link: "/7d" },
  { src: "/B3p/b3_45.png", link: "/8d" },
  { src: "/B3p/b3_46.png", link: "/9d" },
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
          {/* 첫 번째 세트: 위 텍스트 장식 */}
          <div className="w-full relative mb-[40px]">
            <img
              src="/B3p/b3_4title1.svg"
              className={`absolute ${
                isMobile
                  ? "left-[75px] top-[-60px]"
                  : "left-[-145px] top-[-30px]"
              }`}
              alt="left-text"
              style={{
                width: "auto",
                height: "auto",
                transform: "none",
                position: "absolute",
                zIndex: 10,
                scale: isMobile ? "1.7" : "1",
              }}
            />
          </div>

          {/* 첫 번째 세트: 휴대폰 이미지 */}
          <div className="flex gap-[17px] justify-center">
            {phoneImagesSet1.map((item, i) => (
              <Link key={i} to={item.link} style={{ display: "contents" }}>
                <img src={item.src} alt={`phone-${i}`} />
              </Link>
            ))}
          </div>

          {/* 세트 사이 여백 */}
          <div className="mt-[150px]" />

          {/* 두 번째 세트: 위 텍스트 장식 */}
          <div className="w-full relative mb-[40px]">
            <img
              src="/B3p/b3_4title2.svg"
              className={`absolute ${
                isMobile
                  ? "left-[50px] top-[-60px]"
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

          {/* 두 번째 세트: 휴대폰 이미지 */}
          <div className="flex gap-[17px] justify-center">
            {phoneImagesSet2.map((item, i) => (
              <Link key={i + 3} to={item.link} style={{ display: "contents" }}>
                <img src={item.src} alt={`phone-${i + 3}`} />
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