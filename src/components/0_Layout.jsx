import { Outlet, useLocation } from "react-router-dom";
import { createContext, useEffect, useRef, useState } from "react";
import Header from "../components/1_header";
import NavMenu from "../components/2_NavMenu";
import Footer from "../components/3_Footer";
import MobileHeader from "../components/1_MobileHeader";
import MobileNavMenu from "../components/2_MobileNavMenu";
import StopBanner from "../components/4_StopBanner";
import StopBanner2 from "../components/5_StopBanner2";

export const ScaleContext = createContext();

// 네비게이션과 헤더를 별도로 관리하는 컴포넌트
const Navigation = ({ isMobileNav, mobileScale, scrollContainerRef }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        setIsScrolled(scrollContainerRef.current.scrollTop > 0);
      }
    };
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [scrollContainerRef]);

  return (
    <div className="fixed top-0 left-0 w-full" style={{ zIndex: 50 }}>
      {isMobileNav ? (
        <>
          {!isScrolled && (
            <MobileHeader
              mobileScale={mobileScale}
              className="header-container"
              style={{ width: "100vw" }}
            />
          )}
          <MobileNavMenu
            mobileScale={mobileScale}
            style={{
              width: "100vw",
              position: "fixed",
              top: isScrolled ? "0" : "52px",
            }}
          />
        </>
      ) : (
        <>
          {!isScrolled && <Header className="header-container" />}
          <NavMenu
            style={{
              position: "fixed",
              top: isScrolled ? "0" : "62px",
            }}
          />
        </>
      )}
    </div>
  );
};

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

  useEffect(() => {
    if (window.__isModalOpen) return;
    if (pathname.includes("surveyform")) return;
    if (scrollContainerRef.current) scrollContainerRef.current.scrollTop = 0;
  }, [pathname]);

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
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
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const updateContentHeight = () => {
      if (!scrollContainerRef.current) return;
      // 외부 스크롤 컨테이너의 실제 스크롤 가능 높이(scrollHeight) 가져오기
      const scrollHeight = scrollContainerRef.current.scrollHeight;
      // 스케일링 전 높이로 변환 (scrollHeight / scale)
      const adjustedHeight = scrollHeight / scale;
      setContentHeight(adjustedHeight);
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

  const OutletWrapper = () => (
    <div ref={outletRef}>
      <Outlet />
      <div ref={footerRef}>
        <Footer />
      </div>
    </div>
  );

  const scrollbarHideStyle = {
    msOverflowStyle: "none",
    scrollbarWidth: "none",
  };

  return (
    <ScaleContext.Provider value={scale}>
      <div className="min-h-screen flex flex-col overflow-hidden">
        <Navigation
          isMobileNav={isMobileNav}
          mobileScale={mobileScale}
          scrollContainerRef={scrollContainerRef}
        />

        <div
          ref={scrollContainerRef}
          className="flex-1 flex justify-center items-start overflow-x-hidden overflow-y-auto bg-white"
          style={{
            minHeight: "100vh",
            height: "100vh",
            ...scrollbarHideStyle,
            paddingTop: isMobileNav ? "104px" : "112px",
          }}
        >
          <div
            ref={contentRef}
            className="flex justify-center w-full"
            style={{
              height:
                isMobile && contentHeight
                  ? `calc(${contentHeight}px * ${scale})`
                  : "auto",
              minHeight: "100vh",
            }}
          >
            <div
              className="flex flex-col w-full"
              style={{
                width: "1920px",
                transform: `scale(${scale})`,
                transformOrigin: "top center",
                minHeight: isMobile ? "100%" : "auto",
              }}
            >
              <div>
                <OutletWrapper />
              </div>
            </div>
          </div>
        </div>

        <StopBanner style={{ zIndex: 60 }} />
        <StopBanner2 style={{ zIndex: 60 }} />

        <style jsx>{`
          div {
            scroll-behavior: auto;
          }
          div::-webkit-scrollbar {
            display: none;
          }
          .header-container {
            transition: height 0.3s ease, opacity 0.3s ease;
          }
        `}</style>
      </div>

      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: -1,
        }}
        onWheel={(e) => {
          if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop += e.deltaY;
          }
        }}
      />
    </ScaleContext.Provider>
  );
};

export default Layout;