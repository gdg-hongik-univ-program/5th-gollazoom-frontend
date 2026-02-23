import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import ClothItem from '../../components/common/ClothItem';
import { getClothes } from '../../api/closet';
import { updateCoordi } from '../../api/closet'; // 위에서 만든 함수 임포트

const CoordiEdit = () => {
  const { presetId } = useParams();
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [selectedItems, setSelectedItems] = useState<Record<string, any>>({
    TOP: null, BOTTOM: null, DRESS: null, OUTER: null
  });

  const [activeSlot, setActiveSlot] = useState('TOP'); // 현재 선택 중인 카테고리
  const [clothesList, setClothesList] = useState<any[]>([]); // 하단 리스트용

  // 1. 데이터 초기 로드
  const init = useCallback(async () => {
    try {
      const coordiRes = await api.get(`/api/presets/${presetId}`);
      const resData = coordiRes.data.data || coordiRes.data;
      
      if (resData) {
        setName(resData.name || "");
        const itemsMap: Record<string, any> = {};
        resData.items?.forEach((item: any) => { itemsMap[item.slot] = item; });
        setSelectedItems(prev => ({ ...prev, ...itemsMap }));
      }

      const clothesRes = await getClothes(); // 옷장 데이터 가져오기
      setClothesList(clothesRes.data.data || clothesRes.data || []);
    } catch (e) {
      console.error("초기 로드 실패", e);
    }
  }, [presetId]);

  useEffect(() => { init(); }, [init]);

  // 2. 의상 선택 시 해당 슬롯 교체
  const handleSelect = (cloth: any) => {
    setSelectedItems(prev => ({ ...prev, [activeSlot]: cloth }));
  };

  // 3. 수정 완료 (PATCH)
  const handleComplete = async () => {
    if (!name.trim()) return alert("코디 이름을 입력하세요.");

    try {
        // 1. 먼저 필수 값인 name만 담은 기본 객체를 만듭니다.
        const body: any = {
        name: name
        };

        // 2. 각 슬롯에 데이터가 있는 경우에만 숫자로 변환하여 추가합니다.
        // 이렇게 하면 데이터가 없는 슬롯은 객체에 포함되지 않은 상태(빈 슬롯 처리)로 전송됩니다.
        if (selectedItems.TOP?.clothId) body.topClothId = Number(selectedItems.TOP.clothId);
        if (selectedItems.BOTTOM?.clothId) body.bottomClothId = Number(selectedItems.BOTTOM.clothId);
        if (selectedItems.DRESS?.clothId) body.dressClothId = Number(selectedItems.DRESS.clothId);
        if (selectedItems.OUTER?.clothId) body.outerClothId = Number(selectedItems.OUTER.clothId);

        console.log("🚀 빈 슬롯 제외 최종 전송 데이터:", body);

        const response = await api.patch(`/api/presets/${presetId}`, body);
        
        if (response.status >= 200 && response.status < 300) {
            alert("코디가 성공적으로 수정되었습니다."); // 1. 알림창 띄우기
            navigate('/coordi/all'); // 2. 코디북 리스트로 이동
            } else {
            // 응답은 왔으나 기대한 상태가 아닐 때
            console.warn("예상치 못한 응답 상태:", response.status);
            }
        } catch (e: any) {
            console.error("PATCH 에러 상세:", e.response?.data);
            const errorDetail = e.response?.data?.message || "서버 에러(500)";
            alert(`수정 실패: ${errorDetail}`);
        }
    };

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      {/* 헤더 */}
      <div className="p-4 border-b flex justify-between items-center bg-white z-10">
        <button onClick={() => navigate(-1)} className="text-xl">←</button>
        <input 
          value={name} onChange={(e) => setName(e.target.value)}
          className="text-center font-bold text-lg border-b border-gray-200 outline-none focus:border-blue-500"
          placeholder="코디 이름"
        />
        <button onClick={handleComplete} className="text-blue-600 font-bold">완료</button>
      </div>

      {/* 코디 프리뷰 영역 */}
      <div className="bg-gray-50 p-6 flex justify-center border-b">
        <div className="grid grid-cols-2 gap-1 w-56 aspect-square bg-white rounded-3xl shadow-sm border p-2 overflow-hidden">
          {['TOP', 'BOTTOM', 'DRESS', 'OUTER'].map(slot => (
            <div key={slot} 
              onClick={() => setActiveSlot(slot)}
              className={`flex items-center justify-center border-2 rounded-xl overflow-hidden transition-all
                ${activeSlot === slot ? 'border-blue-500 bg-blue-50' : 'border-gray-100'}`}
            >
              {selectedItems[slot] ? (
                <ClothItem item={selectedItems[slot]} />
              ) : (
                <span className="text-[10px] text-gray-300 font-bold">{slot}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 의상 선택 리스트 (등록하기와 동일한 UI) */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-bold text-gray-500">{activeSlot} 카테고리</span>
          <span className="text-xs text-gray-400">아이템을 클릭하여 교체</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {clothesList
            .filter(c => c.category === activeSlot)
            .map(cloth => (
              <div key={cloth.clothId} onClick={() => handleSelect(cloth)}
                className={`aspect-square rounded-xl border-2 overflow-hidden transition-all
                  ${selectedItems[activeSlot]?.clothId === cloth.clothId ? 'border-blue-500 shadow-md' : 'border-transparent bg-gray-50'}`}
              >
                <ClothItem item={cloth} />
              </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CoordiEdit;