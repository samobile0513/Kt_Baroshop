import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const MainImage = () => {
  const [scale, setScale] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const mobile = width <= 500;
      setIsMobile(mobile);

      if (mobile) {
        if (width >= 100 && width <= 393) {
          setScale(2.4);
        } else {
          setScale(Math.min((width / 393) * 2.4, 2.4));
        }
      } else {
        setScale(1); // ✅ PC에선 scale 적용 안 함
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleClick = () => {
    navigate("/center4");
  };

  return (
    <div className="w-full flex justify-center bg-white">
      {/* PC는 scale 1, 모바일은 zoom 적용 */}
      <div
        className="flex flex-col items-center"
        style={{
          zoom: scale,
          paddingTop: "50px",
          paddingBottom: "0px",
        }}
      >
        <img
          src={isMobile ? "/B6p/center4m.png" : "/B2p/b_1.png"}
          alt="2페이지 메인 이미지"
          onClick={handleClick}
          className="object-cover cursor-pointer"
          style={{
            width: isMobile ? "500px" : "100%",
            height: isMobile ? "400px" : "auto",
            maxWidth: "1920px",
          }}
        />
      </div>
    </div>
  );
};

export default MainImage;
