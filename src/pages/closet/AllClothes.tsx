import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { CATEGORY_OPTIONS, type Option } from '../../data/constants';
import ClothDetailModal from '../../components/ClothDetailModal';
import { getClothes, getClothDetail } from '../../api/closet';

interface Cloth {
  clothId: string;
  imageUrl: string;
  category: string;
  season: string;
  rainOk: boolean;
  memo?: string;
}

const AllClothes = () => {
  const navigate = useNavigate();

  const [view, setView] = useState<'category' | 'list'>('category');
  const [selectedCategory, setSelectedCategory] = useState<Option | null>(null);
  const [clothesData, setClothesData] = useState<Cloth[]>([]);
  const [selectedItem, setSelectedItem] = useState<Cloth | null>(null);

  const fetchClothes = useCallback(async () => {
    try {
      const response = await getClothes({ page: 0, size: 20 });
      if (response && response.items) {
        setClothesData(response.items);
      }
    } catch (error) {
      console.error("의상 목록 로드 실패:", error);
    }
  }, []);

  useEffect(() => {
    fetchClothes();
  }, [fetchClothes]);

  // 3. 개별 아이템 클릭 시 상세 정보 가져오기
  const handleItemClick = async (clothId: string) => {
    try {
      const response = await getClothDetail(clothId);
      setSelectedItem(response);
    } catch (e) { console.error(e); }
  };

  if (view === 'category') {
    return (
      <div className="flex flex-col h-full bg-white p-6">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate('/closet')} className="text-2xl">←</button>
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

  if (!selectedCategory) return null;
  // 선택된 카테고리에 맞는 아이템 필터링
  const filteredItems = clothesData.filter(item => item.category === selectedCategory.value);

  return (
    <div className="flex flex-col h-full bg-white p-6">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => setView('category')} className="text-2xl">←</button>
        {/* 위에서 null 체크를 했으므로 안전하게 접근 가능 */}
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