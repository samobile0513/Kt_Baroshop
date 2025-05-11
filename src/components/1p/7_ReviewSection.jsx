import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ReviewSection = () => {
  const scrollRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setScale(width <= 1200 ? 1.3 : 1);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const scrollEl = scrollRef.current;
    if (!scrollEl) return;

    const scrollSpeed = 1;
    const interval = setInterval(() => {
      if (scrollEl.scrollLeft >= scrollEl.scrollWidth / 2) {
        scrollEl.scrollLeft = 0;
      } else {
        scrollEl.scrollLeft += scrollSpeed;
      }
    }, 16); // 약 60fps

    return () => clearInterval(interval);
  }, []);

  const images = [61, 62, 63, 64, 65, 66, 67, 68, 69, 610, 611, 612];

  return (
    <div className="w-full flex justify-center" style={{ backgroundColor: '#EBEBEB' }}>
      <div
        className="w-[100%] flex flex-col items-center"
        style={{
          paddingTop: '73px',
          paddingBottom: '100px',
          zoom: scale,
        }}
      >
        {/* 타이틀 */}
        <img src="/B1p/B_text61.svg" alt="타이틀" />
        <div style={{ height: '46px' }} />

        {/* 슬라이드 이미지들 */}
        <div
          ref={scrollRef}
          className="w-full overflow-hidden"
          style={{
            display: 'flex',
            gap: '46px',
            paddingLeft: '46px',
            paddingRight: '46px',
            scrollBehavior: 'auto',
            whiteSpace: 'nowrap',
          }}
        >
          {[...images, ...images, ...images].map(i => (
            <img
              key={`slide-${i}-${Math.random()}`}
              src={`/B1p/b_${i}.svg`}
              alt={`b_${i}`}
              style={{ flex: '0 0 auto' }}
            />
          ))}
        </div>

        {/* 하단 여백 */}
        <div style={{ height: '105px' }} />

        {/* 하단 배너 버튼 */}
        <img
          src="/B1p/b_6_button.svg"
          alt="하단 배너"
          onClick={() => navigate('/2_Surveyform')}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className={`cursor-pointer rounded-[8px] transition-all duration-300 ease-in-out ${
            hovered ? 'scale-[1.05] brightness-105 shadow-xl' : 'animate-breathe'
          }`}
        />
      </div>
    </div>
  );
};

export default ReviewSection;
