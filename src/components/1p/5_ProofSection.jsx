import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const phoneImages = [
  { src: "/B1p/b_41.png", link: "/9m" },
  { src: "/B1p/b_42.png", link: "/10m" },
  { src: "/B1p/b_43.png", link: "/11m" },
  { src: "/B1p/b_44.png", link: "/12m" },
];

const additionalPhoneImages = [
  { src: "/B1p/b_45.png", link: "/13m" },
  { src: "/B1p/b_46.png", link: "/14m" },
  { src: "/B1p/b_47.png", link: "/15m" },
  { src: "/B1p/b_48.png", link: "/16m" },
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
    <div className="w-full flex justify-center">
      <div
        style={{
          width: "820px",
          zoom: scale,
        }}
      >
        <div className="flex flex-col items-center pt-[100px]">
          {/* 위 텍스트 장식 */}
          <div className="w-full relative mb-[40px]">
            <img
              src="/B1p/B_text41.svg"
              className={`absolute ${
                isMobile
                  ? "left-[155px] top-[-60px]"
                  : "left-[-150px] top-[-50px]"
              }`}
              alt="left-text"
              style={{
                width: "auto",
                height: "auto",
                transform: "none",
                position: "absolute",
                zIndex: 10,
                scale: "1.17",
              }}
            />
            <img
              src="/B1p/B_text12.svg"
              className={`absolute ${
                isMobile
                  ? "right-[120px] bottom-[-25px]"
                  : "right-[-190px] bottom-[-20px]"
              } cursor-pointer`}
              alt="right-text"
              style={{
                width: "auto",
                height: "auto",
                transform: "none",
                position: "absolute",
                zIndex: 10,
                scale: "1",
              }}
              onClick={handleClick}
            />
          </div>

          {/* 기존 휴대폰 이미지 */}
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
          <div className="mt-[20px]" />

          {/* 추가 휴대폰 이미지 */}
          {isMobile ? (
            <div className="grid grid-cols-2 gap-x-[20px] gap-y-[30px]">
              {additionalPhoneImages.map((item, i) => (
                <Link key={i + 15} to={item.link}>
                  <img src={item.src} alt={`phone-${i + 15}`} />
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex gap-[17px] justify-center">
              {additionalPhoneImages.map((item, i) => (
                <Link key={i + 15} to={item.link}>
                  <img src={item.src} alt={`phone-${i + 15}`} />
                </Link>
              ))}
            </div>
          )}

          {/* 하단 여백 */}
          <div className="mt-[0px]" />
        </div>
      </div>
    </div>
  );
};

export default PopularModels;