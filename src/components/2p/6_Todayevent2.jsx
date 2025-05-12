import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const desktopImages = [
  { src: "/B4p/b4_4.png", alt: "b_74", link: "/4_Special" },
  { src: "/B4p/b4_5.png", alt: "b_75", link: "/5_Special" },
];

const mobileImages = [
  { src: "/B4p/b4_4m.png", alt: "b_74", link: "/4_Special" },
  { src: "/B4p/b4_5m.png", alt: "b_75", link: "/5_Special" },
];

const EventSection = () => {
  const [scale, setScale] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 500);
      if (width <= 500) {
        if (width >= 100 && width <= 393) {
          setScale(2.2);
        } else {
          setScale(Math.min((width / 393) * 2.2, 2.2));
        }
      } else {
        setScale(1);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const images = isMobile ? mobileImages : desktopImages;

  return (
    <div className="w-full flex justify-center bg-white">
      <div
        className="w-[820px] flex flex-col items-center"
        style={{
          zoom: scale,
          paddingTop: "50px",
          paddingBottom: "100px",
        }}
      >
        {/* 타이틀 */}
        <img src="/B1p/B_text71.svg" alt="오늘의 이벤트" />
        <div style={{ height: "50px" }} />

        {/* 이미지 카드 */}
        {images.map((item, index) => (
          <React.Fragment key={index}>
            <img
              src={item.src}
              alt={item.alt}
              onClick={() => navigate(item.link)}
              className="cursor-pointer rounded-[8px] transition-all duration-300 "
            />
            <div
              style={{ height: index === images.length - 1 ? "70px" : "30px" }}
            />
          </React.Fragment>
        ))}

        {/* 버튼 배너 */}
        <img
          src="/B1p/b_74.svg"
          alt="b_74"
          onClick={() => navigate("/3_Surveyform2")}
          className="cursor-pointer rounded-[8px] transition-all duration-300 "
        />
      </div>
    </div>
  );
};

export default EventSection;
