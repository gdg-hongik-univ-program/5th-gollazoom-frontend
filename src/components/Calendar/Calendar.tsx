import React, { useEffect, useState } from 'react';
import { 
  format, addMonths, subMonths, 
  startOfMonth, endOfMonth, startOfWeek, endOfWeek, 
  isSameMonth, isSameDay, addDays, isBefore, isToday 
} from 'date-fns';
import hanger from '../../assets/icons/hanger.png';
import clothes from '../../assets/icons/clothes.png';
import ClothItem from '../../components/common/ClothItem';
import ConfirmModal from '../../components/common/ConfirmModal';
import { CATEGORY_OPTIONS, type Option } from '../../data/constants';
// import { MOCK_CLOTHES } from '../mocks/mockData';

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'detail' | 'create'| 'preset'>('detail');
  const [myPresets, setMyPresets] = useState<any[]>([]); // 코디 목록 저장용

  //서버 의상 목록을 저장할 상태 추가
  const [serverClothes, setServerClothes] = useState<any[]>([]);

  // 코디 작성을 위한 상세 선택 상태 관리, 객체 전체 저장하도록 수정
  const [tempSelectedItems, setTempSelectedItems] = useState<Record<string, any | null>>({
    TOP: null, BOTTOM: null, DRESS: null, OUTER: null
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectingCategory, setSelectingCategory] = useState<string | null>(null);

  // data 상태 내 items 타입 변경 (문자열 배열 -> 객체 배열)
  const [data, setData] = useState<Record<string, { 
    hasCoordi: boolean; 
    items: any[]; // imageUrl[] 에서 Cloth[] 로 변경
    wearId?: number // 서버에서 받은 고유 ID 저장용
  }>>({});

  // 팝업 상태 관리 추가
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingPresetId, setPendingPresetId] = useState<number | null>(null);


  // 착용 함수
  // const handleEditCoordi = () => {
  //   const dateKey = format(selectedDate, 'yyyy-MM-dd');
  //   const existingData = data[dateKey];

  //   if (existingData && existingData.items) {
  //     // 기존의 URL 배열을 순회하며 MOCK_CLOTHES에서 일치하는 객체(id, url)를 찾아 복구함
  //     const restoredItems: Record<string, {id: number, url: string} | null> = {
  //       TOP: null, BOTTOM: null, DRESS: null, OUTER: null
  //     };

  //     existingData.items.forEach(url => {
  //       const match = MOCK_CLOTHES.find(c => c.image === url);
  //       if (match) {
  //         restoredItems[match.category] = { id: match.id, url: match.image };
  //       }
  //     });

  //     setTempSelectedItems(restoredItems);
  //     setViewMode('create');
  //   }
  // };

  // 새로운 코디 만들기 함수
  const handleSaveCoordi = async () => {
    const dateKey = format(selectedDate, 'yyyy-MM-dd');
    const existingWearId = data[dateKey]?.wearId; // 기존 기록 ID 확인

    const clothIds = Object.values(tempSelectedItems)
      .filter(item => item !== null)
      .map(item => item!.id); // 숫자 ID만 추출

    if (clothIds.length === 0) {
      alert("최소 한 개 이상의 의상을 선택해야 합니다!");
      return;
    }

    try {
      // ID가 있으면 PATCH /api/wears/{wearId}, 없으면 POST /api/wears
      const url = existingWearId ? `/api/wears/${existingWearId}` : '/api/wears';
      const method = existingWearId ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          date: dateKey,
          clothIds: clothIds // 바뀔 옷 리스트
        })
      });

      const result = await response.json();
      
      if (result.success) { // "success": true 응답 확인
        alert(existingWearId ? "코디가 수정되었습니다!" : "코디가 저장되었습니다!");
        
        // 화면에 즉시 반영하기 위해 로컬 상태도 업데이트
        const dateKey = format(selectedDate, 'yyyy-MM-dd');
        setData(prev => ({
          ...prev,
          [dateKey]: {
            hasCoordi: true,
            wearId: existingWearId || result.wearId, // wearId 업데이트
            // 객체 그대로 저장하도록 수정
            items: Object.values(tempSelectedItems).filter(item => item !== null)
          }
        }));
        
        setTempSelectedItems({ TOP: null, BOTTOM: null, DRESS: null, OUTER: null });
        setViewMode('detail');
      }
    } catch (error) {
      console.error("저장 중 오류 발생:", error);
    }
  };

  // 저장된 코디에서 불러오기 함수
  const fetchMyPresets = async () => {
  try {
    const token = localStorage.getItem('authToken');
    const response = await fetch('http://192.168.158.60:8080/api/presets', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    setMyPresets(data);
    setViewMode('preset'); // 화면을 코디북 선택 창으로 전환
  } catch (e) {
    alert("코디북을 불러오지 못했습니다.");
  }
};

// 실제 서버에 등록을 요청하는 공통 함수 추가
const handleActualRegister = async (body: any) => {
  const token = localStorage.getItem('authToken');
  try {
    const response = await fetch('http://192.168.158.60:8080/api/wears', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(body)
    });
    if (response.ok) {
      alert("착용 등록 완료!");
      setViewMode('detail');
      fetchSelectedDateData(selectedDate);
    }
  } catch (e) {
    console.error("등록 실패:", e);
  } finally {
    setPendingPresetId(null);
  }
};

// 메인 핸들러 함수 수정
const handleFinalRegister = async (presetId?: number) => {
  const token = localStorage.getItem('authToken');
  const dateStr = format(selectedDate, 'yyyy-MM-dd');

  const body = presetId 
    ? { presetId, date: dateStr } 
    : { 
        topClothId: String(tempSelectedItems.TOP?.clothId || ""),
        bottomClothId: String(tempSelectedItems.BOTTOM?.clothId || ""),
        dressClothId: String(tempSelectedItems.DRESS?.clothId || ""),
        outerClothId: String(tempSelectedItems.OUTER?.clothId || ""),
        date: dateStr 
      };

  // --- 세탁 체크 로직 분기 ---

  // 프리셋 등록인 경우 (세탁 체크 API 필요)
  if (presetId) {
    try {
      const checkRes = await fetch(`http://192.168.158.60:8080/api/presets/${presetId}/washCheck`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const checkData = await checkRes.json();

      if (checkData.data?.hasWashing) {
        // 세탁 중인 옷이 있다면 팝업 띄우고 중단
        setPendingPresetId(presetId);
        setIsConfirmOpen(true);
        return; 
      }
    } catch (e) {
      console.error("세탁 체크 에러:", e);
    }
  }

  // 개별 등록이거나 세탁 중인 옷이 없는 프리셋인 경우
  handleActualRegister(body);
};

  // 날짜 선택 시 호출될 조회 함수
  const fetchSelectedDateData = async (date: Date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    try {
      const token = localStorage.getItem('authToken'); // 키 이름 authToken으로 확인 필요!
      const response = await fetch(`http://192.168.158.60:8080/api/wears?date=${dateKey}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const result = await response.json();

      // if문 내용 수정
      if (result && result.clothIds) {
        const coordiItems = result.clothIds.map((id: number) => {
        // clothId와 매칭되는 객체 전체를 찾음
          return serverClothes.find(c => c.clothId === id) || null;
        }).filter((item: any) => item !== null);

        setData(prev => ({
          ...prev,
          [dateKey]: {
            hasCoordi: true,
            wearId: result.wearId,
            items: coordiItems // 이제 객체 배열이 들어감
          }
        }));
      } else {
        setData(prev => ({
          ...prev,
          [dateKey]: { hasCoordi: false, items: [] }
        }));
      }
    } catch (error) {
      console.error("조회 실패:", error);
    }
  };

  // 삭제 함수
  const handleDeleteCoordi = async () => {
    const dateKey = format(selectedDate, 'yyyy-MM-dd');
    const wearId = data[dateKey]?.wearId;

    if (!wearId) return;

    if (window.confirm("정말 이 착용 기록을 삭제하시겠습니까?")) {
      try {
        const response = await fetch(`/api/wears/${wearId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });

        // 삭제 성공 시 204 No Content 응답 확인
        if (response.status === 204) {
          alert("삭제되었습니다.");
          setData(prev => {
            const newData = { ...prev };
            newData[dateKey] = { hasCoordi: false, items: [] };
            return newData;
          });
        }
      } catch (error) {
        console.error("삭제 중 오류 발생:", error);
      }
    }
  };

  useEffect(() => {
    // 월이 바뀌면 이전 달의 아이콘들을 화면에서 지움
    setData({});
    fetchSelectedDateData(startOfMonth(currentMonth));
  }, [currentMonth]);

  useEffect(() => {
    const fetchAllClothes = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch('http://192.168.158.60:8080/api/clothes', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const resData = await response.json();
        // 서버 응답 구조가 { items: [...] } 인지 확인 후 저장
        setServerClothes(resData.items || resData); 
      } catch (e) {
        console.error("의상 로드 실패:", e);
      }
    };
    fetchAllClothes();
  }, []);

  const renderDetailSection = () => {
    const dateKey = format(selectedDate, 'yyyy-MM-dd');
    const dayData = data[dateKey];
    const isPast = isBefore(selectedDate, new Date()) && !isToday(selectedDate);

    // --- [작성 모드]: CoordiSave.tsx의 로직과 유사 ---
    if (viewMode === 'create') {
      return (
        <div className="p-6 bg-white rounded-t-3xl shadow-lg flex-grow animate-slideUp">
          <div className="flex items-center mb-8">
            <button onClick={() => setViewMode('detail')} className="mr-4 text-xl">←</button>
            <h2 className="text-xl font-bold">코디 저장하기</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-12 max-w-[320px] mx-auto">
            {[
              { key: 'TOP', label: '상의' }, { key: 'BOTTOM', label: '하의' },
              { key: 'DRESS', label: '원피스' }, { key: 'OUTER', label: '아우터' }
            ].map((slot) => (
              <div 
                key={slot.key} 
                onClick={() => {
                  setSelectingCategory(slot.key);
                  setIsModalOpen(true);
                }}
                className="aspect-square border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center bg-[#F8FAFC] cursor-pointer"
              >
                {tempSelectedItems[slot.key] ? (
                  // 랜더링 수정
                  <ClothItem item={tempSelectedItems[slot.key]!} className="w-full h-full rounded-[28px]" />
                ) : (
                  <>
                    <img src={clothes} className="w-10 h-10 mb-2 opacity-30 object-contain" alt="아이콘" />
                    <span className="text-xs text-gray-400 font-medium">{slot.label}</span>
                  </>
                )}
              </div>
            ))}
          </div>

          <button 
            className="w-full py-4 bg-blue-500 text-white rounded-2xl font-bold text-lg shadow-lg active:scale-95 transition"
            onClick={handleSaveCoordi}
          >
            이 코디 저장하기
          </button>
        </div>
      );
    }

    if (viewMode === 'preset') {
      return(
        <div className="flex flex-col gap-4">
            <h4 className="font-bold text-sm text-gray-500">불러올 코디를 선택하세요</h4>
            <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto">
              {myPresets.map(preset => (
                <div 
                  key={preset.presetId} 
                  onClick={() => handleFinalRegister(preset.presetId)}
                  className="bg-white p-2 rounded-2xl border border-gray-100 shadow-sm active:scale-95 transition-all"
                >
                  <div className="grid grid-cols-2 gap-0.5 aspect-square rounded-xl overflow-hidden mb-2">
                    {preset.items.slice(0, 4).map((item: any, i: number) => (
                      <img key={i} src={item.imageUrl} className="w-full h-full object-cover" alt="p" />
                    ))}
                  </div>
                  <p className="text-[11px] font-bold text-center truncate">{preset.name}</p>
                </div>
              ))}
            </div>
            <button onClick={() => setViewMode('create')} className="text-gray-400 text-sm mt-2">뒤로가기</button>
          </div>
      )
    }

    // --- [상세 모드] ---
    return (
      <div className="p-6 bg-white rounded-t-3xl shadow-lg flex-grow">
        <h2 className="text-2xl font-bold mb-6">{format(selectedDate, 'M월 d일')}</h2>

        {dayData?.hasCoordi ? (
          /* 1. 코디가 있는 날 */
          <div className={`grid gap-3 w-full max-w-[300px] mx-auto animate-fadeIn ${
            dayData.items.filter(item => item !== "").length > 1 ? 'grid-cols-2' : 'grid-cols-1'
          }`}>
            {dayData.items.map((item, idx) => (
              item !== "" && (
                <div key={idx} className="aspect-square bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 flex items-center justify-center">
                  {/* 랜더링 수정 */}
                  <ClothItem item={item} />
                </div>
              )
            ))}

            {/* 오늘을 포함한 미래 날짜에만 수정 버튼 노출 */}
            {!isPast && (
              <div className="flex flex-col gap-2 w-full">
                <button 
                  className="w-full py-4 bg-gray-100 text-gray-700 rounded-xl font-bold active:scale-95 transition"
                  onClick={() => handleFinalRegister()}
                >
                  입을 코디 수정하기
                </button>
                <button 
                  className="w-full py-2 text-red-500 text-sm font-medium active:opacity-50 transition"
                  onClick={handleDeleteCoordi} // 삭제 함수 연결
                >
                  기록 삭제하기
                </button>
              </div>
            )}
          </div>
        ) : isPast ? (
          /* 2. 과거인데 코디가 없는 날*/
          <div className="flex flex-col items-center justify-center py-10 text-gray-400">
            <img src={hanger} alt="코디 없음" className="w-24 h-24 mb-4 opacity-30 object-contain" />
            <p className="text-lg font-medium tracking-tight text-gray-300">저장된 코디가 없습니다</p>
          </div>
        ) : (
          /* 3. 오늘/미래인데 코디가 없는 날 */
          <div className="flex flex-col gap-3">
            <button className="w-full py-4 bg-gray-100 rounded-xl font-bold text-gray-700 active:bg-gray-200 transition"
            onClick={fetchMyPresets}>
              저장된 코디에서 선택하기
            </button>
            {/* 배경 파란색으로 수정*/}
            <button 
              className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold active:bg-gray-800 transition"
              onClick={() => setViewMode('create')}
            >
              새로운 코디 만들기
            </button>
          </div>
        )}
      </div>
    );
  };

  // --- 모달 창: CoordiSave.tsx와 유사, 세탁 내용에 따라 수정 ---
  const renderModal = () => {
    // 1. 카테고리에 맞는 옷을 필터링하고 + 세탁 중인 옷을 리스트 아래로 정렬.
    const sortedClothes = serverClothes
      .filter(item => item.category === selectingCategory)
      .sort((a, b) => {
        const aStatus = a.washStatus === 'WASHING' ? 1 : 0;
        const bStatus = b.washStatus === 'WASHING' ? 1 : 0;
        return aStatus - bStatus; // 세탁 중인 옷이 뒤로 가게 함
      });

      // (추가)2. 현재 선택된 영문 카테고리 값(selectingCategory)에 해당하는 한국어 라벨 찾기
    const categoryLabel = CATEGORY_OPTIONS.find(
      (opt) => opt.value === selectingCategory
    )?.label || selectingCategory; // 찾지 못할 경우 대비해 기본값 설정

    return (
      <div className="fixed inset-0 bg-black/50 z-[2000] flex items-end justify-center">
        <div className="w-full max-w-[430px] bg-white rounded-t-[40px] p-8 h-[60vh] flex flex-col shadow-2xl">
          <div className="flex justify-between items-center mb-6 pb-4 border-b">
            <strong className="text-lg font-bold">{categoryLabel} 선택</strong>
            <button onClick={() => setIsModalOpen(false)} className="text-2xl text-gray-400">✕</button>
          </div>
          <div className="flex-1 overflow-y-auto grid grid-cols-3 gap-3">
            {sortedClothes.map((item) => (
              <div 
                key={item.clothId}
                onClick={() => {
                  // 세탁 중인 옷은 선택할 수 없도록 방어 로직 추가
                  if (item.washStatus === 'WASHING') {
                    alert("현재 세탁 중인 의상입니다.");
                    return;
                  }
                  setTempSelectedItems(prev => ({ 
                    ...prev, 
                    [item.category]: item 
                  }));
                  setIsModalOpen(false);
                }}
                className={`aspect-square rounded-xl overflow-hidden border cursor-pointer active:scale-95 transition-all
                  ${item.washStatus === 'WASHING' ? 'opacity-50 grayscale' : ''}`} // 세탁 중이면 흐리게 처리
              >
                {/* ClothItem의 hasWashing 프롭에 washStatus 조건을 연결합니다. */}
                <ClothItem item={{ 
                  ...item, 
                  hasWashing: item.washStatus === 'WASHING' 
                }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderHeader = () => (
    <div className="flex justify-between items-center p-4 border-b bg-white">
      <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2">&lt;</button>
      <div className="flex flex-col items-center">
        <span className="text-xs text-gray-500">{format(currentMonth, 'yyyy')}</span>
        <span className="text-xl font-bold">{format(currentMonth, 'M월')}</span>
      </div>
      <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2">&gt;</button>
    </div>
  );

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const isCurrentMonth = isSameMonth(cloneDay, monthStart);
        const isSelected = isSameDay(cloneDay, selectedDate);
        const dateKey = format(cloneDay, 'yyyy-MM-dd');
        const hasData = data[dateKey]?.hasCoordi;

        days.push(
          <div 
            key={cloneDay.toString()} 
            className={`h-24 border-t border-l flex flex-col items-center justify-start cursor-pointer transition-all
              ${!isCurrentMonth ? 'bg-gray-50 text-gray-300' : 'bg-white'} 
              ${isSelected ? 'ring-2 ring-inset ring-blue-500 bg-blue-50' : ''}`}
            onClick={() => {
              setSelectedDate(cloneDay);
              fetchSelectedDateData(cloneDay);
            }}
          >
            <span className={`text-xs mt-1 ${isToday(cloneDay) ? 'bg-blue-500 text-white rounded-full px-1' : ''}`}>
              {format(cloneDay, 'd')}
            </span>
            <div className="mt-2 text-2xl">
              {hasData ? '👕' : '✕'}
            </div>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(<div className="grid grid-cols-7" key={day.toString()}>{days}</div>);
      days = [];
    }
    return <div className="border-r border-b">{rows}</div>;
  };

  

  return (
    <div className="max-w-md mx-auto min-h-screen bg-white flex flex-col">
      {renderHeader()}
      {renderCells()}
      {renderDetailSection()}
      {isModalOpen && renderModal()}


      {/* 임시용, 차후 삭제 */}
      <button 
        onClick={() => setIsConfirmOpen(true)} 
        className="fixed bottom-20 right-4 z-[3000] bg-red-500 text-white p-4 rounded-full shadow-xl"
      >
        팝업 확인용
      </button>

      {/* 팝업 추가 */}
      <ConfirmModal 
        isOpen={isConfirmOpen}
        onClose={() => {
          setIsConfirmOpen(false);
          setPendingPresetId(null);
        }}
        onConfirm={() => {
          if (pendingPresetId) {
            const dateStr = format(selectedDate, 'yyyy-MM-dd');
            handleActualRegister({ presetId: pendingPresetId, date: dateStr });
          }
          setIsConfirmOpen(false);
        }}
        message={"세탁 중인 의상이 포함되어 있는 코디입니다.\n 정말로 입으시겠습니까?"}
      />
    </div>
  );
};

export default Calendar;