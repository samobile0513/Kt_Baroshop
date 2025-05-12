import React, { useState, useEffect, useRef } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import MobilePhoneSurvey from "./2_PhoneSurveyformmobile";
import { useNavigate } from "react-router-dom";
import ReactDOM from "react-dom";

const PhoneSurvey = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    birth: "",
    phone: "",
    device: "",
    joinType: "",
    paymentPeriod: "",
    discountType: "",
    additional: "",
  });

  const [agreements, setAgreements] = useState({
    terms: false,
    privacy: false,
    marketing: false,
    thirdParty: false,
    all: false,
  });

  const [error, setError] = useState("");
  const [scale, setScale] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const contentRef = useRef(null);
  const [adjustedHeight, setAdjustedHeight] = useState("auto");
  const [loaded, setLoaded] = useState(false);
  const [isPopupOpenInfo1, setIsPopupOpenInfo1] = useState(false); // info1 팝업 상태
  const [isPopupOpenInfo2, setIsPopupOpenInfo2] = useState(false); // info2 팝업 상태
  const [isPopupOpenInfo3, setIsPopupOpenInfo3] = useState(false); // info3 팝업 상태
  const [isPopupOpenInfo4, setIsPopupOpenInfo4] = useState(false); // info4 팝업 상태
  const [info1Text, setInfo1Text] = useState("");
  const [info2Text, setInfo2Text] = useState("");
  const [info3Text, setInfo3Text] = useState("");
  const [info4Text, setInfo4Text] = useState("");

  useEffect(() => {
    if (isPopupOpenInfo1) {
      fetch("/info1.txt")
        .then((res) => res.text())
        .then((text) => setInfo1Text(text))
        .catch((err) => {
          console.error("텍스트 로드 실패:", err);
          setInfo1Text("약관을 불러오지 못했습니다.");
        });
    }
  }, [isPopupOpenInfo1]);

  useEffect(() => {
    if (isPopupOpenInfo2) {
      fetch("/info2.txt")
        .then((res) => res.text())
        .then((text) => setInfo2Text(text))
        .catch((err) => {
          console.error("info2 텍스트 로드 실패:", err);
          setInfo2Text("약관을 불러오지 못했습니다.");
        });
    }
  }, [isPopupOpenInfo2]);

  useEffect(() => {
    if (isPopupOpenInfo3) {
      fetch("/info3.txt")
        .then((res) => res.text())
        .then((text) => setInfo3Text(text))
        .catch((err) => {
          console.error("info3 텍스트 로드 실패:", err);
          setInfo3Text("약관을 불러오지 못했습니다.");
        });
    }
  }, [isPopupOpenInfo3]);

  useEffect(() => {
    if (isPopupOpenInfo4) {
      fetch("/info0.txt")
        .then((res) => res.text())
        .then((text) => setInfo4Text(text))
        .catch((err) => {
          console.error("info4 텍스트 로드 실패:", err);
          setInfo4Text("약관을 불러오지 못했습니다.");
        });
    }
  }, [isPopupOpenInfo4]);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 819);
      setScale(width <= 1200 ? 1.4 : 1);
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (contentRef.current) {
      const baseHeight = contentRef.current.offsetHeight;
      const paddedHeight = baseHeight + 0;
      setAdjustedHeight(paddedHeight * scale);
      setLoaded(true);
    }
  }, [scale]);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelect = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const isActive = (field, value) => form[field] === value;

  const openModalAt = (modalId) => {
    window.__isModalOpen = true;
    document.body.style.overflow = "hidden";
  };

  const handleAgreement = (e) => {
    const { name, checked } = e.target;
    if (name === "all") {
      setAgreements({
        terms: checked,
        privacy: checked,
        marketing: checked,
        thirdParty: checked,
        all: checked,
      });
    } else {
      setAgreements((prev) => {
        const updated = { ...prev, [name]: checked };
        updated.all =
          updated.terms &&
          updated.privacy &&
          updated.marketing &&
          updated.thirdParty;
        return updated;
      });
    }
  };

  const handleSubmit = async () => {
    if (!agreements.terms || !agreements.privacy) {
      setError("약관에 동의해 주세요.");
      return;
    }
    setError("");

    try {
      await addDoc(collection(db, "submissions"), {
        ...form,
        agreements,
        type: "phone",
        timestamp: new Date().toISOString(),
      });
      alert("제출 완료되었습니다!");
      setForm({
        name: "",
        birth: "",
        phone: "",
        device: "",
        joinType: "",
        paymentPeriod: "",
        discountType: "",
        additional: "",
      });
      setAgreements({
        terms: false,
        privacy: false,
        marketing: false,
        thirdParty: false,
        all: false,
      });
      navigate("/4_End");
    } catch (err) {
      console.error("제출 실패:", err);
      alert("제출 중 오류가 발생했습니다.");
    }
  };

  const boxStyle = (active) =>
    `border px-4 py-3 rounded-md font-[font-4] text-[16px] text-center ${
      active
        ? "border-[#FD3941] font-bold text-[#FD3941]"
        : "border-black text-black"
    }`;

  if (isMobile) {
    return (
      <MobilePhoneSurvey
        form={form}
        agreements={agreements}
        handleInput={handleInput}
        handleSelect={handleSelect}
        handleAgreement={handleAgreement}
        handleSubmit={handleSubmit}
        openModalAt={openModalAt}
        error={error}
      />
    );
  }

  return (
    <>
      <div
        className="w-full flex justify-center overflow-x-visible py-20 px-6"
        style={{ minHeight: adjustedHeight }}
      >
        <div
          ref={contentRef}
          className="w-[820px] flex flex-col items-center"
          style={{
            zoom: scale,
            transformOrigin: "top center",
          }}
        >
          <div className="w-full text-center">
            <h2 className="text-[20px] font-[font-8] text-[#01A69F] mb-2">
              KT휴대폰은 바로 바로샵
            </h2>
            <h1 className="text-[33px] font-[font-5] font-bold mb-6">
              전국 최저가 요금 확인하기
            </h1>
            <p className="text-[19px] font-[font-4] mb-6">
              원하시는 휴대폰 상품을 선택해 주세요.
            </p>
          </div>

          <div className="w-full">
            <h3 className="text-[20px] font-[font-7] mb-6">가입자 정보</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex flex-col">
                <label className="font-[font-4] text-[15px] mb-1">이름</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleInput}
                  placeholder="이름"
                  className="border p-3 font-[font-4]"
                />
              </div>
              <div className="flex flex-col">
                <label className="font-[font-4] text-[15px] mb-1">
                  생년월일
                </label>
                <input
                  name="birth"
                  value={form.birth}
                  onChange={handleInput}
                  placeholder="생년월일 6자리를 입력해 주세요."
                  className="border p-3 font-[font-4]"
                />
              </div>
            </div>
            <div className="flex flex-col mb-4">
              <label className="font-[font-4] text-[15px] mb-1">
                휴대폰 번호
              </label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleInput}
                placeholder="010-0000-0000"
                className="w-full border p-3 font-[font-4]"
              />
            </div>
            <div className="flex flex-col mb-9">
              <label className="font-[font-4] text-[15px] mb-1">
                신청 희망 단말기
              </label>
              <input
                name="device"
                value={form.device}
                onChange={handleInput}
                placeholder="예) S25"
                className="w-full border p-3 font-[font-4]"
              />
            </div>

            <h3 className="text-[20px] font-[font-7] mb-6">상담 기본정보</h3>
            <p className="font-[font-4] mb-2">가입유형을 선택해 주세요.</p>
            <div className="grid grid-cols-3 gap-2 mb-8">
              {["신규가입", "번호이동", "기기변경"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleSelect("joinType", type)}
                  className={boxStyle(isActive("joinType", type))}
                >
                  {type}
                </button>
              ))}
            </div>

            <p className="font-[font-4] mb-2">
              단말기 결제방식을 선택해 주세요.
            </p>
            <div className="grid grid-cols-5 gap-2 mb-8 w-full">
              {["일시불", "24개월", "30개월", "36개월", "48개월"].map(
                (period) => (
                  <button
                    key={period}
                    type="button"
                    onClick={() => handleSelect("paymentPeriod", period)}
                    className={boxStyle(isActive("paymentPeriod", period))}
                  >
                    {period}
                  </button>
                )
              )}
            </div>

            <div className="flex flex-col gap-2 mb-6">
              <button
                type="button"
                onClick={() => handleSelect("discountType", "단말할인")}
                className={`w-full border p-4 font-[font-4] rounded-md flex justify-between items-center ${
                  form.discountType === "단말할인"
                    ? "border-[#FD3941]"
                    : "border-black"
                }`}
              >
                <span
                  className={`text-[22px] font-bold ${
                    form.discountType === "단말할인"
                      ? "text-[#FD3941]"
                      : "text-black"
                  }`}
                >
                  단말할인
                </span>
                <span className="text-[18px] text-black font-[font-4] whitespace-nowrap">
                  공시지원금(기기값 즉시할인)
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleSelect("discountType", "요금할인")}
                className={`w-full border p-4 font-[font-4] rounded-md flex justify-between items-center ${
                  form.discountType === "요금할인"
                    ? "border-[#FD3941]"
                    : "border-black"
                }`}
              >
                <span
                  className={`text-[22px] font-bold flex items-center ${
                    form.discountType === "요금할인"
                      ? "text-[#FD3941]"
                      : "text-black"
                  }`}
                >
                  요금할인
                  <span className="ml-1 bg-[#FD3941] text-white px-2 py-[2px] rounded-full text-[12px] font-[font-4]">
                    추천
                  </span>
                </span>
                <span className="text-[18px] text-black font-[font-4] whitespace-nowrap">
                  24개월간 매월 요금 25% 할인
                </span>
              </button>
            </div>

            <div className="mb-6">
              <label className="block font-[font-4] text-[26px] mb-2">
                기타 요청사항
              </label>
              <textarea
                name="additional"
                value={form.additional}
                onChange={handleInput}
                placeholder="추가로 상담 받고 싶은 내용이 있다면 적어주세요."
                className="w-full border p-3 text-[14px] font-[font-4]"
                rows={4}
              />
            </div>

            <div className="mb-6">
              <p className="font-[font-4] text-[14px] mb-2">
                약관을 확인해 주세요.
              </p>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="terms"
                    checked={agreements.terms}
                    onChange={handleAgreement}
                  />
                  <span
                    onClick={() => setIsPopupOpenInfo1(true)}
                    className="text-black font-[font-4] text-[15px] underline cursor-pointer"
                  >
                    서비스 이용약관&gt;{" "}
                    <span className="text-[12px] font-[font-4]">(필수)</span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="privacy"
                    checked={agreements.privacy}
                    onChange={handleAgreement}
                  />
                  <span
                    onClick={() => setIsPopupOpenInfo2(true)}
                    className="text-black font-[font-4] text-[15px] underline cursor-pointer"
                  >
                    개인정보처리방침&gt;{" "}
                    <span className="text-[12px] font-[font-4]">(필수)</span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="marketing"
                    checked={agreements.marketing}
                    onChange={handleAgreement}
                  />
                  <span
                    onClick={() => setIsPopupOpenInfo3(true)}
                    className="text-black font-[font-4] text-[15px] underline cursor-pointer"
                  >
                    마케팅 정보수신 동의&gt;{" "}
                    <span className="text-[12px] font-[font-4]">(선택)</span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="thirdParty"
                    checked={agreements.thirdParty}
                    onChange={handleAgreement}
                  />
                  <span
                    onClick={() => setIsPopupOpenInfo4(true)}
                    className="text-black font-[font-4] text-[15px] underline cursor-pointer"
                  >
                    개인정보 수집 및 이용, 제3자 동의서 자세히 보기&gt;{" "}
                    <span className="text-[12px] font-[font-4]">(선택)</span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="all"
                    checked={agreements.all}
                    onChange={handleAgreement}
                  />
                  <span className="text-black font-[font-4] text-[16px]">
                    전체 동의합니다.
                  </span>
                </div>
              </div>
              {error && (
                <p className="text-red-500 font-[font-4] text-[14px] mt-2">
                  {error}
                </p>
              )}
            </div>

            <button
              onClick={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
              className="bg-[#00B7A3] text-white py-3 px-6 rounded-md font-[font-4] text-[18px] w-full"
            >
              상담 예약
            </button>
          </div>
        </div>
      </div>

      {isPopupOpenInfo1 &&
        ReactDOM.createPortal(
          <>
            <div className="fixed inset-0 flex justify-center items-center z-[1000] px-4">
              <div className="w-full max-w-[819px] h-[100vh] bg-white rounded-[30px] border-4 border-red-500 overflow-y-auto relative flex flex-col">
                <div className="sticky top-0 bg-white p-6 border-b z-10">
                  <h2 className="text-[32px] font-bold text-[#000000] text-center">
                    이용 약관
                  </h2>
                </div>
                <div className="flex-1 p-10 whitespace-pre-wrap text-[15px] leading-relaxed text-black">
                  {info1Text}
                </div>
                <div className="sticky bottom-0 bg-white p-6 border-t z-10">
                  <button
                    onClick={() => setIsPopupOpenInfo1(false)}
                    className="w-full bg-[#333333] text-white py-[20px] rounded-[10px] border-none cursor-pointer font-[Paperlogy-5Medium] text-[24px]"
                  >
                    닫기
                  </button>
                </div>
              </div>
            </div>
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-[999]"
              onClick={() => setIsPopupOpenInfo1(false)}
            />
          </>,
          document.body
        )}

      {isPopupOpenInfo2 &&
        ReactDOM.createPortal(
          <>
            <div className="fixed inset-0 flex justify-center items-center z-[1000] px-4">
              <div className="w-full max-w-[819px] h-[100vh] bg-white rounded-[30px] border-4 border-red-500 overflow-y-auto relative flex flex-col">
                <div className="sticky top-0 bg-white p-6 border-b z-10">
                  <h2 className="text-[32px] font-bold text-[#000000] text-center">
                    개인정보 처리방침
                  </h2>
                </div>
                <div className="flex-1 p-10 whitespace-pre-wrap text-[15px] leading-relaxed text-black">
                  {info2Text}
                </div>
                <div className="sticky bottom-0 bg-white p-6 border-t z-10">
                  <button
                    onClick={() => setIsPopupOpenInfo2(false)}
                    className="w-full bg-[#333333] text-white py-[20px] rounded-[10px] border-none cursor-pointer font-[Paperlogy-5Medium] text-[24px]"
                  >
                    닫기
                  </button>
                </div>
              </div>
            </div>
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-[999]"
              onClick={() => setIsPopupOpenInfo2(false)}
            />
          </>,
          document.body
        )}

      {isPopupOpenInfo3 &&
        ReactDOM.createPortal(
          <>
            <div className="fixed inset-0 flex justify-center items-center z-[1000] px-4">
              <div className="w-full max-w-[819px] h-[100vh] bg-white rounded-[30px] border-4 border-red-500 overflow-y-auto relative flex flex-col">
                <div className="sticky top-0 bg-white p-6 border-b z-10">
                  <h2 className="text-[32px] font-bold text-[#000000] text-center">
                    마케팅 정보 수신 동의
                  </h2>
                </div>
                <div className="flex-1 p-10 whitespace-pre-wrap text-[15px] leading-relaxed text-black">
                  {info3Text}
                </div>
                <div className="sticky bottom-0 bg-white p-6 border-t z-10">
                  <button
                    onClick={() => setIsPopupOpenInfo3(false)}
                    className="w-full bg-[#333333] text-white py-[20px] rounded-[10px] border-none cursor-pointer font-[Paperlogy-5Medium] text-[24px]"
                  >
                    닫기
                  </button>
                </div>
              </div>
            </div>
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-[999]"
              onClick={() => setIsPopupOpenInfo3(false)}
            />
          </>,
          document.body
        )}

      {isPopupOpenInfo4 &&
        ReactDOM.createPortal(
          <>
            <div className="fixed inset-0 flex justify-center items-center z-[1000] px-4">
              <div className="w-full max-w-[819px] h-[100vh] bg-white rounded-[30px] border-4 border-red-500 overflow-y-auto relative flex flex-col">
                <div className="sticky top-0 bg-white p-6 border-b z-10">
                  <h2 className="text-[32px] font-bold text-[#000000] text-center">
                    바로샵 비밀 지원금 문자 안내 <br />
                    개인정보 수집 및 이용 동의서
                  </h2>
                </div>
                <div className="flex-1 p-10 whitespace-pre-wrap text-[15px] leading-relaxed text-black">
                  {info4Text}
                </div>
                <div className="sticky bottom-0 bg-white p-6 border-t z-10">
                  <button
                    onClick={() => setIsPopupOpenInfo4(false)}
                    className="w-full bg-[#333333] text-white py-[20px] rounded-[10px] border-none cursor-pointer font-[Paperlogy-5Medium] text-[24px]"
                  >
                    닫기
                  </button>
                </div>
              </div>
            </div>
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-[999]"
              onClick={() => setIsPopupOpenInfo4(false)}
            />
          </>,
          document.body
        )}
    </>
  );
};

export default PhoneSurvey;
