import React from "react";
import { useNavigate } from "react-router-dom";

const RelatedEmploymentSection = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/3_Surveyform2");
  };

  return (
    <div className="w-full flex justify-center bg-white overflow-hidden">
      <div className="w-full flex flex-col items-center pt-[0px]">
        {/* b_31: 좌우 잘리며 반응형 */}
        <div className="w-full overflow-hidden">
          <img
            src="/B2p/b_31.svg"
            alt="3_1"
            className="min-w-[1920px] h-[500px] object-cover"
          />
        </div>

        <div className="mt-[43px]" />

        {/* b_32: 원본 사이즈 + hover + 클릭 */}
        <img
          src="/B2p/b_32.svg"
          alt="3_2"
          onClick={handleClick}
          className="cursor-pointer w-auto h-auto animate-breathe transition-all duration-300 ease-in-out hover:scale-[1.05] hover:brightness-105 hover:shadow-xl"
        />

        <div className="mt-[100px]" />
      </div>
    </div>
  );
};

export default RelatedEmploymentSection;
