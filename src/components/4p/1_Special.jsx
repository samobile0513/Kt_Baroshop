import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const desktopImages = [
  { src: "/B4p/b4_1.png", alt: "3_1", link: "/1_Special" },
  { src: "/B4p/b4_2.png", alt: "3_1", link: "/2_Special" },
  { src: "/B4p/b4_3.png", alt: "3_1", link: "/3_Special" },
  { src: "/B4p/b4_4.png", alt: "3_1", link: "/4_Special" },
  { src: "/B4p/b4_5.png", alt: "3_1", link: "/5_Special" },
];

const mobileImages = [
  { src: "/B4p/b4_1m.png", alt: "3_1", link: "/1_Special" },
  { src: "/B4p/b4_2m.png", alt: "3_1", link: "/2_Special" },
  { src: "/B4p/b4_3m.png", alt: "3_1", link: "/3_Special" },
  { src: "/B4p/b4_4m.png", alt: "3_1", link: "/4_Special" },
  { src: "/B4p/b4_5m.png", alt: "3_1", link: "/5_Special" },
];

const RelatedEmploymentSection = () => {
  const [scale, setScale] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 500);
      if (width <= 500) {
        if (width >= 100 && width <= 393) {
          setScale(2.4);
        } else {
          setScale(Math.min((width / 393) * 2.4, 2.4));
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

export default RelatedEmploymentSection;
