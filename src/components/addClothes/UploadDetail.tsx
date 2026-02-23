import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  COLOR_OPTIONS, 
  SEASON_OPTIONS, 
  CATEGORY_OPTIONS, 
  type Option 
} from '../../data/constants';
import { addCloth } from '../../api/closet';
import AlertModal from '../../components/modal/Alert';

const UploadDetail = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [category, setCategory] = useState('');
  const [isRaining, setIsRaining] = useState(true);
  const [selectedSeasons, setSelectedSeasons] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [memo, setMemo] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (state?.file) {
      setImageFile(state.file);
      const url = URL.createObjectURL(state.file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      navigate('/closet/add');
    }
  }, [state, navigate]);

  // 토글 함수 계절용
  const toggleSeason = (value: string) => {
    setSelectedSeasons(prev => 
      prev.includes(value) ? prev.filter(s => s !== value) : [...prev, value]
    );
  };

  // 토글 함수 색상
  const toggleColor = (value: string) => {
    setSelectedColors(prev => 
      prev.includes(value) ? prev.filter(s => s !== value) : [...prev, value]
    );
  };

  const [alertState, setAlertState] = useState({
    isOpen: false,
    message: "",
    type: "info" as "success" | "error" | "info"
  });

  const showAlert = (message: string, type: "success" | "error" | "info" = "info") => {
    setAlertState({ isOpen: true, message, type });
  };

  const handleSubmit = async () => {
    if (!imageFile || !category || selectedSeasons.length === 0 || selectedColors.length === 0) {
      showAlert("이미지와 필수 항목을 모두 선택해주세요.", "error");
      return;
      return;
    }

    const formData = new FormData();
    
    formData.append('image', imageFile); 

    const requestData = {
      category: category,
      season: selectedSeasons[0],
      color: selectedColors[0],
      isRaining: isRaining,
      memo: memo
    };

    formData.append(
      "data", 
      new Blob([JSON.stringify(requestData)], { type: "application/json" })
    );

    try {
      await addCloth(formData);
      setIsSubmitted(true); 
    } catch (error) {
      console.error("등록 실패:", error);
      showAlert("의상 등록 중 오류가 발생했습니다.", "error");W
    }
  };

  if (isSubmitted) {
    return (
        <div className="flex flex-col items-center justify-center h-full p-6 text-center bg-white">
        <div className="text-6xl mb-4">✨</div>
        <h2 className="text-2xl font-bold mb-2">등록 완료!</h2>
        <p className="text-gray-500 mb-8">새로운 의상이 옷장에 추가되었습니다.</p>
        
        <div className="flex flex-col w-full gap-3">
            <button 
            onClick={() => {
                setPreviewUrl(null);
                setImageFile(null);
                setCategory('');
                setSelectedSeasons([]);
                setSelectedColors([]);
                setMemo('');
                setIsSubmitted(false);
                navigate('/closet/add'); 
            }}
            className="w-full p-4 bg-blue-50 text-blue-600 rounded-2xl font-bold border border-blue-100"
            >
            추가로 의상 등록하기
            </button>

            <button 
            onClick={() => navigate('/closet')}
            className="w-full p-4 bg-black text-white rounded-2xl font-bold"
            >
            옷장으로 돌아가기
            </button>
        </div>
        </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      {/* 헤더 */}
      <div className="flex items-center gap-3 p-5 border-b sticky top-0 bg-white z-10">
        <button onClick={() => navigate(-1)} className="text-2xl">←</button>
        <h3 className="text-lg font-bold">의상 등록하기</h3>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="bg-gray-50 p-8 flex justify-center items-center border-b">
          <div className="w-48 h-48 bg-white rounded-3xl shadow-md overflow-hidden border-2 border-gray-200">
            {previewUrl && <img src={previewUrl} className="w-full h-full object-cover" alt="미리보기" />}
          </div>
        </div>

        <div className="p-6 flex flex-col gap-8 pb-10">
          {/* 1. 카테고리 */}
          <div>
            <label className="block text-sm font-bold text-gray-500 mb-2">카테고리</label>
            <select 
              value={category} 
              onChange={(e) => setCategory(e.target.value)} 
              className="w-full p-4 border border-gray-200 rounded-2xl bg-gray-50 outline-none font-medium"
            >
              <option value="" disabled>카테고리를 선택하세요</option>
              {CATEGORY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* 비 올 때 여부 */}
          <div>
            <label className="block text-sm font-bold text-gray-500 mb-2 font-bold">비 올 때 입어도 되나요?</label>
            <div className="flex gap-6 mt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="isRaining"
                  checked={isRaining === true} 
                  onChange={() => setIsRaining(true)} 
                  className="w-5 h-5 accent-blue-600" 
                /> 예
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="isRaining"
                  checked={isRaining === false} 
                  onChange={() => setIsRaining(false)} 
                  className="w-5 h-5 accent-blue-600"
                /> 아니오
              </label>
            </div>
          </div>

          {/* 2. 계절 */}
          <div>
            <label className="block text-sm font-bold text-gray-500 mb-3">계절 (중복 가능)</label>
            <div className="flex flex-wrap gap-2">
              {SEASON_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => toggleSeason(opt.value)}
                  className={`px-4 py-2 rounded-full border text-sm font-bold transition-all ${
                    selectedSeasons.includes(opt.value) 
                      ? 'bg-blue-600 text-white border-blue-600' 
                      : 'bg-blue-10 text-gray-400 border-blue-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* 3. 색상 */}
          <div>
            <label className="block text-sm font-bold text-gray-500 mb-3">색상 (중복 가능)</label>
            <div className="flex flex-wrap gap-2">
              {COLOR_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => toggleColor(opt.value)}
                  className={`px-4 py-2 rounded-full border text-sm font-bold transition-all ${
                    selectedColors.includes(opt.value) 
                      ? 'bg-blue-600 text-white border-blue-600' 
                      : 'bg-blue-10 text-gray-400 border-blue-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

        {/* 4. 메모 */}
          <div>
            <label className="block text-sm font-bold text-gray-500 mb-2">메모 (선택)</label>
            <textarea 
              value={memo} 
              onChange={(e) => setMemo(e.target.value)} 
              placeholder="메모를 자유롭게 입력하세요" 
              className="w-full p-4 border border-gray-200 rounded-2xl bg-gray-50 h-24 resize-none outline-none" 
            />
          </div>

          <button onClick={handleSubmit} className="w-full p-5 bg-[#0055ff] text-white rounded-2xl font-bold text-lg shadow-xl active:scale-95 transition-all">
            등록하기
          </button>
        </div>
      </div>
      <AlertModal 
        isOpen={alertState.isOpen}
        onClose={() => setAlertState(prev => ({ ...prev, isOpen: false }))}
        message={alertState.message}
        type={alertState.type}
      />
    </div>
  );
};

export default UploadDetail;