import { useState, useEffect } from 'react';
import { CATEGORY_OPTIONS } from '../../data/constants';
import ClothDetailModal from '../../components/ClothDetailModal';

interface AllClothesProps {
  onBack: () => void;
}

const BASE_URL = 'http://192.168.xxx.xxx:8080';

const AllClothes = ({ onBack }: AllClothesProps) => {
  const [view, setView] = useState<'category' | 'list'>('category');
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [clothesData, setClothesData] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // 1. 서버에서 전체 의상 목록 가져오기 (원본 로직 보존)
  const fetchClothes = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/closet`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer {accessToken}' 
        },
        body: JSON.stringify({ page: 0, size: 20 })
      });
      const result = await response.json();
      if (result.success) {
        setClothesData(result.data.items);
      }
    } catch (error) {
      console.error("의상 목록 로드 실패:", error);
    }
  };

  useEffect(() => {
    fetchClothes();
  }, []);

  // 2. 개별 아이템 클릭 시 상세 정보 가져오기
  const handleItemClick = async (clothId: string) => {
    try {
      const response = await fetch(`${BASE_URL}/api/closet/${clothId}`, {
        method: 'GET',
        headers: { 'Authorization': 'Bearer {accessToken}' }
      });
      const result = await response.json();
      if (result.success) {
        setSelectedItem(result.data);
      }
    } catch (e) { console.error(e); }
  };

  if (view === 'category') {
    return (
      <div className="flex flex-col h-full bg-white p-6">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={onBack} className="text-2xl">←</button>
          <h3 className="text-xl font-bold">모든 의상</h3>
        </div>
        <div className="flex flex-col gap-3">
          {CATEGORY_OPTIONS.map(opt => (
            <button 
              key={opt.value} 
              onClick={() => { setSelectedCategory(opt); setView('list'); }} 
              className="w-full p-5 text-lg rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 active:scale-[0.98] transition-all text-left font-medium"
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // 선택된 카테고리에 맞는 아이템 필터링
  const filteredItems = clothesData.filter(item => item.category === selectedCategory.value);

  return (
    <div className="flex flex-col h-full bg-white p-6">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => setView('category')} className="text-2xl">←</button>
        <h3 className="text-xl font-bold">{selectedCategory.label} 목록</h3>
      </div>

      {/* 의상 이미지 그리드: 3열 배치 */}
      <div className="grid grid-cols-3 gap-3 overflow-y-auto pb-10">
        {filteredItems.map(item => (
          <div 
            key={item.clothId} 
            onClick={() => handleItemClick(item.clothId)}
            className="aspect-square rounded-xl border border-gray-100 bg-gray-50 overflow-hidden cursor-pointer active:opacity-70 transition-opacity shadow-sm"
          >
            <img src={item.imageUrl} className="w-full h-full object-cover" alt="clothes" />
          </div>
        ))}
      </div>

      {/* 상세 보기 모달 */}
      {selectedItem && (
        <ClothDetailModal 
          data={selectedItem} 
          onClose={() => setSelectedItem(null)} 
          onRefresh={fetchClothes} 
        />
      )}
    </div>
  );
};

export default AllClothes;