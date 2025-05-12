import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const desktopImages = [
  { src: "/B4p/b4_1.png", alt: "b_71", link: "/1_Special" },
  { src: "/B4p/b4_2.png", alt: "b_72", link: "/2_Special" },
  { src: "/B4p/b4_3.png", alt: "b_73", link: "/3_Special" },
];

const mobileImages = [
  { src: "/B4p/b4_1m.png", alt: "b_71", link: "/1_Special" },
  { src: "/B4p/b4_2m.png", alt: "b_72", link: "/2_Special" },
  { src: "/B4p/b4_3m.png", alt: "b_73", link: "/3_Special" },
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
          paddingTop: "150px",
          paddingBottom: "100px",
        }}
      >
        {/* 타이틀 */}
        <img src="/B1p/B_text71.svg" alt="오늘의 이벤트" />
        <div style={{ height: "98px" }} />

        {/* 이미지 카드 3개 */}
        {images.map((item, index) => (
          <React.Fragment key={index}>
            <img
              src={item.src}
              alt={item.alt}
              onClick={() => navigate(item.link)}
              className="cursor-pointer rounded-[8px] transition-all duration-300 "
            />
            <div style={{ height: index === 2 ? "70px" : "30px" }} />
          </React.Fragment>
        ))}

        {/* 버튼 배너 */}
        <img
          src="/B1p/b_74.svg"
          alt="b_74"
          onClick={() => navigate("/2_Surveyform")}
          className="cursor-pointer rounded-[8px] transition-all duration-300 "
        />
      </div>
    </div>
  );
};

export default EventSection;
