import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const Callcenter = () => {
  const [scale, setScale] = useState(1);
  const [sectionHeight, setSectionHeight] = useState(null);
  const contentRef = useRef();

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth <= 1200) {
        setScale(2);
      } else {
        setScale(1);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const updateHeight = () => {
      if (contentRef.current) {
        const rawHeight = contentRef.current.scrollHeight;
        const scaledHeight = rawHeight * scale;
        setSectionHeight(scaledHeight);
      }
    };

    const resizeObserver = new ResizeObserver(updateHeight);
    if (contentRef.current) resizeObserver.observe(contentRef.current);
    setTimeout(updateHeight, 50);

    return () => {
      if (contentRef.current) resizeObserver.unobserve(contentRef.current);
    };
  }, [scale]);

  return (
    <div
      className="w-full flex flex-col items-center pt-[0px]"
      style={{
        height: sectionHeight ? `${sectionHeight}px` : "auto",
        overflow: "hidden",
      }}
    >
      <div
        ref={contentRef}
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "top center",
          width: "fit-content",
        }}
      >
        <Link to="/center1">
          <img src="/B6p/center1.svg" alt="3_1" />
        </Link>
        <div className="mt-[3px]" />
        <Link to="/center2">
          <img src="/B6p/center2.svg" alt="3_1" />
        </Link>
        <div className="mt-[3px]" />
        <Link to="/center3">
          <img src="/B6p/center3.svg" alt="3_1" />
        </Link>
        <div className="mt-[3px]" />
        <Link to="/center4">
          <img src="/B6p/center4.svg" alt="3_1" />
        </Link>
        <div className="mt-[150px]" />
      </div>
    </div>
  );
};

export default Callcenter;
