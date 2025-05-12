import React, { useEffect, useRef, useState } from "react";

const AboutSection = () => {
  const [scale, setScale] = useState(1);
  const contentRef = useRef(null);
  const [adjustedHeight, setAdjustedHeight] = useState("auto");
  const [loadedCount, setLoadedCount] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const imageCount = 7; // 총 이미지 수

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
      setScale(width <= 1200 ? 1.1 : 1);
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (loaded && contentRef.current) {
      const baseHeight = contentRef.current.offsetHeight;
      setAdjustedHeight(baseHeight * scale);
    }
  }, [loaded, scale]);

  return (
    <div
      className="w-full flex justify-center overflow-y-hidden overflow-x-visible pt-[80px]"
      style={{ height: adjustedHeight }}
    >
      <div
        ref={contentRef}
        className="w-[820px] flex flex-col items-center"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "top center",
        }}
      >
        <img
          src="/B1p/b_21.svg"
          alt="b_21"
          onLoad={handleImageLoad}
          className="mx-auto"
        />
        <div className="mt-[15px]" />
        <img
          src="/B1p/b_22.svg"
          alt="b_22"
          onLoad={handleImageLoad}
          className="mx-auto"
        />
        <div className="mt-[47px]" />
        <img
          src="/B1p/b_23.svg"
          alt="b_23"
          onLoad={handleImageLoad}
          className="mx-auto"
        />
        <div className="mt-[122px]" />

        <div className="flex flex-row justify-center gap-[10px]">
          <img src="/B1p/b_24.svg" alt="b_24" onLoad={handleImageLoad} />
          <img src="/B1p/b_25.svg" alt="b_25" onLoad={handleImageLoad} />
        </div>
        <div className="mt-[50px]" />

        <div className="flex flex-row justify-center gap-[10px]">
          <img src="/B1p/b_26.svg" alt="b_26" onLoad={handleImageLoad} />
          <img src="/B1p/b_27.svg" alt="b_27" onLoad={handleImageLoad} />
        </div>
        <div className="mt-[96px]" />
      </div>
    </div>
  );
};

export default AboutSection;
