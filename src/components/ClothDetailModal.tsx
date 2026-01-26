import React, { useState } from 'react';
import { CATEGORY_OPTIONS, SEASON_OPTIONS } from '../data/constants';

interface ClothDetailModalProps {
  data: any;
  onClose: () => void;
  onRefresh: () => void;
}

const ClothDetailModal = ({ data, onClose, onRefresh }: ClothDetailModalProps) => {
  const [category, setCategory] = useState(data.category);
  const [season, setSeason] = useState(data.season);
  const [rainOk, setRainOk] = useState(data.rainOk);
  const [memo, setMemo] = useState(data.memo || '');

  const BASE_URL = 'http://192.168.xxx.xxx:8080'; // 팀 백엔드 주소로 수정 필요

  const handleDelete = async () => {
    if (!window.confirm("정말 이 옷을 삭제할까요?")) return;
    try {
      const response = await fetch(`${BASE_URL}/api/closet/${data.clothId}`, {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer {accessToken}' } // 실제 토큰 필요
      });
      if (response.status === 204 || response.ok) {
        alert("옷이 성공적으로 삭제되었습니다.");
        onRefresh();
        onClose();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    // 배경 오버레이: 고정 위치, 검은색 반투명, 중앙 정렬
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1100]">
      {/* 모달 본체: 너비 90%, 흰색 배경, 둥근 모서리, 패딩, 최대 높이 설정 */}
      <div className="w-[90%] max-w-[400px] bg-white rounded-[20px] p-5 max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-bold text-lg">의상 정보</h4>
          <button onClick={onClose} className="text-2xl leading-none">&times;</button>
        </div>

        {/* 이미지: 1:1 비율, 채우기, 둥근 모서리 */}
        <img src={data.imageUrl} className="w-full aspect-square object-cover rounded-2xl mb-4" alt="옷 사진" />

        <div className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-600">카테고리</label>
            <select 
              value={category} 
              onChange={(e) => setCategory(e.target.value)} 
              className="w-full p-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {/* opt 에러 해결: (opt: any) 추가 */}
              {CATEGORY_OPTIONS.map((opt: any) => (
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
              {/* opt 에러 해결: (opt: any) 추가 */}
              {SEASON_OPTIONS.map((opt: any) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-600">비 선호도</label>
            <div className="flex gap-4 mt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" checked={rainOk} onChange={() => setRainOk(true)} className="w-4 h-4" /> 
                <span className="text-sm">예</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" checked={!rainOk} onChange={() => setRainOk(false)} className="w-4 h-4" /> 
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

        {/* 하단 버튼 그룹 */}
        <div className="flex gap-3 mt-6">
          <button 
            onClick={handleDelete} 
            className="flex-1 p-3.5 text-red-500 border border-red-200 rounded-2xl font-bold hover:bg-red-50 transition-colors"
          >
            삭제하기
          </button>
          <button 
            className="flex-[1.5] p-3.5 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 shadow-md transition-colors"
          >
            수정 완료
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClothDetailModal;