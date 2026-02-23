import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ClothItem from './ClothItem';
import api from '../../api/axios'; 
import AlertModal from '../../components/modal/Alert'; // 💡 AlertModal 추가
import ConfirmModal from '../../components/common/ConfirmModal'; // 💡 ConfirmModal 추가

interface CoordiClothData {
  slot: string;
  clothId: number;
  imageUrl: string;
  category: string;
  subCategory?: string; 
  color?: string;       
  season: string;
  isRaining: boolean;
}

export interface CoordiData {
  presetId: string | number; 
  name: string; 
  items: CoordiClothData[]; 
}

interface CoordiDetailModalProps {
  data: CoordiData;
  onClose: () => void;
  onRefresh: () => void;
}

const CoordiDetailModal = ({ data, onClose, onRefresh }: CoordiDetailModalProps) => {
  const navigate = useNavigate();
  const [name, setName] = useState(data.name);

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

  const getItemBySlot = (slot: string) => data.items?.find(item => item.slot === slot);
 
  const executeDelete = async () => {
    setIsConfirmOpen(false); // 확인 모달 닫기
    
    if (!data.presetId) {
      showAlert("삭제할 코디의 ID를 찾을 수 없습니다.", "error");
      return;
    }

    try {
      const response = await api.delete(`/api/presets/${data.presetId}`);

      if (response.status === 200 || response.status === 204) {
        showAlert("코디가 성공적으로 삭제되었습니다.", "success", () => {
          onRefresh(); // 리스트 새로고침
          onClose();   // 모달 닫기
        });
      }
    } catch (e) {
      console.error("삭제 에러:", e);
      showAlert("삭제에 실패했습니다.", "error");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1100]">
      <div className="w-[90%] max-w-[400px] bg-white rounded-[20px] p-5 shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-bold text-lg">코디 정보</h4>
          <button onClick={onClose} className="text-2xl leading-none">&times;</button>
        </div>

        <div className="grid grid-cols-2 gap-1 aspect-square rounded-2xl overflow-hidden bg-gray-100 mb-4 border border-gray-200">
          {['TOP', 'BOTTOM', 'DRESS', 'OUTER'].map(slot => {
              const item = getItemBySlot(slot); 
              return (
                <div key={slot} className="bg-white">
                  {item ? (
                    <ClothItem item={item} />
                  ) : (
                    <div className="w-full h-full bg-gray-50 flex items-center justify-center text-[10px] text-gray-300">
                      EMPTY
                    </div>
                  )}
              </div>
            );
          })}
        </div>

        <div className="flex flex-col gap-1.5 mb-6">
          <label className="text-sm font-semibold text-gray-600">코디 이름</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            className="w-full p-2.5 rounded-xl border border-gray-200 bg-gray-50 outline-none"
            readOnly 
          />
        </div>

        <div className="flex gap-3">
          <button 
            onClick={() => setIsConfirmOpen(true)} // 💡 ConfirmModal 열기
            className="flex-1 p-3.5 text-red-500 border border-red-200 rounded-2xl font-bold hover:bg-red-50 transition-colors"
          >
            삭제하기
          </button>
          <button 
            onClick={() => navigate(`/coordi-save?edit=${data.presetId}`)} 
            className="flex-[1.5] p-3.5 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 shadow-md"
          >
            수정하기
          </button>
        </div>
      </div>

      <ConfirmModal 
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={executeDelete}
        message={"정말 이 코디를 삭제할까요?\n삭제된 정보는 복구할 수 없습니다."}
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

export default CoordiDetailModal;