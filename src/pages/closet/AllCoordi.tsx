import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import CoordiDetailModal, { type CoordiData } from '../../components/common/CoordiDetailModal';
import ClothItem from '../../components/common/ClothItem';
import api from '../../api/axios'; 

interface CoordiCloth {
  slot: string;
  clothId: string | number;
  imageUrl: string;
  category: string; 
  subCategory?: string;
  color?: string;
}

const AllCoordi = () => {
  const navigate = useNavigate();

  const [coordiList, setCoordiList] = useState<CoordiData[]>([]);
  const [selectedCoordi, setSelectedCoordi] = useState<CoordiData | null>(null);

  const fetchPresets = useCallback(async () => {
    try {
      const token = localStorage.getItem('accessToken'); 
      
      const response = await api.get('/api/presets', {
        headers: {
          'Authorization': `Bearer ${token}` 
        }
      });

      const responseData = response.data;
      if (responseData && Array.isArray(responseData.data)) {
        setCoordiList(responseData.data);
        // 💡 백엔드 데이터 구조 확인을 위한 로그
        console.log("백엔드가 준 코디 데이터:", responseData.data); 
      } else if (Array.isArray(responseData)) {
        setCoordiList(responseData); 
        console.log("백엔드가 준 코디 데이터:", responseData);
      } else {
        setCoordiList([]);
      }
      
    } catch (e) {
      console.error("API 연결 에러:", e);
    }
  }, []);

  useEffect(() => {
    fetchPresets();
  }, [fetchPresets]);

  return (
    <div className="p-5 flex flex-col h-full bg-white">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/closet')} className="text-xl">←</button>
        <h2 className="text-xl font-bold">나의 코디북</h2>
      </div>
      
      <div className="grid grid-cols-2 gap-4 overflow-y-auto">
        {coordiList.map((coordi) => (
          <div key={coordi.presetId}
            onClick={() => setSelectedCoordi(coordi)} 
            className="flex flex-col gap-2 cursor-pointer active:scale-95 transition-transform">
            
            <div 
              className="bg-gray-50 rounded-2xl p-2 border border-gray-100 shadow-sm active:scale-95 transition-transform cursor-pointer aspect-square grid grid-cols-2 gap-0.5 overflow-hidden"
            >
              {["TOP", "BOTTOM", "DRESS", "OUTER"].map(slot => {
                // 💡 수정됨: items 뒤에 물음표(?)를 붙여서 하얀 화면 에러를 방지합니다!
                const item = coordi.items?.find((i: CoordiCloth) => i.slot === slot);
                return (
                  <div key={slot} className="bg-gray-200 rounded-sm overflow-hidden">
                    {item ? (
                        <ClothItem item={item} />
                      ) : (
                        <div className="w-full h-full bg-gray-100" />
                      )}
                  </div>
                );
              })}
            </div>
            
            <div className="px-1">
              <div className="text-sm font-bold text-gray-800 truncate mb-1">{coordi.name}</div>
              <div className="flex gap-2">
                <button 
                  onClick={(e) => {
                    e.stopPropagation(); 
                    // 💡 수정됨: 올바른 주소인 /coordi/save 로 이동합니다!
                    navigate(`/coordi/save?edit=${coordi.presetId}`);
                  }}
                  className="flex-1 py-1 text-[11px] bg-white border border-blue-200 text-blue-500 rounded-md"
                >
                  수정
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation(); 
                    /* 삭제 로직 */
                  }}
                  className="flex-1 py-1 text-[11px] bg-white border border-red-100 text-red-400 rounded-md"
                >
                  삭제
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedCoordi && (
        <CoordiDetailModal 
          data={selectedCoordi} 
          onClose={() => setSelectedCoordi(null)} 
          onRefresh={fetchPresets} 
        />
      )}
    </div>
  );
};

export default AllCoordi;