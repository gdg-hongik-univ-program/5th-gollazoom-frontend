import { useState, useRef } from "react";
import album from '../../assets/icons/album.png';
import camera from '../../assets/icons/camera.png';
import { COLOR_OPTIONS, SEASON_OPTIONS, CATEGORY_OPTIONS } from '../../data/constants';

interface AddClothesProps { onBack: () => void; }

const BASE_URL = 'http://192.168.xxx.xxx:8080';

const AddClothes = ({ onBack }: AddClothesProps) => {
  const [image, setImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [category, setCategory] = useState('');
  const [season, setSeason] = useState('');
  const [rainOk, setRainOk] = useState(true);
  const [color, setColor] = useState('');
  const [memo, setMemo] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const albumRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    if (!imageFile || !category || !season) {
      alert("각 정보는 반드시 입력되어야 합니다.");
      return;
    }
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('category', category);
    formData.append('season', season);
    formData.append('color', color);
    formData.append('rainOk', String(rainOk));
    formData.append('memo', memo);

    try {
      const response = await fetch(`${BASE_URL}/api/closet`, {
        method: 'POST',
        headers: { 'Authorization': 'Bearer {accessToken}' },
        body: formData
      });
      const result = await response.json();
      if (result.success) {
        alert(result.message || "옷이 추가되었어요.");
        setIsSubmitted(true);
      } else {
        alert("등록 실패: " + result.message);
      }
    } catch (error) {
      console.error("서버 전송 오류:", error);
      alert("서버와 연결할 수 없습니다.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  if (isSubmitted) {
    return (
      <div className="p-10 flex flex-col items-center text-center gap-5">
        <div className="text-5xl">✅</div>
        <h2 className="text-xl font-bold">의상이 등록되었습니다.</h2>
        <button onClick={() => { setImage(null); setIsSubmitted(false); }} className="w-full p-4 bg-blue-600 text-white rounded-xl font-bold">추가로 의상 등록하기</button>
        <button onClick={onBack} className="w-full p-4 bg-white text-gray-500 border border-gray-200 rounded-xl font-bold">옷장으로 돌아가기</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white overflow-y-auto">
      <div className="flex items-center gap-3 p-6 border-b sticky top-0 bg-white z-10">
        <button onClick={onBack} className="text-2xl">←</button>
        <h3 className="text-xl font-bold">의상 등록하기</h3>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        {!image ? (
          <div className="flex flex-col gap-4">
            <div onClick={() => albumRef.current?.click()} className="h-[160px] border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center bg-gray-50 cursor-pointer">
              <img src={album} className="w-12 h-12 mb-2 opacity-40 object-contain" alt="앨범" />
              <span className="text-gray-500 font-bold text-sm text-center">앨범에서 선택</span>
            </div>
            <div onClick={() => cameraRef.current?.click()} className="h-[160px] border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center bg-gray-50 cursor-pointer">
              <img src={camera} className="w-12 h-12 mb-2 opacity-40 object-contain" alt="카메라" />
              <span className="text-gray-500 font-bold text-sm text-center">직접 촬영하기</span>
            </div>
          </div>
        ) : (
          /* 등록 상세 정보 폼 */
          <div className="flex flex-col gap-6">
            <div className="relative w-full aspect-square rounded-3xl overflow-hidden bg-gray-100 shadow-inner">
              <img src={image} className="w-full h-full object-cover" alt="preview" />
              <button onClick={() => setImage(null)} className="absolute top-4 right-4 w-9 h-9 bg-black/50 text-white rounded-full flex items-center justify-center font-bold">✕</button>
            </div>
            
            <div className="flex flex-col gap-5 pb-10">
              <div>
                <label className="block text-sm font-bold text-gray-500 mb-2">카테고리</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="" disabled>선택하세요</option>
                  {CATEGORY_OPTIONS.map((opt: any) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-500 mb-2">계절</label>
                <select value={season} onChange={(e) => setSeason(e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 outline-none">
                  <option value="" disabled>선택하세요</option>
                  {SEASON_OPTIONS.map((opt: any) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-500 mb-2 font-bold">비 올 때 입어도 되나요?</label>
                <div className="flex gap-6 mt-1">
                  <label className="flex items-center gap-2"><input type="radio" checked={rainOk === true} onChange={() => setRainOk(true)} /> 예</label>
                  <label className="flex items-center gap-2"><input type="radio" checked={rainOk === false} onChange={() => setRainOk(false)} /> 아니오</label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-500 mb-2">색상</label>
                <select value={color} onChange={(e) => setColor(e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 outline-none">
                  <option value="" disabled>색상을 선택하세요</option>
                  {COLOR_OPTIONS.map((opt: any) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-500 mb-2">메모</label>
                <textarea value={memo} onChange={(e) => setMemo(e.target.value)} placeholder="메모를 입력하세요" className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 h-24 resize-none outline-none" />
              </div>

              <button 
                onClick={handleSubmit}
                style={{ backgroundColor: '#0055ff' }} 
                className="w-full p-5 bg-[#0055ff] text-white rounded-2xl font-bold text-lg shadow-xl active:scale-95 transition-all cursor-pointer"
              >
                등록하기
              </button>
            </div>
          </div>
        )}
      </div>
      <input type="file" ref={albumRef} className="hidden" accept="image/*" onChange={handleFileChange} />
      <input type="file" ref={cameraRef} className="hidden" accept="image/*" capture="environment" onChange={handleFileChange} />
    </div>
  );
};

export default AddClothes;