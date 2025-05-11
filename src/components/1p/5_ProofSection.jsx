import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';


const phoneImages = [
  '/B1p/b_41.svg',
  '/B1p/b_42.svg',
  '/B1p/b_43.svg',
  '/B1p/b_44.svg',
];

const additionalPhoneImages = [
  '/B1p/b_45.svg',
  '/B1p/b_46.svg',
  '/B1p/b_47.svg',
  '/B1p/b_48.svg',
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
              src="/B1p/B_text41.svg"
              className={`absolute ${
                isMobile ? 'left-[155px] top-[-60px]' : 'left-[-150px] top-[-50px]'
              }`}
              alt="left-text"
              style={{
                width: 'auto',
                height: 'auto',
                transform: 'none',
                position: 'absolute',
                zIndex: 10,
                scale: '1.17',
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
                boxShadow: '0 0 0 rgba(253, 57, 65, 0)',
                animation: 'sparkle 1.5s infinite',
              }}
              onClick={handleClick}

            />
          </div>

          {/* 기존 휴대폰 이미지 */}
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
          <div className="mt-[20px]" />

          {/* 추가 휴대폰 이미지 */}
          {isMobile ? (
            <div className="grid grid-cols-2 gap-x-[20px] gap-y-[30px]">
              {additionalPhoneImages.map((src, i) => (
                <img key={i + 15} src={src} alt={`phone-${i + 15}`} />
              ))}
            </div>
          ) : (
            <div className="flex gap-[17px] justify-center">
              {additionalPhoneImages.map((src, i) => (
                <img key={i + 15} src={src} alt={`phone-${i + 15}`} />
              ))}
            </div>
          )}

          {/* 하단 여백 */}
          <div className="mt-[0px]" />
        </div>
      </div>
    </div>
  );
};

export default PopularModels;