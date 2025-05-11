import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TotalAdmin from "./pages/TotalAdmin";

import Layout from "./components/0_Layout";
import HomePage from './pages/HomePage';
import SecondPage from './pages/2Page';
import ThirdPage from './pages/3Page';
import FourPage from './pages/4Page';

import Special1 from "./components/5p/1_Special";
import Special2 from "./components/5p/2_Special";
import Special3 from "./components/5p/3_Special";
import Special4 from "./components/5p/4_Special";
import Special5 from "./components/5p/5_Special";

import ScrollToTop from "./components/other/ScrollToTop";
import Survey from "./components/6p/2_PhoneSurveyform";
import Survey2 from "./components/6p/3_InternetSurveyform";
import Survey3 from "./components/6p/2_PhoneSurveyformmobile";
import Survey4 from "./components/6p/3_InternetSurveyformmobile";
import End from "./components/6p/4.End";


import Info4 from "./components/other/info4";
import Info1 from "./components/other/info1";
import Info2 from "./components/other/info2";
import Info3 from "./components/other/info3";

import Callcenter from "./components/6p/1_Callcenter";
import Center1 from "./components/5p/1_Center";
import Center2 from "./components/5p/2_Center";
import Center3 from "./components/5p/3_Center";
import Center4 from "./components/5p/4_Center";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/2page" element={<SecondPage />} />
          <Route path="/3page" element={<ThirdPage />} />
          <Route path="/4page" element={<FourPage />} />
          <Route path="/1_Special" element={<Special1 />} />
          <Route path="/2_Special" element={<Special2 />} />
          <Route path="/3_Special" element={<Special3 />} />
          <Route path="/4_Special" element={<Special4 />} />
          <Route path="/5_Special" element={<Special5 />} />
          <Route path="/info1" element={<Info1 />} />
          <Route path="/info2" element={<Info2 />} />
          <Route path="/info4" element={<Info4 />} />
          <Route path="/info3" element={<Info3 />} />
          <Route path="/2_Surveyform" element={<Survey />} />
          <Route path="/3_Surveyform2" element={<Survey2 />} />
          <Route path="/2_Surveyform2" element={<Survey3 />} />
          <Route path="/3_Surveyform3" element={<Survey4 />} />
          <Route path="/4_End" element={<End />} />
          <Route path="/callcenter" element={<Callcenter />} />
          <Route path="/center1" element={<Center1 />} />
          <Route path="/center2" element={<Center2 />} />
          <Route path="/center3" element={<Center3 />} />
          <Route path="/center4" element={<Center4 />} />
          <Route path="/admin" element={<TotalAdmin />} />
        </Route>
      </Routes>
    </Router>
  </React.StrictMode>
);