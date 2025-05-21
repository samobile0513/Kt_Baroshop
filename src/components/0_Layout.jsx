import { Outlet, useLocation } from "react-router-dom";
import { createContext, useEffect, useRef, useState } from "react";
import Header from "../components/1_header";
import NavMenu from "../components/2_NavMenu";
import Footer from "../components/3_Footer";
import MobileHeader from "../components/1_MobileHeader";
import MobileNavMenu from "../components/2_MobileNavMenu";
import StopBanner from "../components/4_StopBanner";
import StopBanner2 from "../components/5_StopBanner2";
import Loading from "./other/Loading";

export const ScaleContext = createContext();

const Navigation = ({ isMobileNav, mobileScale, scrollContainerRef }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  const navHeight = isMobileNav ? 65 : 52;
  const headerHeight = isMobileNav ? 52 : 62;

  useEffect(() => {
    let timeoutId = null;
    
    const handleScroll = () => {
      if (timeoutId) {
        return;
      }
      
      timeoutId = setTimeout(() => {
        const scrollTop = 
          scrollContainerRef.current?.scrollTop ?? window.scrollY;
        setIsScrolled(scrollTop > 0);
        timeoutId = null;
      }, 16);
    };

    const scrollElement = isMobileNav && scrollContainerRef.current 
      ? scrollContainerRef.current 
      : window;
    
    scrollElement.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      scrollElement.removeEventListener("scroll", handleScroll);
    };
  }, [scrollContainerRef, isMobileNav]);

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
              top: isScrolled ? "0" : `${headerHeight}px`,
              height: `${navHeight}px`,
            }}
            isScrolled={isScrolled}
          />
        </>
      ) : (
        <>
          {!isScrolled && (
            <Header
              className="header-container"
              style={{
                transition: "opacity 0.3s ease",
                opacity: isScrolled ? 0 : 1,
              }}
            />
          )}
          <NavMenu
            isScrolled={isScrolled}
            style={{
              position: "fixed",
              top: isScrolled ? "0" : `${headerHeight}px`,
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
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1200);
  const [isMobileNav, setIsMobileNav] = useState(window.innerWidth <= 819);
  const [isLoading, setIsLoading] = useState(window.innerWidth <= 1200);
  const [contentHeight, setContentHeight] = useState(null);
  const { pathname } = useLocation();
  const scrollContainerRef = useRef();
  const contentRef = useRef();
  const outletRef = useRef();
  const footerRef = useRef();

  const navHeight = isMobileNav ? 65 : 50;
  const headerHeight = isMobileNav ? 52 : 62;
  const totalPadding = isMobileNav ? headerHeight + navHeight + 11 : 108;
  const extraPadding =
    !isMobileNav && window.innerWidth > 819 && window.innerWidth <= 1920 ? 20 : 0;

  useEffect(() => {
    if (window.__isModalOpen) return;
    if (pathname.includes("surveyform")) return;
    
    if (scrollContainerRef.current) {
      requestAnimationFrame(() => {
        scrollContainerRef.current.scrollTop = 0;
      });
    }
  }, [pathname]);

  useEffect(() => {
    let resizeTimeout = null;
    
    const handleResize = () => {
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }
      
      resizeTimeout = setTimeout(() => {
        const screenWidth = Math.min(window.innerWidth, window.outerWidth || window.innerWidth);
        const isMobileUA = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        console.log('Screen width:', screenWidth, 'Is mobile UA:', isMobileUA);

        if (screenWidth <= 819 || isMobileUA) {
          setIsMobileNav(true);
          setMobileScale(screenWidth / 393);
        } else {
          setIsMobileNav(false);
          setMobileScale(1);
        }
        if (screenWidth <= 1200 || isMobileUA) {
          setIsMobile(true);
          setScale(screenWidth / 1200);
        } else {
          setIsMobile(false);
          setScale(screenWidth >= 1920 ? screenWidth / 1920 : 1);
        }
      }, 100);
    };
    
    window.addEventListener("resize", handleResize);
    handleResize();
    
    return () => {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const hasLoadedBefore = localStorage.getItem("hasLoadedBefore");
    if (isMobile && !hasLoadedBefore) {
      setIsLoading(true);
      localStorage.setItem("hasLoadedBefore", "true");
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      setIsLoading(false);
    }
  }, [isMobile]);

  useEffect(() => {
    // 페이지별 contentHeight 보정값 설정
    const pageAdjustments = {
      "/": 0.225,      // HomePage
      "/2page": 0.236, // 2page
      "/3page": 0.242, // 3page
      "/4page": 0.265, // 4page
    };

    const updateContentHeight = () => {
      requestAnimationFrame(() => {
        if (!outletRef.current) return;
        
        let totalHeight = 0;
        totalHeight += outletRef.current.getBoundingClientRect().height;
        
        if (footerRef.current) {
          totalHeight += footerRef.current.getBoundingClientRect().height;
        }
        
        const screenWidth = window.innerWidth;
        let extraSpace = 50;
        
        if (screenWidth > 2560) {
          extraSpace = 10;
        } else if (screenWidth > 1920) {
          extraSpace = 20;
        }
        
        if (totalHeight < window.innerHeight) {
          setContentHeight("100vh");
        } else {
          // 페이지별 보정값 적용
          const adjustment = pageAdjustments[pathname] || 1; // 기본값 1 (기타 페이지)
          if (adjustment !== 1) {
            totalHeight *= adjustment;
          } else {
            totalHeight *= 0.005 // 기타 페이지의 원본 로직
          }
          setContentHeight(totalHeight + extraSpace);
        }
      });
    };

    const resizeObserver = new ResizeObserver(() => {
      if (window.updateHeightTimeout) {
        clearTimeout(window.updateHeightTimeout);
      }
      window.updateHeightTimeout = setTimeout(updateContentHeight, 100);
    });
    
    if (outletRef.current) resizeObserver.observe(outletRef.current);
    if (footerRef.current) resizeObserver.observe(footerRef.current);
    
    setTimeout(updateContentHeight, 100);
    window.addEventListener('load', updateContentHeight);
    
    return () => {
      if (window.updateHeightTimeout) clearTimeout(window.updateHeightTimeout);
      window.removeEventListener('load', updateContentHeight);
      resizeObserver.disconnect();
    };
  }, [isMobile, scale, pathname]);

  // 모바일에서 모든 페이지 스크롤 차단
  useEffect(() => {
    if (isMobileNav) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [isMobileNav]);

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
        {!isLoading && (
          <Navigation
            isMobileNav={isMobileNav}
            mobileScale={mobileScale}
            scrollContainerRef={scrollContainerRef}
          />
        )}

        <div
          ref={scrollContainerRef}
          className="flex-1 flex justify-center items-start overflow-x-hidden overflow-y-auto bg-white"
          style={{
            minHeight: "100vh",
            height: "100vh",
            ...scrollbarHideStyle,
            paddingTop: isLoading ? 0 : `${totalPadding + extraPadding}px`,
            overflowY: "auto",
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
              <div>{isMobile && isLoading ? <Loading /> : <OutletWrapper />}</div>
            </div>
          </div>
        </div>

        {!isLoading && (
          <>
            <StopBanner style={{ zIndex: 60 }} />
            <StopBanner2 style={{ zIndex: 60 }} />
          </>
        )}

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