import React from "react";
import Layout from "../components/0_Layout";
import MainImage from "../components/3p/1_MainImage";
import ServiceSection from "../components/3p/2_ServiceSection";
import ImageSection from "../components/3p/3_ImageSection";
import Shopsection from "../components/3p/4_ShopSection.jsx"; // ⭐ 추가3_AboutSection
import AboutSection from "../components/1p/3_AboutSection.jsx";
import Todayevent3 from "../components/3p/5_Todayevent3.jsx";

const SecondPage = () => {
  return (
    <>
      <MainImage />
      <ServiceSection />
      <ImageSection />
      <Shopsection /> {/* 여기 추가 */}
      <AboutSection />
      <Todayevent3 />
    </>
  );
};

export default SecondPage;
