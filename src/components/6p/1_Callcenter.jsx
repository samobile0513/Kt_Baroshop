import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const desktopImages = [
  { src: "/B6p/center1.png", alt: "3_1", link: "/center1" },
  { src: "/B6p/center2.png", alt: "3_1", link: "/center2" },
  { src: "/B6p/center3.png", alt: "3_1", link: "/center3" },
  { src: "/B6p/center4.png", alt: "3_1", link: "/center4" },
  { src: "/B6p/center5.png", alt: "3_1", link: "/center5" },
];

const mobileImages = [
  { src: "/B6p/center1m.png", alt: "3_1", link: "/center1" },
  { src: "/B6p/center2m.png", alt: "3_1", link: "/center2" },
  { src: "/B6p/center3m.png", alt: "3_1", link: "/center3" },
  { src: "/B6p/center4m.png", alt: "3_1", link: "/center4" },
  { src: "/B6p/center5m.png", alt: "3_1", link: "/center5" },
];

const Callcenter = () => {
  const [scale, setScale] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

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
    <div className="w-full flex justify-center bg-white overflow-hidden">
      <div
        className="flex flex-col items-center"
        style={
          isMobile
            ? {
                width: "820px",
                zoom: scale,
                paddingTop: "0px",
                paddingBottom: "0px",
              }
            : {
                width: "100%",
                paddingTop: "0px",
              }
        }
      >
        {images.map((item, index) => (
          <React.Fragment key={index}>
                    {item.isMain ? (
              <div className="w-full overflow-hidden">
                <Link to={item.link}>
                  <img
                    src={item.src}
                    alt={item.alt}
                    className={
                      isMobile
                        ? "cursor-pointer"
                        : "min-w-[1920px] h-[500px] object-cover cursor-pointer"
                    }
                  />
                </Link>
              </div>
            ) : (
              <Link to={item.link}>
                <img
                  src={item.src}
                  alt={item.alt}
                  className={
                    isMobile ? "cursor-pointer" : "cursor-pointer w-auto h-auto"
                  }
                />
              </Link>
            )}
            <div
              style={{
                height: isMobile ? "3px" : index === 0 ? "０px" : "0px",
              }}
            />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Callcenter;
