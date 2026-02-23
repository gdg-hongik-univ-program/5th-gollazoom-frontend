import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import clothes from '../../assets/icons/clothes.png';
import { CATEGORY_OPTIONS, type Option } from '../../data/constants';
import ClothItem from '../../components/common/ClothItem';
import api from '../../api/axios';
import AlertModal from '../../components/modal/Alert';

interface Cloth {
  clothId: string | number; 
  imageUrl: string;
  category: string;
  subCategory?: string;
  color?: string;
}

interface SelectedItems {
  [key: string]: Cloth | null;
  TOP: Cloth | null;
  BOTTOM: Cloth | null;
  DRESS: Cloth | null;
  OUTER: Cloth | null;
}

const CoordiSave = () => {
  const navigate = useNavigate();
  const [coordiName, setCoordiName] = useState('');
  const [selectedItems, setSelectedItems] = useState<SelectedItems>({ 
    TOP: null, 
    BOTTOM: null, 
    DRESS: null, 
    OUTER: null 
  });
  const [serverClothes, setServerClothes] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectingCategory, setSelectingCategory] = useState<Option | null>(null);

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

  useEffect(() => {
  const fetchClothes = async () => {
    try {
        const token = localStorage.getItem('accessToken');
        const response = await fetch('http://13.125.175.130:8080/api/closet', { 
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const result = await response.json();
        setServerClothes(result.data || []);
      } catch (e) {
        console.error("의상 목록 로드 실패:", e);
      }
    };
    fetchClothes();
  }, []);

  const slots = [ 
    { key: 'TOP', label: '상의' }, { key: 'BOTTOM', label: '하의' },
    { key: 'DRESS', label: '원피스' }, { key: 'OUTER', label: '아우터' }
  ];

  const handleSaveCoordi = async () => {
    const hasSelectedItems = Object.values(selectedItems).some(item => item !== null);

    if (!hasSelectedItems) {
      showAlert("적어도 하나의 의상은 선택해야 코디를 저장할 수 있습니다.", "error");
      return;
    }

    if (!coordiName.trim()) {
      showAlert("코디 이름을 입력해주세요.", "error");
      return;
    }

    const editId = new URLSearchParams(window.location.search).get('edit'); 

    const coordiData = {
      name: coordiName,
      topClothId: String(selectedItems.TOP?.clothId || ""), 
      bottomClothId: String(selectedItems.BOTTOM?.clothId || ""),
      dressClothId: String(selectedItems.DRESS?.clothId || ""),
      outerClothId: String(selectedItems.OUTER?.clothId || "")
    };

    try {
      const url = editId ? `/api/presets/${editId}` : '/api/presets';
      const method = editId ? 'patch' : 'post';

      const response = await api[method](url, coordiData);

      if (response.status === 200 || response.status === 201) {
        showAlert(
          editId ? "코디가 수정되었습니다." : "새 코디가 저장되었습니다.", 
          "success", 
          () => navigate('/closet')
        );
      }
    } catch (e) {
      console.error("저장 중 에러 발생:", e);
      showAlert("저장 중 오류가 발생했습니다.", "error");
    }
  };

  return (
    <div className="flex flex-col h-full bg-white relative">
      <div className="flex items-center gap-3 p-6 border-b bg-white z-10">
        <button onClick={() => navigate('/closet')} className="text-2xl font-medium text-gray-500">←</button>
        <h2 className="text-xl font-bold">코디 저장하기</h2>
      </div>

      <div className="flex-1 p-8 flex flex-col items-center overflow-y-auto">
        <div className="w-full max-w-[320px] mb-8">
          <label className="block text-sm font-bold text-gray-500 mb-2">코디 이름</label>
          <input 
            type="text"
            value={coordiName}
            onChange={(e) => setCoordiName(e.target.value)}
            placeholder="코디 이름을 적어주세요 (예: 데이트룩)"
            className="w-full p-4 border border-gray-200 rounded-[20px] bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500 font-bold"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 w-full max-w-[320px]">
          {slots.map((slot) => (
            <div 
              key={slot.key} 
              onClick={() => {
                const category = CATEGORY_OPTIONS.find(o => o.value === slot.key) || null;
                setSelectingCategory(category);
                setIsModalOpen(true);
              }}
              className="w-full aspect-square border-2 border-dashed border-gray-200 rounded-[30px] flex flex-col items-center justify-center bg-[#F8FAFC] cursor-pointer active:bg-gray-100"
            >
              {selectedItems[slot.key] ? (
                <ClothItem item={selectedItems[slot.key]!} 
                  className="w-full h-full rounded-[28px]" 
                />
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <img src={clothes} className="w-10 h-10 mb-2 opacity-30 object-contain" alt="아이콘" />
                  <span className="text-xs font-bold text-gray-400">{slot.label}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="w-full max-w-[320px] mt-8">
          <button onClick={handleSaveCoordi} className="w-full p-5 bg-[#007AFF] text-white rounded-[20px] font-bold text-lg shadow-lg hover:bg-blue-600 transition">
            이 코디 저장하기
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-[2000] flex items-end justify-center">
          <div className="w-full max-w-[430px] bg-white rounded-t-[40px] p-8 h-[60vh] flex flex-col shadow-2xl overflow-hidden animate-slide-up">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
              <strong className="text-lg font-bold">{selectingCategory ? selectingCategory.label : '아이템'} 선택</strong>
              <button onClick={() => setIsModalOpen(false)} className="text-2xl text-gray-400">&times;</button>
            </div>
              
            <div className="flex-1 overflow-y-auto p-2 no-scrollbar">
              <div className="grid grid-cols-3 gap-3">
                {serverClothes
                  .filter(item => item.category === selectingCategory?.value)
                  .map((item) => (
                    <div 
                      key={item.clothId}
                      onClick={() => {
                        setSelectedItems(prev => ({ 
                          ...prev, 
                          [item.category]: item 
                        }))
                        setIsModalOpen(false);
                      }}
                      className="aspect-square rounded-xl overflow-hidden border border-gray-100 cursor-pointer active:scale-95 transition-transform"
                    >
                      <ClothItem item={item} /> 
                    </div>
                  ))}
                {serverClothes.filter(item => item.category === selectingCategory?.value).length === 0 && (
                  <div className="col-span-3 text-center text-gray-400 py-10 flex flex-col items-center">
                    <span className="text-4xl mb-3 opacity-50">👕</span>
                    <p>등록된 아이템이 없습니다.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <AlertModal 
        isOpen={alertState.isOpen}
        onClose={alertState.onConfirm}
        message={alertState.message}
        type={alertState.type}
      />
    </div>
  );
};

export default CoordiSave;