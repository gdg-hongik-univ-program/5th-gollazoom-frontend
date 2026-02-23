import { useState } from "react";
import { 
    COLOR_OPTIONS, 
    SEASON_OPTIONS, 
    CATEGORY_OPTIONS, 
    SUB_CATEGORY_OPTIONS, 
    type Option 
} from '../../data/constants';
import { useNavigate } from "react-router-dom";
import { addQuickCloth, type QuickClothRequest } from '../../api/closet';
import AlertModal from '../../components/modal/Alert';

// 아이콘 경로를 반환하는 헬퍼 함수
const getIconPath = (cat: string, sub: string) => {
  if (!cat || !sub) return '';
  return new URL(`../../assets/icons/${cat}/${sub}.png`, import.meta.url).href;
};

const QuickAdd = () => {
  const navigate = useNavigate();

  // 상태 관리 (기존 AddClothes 로직 기반 + 종류 추가)
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState(''); // 종류 (티셔츠, 후드티 등)
  const [selectedColor, setSelectedColor] = useState(''); // 색상 (중복 불가 단일 선택)
  const [season, setSeason] = useState<string>('');
  const [isRaining, setIsRaining] = useState(true);
  const [memo, setMemo] = useState('');

  // 색상 값(Label)을 실제 CSS 컬러로 매핑
  const colorMap: Record<string, string> = {
    BLACK: '#000000', WHITE: '#FFFFFF', RED: '#d83535', 
    BLUE: '#145abc', BEIGE: '#c4b38b', GRAY: '#a0a0a0', NAVY: '#00177f'
  };

  const iconUrl = getIconPath(category, subCategory);

  const [alertState, setAlertState] = useState({
      isOpen: false,
      message: "",
      type: "info" as "success" | "error" | "info",
      onConfirm: () => {} 
  });

  const showAlert = (message: string, type: "success" | "error" | "info" = "info", onConfirm?: () => void) => {
      setAlertState({ 
          isOpen: true, 
          message, 
          type, 
          onConfirm: onConfirm || (() => setAlertState(prev => ({ ...prev, isOpen: false })))
      });
  };
  
  const handleSubmit = async () => {
    if (!category || !subCategory || !selectedColor || !season) {
      alert("모든 필수 항목을 선택해주세요!");
      return;
    }

    const colorInfo = COLOR_OPTIONS.find(opt => opt.value === selectedColor);

    const requestBody: QuickClothRequest = {
      category: category,         
      season: season, // 💡 사진 등록 때와 동일하게 첫 번째 값만 보냅니다. (기존 join(',') 제거)
      color: selectedColor, 
      memo: memo,             
      imageUrl: "",     
      subCategory: subCategory, 
      colorCode: (colorInfo?.hex || "FFFFFF").replace('#', ''),
      isRaining: isRaining
    };

    try {
      // 💡 기존 addCloth 대신 새로 만든 addQuickCloth를 호출합니다!
      await addQuickCloth(requestBody);
      console.log("퀵등록 요청:", requestBody);
      showAlert("의상이 추가되었습니다.", "success", () => navigate('/closet'));
    } catch (error) {
      console.error(error);
      showAlert("등록 실패", "error");
    }
  };

  const handleCategoryChange = (val: string) => {
    setCategory(val);
    setSubCategory(''); // 카테고리 바뀌면 종류 초기화
  };

  const handleSeasonClick = (value: string) => {
    // 클릭한 값 하나만 저장
    setSeason(value);
  };

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
        {/* 헤더 */}
        <div className="flex items-center gap-3 p-6 border-b bg-white z-20">
            <button onClick={() => navigate(-1)} className="text-2xl">←</button>
            <h3 className="text-xl font-bold">퀵등록</h3>
        </div>

        {/* 상단 이미지 영역 */}
        <div className="sticky top-0 bg-gray-50 p-8 flex justify-center items-center z-10 border-b">
            <div className="w-48 h-48 bg-white rounded-3xl shadow-[inset_0_2px_8px_rgba(0,0,0,0.05)] border-2 border-gray-200 flex items-center justify-center relative">
                
                {subCategory ? (
                    <div className="relative w-32 h-32">
                        {/* 테두리용 레이어 (흰색일 때만) */}
                        {selectedColor === 'WHITE' && (
                            <div 
                                className="absolute inset-0 scale-[1.03] transition-all duration-300"
                                style={{
                                    backgroundColor: '#d1d5db',
                                    maskImage: `url(${iconUrl})`,
                                    WebkitMaskImage: `url(${iconUrl})`,
                                    maskRepeat: 'no-repeat',
                                    WebkitMaskRepeat: 'no-repeat',
                                    maskPosition: 'center',
                                    WebkitMaskPosition: 'center',
                                    maskSize: 'contain',
                                    WebkitMaskSize: 'contain',
                                }}
                            />
                            )}

                            {/* 실제 아이콘 레이어 */}
                            <div 
                                className="absolute inset-0 transition-all duration-300 z-10"
                                style={{
                                    backgroundColor: colorMap[selectedColor] || '#232323',
                                    maskImage: `url(${iconUrl})`,
                                    WebkitMaskImage: `url(${iconUrl})`,
                                    maskRepeat: 'no-repeat',
                                    WebkitMaskRepeat: 'no-repeat',
                                    maskPosition: 'center',
                                    WebkitMaskPosition: 'center',
                                    maskSize: 'contain',
                                    WebkitMaskSize: 'contain',
                                }}
                            />
                        </div>
                ) : (
                    <span className="text-gray-300 font-bold">종류를 선택하세요</span>
                )}
            </div>
        </div>
        
      {/* 입력 폼 영역 (스크롤 가능) */}
      <div className="flex-1 p-6 overflow-y-auto pb-10">
        <div className="flex flex-col gap-6">
          
          {/* 카테고리 */}
          <div>
            <label className="block text-sm font-bold text-gray-500 mb-2">카테고리</label>
            <select value={category} onChange={(e) => handleCategoryChange(e.target.value)} className="w-full p-4 border border-gray-200 rounded-2xl bg-gray-50 outline-none">
              <option value="" disabled>선택하세요</option>
              {CATEGORY_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>

          {/* 종류 (카테고리에 따라 변경됨) */}
          <div>
            <label className="block text-sm font-bold text-gray-500 mb-2">종류</label>
            <select 
              value={subCategory} 
              onChange={(e) => setSubCategory(e.target.value)}
              disabled={!category}
              className="w-full p-4 border border-gray-200 rounded-2xl bg-gray-50 outline-none disabled:opacity-50"
            >
              <option value="" disabled>종류를 선택하세요</option>
              {category && SUB_CATEGORY_OPTIONS[category]?.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* 비 올 때 여부 (기존 AddClothes 로직) */}
          <div>
            <label className="block text-sm font-bold text-gray-500 mb-2 font-bold">비 올 때 입어도 되나요?</label>
            <div className="flex gap-6 mt-1">
              <label className="flex items-center gap-2"><input type="radio" checked={isRaining === true} onChange={() => setIsRaining(true)} /> 예</label>
              <label className="flex items-center gap-2"><input type="radio" checked={isRaining === false} onChange={() => setIsRaining(false)} /> 아니오</label>
            </div>
          </div>

          {/* 계절 (기존 중복 선택 > 불가로 수정) */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-600">계절 선택</label>
            <div className="flex gap-2 mt-1 flex-wrap">
              {SEASON_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleSeasonClick(opt.value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                    season === opt.value // 배열이 아니라 단일 값 비교
                      ? 'bg-blue-600 text-white border-blue-600' 
                      : 'bg-white text-gray-400 border-gray-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* 색상 (드롭박스 - 중복 불가) */}
          <div>
            <label className="block text-sm font-bold text-gray-500 mb-2">색상</label>
            <select value={selectedColor} onChange={(e) => setSelectedColor(e.target.value)} className="w-full p-4 border border-gray-200 rounded-2xl bg-gray-50 outline-none">
              <option value="" disabled>색상을 선택하세요</option>
              {COLOR_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>

          {/* 메모 */}
          <div>
            <label className="block text-sm font-bold text-gray-500 mb-2">메모 (선택)</label>
            <textarea value={memo} onChange={(e) => setMemo(e.target.value)} placeholder="메모를 입력하세요" className="w-full p-4 border border-gray-200 rounded-2xl bg-gray-50 h-24 resize-none outline-none" />
          </div>

          <button onClick={handleSubmit} className="w-full p-5 bg-[#0055ff] text-white rounded-2xl font-bold text-lg shadow-xl mt-4 active:scale-95 transition-all">
            등록하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickAdd;