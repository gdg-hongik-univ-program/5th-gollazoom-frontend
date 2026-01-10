import { useState, useEffect } from 'react';
import clothes from '../../assets/icons/clothes.png';

interface AllCoordiProps {
  onBack: () => void;
}

const AllCoordi = ({ onBack }: AllCoordiProps) => {
  const [coordiList, setCoordiList] = useState<any[]>([]);

  useEffect(() => {
    const mockData = [
      {
        coordiId: "c1",
        name: "데일리 출근룩",
        items: { TOP: clothes, BOTTOM: clothes, SHOES: clothes, OUTER: clothes }
      }
    ];
    setCoordiList(mockData);
  }, []);

  return (
    <div className="p-5 flex flex-col h-full">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="text-xl">←</button>
        <h2 className="text-xl font-bold">나의 코디북</h2>
      </div>
      
      {/* 2열 그리드로 배치 */}
      <div className="grid grid-cols-2 gap-4 overflow-y-auto">
        {coordiList.map((coordi: any) => (
          <div key={coordi.coordiId} className="bg-gray-50 rounded-2xl p-2 border border-gray-100 shadow-sm active:scale-95 transition-transform">
            <div className="grid grid-cols-2 gap-0.5 aspect-square rounded-xl overflow-hidden bg-white">
              {/* 4개의 이미지가 2*2로 들어가도록 */}
              <img src={coordi.items.TOP} className="w-full h-full object-cover" alt="t" />
              <img src={coordi.items.BOTTOM} className="w-full h-full object-cover" alt="b" />
              <img src={coordi.items.SHOES} className="w-full h-full object-cover" alt="s" />
              <img src={coordi.items.OUTER} className="w-full h-full object-cover" alt="o" />
            </div>
            <div className="mt-2 text-center text-sm font-semibold text-gray-700">{coordi.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllCoordi;