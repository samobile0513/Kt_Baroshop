import React from 'react';
import { useNavigate } from 'react-router-dom';

const RelatedEmploymentSection = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/3_Surveyform2');
  };

  return (
    <div className="w-full flex flex-col items-center pt-[200px]">
      <img
        src="/B2p/b_2title.svg"
        alt="2_21"
        onClick={handleClick}
        className="cursor-pointer"
      />

      <div className="mt-[150px]" />

      <img
        src="/B2p/b_21.svg"
        alt="2_22"
        onClick={handleClick}
        className="cursor-pointer"
      />
      <div className="mt-[60px]" />

      <img
        src="/B2p/b_22.svg"
        alt="2_23"
        onClick={handleClick}
        className="cursor-pointer"
      />
      <div className="mt-[60px]" />

      <img
        src="/B2p/b_23.svg"
        alt="2_24"
        onClick={handleClick}
        className="cursor-pointer"
      />
      
      <div className="mt-[100px]" />
    </div>
  );
};

export default RelatedEmploymentSection;
