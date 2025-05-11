import { Outlet, useLocation } from 'react-router-dom';
import Header from "../components/1_header";
import NavMenu from "../components/2_NavMenu";
import Footer from "../components/3_Footer";
import MobileHeader from "../components/1_MobileHeader";
import MobileNavMenu from "../components/2_MobileNavMenu";
import { useEffect, useRef, useState } from 'react';

const Layout = () => {
  const [scale, setScale] = useState(1);
  const [mobileScale, setMobileScale] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileNav, setIsMobileNav] = useState(false);
  const [contentHeight, setContentHeight] = useState(null);
  const { pathname } = useLocation();
  const scrollContainerRef = useRef();
  const contentRef = useRef();
  const outletRef = useRef();
  const footerRef = useRef();

  // 페이지 이동 시 스크롤 리셋
  useEffect(() => {
    if (window.__isModalOpen) {
      console.log("Layout: Scroll reset skipped due to open modal, pathname:", pathname);
      return;
    }

      if (pathname.includes("surveyform")) {
    console.log("Layout: Scroll reset skipped for surveyform path:", pathname);
    return;
  }

    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
      console.log("Layout: Scroll reset executed, pathname:", pathname);
    }
  }, [pathname]);

  // 반응형 스케일 계산
  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      console.log("Layout: Screen width:", screenWidth, "Scale:", scale, "MobileScale:", mobileScale, "isMobileNav:", isMobileNav);

      if (screenWidth <= 819) {
        setIsMobileNav(true);
        setMobileScale(screenWidth / 393);
      } else {
        setIsMobileNav(false);
        setMobileScale(1);
      }

      if (screenWidth <= 1200) {
        setIsMobile(true);
        setScale(screenWidth / 1200);
      } else {
        setIsMobile(false);
        setScale(screenWidth >= 1920 ? screenWidth / 1920 : 1);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 콘텐츠 높이 계산
  useEffect(() => {
    const updateContentHeight = () => {
      let totalHeight = 0;
      if (outletRef.current) {
        totalHeight += outletRef.current.getBoundingClientRect().height;
      }
      if (footerRef.current) {
        totalHeight += footerRef.current.getBoundingClientRect().height;
      }
      console.log("Layout: Total content height:", totalHeight);
      setContentHeight(totalHeight + 100);
    };

    const resizeObserver = new ResizeObserver(updateContentHeight);
    if (outletRef.current) resizeObserver.observe(outletRef.current);
    if (footerRef.current) resizeObserver.observe(footerRef.current);

    setTimeout(updateContentHeight, 50);

    return () => {
      if (outletRef.current) resizeObserver.unobserve(outletRef.current);
      if (footerRef.current) resizeObserver.unobserve(footerRef.current);
    };
  }, [isMobile, scale, pathname]);

  // 부드러운 스크롤 동작 적용
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleWheel = (e) => {
      const atTop = container.scrollTop <= 0;
      const atBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - 1;
      const scrollingUp = e.deltaY < 0;
      const scrollingDown = e.deltaY > 0;

      if ((atTop && scrollingUp) || (atBottom && scrollingDown)) {
        e.preventDefault();
        window.scrollBy({
          top: e.deltaY * 1,
          behavior: 'smooth',
        });
      } else {
        e.preventDefault();
        container.scrollBy({
          top: e.deltaY * 5,
          behavior: 'smooth',
        });
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, []);

  const OutletWrapper = () => (
    <div ref={outletRef}>
      <Outlet />
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      {isMobileNav ? (
        <>
          <MobileHeader
            mobileScale={mobileScale}
            className="fixed top-0 left-0 w-full z-50"
            style={{ width: '100vw' }}
          />
          <MobileNavMenu
            mobileScale={mobileScale}
            className="fixed top-[52px] left-0 w-full z-40"
            style={{ width: '100vw' }}
          />
        </>
      ) : (
        <>
          <Header className="fixed top-0 left-0 w-full z-50" />
          <NavMenu className="fixed top-[80px] left-0 w-full z-40" />
        </>
      )}
      <div
        ref={scrollContainerRef}
        className="flex-1 flex justify-center items-start overflow-x-hidden overflow-y-auto bg-white hide-scrollbar"
        style={{
          height: '100vh',
          minHeight: '100vh',
        }}
      >
        <div
          ref={contentRef}
          className="flex justify-center w-full"
          style={{
            height: isMobile && contentHeight ? `calc(${contentHeight}px * ${scale})` : 'auto',
            minHeight: '100vh',
          }}
        >
          <div
            className="flex flex-col w-full"
            style={{
              width: isMobile ? '100%' : '1920px',  // ✅ 모바일일 때는 강제 고정폭 제거
              transform: `scale(${scale})`,
              transformOrigin: 'top center',
              minHeight: isMobile ? '100%' : 'auto',
            }}
          >
            <div style={{ paddingTop: isMobileNav ? 0 : `calc(0px / ${scale})` }}>
              <OutletWrapper />
            </div>
            <div ref={footerRef}>
              <Footer />
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .hide-scrollbar {
          scrollbar-width: none; /* Firefox */
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none; /* Chrome, Safari */
        }
      `}</style>
    </div>
  );
};

export default Layout;
