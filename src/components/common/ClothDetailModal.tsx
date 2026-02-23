import React, { useState } from 'react';
import { CATEGORY_OPTIONS, SEASON_OPTIONS, type Option } from '../../data/constants';
import { deleteCloth, updateCloth, type UpdateClothRequest } from '../../api/closet';
import ClothItem from '../../components/common/ClothItem';
import AlertModal from '../../components/modal/Alert'; 
import ConfirmModal from '../../components/common/ConfirmModal';

export interface ClothData {
  clothId: number | string;
  imageUrl: string;
  category: string;
  season: string;
  isRaining: boolean;
  memo?: string;
  color?: string;        
  subCategory?: string;  
  colorCode?: string;
  createAt?: string; // 명세서에 포함된 생성일자
}

interface ClothDetailModalProps {
  data: ClothData;
  onClose: () => void;
  onRefresh: () => void;
}

const ClothDetailModal = ({ data, onClose, onRefresh }: ClothDetailModalProps) => {
  // const [category, setCategory] = useState(data.category);
  // const [season, setSeason] = useState(data.season);
  // const [isRaining, setIsRaining] = useState(data.isRaining);
  // const [memo, setMemo] = useState(data.memo || '');

  // 카테고리와 계절을 한글 라벨로 변환
  const categoryLabel = CATEGORY_OPTIONS.find(opt => opt.value === data.category)?.label || data.category;
  
  // 계절이 "SPRING,SUMMER"처럼 올 경우를 대비해 처리
  const seasonLabels = data.season.split(',').map(s => 
    SEASON_OPTIONS.find(opt => opt.value === s)?.label || s
  ).join(', ');

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

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

  const executeDelete = async () => {
    setIsConfirmOpen(false);
    try {
        await deleteCloth(String(data.clothId));
        showAlert("옷이 성공적으로 삭제되었습니다.", "success", () => {
          onRefresh();
          onClose();
        });
      } catch (e) {
      console.error(e);
      showAlert("삭제에 실패했습니다.", "error");
    }
  };

  // const handleUpdate = async () => {
  //   try {
  //     // 1. 퀵등록 여부 확인 (URL 패턴으로 판단)
  //     const isQuickAdd = data.imageUrl.includes('quickupload');
      
  //     let updateData: FormData | UpdateClothRequest;

  //     if (isQuickAdd) {
  //       // 2-1. 퀵등록 수정 데이터 구성 (JSON)
  //       updateData = {
  //         category,
  //         season,
  //         color: data.color || "", // 기존 color 유지 혹은 선택 기능 추가 필요
  //         memo,
  //         imageUrl: data.imageUrl, // 기존 퀵등록 URL 유지
  //         subCategory: data.subCategory || "",
  //         colorCode: data.colorCode || "",
  //         isRaining,
  //       };
  //     } else {
  //       // 2-2. 일반 사진 수정 데이터 구성
  //       const formData = new FormData();
  //       formData.append('category', category);
  //       formData.append('season', season);
  //       // formData.append('season', selectedSeasons.join(','));
  //       // formData.append('color', selectedColors.join(','));
  //       formData.append('isRaining', String(isRaining));
  //       formData.append('memo', memo);
  //       formData.append('subCategory', ""); // 추가
  //       formData.append('colorCode', "");   // 추가
  //       updateData = formData;
  //     }

  //     await updateCloth(String(data.clothId), updateData);
  //     alert("의상 정보가 수정되었습니다.");
  //     onRefresh();
  //     onClose();
  //   } catch (e) {
  //     console.error(e);
  //     alert("수정에 실패했습니다.");
  //   }
  // };

  // return (
  //   // 배경 오버레이: 고정 위치, 검은색 반투명, 중앙 정렬
  //   <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1100]">
  //     {/* 모달 본체: 너비 90%, 흰색 배경, 둥근 모서리, 패딩, 최대 높이 설정 */}
  //     <div className="w-[90%] max-w-[400px] bg-white rounded-[20px] p-5 max-h-[90vh] overflow-y-auto shadow-2xl">
  //       <div className="flex justify-between items-center mb-4">
  //         <h4 className="font-bold text-lg">의상 정보</h4>
  //         <button onClick={onClose} className="text-2xl leading-none">&times;</button>
  //       </div>

        
  //       {/* 모달 내부 이미지 부분 수정 */}
  //       <div className="w-full aspect-square mb-4 bg-gray-50 rounded-2xl overflow-hidden shadow-inner">
  //         <ClothItem item={data} />
  //       </div>

  //       <div className="space-y-4">
  //         <div className="flex flex-col gap-1.5">
  //           <label className="text-sm font-semibold text-gray-600">카테고리</label>
  //           <select 
  //             value={category} 
  //             onChange={(e) => setCategory(e.target.value)} 
  //             className="w-full p-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
  //           >
  //             {CATEGORY_OPTIONS.map((opt: Option) => (
  //               <option key={opt.value} value={opt.value}>{opt.label}</option>
  //             ))}
  //           </select>
  //         </div>

  //         <div className="flex flex-col gap-1.5">
  //           <label className="text-sm font-semibold text-gray-600">계절</label>
  //           <select 
  //             value={season} 
  //             onChange={(e) => setSeason(e.target.value)} 
  //             className="w-full p-2.5 rounded-xl border border-gray-200 bg-gray-50"
  //           >
  //             {SEASON_OPTIONS.map((opt: Option) => (
  //               <option key={opt.value} value={opt.value}>{opt.label}</option>
  //             ))}
  //           </select>
  //         </div>

  //         <div className="flex flex-col gap-1.5">
  //           <label className="text-sm font-semibold text-gray-600">비 선호도</label>
  //           <div className="flex gap-4 mt-1">
  //             <label className="flex items-center gap-2 cursor-pointer">
  //               <input type="radio" checked={isRaining} onChange={() => setIsRaining(true)} className="w-4 h-4" /> 
  //               <span className="text-sm">예</span>
  //             </label>
  //             <label className="flex items-center gap-2 cursor-pointer">
  //               <input type="radio" checked={!isRaining} onChange={() => setIsRaining(false)} className="w-4 h-4" /> 
  //               <span className="text-sm">아니오</span>
  //             </label>
  //           </div>
  //         </div>

  //         <div className="flex flex-col gap-1.5">
  //           <label className="text-sm font-semibold text-gray-600">메모</label>
  //           <textarea 
  //             value={memo} 
  //             onChange={(e) => setMemo(e.target.value)} 
  //             placeholder="의상에 대한 메모를 입력하세요"
  //             className="w-full p-2.5 rounded-xl border border-gray-200 bg-gray-50 h-20 resize-none focus:outline-none" 
  //           />
  //         </div>
  //       </div>

  //       {/* 하단 버튼 그룹 */}
  //       <div className="flex gap-3 mt-6">
  //         <button 
  //           onClick={handleDelete} 
  //           className="flex-1 p-3.5 text-red-500 border border-red-200 rounded-2xl font-bold hover:bg-red-50 transition-colors"
  //         >
  //           삭제하기
  //         </button>
  //         <button
  //           onClick={handleUpdate} 
  //           className="flex-[1.5] p-3.5 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 shadow-md transition-colors"
  //         >
  //           수정 완료
  //         </button>
  //       </div>
  //     </div>
  //   </div>
  // );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1100] p-4">
      <div className="w-full max-w-[400px] bg-white rounded-[24px] p-6 max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-center mb-5">
          <h4 className="font-bold text-xl text-gray-800">의상 상세 정보</h4>
          <button onClick={onClose} className="text-3xl text-gray-400 hover:text-gray-600 leading-none">&times;</button>
        </div>

        {/* 의상 이미지 영역 */}
        <div className="w-full aspect-square mb-6 bg-gray-50 rounded-2xl overflow-hidden shadow-inner border border-gray-100">
          <ClothItem item={data} />
        </div>

        {/* 정보 리스트 영역 */}
        <div className="space-y-5">
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-bold text-blue-500 uppercase tracking-wider">Category</span>
            <p className="text-lg font-medium text-gray-900 border-b border-gray-100 pb-2">{categoryLabel}</p>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-bold text-blue-500 uppercase tracking-wider">Season</span>
            <div className="flex gap-2 flex-wrap pt-1 pb-2 border-b border-gray-100">
              {data.season.split(',').map((s, index) => {
                // 영문 값을 한글 라벨로 변환
                const label = SEASON_OPTIONS.find(opt => opt.value === s.trim())?.label || s;
                return (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-semibold"
                  >
                    {label}
                  </span>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-bold text-blue-500 uppercase tracking-wider">Rainy Day Wearable</span>
            <p className="text-lg font-medium text-gray-900 border-b border-gray-100 pb-2">
              {data.isRaining ? "🌧️ 비 오는 날 가능" : "☀️ 맑은 날 권장"}
            </p>
          </div>

          {data.memo && data.memo !== "string" && (
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-bold text-blue-500 uppercase tracking-wider">Memo</span>
              <div className="bg-gray-50 p-4 rounded-xl text-gray-700 leading-relaxed text-sm italic">
                "{data.memo}"
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <button 
            onClick={() => setIsConfirmOpen(true)} 
            className="flex-1 p-3.5 text-red-500 border border-red-200 rounded-2xl font-bold hover:bg-red-50 transition-colors"
          >
            의상 삭제하기
          </button>
        </div>
      </div>

      <ConfirmModal 
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={executeDelete}
        message="옷을 삭제할까요? 삭제한 옷은 다시 복구할 수 없습니다."
      />

      <AlertModal 
        isOpen={alertState.isOpen}
        onClose={alertState.onConfirm}
        message={alertState.message}
        type={alertState.type}
      />
    </div>
  );

};

export default ClothDetailModal;