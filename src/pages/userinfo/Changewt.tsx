import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { changeWorktime, getUserInfo } from '../../api/users';
import AlertModal from '../../components/modal/Alert';

const WorkTimePage = () => {
    const navigate = useNavigate();
    const [time, setTime] = useState("09:00");
    
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

    useEffect(() => {
        const fetchCurrentTime = async () => {
        try {
            const data = await getUserInfo();
            if (data && data.worktime) {
                setTime(data.worktime);
            }
        } catch (error) {
            console.error("기존 정보 로딩 실패:", error);
        }
        };
        fetchCurrentTime();
    }, []);  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await changeWorktime(time);   
      localStorage.setItem('worktime', time);   
      
      showAlert("출근 시간이 성공적으로 설정되었습니다!", "success", () => {
          navigate('/userinfo');
      });

    } catch (error) {
      console.error("출근 시간 설정 실패:", error);
      showAlert("시간 설정에 실패했습니다.\n다시 시도해주세요.", "error");
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

          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            변경 완료
          </button>
        </form>
        
        <div className="mt-4 text-center">
            <button 
                onClick={() => navigate('/userinfo')}
                className="text-sm text-gray-400 hover:text-gray-600 underline"
            >
                취소하고 돌아가기
            </button>
        </div>
      </div>

      <AlertModal 
          isOpen={alertState.isOpen}
          onClose={alertState.onConfirm}
          message={alertState.message}
          type={alertState.type}
      />
    </div>
  );
};

export default WorkTimePage;