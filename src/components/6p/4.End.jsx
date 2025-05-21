import React, { useEffect, useRef, useState } from "react";

const CharacterSection = () => {
  const [scale, setScale] = useState(1);
  const contentRef = useRef(null);
  const [adjustedHeight, setAdjustedHeight] = useState("auto");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width <= 640) {
        setScale(1); // 모바일: 확대 없음
      } else if (width <= 1200) {
        setScale(1.4); // 태블릿 또는 작은 데스크톱
      } else {
        setScale(1); // 큰 데스크톱
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const img = new Image();
    img.src = "/End.svg";
    img.onload = () => {
      if (contentRef.current) {
        const baseHeight = contentRef.current.offsetHeight;
        const paddedHeight = baseHeight + 0;
        setAdjustedHeight(paddedHeight * scale);
        setLoaded(true);
      }
    };
  }, [scale]);

  return (
    <div
      className="w-full flex justify-center overflow-x-auto pt-[30px]"
      style={{ minHeight: adjustedHeight }}
    >
      <div
        ref={contentRef}
        className="w-[820px] max-w-full flex flex-col items-center"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "top center",
        }}
      >
        <img
          src="/End.svg"
          alt="5_1"
          style={{ objectFit: "contain", width: "100%", height: "auto" }}
        />
      </div>
    </div>
  );
};

export default CharacterSection;