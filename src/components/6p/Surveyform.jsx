import React, { useState } from "react";
import Info1 from "../other/info1";
import Info2 from "../other/info2";
import Info3 from "../other/info3";
import TermsModal from "../TermsModal";
import { collection, addDoc } from "firebase/firestore"; // Firebase 임포트 추가
import { db } from "../../../firebase"; // Firebase 설정 임포트

const Survey = () => {
  const [form, setForm] = useState({
    company: "",
    manager: "",
    phone: "",
    category: "",
    businessType: "",
    additional: "",
  });

  const [agreements, setAgreements] = useState({
    terms: false,
    privacy: false,
    marketing: false,
    all: false,
  });

  const [error, setError] = useState("");
  const [openModal, setOpenModal] = useState(null);

  const categories = [
    "각종 소모품",
    "판촉물 및 선물세트",
    "교육",
    "기업 행사",
  ];

  const handleInput = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAgreement = (e) => {
    const { name, checked } = e.target;
    if (name === "all") {
      setAgreements({ terms: checked, privacy: checked, marketing: checked, all: checked });
    } else {
      setAgreements((prev) => {
        const updated = { ...prev, [name]: checked };
        updated.all = updated.terms && updated.privacy && updated.marketing;
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
        type: "fit", // type 필드 추가
        timestamp: new Date().toISOString(),
      });
      alert("제출 완료되었습니다!");

      // 제출 후 초기화
      setForm({
        company: "",
        manager: "",
        phone: "",
        category: "",
        businessType: "",
        additional: "",
      });
      setAgreements({
        terms: false,
        privacy: false,
        marketing: false,
        all: false,
      });
    } catch (err) {
      console.error("제출 실패:", err);
      alert("제출 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="flex flex-col items-center bg-[#E6F4F4] py-20 px-6 min-h-screen">
      <div className="bg-white p-10 rounded-md w-[772px] shadow-md">
        <h2 className="font-[Paperlogy] font-extrabold text-[30px] mb-4">장애인 고용 부담금 감면의 길</h2>
        <h1 className="font-[Paperlogy] font-medium text-[48px] mb-2">지금 바로 원하는 서비스 찾기</h1>
        <p className="font-[Paperlogy] font-regular text-[20px] mb-10">원하시는 유형의 상품 카테고리와 회사정보를 입력 해주세요.</p>

        {[
          { label: "회사명", name: "company", placeholder: "회사명을 입력해 주세요." },
          { label: "담당자명", name: "manager", placeholder: "담당자님의 성함을 입력해 주세요. EX 홍길동 과장" },
          { label: "연락처", name: "phone", placeholder: "010 - 0000 - 0000" },
          { label: "사업자or개인", name: "businessType", placeholder: "사업자인지 개인인지 적어주세요." },
        ].map(({ label, name, placeholder }) => (
          <div key={name} className="mb-6">
            <label className="block font-[Paperlogy] text-[30px] mb-2">{label}</label>
            <input
              name={name}
              value={form[name]}
              onChange={handleInput}
              placeholder={placeholder}
              className="w-full border p-3 text-[20px] font-[Paperlogy]"
            />
          </div>
        ))}

        <div className="mb-6">
          <label className="block font-[Paperlogy] text-[30px] mb-2">구매 희망 카테고리</label>
          <select name="category" value={form.category} onChange={handleInput} className="w-full border p-3 text-[20px] font-[Paperlogy]">
            <option value="">선택하세요</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label className="block font-[Paperlogy] text-[30px] mb-2">기타 요청사항</label>
          <textarea
            name="additional"
            value={form.additional}
            onChange={handleInput}
            placeholder="추가로 상담 받고 싶은 내용이 있다면 적어주세요."
            className="w-full border p-3 text-[20px] font-[Paperlogy]"
            rows={5}
          />
        </div>

        <div className="mb-6">
          <p className="font-[Paperlogy] text-[20px] mb-2">약관을 확인해 주세요.</p>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <input type="checkbox" name="terms" checked={agreements.terms} onChange={handleAgreement} />
              <span onClick={() => setOpenModal("info1")} className="text-black font-[Paperlogy] text-[15px] underline cursor-pointer">서비스 이용약관 &gt;</span>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" name="privacy" checked={agreements.privacy} onChange={handleAgreement} />
              <span onClick={() => setOpenModal("info2")} className="text-black font-[Paperlogy] text-[15px] underline cursor-pointer">개인정보처리방침 &gt;</span>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" name="marketing" checked={agreements.marketing} onChange={handleAgreement} />
              <span onClick={() => setOpenModal("info3")} className="text-black font-[Paperlogy] text-[15px] underline cursor-pointer">마케팅 정보수신 동의 &gt;</span>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" name="all" checked={agreements.all} onChange={handleAgreement} />
              <span className="text-black font-[Paperlogy] text-[20px]">전체 동의합니다.</span>
            </div>
          </div>
          {error && <p className="text-red-500 font-[Paperlogy] text-[15px] mt-2">{error}</p>}
        </div>

        <button onClick={handleSubmit} className="bg-teal-500 text-white py-3 px-6 rounded-md font-[Paperlogy] text-[20px] w-full">
          상담 예약
        </button>
      </div>

      <TermsModal isOpen={openModal === "info1"} onClose={() => setOpenModal(null)}>
        <Info1 />
      </TermsModal>
      <TermsModal isOpen={openModal === "info2"} onClose={() => setOpenModal(null)}>
        <Info2 />
      </TermsModal>
      <TermsModal isOpen={openModal === "info3"} onClose={() => setOpenModal(null)}>
        <Info3 />
      </TermsModal>
    </div>
  );
};

export default Survey;