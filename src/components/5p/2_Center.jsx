import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom'; // Link 임포트


const CharacterSection = () => {
  const [scale, setScale] = useState(1);
  const contentRef = useRef(null);
  const [adjustedHeight, setAdjustedHeight] = useState('auto');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setScale(width <= 1200 ? 1.4 : 1);
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (contentRef.current) {
      const baseHeight = contentRef.current.offsetHeight;
      const paddedHeight = baseHeight + 0;
      setAdjustedHeight(paddedHeight * scale);
      setLoaded(true);
    }
  }, [scale]);

  return (
    <div className="w-full flex justify-center overflow-x-visible pt-[30px]" style={{ minHeight: adjustedHeight }}>
      <div
        ref={contentRef}
        className="w-[820px] flex flex-col items-center"
        style={{
          zoom: scale,
          transformOrigin: 'top center',
        }}
      >
          <img src="/B5p/c2.svg" alt="5_1" />
          <div className="mt-[50px]" />
          <Link to="/2_Surveyform">
                    <img src="/B1p/b_74.svg" alt="5_2" className="cursor-pointer" />
                  </Link>
          <div className="mt-[100px]" />
        </div>
    </div>
  );
};

export default CharacterSection;