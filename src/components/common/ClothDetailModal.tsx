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
}

interface ClothDetailModalProps {
  data: ClothData;
  onClose: () => void;
  onRefresh: () => void;
}

const ClothDetailModal = ({ data, onClose, onRefresh }: ClothDetailModalProps) => {
  const [category, setCategory] = useState(data.category);
  const [season, setSeason] = useState(data.season);
  const [isRaining, setIsRaining] = useState(data.isRaining);
  const [memo, setMemo] = useState(data.memo || '');

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

  const handleUpdate = async () => {
    try {
      const isQuickAdd = data.imageUrl.includes('quickupload');
      
      let updateData: FormData | UpdateClothRequest;

      if (isQuickAdd) {
        updateData = {
          category,
          season,
          color: data.color || "", 
          memo,
          imageUrl: data.imageUrl, 
          subCategory: data.subCategory || "",
          colorCode: data.colorCode || "",
          isRaining,
        };
      } else {
        const formData = new FormData();
        formData.append('category', category);
        formData.append('season', season);
        formData.append('isRaining', String(isRaining));
        formData.append('memo', memo);
        formData.append('subCategory', ""); 
        formData.append('colorCode', "");   
        updateData = formData;
      }

      await updateCloth(String(data.clothId), updateData);
      showAlert("의상 정보가 수정되었습니다.", "success", () => {
        onRefresh();
        onClose();
      });
    } catch (e) {
      console.error(e);
      showAlert("수정에 실패했습니다.", "error");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1100]">
      <div className="w-[90%] max-w-[400px] bg-white rounded-[20px] p-5 max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-bold text-lg">의상 정보</h4>
          <button onClick={onClose} className="text-2xl leading-none">&times;</button>
        </div>
        
        <div className="w-full aspect-square mb-4 bg-gray-50 rounded-2xl overflow-hidden shadow-inner">
          <ClothItem item={data} />
        </div>

        <div className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-600">카테고리</label>
            <select 
              value={category} 
              onChange={(e) => setCategory(e.target.value)} 
              className="w-full p-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {CATEGORY_OPTIONS.map((opt: Option) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-600">계절</label>
            <select 
              value={season} 
              onChange={(e) => setSeason(e.target.value)} 
              className="w-full p-2.5 rounded-xl border border-gray-200 bg-gray-50"
            >
              {SEASON_OPTIONS.map((opt: Option) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-600">비 선호도</label>
            <div className="flex gap-4 mt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" checked={isRaining} onChange={() => setIsRaining(true)} className="w-4 h-4" /> 
                <span className="text-sm">예</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" checked={!isRaining} onChange={() => setIsRaining(false)} className="w-4 h-4" /> 
                <span className="text-sm">아니오</span>
              </label>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-600">메모</label>
            <textarea 
              value={memo} 
              onChange={(e) => setMemo(e.target.value)} 
              placeholder="의상에 대한 메모를 입력하세요"
              className="w-full p-2.5 rounded-xl border border-gray-200 bg-gray-50 h-20 resize-none focus:outline-none" 
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button 
            onClick={() => setIsConfirmOpen(true)} 
            className="flex-1 p-3.5 text-red-500 border border-red-200 rounded-2xl font-bold hover:bg-red-50 transition-colors"
          >
            삭제하기
          </button>
          <button
            onClick={handleUpdate} 
            className="flex-[1.5] p-3.5 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 shadow-md transition-colors"
          >
            수정 완료
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