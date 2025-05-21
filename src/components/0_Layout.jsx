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
  const [isLoading, setIsLoading] = useState(window.innerWidth <= 1200); // 초기 로딩 상태 관련
  const [contentHeight, setContentHeight] = useState(null); // ✅ 콘텐츠의 최종 시각적 높이 (스케일링 반영 후)
  const { pathname } = useLocation();
  const scrollContainerRef = useRef();
  const contentRef = useRef(); // 이 ref의 style.height를 조정합니다.
  const outletRef = useRef(); // OutletWrapper의 ref
  const footerRef = useRef(); // Footer를 감싸는 div의 ref

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
      let visualHeight = 0;
      // outletRef와 footerRef는 이미 scale 변환이 적용된 부모 내부에 있으므로,
      // getBoundingClientRect().height는 스케일링이 적용된 '시각적' 높이입니다.
      if (outletRef.current) {
        visualHeight += outletRef.current.getBoundingClientRect().height;
      }
      if (footerRef.current) {
        visualHeight += footerRef.current.getBoundingClientRect().height;
      }
      // contentHeight 상태에는 이 최종 시각적 높이에 추가 여백(100px)을 더한 값을 저장합니다.
      // 이 100px은 기존 로직을 유지한 것입니다.
      setContentHeight(visualHeight + 100);
    };

    // ResizeObserver는 outlet 또는 footer의 크기가 변경될 때마다 contentHeight를 업데이트합니다.
    const resizeObserver = new ResizeObserver(updateContentHeight);
    if (outletRef.current) {
      resizeObserver.observe(outletRef.current);
    }
    if (footerRef.current) {
      resizeObserver.observe(footerRef.current);
    }

    // 최초 마운트 시 또는 scale, pathname 등이 변경될 때 높이를 계산합니다.
    // setTimeout은 DOM이 완전히 그려진 후 높이를 읽기 위함일 수 있으나,
    // 경우에 따라서는 불필요하거나 다른 방식으로 대체 가능합니다 (예: requestAnimationFrame).
    // 기존 로직 유지를 위해 setTimeout은 그대로 두었습니다.
    const timeoutId = setTimeout(updateContentHeight, 50);

    return () => {
      clearTimeout(timeoutId);
      if (outletRef.current) {
        resizeObserver.unobserve(outletRef.current);
      }
      if (footerRef.current) {
        resizeObserver.unobserve(footerRef.current);
      }
    };
  }, [isMobile, scale, pathname]); // 의존성 배열: isMobile, scale, pathname 변경 시 높이 재계산

  // Outlet과 Footer를 함께 묶어 ref를 달기 위한 Wrapper 컴포넌트
  const OutletWrapper = () => (
    <>
      <div ref={outletRef}> {/* 이 div의 높이를 측정 */}
        <Outlet />
      </div>
      <div ref={footerRef}> {/* 이 div의 높이를 측정 */}
        <Footer />
      </div>
    </>
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
            // overflowY: "auto", // className에 이미 포함되어 있음
          }}
        >
          <div
            ref={contentRef}
            className="flex justify-center w-full"
            style={{
              // ✅ 수정된 부분: contentHeight가 이미 최종 시각적 높이를 나타내므로, 추가로 scale을 곱하지 않습니다.
              height:
                isMobile && contentHeight !== null
                  ? `${contentHeight}px`
                  : "auto",
              // minHeight: "100vh", // 이 스타일은 scrollContainerRef가 100vh이므로, contentRef의 높이 설정과 충돌하거나 불필요할 수 있습니다. 필요시 재검토.
            }}
          >
            <div
              className="flex flex-col w-full" // 이 div가 실제로 스케일링되는 대상
              style={{
                width: "1920px", // 기준 너비
                transform: `scale(${scale})`,
                transformOrigin: "top center",
                minHeight: isMobile ? "100%" : "auto", // contentRef 높이에 맞춰지도록
              }}
            >
              {/* OutletWrapper를 사용하여 Outlet과 Footer가 함께 div로 묶여 높이가 측정되도록 함 */}
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
            scroll-behavior: auto; /* 기존 코드 유지 */
          }
          div::-webkit-scrollbar {
            display: none;
          }
          .header-container {
            transition: height 0.3s ease, opacity 0.3s ease;
          }
        `}</style>
      </div>

      {/* 이 div는 전체 화면 휠 이벤트를 scrollContainerRef로 전달하려는 의도로 보임. */}
      {/* pointerEvents: "none"과 zIndex: -1로 인해 실제 휠 이벤트 가로채기 동작 여부는 브라우저/상황에 따라 다를 수 있음. */}
      {/* 모바일 터치 스크롤에는 영향을 주지 않을 가능성이 높음. */}
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