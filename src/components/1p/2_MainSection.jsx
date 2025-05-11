import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const phoneImages = [
  '/B1p/b_11.svg',
  '/B1p/b_12.svg',
  '/B1p/b_13.svg',
  '/B1p/b_14.svg',
];

const PopularModels = () => {
  const [scale, setScale] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 1200);
      setScale(width <= 1200 ? 1.8 : 1);
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleClick = () => {
    navigate('/2_Surveyform');
  };

  return (
    <div className="w-full flex justify-center">
      <div
        style={{
          width: '820px',
          zoom: scale,
        }}
      >
        <div className="flex flex-col items-center pt-[100px]">
          {/* 위 텍스트 장식 */}
          <div className="w-full relative mb-[40px]">
            <img
              src="/B1p/B_text11.svg"
              className={`absolute ${
                isMobile ? 'left-[150px] top-[-60px]' : 'left-[-150px] top-[-50px]'
              }`}
              alt="left-text"
              style={{
                width: 'auto',
                height: 'auto',
                transform: 'none',
                position: 'absolute',
                zIndex: 10,
                scale: '1.15',
              }}
            />
            <img
              src="/B1p/B_text12.svg"
              className={`absolute ${
                isMobile ? 'right-[120px] bottom-[-25px]' : 'right-[-190px] bottom-[-20px]'
              } transition-all duration-300 cursor-pointer hover:brightness-125`}
              alt="right-text"
              style={{
                width: 'auto',
                height: 'auto',
                transform: 'none',
                position: 'absolute',
                zIndex: 10,
                scale: '1',
                filter: 'none',
                boxShadow: '0 0 0 rgba(253, 57, 65, 0)', // #FD3941
                animation: 'sparkle 1.5s infinite',
              }}
              onClick={handleClick}
            />
          </div>

          {/* 휴대폰 이미지 */}
          {isMobile ? (
            <div className="grid grid-cols-2 gap-x-[20px] gap-y-[30px]">
              {phoneImages.map((src, i) => (
                <img key={i} src={src} alt={`phone-${i}`} />
              ))}
            </div>
          ) : (
            <div className="flex gap-[17px] justify-center">
              {phoneImages.map((src, i) => (
                <img key={i} src={src} alt={`phone-${i}`} />
              ))}
            </div>
          )}

          {/* 하단 여백 */}
          <div className="mt-[50px]" />
        </div>
      </div>
      <style jsx>{`
        @keyframes sparkle {
          0%, 100% {
            filter: brightness(100%);
            box-shadow: 0 0 0 rgba(253, 57, 65, 0);
          }
          50% {
            filter: brightness(125%);
            box-shadow: 0 0 10px rgba(253, 57, 65, 0.7);
          }
        }
      `}</style>
    </div>
  );
};

export default PopularModels;