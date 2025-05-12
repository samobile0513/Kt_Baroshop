import React from "react";
import MainImage from "../components/1p/1_MainImage";
import MainSection from "../components/1p/2_MainSection";
import AboutSection from "../components/1p/3_AboutSection";
import BuySection from "../components/1p/4_BuySection";
import ProofSection from "../components/1p/5_ProofSection";
import ProductSection from "../components/1p/6_ProductSection";
import ReviewSection from "../components/1p/7_ReviewSection";
import Todayevent from "../components/1p/8_Todayevent";

const HomePage = ({ isMobile, scale }) => {
  if (isMobile) {
    return <HomePageMobile scale={scale} />;
  }

  return (
    <div className="flex flex-col" style={{ width: "1920px" }}>
      <MainImage />
      <MainSection />
      <AboutSection />
      <BuySection />
      <ProofSection />
      <ProductSection />
      <ReviewSection />
      <Todayevent />
    </div>
  );
};

export default HomePage;
