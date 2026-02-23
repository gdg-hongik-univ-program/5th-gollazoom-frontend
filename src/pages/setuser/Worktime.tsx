import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setWorkTime, changeWashsetting } from '../../api/users';

const WorkTimePage = () => {
  const navigate = useNavigate();
  const [time, setTime] = useState("09:00");
  const [isUsingWash, setIsUsingWash] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await setWorkTime(time);      
      await changeWashsetting(isUsingWash);
      localStorage.setItem('isUsingWashUpTech', String(isUsingWash));
      navigate('/'); 
    } catch (error) {
      console.error("출근 시간 설정 실패:", error);
      console.log(time);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
          출근 시간을 알려주세요 ⏰
        </h2>
        <p className="text-center text-gray-500 mb-8">
          설정하신 출근 시간에 맞춰<br />
          그날 입기 딱 좋은 옷을 추천해 드릴게요!
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="worktime" className="block text-sm font-medium text-gray-700 mb-2">
              출근 시간
            </label>
            <input
              id="worktime"
              type="time"
              required
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-lg text-center"
            />
          </div>

          {/* 세탁 기능 ON/OFF 토글 스위치 */}
          <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div>
              <span className="block text-sm font-bold text-gray-700">세탁 관리 기능</span>
              <span className="text-xs text-gray-500">밤 10시 알림 및 빨래통 아이콘 사용</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={isUsingWash}
                onChange={(e) => setIsUsingWash(e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
            </label>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            설정 완료 및 시작하기
          </button>
        </form>
        
        <div className="mt-4 text-center">
            <button 
                onClick={() => navigate('/')}
                className="text-sm text-gray-400 hover:text-gray-600 underline"
            >
                건너뛰기
            </button>
        </div>
      </div>
    </div>
  );
};

export default WorkTimePage;