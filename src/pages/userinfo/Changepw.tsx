import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { changePassword } from '../../api/users';
import { AxiosError } from 'axios';
import AlertModal from '../../components/modal/Alert';

const ChangePw = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmNewPassword) {
      showAlert("새 비밀번호가 서로 일치하지 않습니다.", "error");
      return;
    }
    if (formData.newPassword.length < 4) {
      showAlert("비밀번호는 4자리 이상이어야 합니다.", "error");
      return;
    }

    try {
      const userId = localStorage.getItem('id');
      if (!userId) {
        showAlert("로그인 정보가 유효하지 않습니다.", "error", () => navigate('/login'));
        return;
      }
      // 비밀번호 변경 API 호출
      await changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword 
      });
      
      showAlert("비밀번호가 성공적으로 변경되었습니다.", "success", () => {
        navigate('/userinfo');
      });

    } catch (error) {
      // API 실패 시
      const axiosError = error as AxiosError<{ message: string }>;
      const message = axiosError.response?.data?.message || "비밀번호 변경 실패";
      showAlert(message, "error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">비밀번호 변경</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* 현재 비밀번호 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">현재 비밀번호</label>
            <input
              name="currentPassword"
              type="password"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="사용 중인 비밀번호 입력"
              onChange={handleChange}
            />
          </div>

          <div className="border-t border-gray-100 my-4"></div>

          {/* 새 비밀번호 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">새 비밀번호</label>
            <input
              name="newPassword"
              type="password"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="변경할 비밀번호 입력"
              onChange={handleChange}
            />
          </div>

          {/* 새 비밀번호 확인 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">새 비밀번호 확인</label>
            <input
              name="confirmNewPassword"
              type="password"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="변경할 비밀번호 다시 입력"
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition duration-200"
          >
            변경하기
          </button>
        </form>

        <div className="mt-4 text-center">
          <button 
            onClick={() => navigate('/userinfo')}
            className="text-gray-500 hover:text-gray-700 text-sm font-medium underline"
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

export default ChangePw;