import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const desktopImages = [
  { src: "/B4p/b4_4.png", link: "/4_Special" },
  { src: "/B4p/b4_5.png", link: "/5_Special" },
];

const mobileImages = [
  { src: "/B4p/b4_4m.png", link: "/4_Special" },
  { src: "/B4p/b4_5m.png", link: "/5_Special" },
];

const MainImageSlider = () => {
  const [current, setCurrent] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [scale, setScale] = useState(1);
  const intervalRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const mouseDownX = useRef(null);
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

  useEffect(() => {
    startAutoSlide();
    return () => stopAutoSlide();
  }, []);

  const startAutoSlide = () => {
    intervalRef.current = setInterval(() => {
      setCurrent(
        (prev) =>
          (prev + 1) % (isMobile ? mobileImages.length : desktopImages.length)
      );
    }, 3000);
  };

  const stopAutoSlide = () => {
    clearInterval(intervalRef.current);
  };

  const goToSlide = (index) => {
    setCurrent(index);
    stopAutoSlide();
    startAutoSlide();
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX.current;

    if (Math.abs(diff) > 50) {
      if (diff > 0)
        setCurrent(
          (prev) =>
            (prev + 1) % (isMobile ? mobileImages.length : desktopImages.length)
        );
      else
        setCurrent(
          (prev) =>
            (prev -
              1 +
              (isMobile ? mobileImages.length : desktopImages.length)) %
            (isMobile ? mobileImages.length : desktopImages.length)
        );
    }
  };

  const handleMouseDown = (e) => {
    mouseDownX.current = e.clientX;
  };

  const handleMouseUp = (e) => {
    if (mouseDownX.current === null) return;
    const diff = mouseDownX.current - e.clientX;

    if (Math.abs(diff) > 50) {
      if (diff > 0)
        setCurrent(
          (prev) =>
            (prev + 1) % (isMobile ? mobileImages.length : desktopImages.length)
        );
      else
        setCurrent(
          (prev) =>
            (prev -
              1 +
              (isMobile ? mobileImages.length : desktopImages.length)) %
            (isMobile ? mobileImages.length : desktopImages.length)
        );
    }
    mouseDownX.current = null;
  };

  const handleClick = (link) => {
    navigate(link);
  };

  const images = isMobile ? mobileImages : desktopImages;

  return (
    <div className="w-full flex justify-center">
      <div
        style={{
          width: isMobile ? "500px" : "100%",
          height: isMobile ? "400px" : "500px",
          zoom: scale,
          marginBottom: isMobile ? "20px" : "0",
        }}
      >
        <div
          className="relative overflow-hidden w-full h-full"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
        >
          <div
            className="flex transition-transform duration-700 ease-in-out h-full"
            style={{ transform: `translateX(-${current * 100}%)` }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {images.map((item, index) => (
              <div
                key={index}
                className="w-full flex-shrink-0 cursor-pointer"
                onClick={() => handleClick(item.link)}
              >
                <img
                  src={item.src}
                  className="w-full h-full object-cover"
                  draggable={false}
                  alt={`slide-${index}`}
                />
              </div>
            ))}
          </div>

          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            {images.map((_, index) => (
              <div
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 cursor-pointer ${
                  index === current
                    ? "w-8 h-3 rounded-full bg-neutral-800"
                    : "w-3 h-3 rounded-full bg-neutral-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainImageSlider;
