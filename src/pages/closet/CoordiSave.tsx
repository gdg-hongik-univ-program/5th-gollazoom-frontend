import { useState } from 'react';
import clothes from '../../assets/icons/clothes.png';
import { CATEGORY_OPTIONS } from '../../data/constants';

interface CoordiSaveProps { onBack: () => void; }

const CoordiSave = ({ onBack }: CoordiSaveProps) => {
  const [selectedItems, setSelectedItems] = useState<any>({ TOP: null, BOTTOM: null, SHOES: null, OUTER: null });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectingCategory, setSelectingCategory] = useState<any>(null);

  const slots = [
    { key: 'TOP', label: '상의' }, { key: 'BOTTOM', label: '하의' },
    { key: 'SHOES', label: '신발' }, { key: 'OUTER', label: '아우터' }
  ];

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* 상단 헤더 */}
      <div className="flex items-center gap-3 p-6 border-b bg-white z-10">
        <button onClick={onBack} className="text-2xl">←</button>
        <h2 className="text-xl font-bold">코디 저장하기</h2>
      </div>

      <div className="flex-1 p-8 flex flex-col items-center">
        {/* 2x2 정사각형 격자 */}
        <div className="grid grid-cols-2 gap-4 w-full max-w-[320px]">
          {slots.map((slot) => (
            <div 
              key={slot.key} 
              onClick={() => {
                setSelectingCategory(CATEGORY_OPTIONS.find(o => o.value === slot.key));
                setIsModalOpen(true);
              }}
              className="w-full aspect-square border-2 border-dashed border-gray-200 rounded-[30px] flex flex-col items-center justify-center bg-[#F8FAFC] cursor-pointer active:bg-gray-100"
            >
              {selectedItems[slot.key] ? (
                <img src={selectedItems[slot.key].imageUrl} className="w-full h-full object-cover rounded-[28px]" alt={slot.label} />
              ) : (
                <div className="flex flex-col items-center justify-center">
                  {/* 아이콘 크기 작게 고정 */}
                  <img src={clothes} className="w-10 h-10 mb-2 opacity-30 object-contain" alt="아이콘" />
                  <span className="text-xs font-bold text-gray-400">{slot.label}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="p-6">
        <button className="w-full p-5 bg-[#007AFF] text-white rounded-[20px] font-bold text-lg shadow-lg">
          이 코디 저장하기
        </button>
      </div>

      {/* 겹침 방지 흰색 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-[2000] flex items-end justify-center">
          {/* 뒤가 비치지 않게 bg-white와 불투명도 100% 적용 */}
          <div className="w-full max-w-[430px] bg-white rounded-t-[40px] p-8 h-[60vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
              <strong className="text-lg font-bold">{selectingCategory?.label} 선택</strong>
              <button onClick={() => setIsModalOpen(false)} className="text-2xl text-gray-400">✕</button>
            </div>
            {/* 리스트 영역 */}
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-white">
              <p className="font-medium">선택할 수 있는 {selectingCategory?.label} 목록이 없습니다.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoordiSave;