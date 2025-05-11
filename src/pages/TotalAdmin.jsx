import React, { useEffect, useState } from "react";
import { doc, getDoc, setDoc, collection, getDocs, deleteDoc } from "firebase/firestore";
import { db, auth, storage } from "../../firebase";
import { ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";
import * as XLSX from "xlsx";
import CryptoJS from "crypto-js";

const TotalAdmin = () => {
  const [submissions, setSubmissions] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedTab, setSelectedTab] = useState("phone");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changeError, setChangeError] = useState("");
  const [category, setCategory] = useState("B1p"); // 기본 카테고리 변경
  const [files, setFiles] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [folders, setFolders] = useState([]);
  const [uploadedPhotos, setUploadedPhotos] = useState([]);

  const ENCRYPTION_KEY = "my-secret-key-9807161223";

  const ENCRYPTED_USERS = [
    {
      username: "U2FsdGVkX1+WUzQ3v5Jv5UqTSLiT78mKw3KjrgPHO1E=",
      password: "U2FsdGVkX19P66/oqea0JSPKcwah6yG8P59h5msAGaA="
    },
    {
      username: "U2FsdGVkX19CdnBb/QPpKKR7eU9he2i2lJp1UJwRIRM=",
      password: "U2FsdGVkX194fQRifEFE99Yx50W2N3J4SAWDGgeoC4c="
    },
  ];

  const decryptData = (encrypted) => {
    try {
      const bytes = CryptoJS.AES.decrypt(encrypted, ENCRYPTION_KEY);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      if (!decrypted) {
        throw new Error("복호화 결과가 비어 있습니다.");
      }
      return decrypted;
    } catch (err) {
      console.error("복호화 실패:", err.message);
      return null;
    }
  };

  const encryptData = (data) => {
    try {
      return CryptoJS.AES.encrypt(data, ENCRYPTION_KEY).toString();
    } catch (err) {
      console.error("암호화 실패:", err.message);
      return null;
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const loggedIn = sessionStorage.getItem("isLoggedIn") === "true";
      const storedUsername = sessionStorage.getItem("username");
      if (loggedIn && storedUsername) {
        setIsLoggedIn(true);
        setUsername(storedUsername);
        fetchData();
      }
    }

    const loadPhotos = async () => {
      try {
        const storagePhotos = await loadStoragePhotos();
        setUploadedPhotos(storagePhotos);

        // 폴더 목록 생성 (루트폴더 제거)
        const folderSet = new Set(storagePhotos.map((photo) => photo.category));
        const folderArray = [...folderSet];
        setFolders(folderArray);
        if (folderArray.length > 0 && !folderArray.includes(category)) {
          setCategory(folderArray[0]); // 첫 번째 카테고리로 기본 설정
        }
      } catch (err) {
        console.error("사진 목록 가져오기 실패:", err);
        setUploadStatus("사진 목록을 불러오지 못했습니다.");
      }
    };

    loadPhotos();
  }, []);

  const loadStoragePhotos = async () => {
    try {
      const storageRef = ref(storage, "baroshop");
      const listResult = await listAll(storageRef);
      const photos = [];

      // 폴더별로 순차적으로 로드
      for (const folderRef of listResult.prefixes) {
        const folderName = folderRef.name; // 예: B1p
        const folderList = await listAll(folderRef);
        for (const itemRef of folderList.items) {
          const url = await getDownloadURL(itemRef);
          photos.push({
            category: folderName,
            fileName: itemRef.name,
            url: url,
          });
        }
        // 폴더 하나 로드할 때마다 상태 업데이트
        setUploadedPhotos([...photos]);
      }

      return photos;
    } catch (err) {
      console.error("Storage 사진 목록 가져오기 실패:", err);
      return [];
    }
  };

  const fetchData = async () => {
    console.log("✅ [fetchData] Firestore 데이터 불러오는 중...");
    try {
      const snapshot = await getDocs(collection(db, "submissions"));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("📦 [fetchData] 불러온 데이터:", data);
      setSubmissions(data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
    } catch (err) {
      console.error("❌ [fetchData] 에러 발생:", err);
      setError("데이터를 불러오지 못했습니다.");
    }
  };

  const getStoredPassword = async (username) => {
    const userDocRef = doc(db, "admins", username);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      return userDoc.data().password;
    }
    return null;
  };

  const storePassword = async (username, encryptedPassword) => {
    const userDocRef = doc(db, "admins", username);
    await setDoc(userDocRef, { password: encryptedPassword });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    let decryptedPassword = null;
    let isValidUser = false;

    let storedPassword = await getStoredPassword(username);
    if (storedPassword) {
      decryptedPassword = decryptData(storedPassword);
    }

    if (!storedPassword) {
      const user = ENCRYPTED_USERS.find((u) => {
        const decryptedUsername = decryptData(u.username);
        return decryptedUsername === username;
      });

      if (!user) {
        setError("아이디 또는 비밀번호가 잘못되었습니다.");
        return;
      }

      decryptedPassword = decryptData(user.password);
      storedPassword = user.password;
      await storePassword(username, storedPassword);
    }

    if (!decryptedPassword) {
      setError("인증 데이터를 복호화하지 못했습니다. 관리자에게 문의하세요.");
      return;
    }

    if (password === decryptedPassword) {
      isValidUser = true;
    }

    if (isValidUser) {
      setIsLoggedIn(true);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("isLoggedIn", "true");
        sessionStorage.setItem("username", username);
      }
      fetchData();
    } else {
      setError("아이디 또는 비밀번호가 잘못되었습니다.");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setChangeError("");

    const storedPassword = await getStoredPassword(username);
    const decryptedPassword = decryptData(storedPassword);

    if (!decryptedPassword) {
      setChangeError("현재 비밀번호를 복호화하지 못했습니다.");
      return;
    }

    if (currentPassword !== decryptedPassword) {
      setChangeError("현재 비밀번호가 올바르지 않습니다.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setChangeError("새 비밀번호와 확인 비밀번호가 일치하지 않습니다.");
      return;
    }

    const encryptedNewPassword = encryptData(newPassword);
    if (!encryptedNewPassword) {
      setChangeError("비밀번호 암호화에 실패했습니다.");
      return;
    }

    try {
      await storePassword(username, encryptedNewPassword);
      setShowChangePassword(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      alert("비밀번호가 성공적으로 변경되었습니다. 다시 로그인해주세요.");
      handleLogout();
    } catch (err) {
      console.error("비밀번호 변경 실패:", err);
      setChangeError("비밀번호 변경 중 오류가 발생했습니다.");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("isLoggedIn");
      sessionStorage.removeItem("username");
    }
    setUsername("");
    setPassword("");
    setError("");
  };

  const toggleSelectAll = () => {
    const filteredSubmissions = submissions.filter((s) => s.type === selectedTab);
    if (selectedIds.length === filteredSubmissions.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredSubmissions.map((s) => s.id));
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = async () => {
    if (!window.confirm("선택된 항목을 삭제할까요?")) return;
    await Promise.all(selectedIds.map((id) => deleteDoc(doc(db, "submissions", id))));
    setSelectedIds([]);
    fetchData();
  };

  const handleExport = () => {
    const filteredSubmissions = submissions.filter((s) => s.type === selectedTab);
    let exportData;

    if (selectedTab === "phone") {
      exportData = filteredSubmissions.map((s) => ({
        이름: s.name,
        생년월일: s.birth,
        휴대폰번호: s.phone,
        신청단말기: s.device,
        가입유형: s.joinType,
        결제방식: s.paymentPeriod,
        할인방식: s.discountType,
        기타요청: s.additional,
        선택1_마케팅동의: s.agreements?.marketing ? "Y" : "N",
        선택2_개인정보제3자: s.agreements?.thirdParty ? "Y" : "N",
        신청일시: new Date(s.timestamp).toLocaleString("ko-KR"),
      }));
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "휴대폰_신청내역");
      XLSX.writeFile(workbook, "휴대폰_상담내역.xlsx");
    } else if (selectedTab === "internet") {
      exportData = filteredSubmissions.map((s) => ({
        이름: s.name,
        생년월일: s.birth,
        휴대폰번호: s.phone,
        가입유형: s.joinType,
        사은품종류: s.giftType,
        기타요청: s.additional,
        선택1_마케팅동의: s.agreements?.marketing ? "Y" : "N",
        선택2_개인정보제3자: s.agreements?.thirdParty ? "Y" : "N",
        신청일시: new Date(s.timestamp).toLocaleString("ko-KR"),
      }));
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "인터넷_신청내역");
      XLSX.writeFile(workbook, "인터넷_상담내역.xlsx");
    } else if (selectedTab === "fit") {
      exportData = filteredSubmissions.map((s) => ({
        회사명: s.company,
        담당자명: s.manager,
        연락처: s.phone,
        카테고리: s.category,
        사업자or개인: s.businessType,
        기타요청: s.additional,
        선택1_마케팅동의: s.agreements?.marketing ? "Y" : "N",
        신청일시: new Date(s.timestamp).toLocaleString("ko-KR"),
      }));
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "어울림_신청내역");
      XLSX.writeFile(workbook, "어울림_상담내역.xlsx");
    }
  };

  const handleSort = () => {
    const newOrder = sortOrder === "desc" ? "asc" : "desc";
    const sorted = [...submissions].sort((a, b) => {
      const t1 = new Date(a.timestamp), t2 = new Date(b.timestamp);
      return newOrder === "asc" ? t1 - t2 : t2 - t1;
    });
    setSubmissions(sorted);
    setSortOrder(newOrder);
  };

  const handleFileReplace = async (fileName) => {
    if (!files || files.length === 0) {
      setUploadStatus("파일을 선택해주세요.");
      return;
    }

    setUploadStatus("교체 중...");
    try {
      const file = files[0];
      const storagePath = `baroshop/${category}/${fileName}`; // 루트폴더 조건 제거
      const storageRef = ref(storage, storagePath);

      const metadata = {
        adminId: username,
        cacheControl: "public, max-age=0, no-cache",
      };
      await uploadBytes(storageRef, file, metadata);

      const downloadURL = await getDownloadURL(storageRef);

      setUploadStatus("교체 완료!");
      setFiles(null);

      // 최신 사진 목록 갱신
      const storagePhotos = await loadStoragePhotos();
      setUploadedPhotos(storagePhotos);
    } catch (err) {
      console.error("파일 교체 실패:", err);
      setUploadStatus(`교체 실패: ${err.message}`);
    }
  };

  const filteredSubmissions = submissions.filter((s) => s.type === selectedTab);

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col bg-gray-100 mt-28">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">관리자 로그인</h2>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block font-[Paperlogy] text-[16px] mb-2">아이디</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border p-3 rounded-md font-[Paperlogy]"
                placeholder="아이디를 입력하세요"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block font-[Paperlogy] text-[16px] mb-2">비밀번호</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border p-3 rounded-md font-[Paperlogy]"
                placeholder="비밀번호를 입력하세요"
                required
              />
            </div>
            {error && <p className="text-red-500 font-[Paperlogy] text-[14px] mb-4">{error}</p>}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-3 rounded-md font-[Paperlogy] text-[18px] hover:bg-blue-600 transition"
            >
              로그인
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto mt-20 pt-0">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">📋 토탈 관리자 - 신청 내역</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setShowChangePassword(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            비밀번호 변경
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            로그아웃
          </button>
        </div>
      </div>

      {showChangePassword && (
        <div className="fixed top-28 left-0 right-0 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm mx-auto">
            <h3 className="text-xl font-bold mb-4 text-center">비밀번호 변경</h3>
            <form onSubmit={handleChangePassword}>
              <div className="mb-4">
                <label className="block font-[Paperlogy] text-[16px] mb-2">현재 비밀번호</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full border p-3 rounded-md font-[Paperlogy]"
                  placeholder="현재 비밀번호"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block font-[Paperlogy] text-[16px] mb-2">새 비밀번호</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full border p-3 rounded-md font-[Paperlogy]"
                  placeholder="새 비밀번호"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block font-[Paperlogy] text-[16px] mb-2">새 비밀번호 확인</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border p-3 rounded-md font-[Paperlogy]"
                  placeholder="새 비밀번호 확인"
                  required
                />
              </div>
              {changeError && <p className="text-red-500 font-[Paperlogy] text-[14px] mb-4">{changeError}</p>}
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-3 rounded-md font-[Paperlogy] text-[18px] hover:bg-blue-600 transition"
                >
                  변경
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowChangePassword(false);
                    setCurrentPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                    setChangeError("");
                  }}
                  className="w-full bg-red-500 text-white py-3 rounded-md font-[Paperlogy] text-[18px] hover:bg-blue-600 transition"
                >
                  취소
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setSelectedTab("phone")}
          className={`px-4 py-2 rounded ${selectedTab === "phone" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"} hover:bg-blue-600 hover:text-white transition`}
        >
          휴대폰
        </button>
        <button
          onClick={() => setSelectedTab("internet")}
          className={`px-4 py-2 rounded ${selectedTab === "internet" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"} hover:bg-blue-600 hover:text-white transition`}
        >
          인터넷
        </button>
        <button
          onClick={() => setSelectedTab("fit")}
          className={`px-4 py-2 rounded ${selectedTab === "fit" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"} hover:bg-blue-600 hover:text-white transition`}
        >
          어울림
        </button>
        <button
          onClick={() => setSelectedTab("photos")}
          className={`px-4 py-2 rounded ${selectedTab === "photos" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"} hover:bg-blue-600 hover:text-white transition`}
        >
          사진관리
        </button>
      </div>

      {selectedTab === "photos" ? (
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 mb-4">
            {folders.map((folder) => (
              <button
                key={folder}
                onClick={() => setCategory(folder)}
                className={`px-4 py-2 rounded ${category === folder ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"} hover:bg-blue-600 hover:text-white transition`}
              >
                {folder}
              </button>
            ))}
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-bold mb-2">사진 목록</h3>
            <div className="grid grid-cols-3 gap-4">
              {uploadedPhotos
                .filter((photo) => photo.category === category)
                .map((photo) => (
                  <div key={`${photo.category}_${photo.fileName}`} className="border p-2 rounded">
                    <img
                      src={photo.url}
                      alt={photo.fileName}
                      className="w-full h-32 object-fill" // object-cover → object-fill
                    />
                    <p className="text-center font-[Paperlogy]">{photo.fileName}</p>
                    <input
                      type="file"
                      accept=".svg"
                      onChange={(e) => setFiles(e.target.files)}
                      className="w-full border p-1 rounded-md font-[Paperlogy] mt-2"
                    />
                    <button
                      onClick={() => handleFileReplace(photo.fileName)}
                      className="w-full bg-blue-500 text-white py-1 rounded-md font-[Paperlogy] text-[14px] hover:bg-blue-600 transition mt-2"
                    >
                      교체
                    </button>
                  </div>
                )) || <p className="text-gray-500">사진이 없습니다.</p>}
            </div>
          </div>
          {uploadStatus && <p className="text-red-500 font-[Paperlogy] text-[14px] mt-2">{uploadStatus}</p>}
        </div>
      ) : (
        <>
          <div className="flex gap-2 mb-4">
            <button
              onClick={toggleSelectAll}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              모두선택
            </button>
            <button
              onClick={handleDeleteSelected}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              모두삭제
            </button>
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
            >
              엑셀 저장
            </button>
            <button
              onClick={handleSort}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              {sortOrder === "desc" ? "내림차순" : "오름차순"}
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border text-sm shadow-lg rounded-lg">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border-r p-3 text-center text-gray-700 font-[Paperlogy] font-semibold">선택</th>
                  {selectedTab === "phone" && (
                    <>
                      <th className="border-r p-3 text-center text-gray-700 font-[Paperlogy] font-semibold">이름</th>
                      <th className="border-r p-3 text-center text-gray-700 font-[Paperlogy] font-semibold">연락처</th>
                      <th className="border-r p-3 text-center text-gray-700 font-[Paperlogy] font-semibold">생년월일</th>
                      <th className="border-r p-3 text-center text-gray-700 font-[Paperlogy] font-semibold">단말기</th>
                      <th className="border-r p-3 text-center text-gray-700 font-[Paperlogy] font-semibold">가입유형</th>
                      <th className="border-r p-3 text-center text-gray-700 font-[Paperlogy] font-semibold">결제</th>
                      <th className="border-r p-3 text-center text-gray-700 font-[Paperlogy] font-semibold">할인</th>
                      <th className="border-r p-3 text-center text-gray-700 font-[Paperlogy] font-semibold">요청사항</th>
                      <th className="border-r p-3 text-center text-gray-700 font-[Paperlogy] font-semibold">선택1</th>
                      <th className="border-r p-3 text-center text-gray-700 font-[Paperlogy] font-semibold">선택2</th>
                      <th className="p-3 text-center text-gray-700 font-[Paperlogy] font-semibold">날짜</th>
                    </>
                  )}
                  {selectedTab === "internet" && (
                    <>
                      <th className="border-r p-3 text-center text-gray-700 font-[Paperlogy] font-semibold">이름</th>
                      <th className="border-r p-3 text-center text-gray-700 font-[Paperlogy] font-semibold">연락처</th>
                      <th className="border-r p-3 text-center text-gray-700 font-[Paperlogy] font-semibold">생년월일</th>
                      <th className="border-r p-3 text-center text-gray-700 font-[Paperlogy] font-semibold">가입유형</th>
                      <th className="border-r p-3 text-center text-gray-700 font-[Paperlogy] font-semibold">사은품종류</th>
                      <th className="border-r p-3 text-center text-gray-700 font-[Paperlogy] font-semibold">요청사항</th>
                      <th className="border-r p-3 text-center text-gray-700 font-[Paperlogy] font-semibold">선택1</th>
                      <th className="border-r p-3 text-center text-gray-700 font-[Paperlogy] font-semibold">선택2</th>
                      <th className="p-3 text-center text-gray-700 font-[Paperlogy] font-semibold">날짜</th>
                    </>
                  )}
                  {selectedTab === "fit" && (
                    <>
                      <th className="border-r p-3 text-center text-gray-700 font-[Paperlogy] font-semibold">회사명</th>
                      <th className="border-r p-3 text-center text-gray-700 font-[Paperlogy] font-semibold">담당자명</th>
                      <th className="border-r p-3 text-center text-gray-700 font-[Paperlogy] font-semibold">연락처</th>
                      <th className="border-r p-3 text-center text-gray-700 font-[Paperlogy] font-semibold">카테고리</th>
                      <th className="border-r p-3 text-center text-gray-700 font-[Paperlogy] font-semibold">사업자or개인</th>
                      <th className="border-r p-3 text-center text-gray-700 font-[Paperlogy] font-semibold">요청사항</th>
                      <th className="border-r p-3 text-center text-gray-700 font-[Paperlogy] font-semibold">선택1</th>
                      <th className="p-3 text-center text-gray-700 font-[Paperlogy] font-semibold">날짜</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredSubmissions.map((s) => (
                  <tr key={s.id} className="border-t hover:bg-gray-50">
                    <td className="border-r p-3 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(s.id)}
                        onChange={() => toggleSelect(s.id)}
                      />
                    </td>
                    {selectedTab === "phone" && (
                      <>
                        <td className="border-r p-3 text-center">{s.name}</td>
                        <td className="border-r p-3 text-center">{s.phone}</td>
                        <td className="border-r p-3 text-center">{s.birth}</td>
                        <td className="border-r p-3 text-center">{s.device}</td>
                        <td className="border-r p-3 text-center">{s.joinType}</td>
                        <td className="border-r p-3 text-center">{s.paymentPeriod}</td>
                        <td className="border-r p-3 text-center">{s.discountType}</td>
                        <td className="border-r p-3 text-center">{s.additional}</td>
                        <td className="border-r p-3 text-center">{s.agreements?.marketing ? "Y" : "-"}</td>
                        <td className="border-r p-3 text-center">{s.agreements?.thirdParty ? "Y" : "-"}</td>
                        <td className="p-3 text-center">{new Date(s.timestamp).toLocaleString("ko-KR")}</td>
                      </>
                    )}
                    {selectedTab === "internet" && (
                      <>
                        <td className="border-r p-3 text-center">{s.name}</td>
                        <td className="border-r p-3 text-center">{s.phone}</td>
                        <td className="border-r p-3 text-center">{s.birth}</td>
                        <td className="border-r p-3 text-center">{s.joinType}</td>
                        <td className="border-r p-3 text-center">{s.giftType}</td>
                        <td className="border-r p-3 text-center">{s.additional}</td>
                        <td className="border-r p-3 text-center">{s.agreements?.marketing ? "Y" : "-"}</td>
                        <td className="border-r p-3 text-center">{s.agreements?.thirdParty ? "Y" : "-"}</td>
                        <td className="p-3 text-center">{new Date(s.timestamp).toLocaleString("ko-KR")}</td>
                      </>
                    )}
                    {selectedTab === "fit" && (
                      <>
                        <td className="border-r p-3 text-center">{s.company}</td>
                        <td className="border-r p-3 text-center">{s.manager}</td>
                        <td className="border-r p-3 text-center">{s.phone}</td>
                        <td className="border-r p-3 text-center">{s.category}</td>
                        <td className="border-r p-3 text-center">{s.businessType}</td>
                        <td className="border-r p-3 text-center">{s.additional}</td>
                        <td className="border-r p-3 text-center">{s.agreements?.marketing ? "Y" : "-"}</td>
                        <td className="p-3 text-center">{new Date(s.timestamp).toLocaleString("ko-KR")}</td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default TotalAdmin;