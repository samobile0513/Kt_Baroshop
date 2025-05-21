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
    if (scrollContainerRef.current) scrollContainerRef.current.scrollTop = 0;
  }, [pathname]);

  useEffect(() => {
    const handleResize = () => {
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
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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
    const updateContentHeight = () => {
      let totalHeight = 0;
      if (outletRef.current)
        totalHeight += outletRef.current.getBoundingClientRect().height;
      if (footerRef.current)
        totalHeight += footerRef.current.getBoundingClientRect().height;
      setContentHeight(totalHeight * 0.5); // scale 미적용 원본 높이
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

  // 모바일에서 외부 스크롤 차단
  useEffect(() => {
    if (isMobileNav) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
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
          className="flex-1 flex justify-center items-start overflow-x-hidden bg-white"
          style={{
            height: isMobileNav && contentHeight ? `${contentHeight}px` : "100vh",
            maxHeight: isMobileNav && contentHeight ? `${contentHeight}px` : "none",
            overflowY: isMobileNav ? "auto" : "auto",
            ...scrollbarHideStyle,
            paddingTop: isLoading ? 0 : `${totalPadding + extraPadding}px`,
            overscrollBehavior: isMobileNav ? "contain" : "auto",
          }}
        >
          <div
            ref={contentRef}
            className="flex justify-center w-full"
            style={{
              height: isMobileNav && contentHeight ? `${contentHeight}px` : (isMobile && contentHeight ? `calc(${contentHeight}px * ${scale})` : "auto"),
              minHeight: isMobileNav ? "auto" : "100vh",
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
            scroll-behavior: smooth;
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
          pointerEvents: isMobileNav ? "none" : "auto",
          zIndex: -1,
        }}
        onWheel={(e) => {
          if (!isMobileNav && scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop += e.deltaY;
          }
        }}
      />
    </ScaleContext.Provider>
  );
};

export default Layout;