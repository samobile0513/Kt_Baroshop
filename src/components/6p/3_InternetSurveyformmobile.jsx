import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactDOM from "react-dom";

const InternetSurvey = ({
  form,
  agreements,
  handleInput,
  handleSelect,
  handleAgreement,
  handleSubmit,
  openModalAt,
  error
}) => {
  const containerRef = useRef(null);
  const [zoom, setZoom] = useState(1);
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

  const isActive = (field, value) => form[field] === value;

  const boxStyle = (active) =>
    `border rounded-md py-12 text-[64px] text-center ${
      active ? "border-[#FD3941] font-bold text-[#FD3941]" : "border-black text-black"
    }`;

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const ratio = width <= 819 ? Math.max(Math.min((width / 819) * 1.3, 1.3), 1.3) : 1.3;
      setZoom(ratio);
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <div
        ref={containerRef}
        className="w-full flex justify-center bg-white pt-[100px] pb-[100px]"
        style={{ zoom }}
      >
        <div className="w-[819px] px-4 font-[font-4]">
          <div className="flex flex-col items-center text-center mb-[120px]">
            <h2 className="text-[70.5px] text-[#01A69F] font-[font-8] mb-4">KT인터넷은 바로 바로샵</h2>
            <h1 className="text-[75px] font-bold font-[font-5] mb-4">전국 최저가 요금 확인하기</h1>
            <p className="text-[45px]">원하시는 휴대폰 상품을 선택해 주세요.</p>
          </div>

          <h3 className="text-[80px] font-bold font-[font-7] mb-12 pl-[20px]">가입자 정보</h3>

          <div className="mb-12">
            <label className="text-[80px] block mb-4 pl-[20px]">이름</label>
            <input
              name="name"
              value={form.name}
              onChange={handleInput}
              placeholder="홍길동"
              className="w-full border p-6 text-[50px] h-[80px]"
            />
          </div>

          <div className="mb-12">
            <label className="text-[80px] block mb-4 pl-[20px]">생년월일</label>
            <input
              name="birth"
              value={form.birth}
              onChange={handleInput}
              placeholder="생년월일 6자리를 입력해 주세요."
              className="w-full border p-6 text-[50px] h-[80px]"
            />
          </div>

          <div className="mb-12">
            <label className="text-[80px] block mb-4 pl-[20px]">휴대폰 번호</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleInput}
              placeholder="010-0000-0000"
              className="w-full border p-6 text-[54px] h-[80px]"
            />
          </div>
          <div className="mb-[150px]"></div>
          <div className="h-[2px] w-[700px] bg-black mx-auto mb-4"></div>

          <div className="mb-[150px] mt-[150px]">
            <p className="text-[32px] text-[#FD3941] mb-2 text-center">※ 인터넷 단독 신청 시 사은품 전화상담 필수!</p>
            <p className="text-[60px] mb-4 text-center">가입유형을 {'>'} 선택해 주세요.</p>
            <div className="flex flex-col gap-4">
              {["인터넷", "인터넷+TV", "인터넷+TV+휴대폰"].map((item) => (
                <button
                  key={item}
                  onClick={() => handleSelect("joinType", item)}
                  className={boxStyle(isActive("joinType", item))}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-[150px]">
            <p className="text-[72px] mb-4 text-center">원하시는 사은품 종류를<br />선택해 주세요.</p>
            <div className="space-y-8">
              <button
                onClick={() => handleSelect("giftType", "상품권")}
                className={`w-full border p-12 rounded-md text-center ${
                  isActive("giftType", "상품권") ? "border-[#FD3941]" : "border-black"
                }`}
              >
                <div className={`text-[88px] font-bold ${isActive("giftType", "상품권") ? "text-[#FD3941]" : "text-black"}`}>
                  상품권
                </div>
                <div className="text-[50px] text-gray-700">약 50만원 상당의 상품권<br />(편의점/백화점)</div>
              </button>

              <button
                onClick={() => handleSelect("giftType", "가전제품")}
                className={`w-full border p-12 rounded-md text-center ${
                  isActive("giftType", "가전제품") ? "border-[#FD3941]" : "border-black"
                }`}
              >
                <div className={`text-[88px] font-bold flex justify-center items-center ${isActive("giftType", "가전제품") ? "text-[#FD3941]" : "text-black"}`}>
                  가전제품
                  <span className="ml-4 bg-[#FD3941] text-white px-4 py-[2px] rounded-full text-[48px]">추천</span>
                </div>
                <div className="text-[50px] text-gray-700">TV, 청소기, 공기청정기 등</div>
              </button>
            </div>
          </div>

          <div className="mb-[50px]">
            <h3 className="text-[80px] font-[font-7] mb-4 text-center">기타 요청사항</h3>
            <textarea
              name="additional"
              value={form.additional}
              onChange={handleInput}
              rows={10}
              className="w-full border p-6 text-[58px]"
              placeholder="추가로 상담 받고 싶은 내용이 있다면 적어주세요."
            />
          </div>

          <div className="mt-20">
            <div>
              <p className="text-black text-[80px] mb-4">약관을 확인해 주세요</p>
            </div>
            <div className="pl-[20px]">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    name="terms"
                    checked={agreements.terms}
                    onChange={handleAgreement}
                    className="w-8 h-8"
                  />
                  <span
                    onClick={() => setIsPopupOpenInfo1(true)}
                    className="cursor-pointer text-black text-[50px]"
                  >
                    서비스 이용약관 <span className="text-[48px]">(필수)</span>
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    name="privacy"
                    checked={agreements.privacy}
                    onChange={handleAgreement}
                    className="w-8 h-8"
                  />
                  <span
                    onClick={() => setIsPopupOpenInfo2(true)}
                    className="cursor-pointer text-black text-[50px]"
                  >
                    개인정보처리방침 <span className="text-[48px]">(필수)</span>
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    name="marketing"
                    checked={agreements.marketing}
                    onChange={handleAgreement}
                    className="w-8 h-8"
                  />
                  <span
                    onClick={() => setIsPopupOpenInfo3(true)}
                    className="cursor-pointer text-black text-[50px]"
                  >
                    마케팅 정보수신 동의 <span className="text-[48px] opacity-65">(선택)</span>
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    name="thirdParty"
                    checked={agreements.thirdParty}
                    onChange={handleAgreement}
                    className="w-8 h-8"
                  />
                  <span
                    onClick={() => setIsPopupOpenInfo4(true)}
                    className="cursor-pointer text-black text-[50px]"
                  >
                    개인정보 수집 및 이용,<br /> 제3자 동의서 자세히 보기 {'>'} <span className="text-[48px] opacity-65">(선택)</span>
                  </span>
                </div>
                <div className="flex items-center gap-4 mb-4">
                  <input
                    type="checkbox"
                    name="all"
                    checked={agreements.all}
                    onChange={handleAgreement}
                    className="w-8 h-8"
                  />
                  <span className="text-black text-[80px]">전체 동의합니다.</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className="mt-20 w-full bg-[#00B7A3] text-white py-8 rounded-md text-[72px]"
            >
              상담 예약
            </button>

            {error && <p className="text-red-500 text-[56px] mt-8">{error}</p>}
          </div>
        </div>
      </div>

      {isPopupOpenInfo1 &&
        ReactDOM.createPortal(
          <>
            <div className="fixed inset-0 flex justify-center items-center z-[1000] px-4">
              <div className="w-full max-w-[819px] h-[100vh] bg-white rounded-[30px] border-4 border-red-500 overflow-y-auto relative flex flex-col">
                {/* ⬆️ 상단 sticky 제목 */}
                <div className="sticky top-0 bg-white p-6 border-b z-10">
                  <h2 className="text-[25px] font-bold text-[#000000] text-center">이용 약관</h2>
                </div>

                {/* 본문 텍스트 */}
                <div className="flex-1 p-10 whitespace-pre-wrap text-[10px] leading-relaxed text-black">
                  {info1Text}
                </div>

                {/* 하단 sticky 닫기 버튼 */}
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

            {/* 어두운 배경 */}
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
                {/* ⬆️ 상단 sticky 제목 */}
                <div className="sticky top-0 bg-white p-6 border-b z-10">
                  <h2 className="text-[25px] font-bold text-[#000000] text-center">개인정보 처리방침</h2>
                </div>

                {/* 본문 텍스트 */}
                <div className="flex-1 p-10 whitespace-pre-wrap text-[10px] leading-relaxed text-black">
                  {info2Text}
                </div>

                {/* 하단 sticky 닫기 버튼 */}
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

            {/* 어두운 배경 */}
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
                {/* ⬆️ 상단 sticky 제목 */}
                <div className="sticky top-0 bg-white p-6 border-b z-10">
                  <h2 className="text-[25px] font-bold text-[#000000] text-center">마케팅 정보 수신 동의</h2>
                </div>

                {/* 본문 텍스트 */}
                <div className="flex-1 p-10 whitespace-pre-wrap text-[10px] leading-relaxed text-black">
                  {info3Text}
                </div>

                {/* 하단 sticky 닫기 버튼 */}
                <div className="sticky bottom-0 bguo-white p-6 border-t z-10">
                  <button
                    onClick={() => setIsPopupOpenInfo3(false)}
                    className="w-full bg-[#333333] text-white py-[20px] rounded-[10px] border-none cursor-pointer font-[Paperlogy-5Medium] text-[24px]"
                  >
                    닫기
                  </button>
                </div>
              </div>
            </div>

            {/* 어두운 배경 */}
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
                {/* ⬆️ 상단 sticky 제목 */}
                <div className="sticky top-0 bg-white p-6 border-b z-10">
                  <h2 className="text-[25px] font-bold text-[#000000] text-center">개인정보 수집및 이용 및 <br />제3자 동의서</h2>
                </div>

                {/* 본문 텍스트 */}
                <div className="flex-1 p-10 whitespace-pre-wrap text-[10px] leading-relaxed text-black">
                  {info4Text}
                </div>

                {/* 하단 sticky 닫기 버튼 */}
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

            {/* 어두운 배경 */}
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

export default InternetSurvey;