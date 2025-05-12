import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const AboutSection = () => {
  const [scale, setScale] = useState(1);
  const contentRef = useRef(null);
  const [loadedCount, setLoadedCount] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [hovered, setHovered] = useState(false); // ✅ 추가된 상태

  const imageCount = 7;

  const handleImageLoad = () => {
    setLoadedCount((prev) => {
      const updated = prev + 1;
      if (updated === imageCount) {
        setLoaded(true);
      }
      return updated;
    });
  };

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 1200);
      setScale(width <= 1200 ? 1.3 : 1);
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="w-full flex justify-center overflow-y-hidden overflow-x-visible pt-[100px]">
      <div
        ref={contentRef}
        className="w-[820px] flex flex-col items-center"
        style={{
          zoom: scale,
        }}
      >
        <div className="mt-[10px]">
          <img
            src="/B1p/B_text51.svg"
            alt="text-51"
            onLoad={handleImageLoad}
            className="mx-auto"
          />
        </div>
        <div className="mt-[20px]" />

        <div className="grid grid-cols-2 gap-x-[20px] gap-y-[30px] md:flex md:gap-[17px] md:justify-center md:flex-wrap">
          {[51, 52, 53, 54].map((i) => (
            <img
              key={i}
              src={`/B1p/b_${i}.svg`}
              alt={`b_${i}`}
              onLoad={handleImageLoad}
            />
          ))}
        </div>

        <div className="mt-[1px]" />
        <Link to="/center1">
          <img
            src="/B1p/b_55.svg"
            alt="b_55"
            onLoad={handleImageLoad}
            className={`cursor-pointer rounded-[8px] transition-all duration-300 ease-in-out 
            ${
              hovered
                ? "scale-[1.05] brightness-105 shadow-xl"
                : "animate-breathe"
            }`}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          />
        </Link>

        <div className="mt-[40px]" />
      </div>
    </div>
  );
};

export default AboutSection;
