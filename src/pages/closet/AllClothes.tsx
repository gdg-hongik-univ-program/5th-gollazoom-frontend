import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CATEGORY_OPTIONS } from '../../data/constants';
import ClothDetailModal from '../../components/common/ClothDetailModal';
import { getClothes, getClothDetail, updateWashStatus } from '../../api/closet';
import ClothItem from '../../components/common/ClothItem';
import HelpIcon from '../../components/guide/HelpIcon'; 
import { Archive, CheckCircle2, Circle } from 'lucide-react';

interface Cloth {
  clothId: string;
  imageUrl: string;
  category: string;
  season: string;
  isRaining: boolean;
  memo?: string;
  color?: string;      // 상세 조회를 위해 추가
  subCategory?: string; // 상세 조회를 위해 추가
  washStatus?: string; // 세탁 상태 추가
}

const CATEGORY_ORDER = ['TOP', 'BOTTOM', 'DRESS', 'OUTER'];

const AllClothes = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<string>('ALL');

  const [clothesData, setClothesData] = useState<Cloth[]>([]);
  const [selectedItem, setSelectedItem] = useState<Cloth | null>(null);

  const [isLaundryMode, setIsLaundryMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const [isUsingWash, setIsUsingWash] = useState(false);

  const fetchClothes = useCallback(async () => {
    try {
      const response = await getClothes({ page: 0, size: 20 });
      console.log("서버 응답 전체 데이터:", response);

      if (response && response.data) {
      setIsUsingWash(response.data.isUsingWashUpTech); 

        if (Array.isArray(response.data.items)) {
          setClothesData(response.data.items);
        }
      }
    } catch (error) {
      console.error("의상 목록 로드 실패:", error);
    }
  }, []);

  useEffect(() => {
    fetchClothes();
  }, [fetchClothes]);

  // 필터링 및 정렬 로직
  const sortedAndFilteredItems = useMemo(() => {
    return clothesData
      .filter(item => activeFilter === 'ALL' || item.category === activeFilter)
      .sort((a, b) => {
        const indexA = CATEGORY_ORDER.indexOf(a.category);
        const indexB = CATEGORY_ORDER.indexOf(b.category);
        const finalIndexA = indexA !== -1 ? indexA : 999;
        const finalIndexB = indexB !== -1 ? indexB : 999;
        return finalIndexA - finalIndexB;
      });
  }, [clothesData, activeFilter]);

  // 개별 아이템 클릭 시 상세 정보 가져오기
  const handleItemClick = async (cloth: Cloth) => {
    const clothId = cloth.clothId;
    const isWashing = cloth.washStatus === "WASHING";
    // 세탁 모드 선택/해제
    if (isLaundryMode) {
      if (isWashing) return;
      const newSelected = new Set(selectedIds);
      if (newSelected.has(clothId)) {
        newSelected.delete(clothId);
      } else {
        newSelected.add(clothId);
      }
      setSelectedIds(newSelected);
      return;
    }

    // 세탁 중인 옷을 클릭했을 때 세탁 완료 처리함
    if (isWashing) {
      const confirmComplete = window.confirm("세탁이 완료되었나요? 다시 옷장으로 가져옵니다.");
      if (confirmComplete) {
        try {
          // 상태를 AVAILABLE로 업데이트
          await updateWashStatus([Number(clothId)], "AVAILABLE");
          await fetchClothes(); 
          return;
        } catch (error) {
          console.error("상태 변경 실패", error);
          alert("상태 변경 중 오류가 발생했습니다.");
          return;
        }
      } else {
        return;
      }
    }

    try {
      const response = await getClothDetail(clothId);
      setSelectedItem(response);
    } catch (e) { console.error(e); }
  };

  // 세탁 상태 변경 요청 함수
  const handleUpdateStatus = async (status: "WASHING" | "AVAILABLE") => {
    if (selectedIds.size === 0) {
      alert("선택된 의상이 없습니다.");
      return;
    }
    try {
      const idsAsNumber = Array.from(selectedIds).map(id => Number(id));
      await updateWashStatus(idsAsNumber, status);
      alert("선택한 옷을 빨래통으로 보냈습니다!");  
      // 상태 초기화 및 목록 새로고침
      setIsLaundryMode(false);
      setSelectedIds(new Set());
      fetchClothes(); 
    } catch (error) {
      console.error("상태 변경 실패", error);
      alert("오류가 발생했습니다.");
    }
  };

  const filterTabs = [{ label: '전체', value: 'ALL' }, ...CATEGORY_OPTIONS];
    return (
      <div className="flex flex-col h-full bg-white relative">
        <div className="flex items-center gap-3 p-6 border-b bg-white z-10">
          <div className="flex items-center gap-3">
            <button onClick={() => {
              if(isLaundryMode) { setIsLaundryMode(false); setSelectedIds(new Set()); }
              else navigate('/closet');
            }} className="text-xl font-medium text-gray-500">
            ←
            </button>
            {/* 제목 추가 */}
            <h3 className="text-xl font-bold flex items-center gap-2">
              <h3 className="text-xl font-bold">모든 의상</h3>
              {!isLaundryMode && <HelpIcon />}
            </h3>
          </div>

          {!isLaundryMode && isUsingWash && (
            <button 
              onClick={() => setIsLaundryMode(true)}
              className="p-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition"
              >
              <Archive size={22} />
            </button>
          )}
        </div>

        {!isLaundryMode && (
          <div className="flex gap-2 px-6 pt-4 pb-4 overflow-x-auto no-scrollbar scroll-smooth">
            {filterTabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveFilter(tab.value)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors
                 ${activeFilter === tab.value 
                   ? 'bg-gray-900 text-white shadow-sm' 
                   : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

      {/* 의상 리스트 그리드 */}
      <div className="flex-1 overflow-y-auto px-6 pb-24">
        {sortedAndFilteredItems.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 mt-10">
            <p>등록된 의상이 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {/* 필터링 및 정렬된 아이템 렌더링 */}
            {sortedAndFilteredItems.map(item => {
              const isSelected = selectedIds.has(item.clothId);
              const isWashing = item.washStatus === "WASHING";
              const isDisabled = isLaundryMode && isWashing;

              return (
                <div 
                  key={item.clothId} 
                  onClick={() => handleItemClick(item)} 
                  className={`
                    relative aspect-square rounded-xl overflow-hidden shadow-sm transition-all
                    ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}
                    ${isLaundryMode && !isDisabled ? 'active:scale-95' : ''}
                    ${isSelected ? 'ring-4 ring-blue-500 ring-offset-1' : 'border border-gray-100 bg-gray-50'}
                  `}
                >
                  <div className={isSelected ? "opacity-60" : ""}>
                    <ClothItem item={item} />
                  </div>

                  {isLaundryMode && !isWashing && (
                    <div className="absolute top-2 right-2 z-10">
                      {isSelected ? (
                        <CheckCircle2 className="text-blue-600 bg-white rounded-full" size={24} fill="white" />
                      ) : (
                        <Circle className="text-gray-300 bg-black/10 rounded-full" size={24} />
                      )}
                    </div>
                  )}

                  {isWashing && !isLaundryMode && (
                    <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white font-bold">
                      <span className="text-xl mb-1">🫧</span>
                      <span className="text-sm">세탁 중</span>
                      <span className="text-[10px] text-gray-200 mt-1 font-normal text-center px-1">클릭하여 옷장 복귀</span>
                    </div>
                  )}

                  {isDisabled && (
                    <div className="absolute inset-0 bg-gray-200/80 flex flex-col items-center justify-center text-gray-400 font-bold z-20">
                      <span className="text-xl mb-1">🫧</span>
                      <span className="text-xs">세탁 중</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {isLaundryMode && (
        <div className="absolute bottom-0 left-0 w-full bg-white border-t border-gray-100 p-4 flex gap-3 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] animate-slide-up z-20">
          <button 
            onClick={() => handleUpdateStatus("WASHING")}
            className="w-full py-3.5 bg-blue-100 text-blue-700 font-bold rounded-xl hover:bg-blue-200 transition text-lg"
          >
            {selectedIds.size > 0 ? `${selectedIds.size}벌 세탁하기` : '의상을 선택해주세요'}
          </button>
        </div>
      )}

      {selectedItem && !isLaundryMode && (
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