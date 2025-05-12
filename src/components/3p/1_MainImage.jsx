import React from "react";
import { useNavigate } from "react-router-dom";

const MainImage = () => {
  const navigate = useNavigate();

  return (
    <div
      className="relative w-full h-[500px] overflow-hidden flex justify-center items-center cursor-pointer"
      onClick={() => navigate("/2_Surveyform")}
    >
      <img
        src="B3p/B3_main.svg"
        alt="2페이지 메인 이미지"
        className="min-w-[1920px] h-full object-cover"
      />
    </div>
  );
};

export default MainImage;
