import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MainImage = () => {
  const [containerHeight, setContainerHeight] = useState('600px'); // 기본 높이
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width <= 1200) {
        setContainerHeight('700px');
      } else {
        setContainerHeight('600px');
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      className="relative w-full overflow-hidden flex justify-center items-center pt-[100px]"
      style={{ height: containerHeight }}
    >
      <img 
        src="/B3p/b3_3.svg" 
        alt="2페이지 메인 이미지" 
        onClick={() => navigate('/2_Surveyform')}
        className="min-w-[1920px] h-full object-cover cursor-pointer"
      />
    </div>
  );
};

export default MainImage;
