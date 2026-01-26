import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { changePassword } from '../api/members';
import { AxiosError } from 'axios';

const ChangePw = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    currentpassword: '',
    newpassword: '',
    confirmNewPassword: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    /* 클라이언트 유효성 검사
    if (formData.newpassword !== formData.confirmNewPassword) {
      alert("새 비밀번호가 서로 일치하지 않습니다.");
      return;
    }
    if (formData.newpassword.length < 4) {
      alert("비밀번호는 4자리 이상이어야 합니다.");
      return;
    }
    */

    try {
      const userId = localStorage.getItem('id');
      if (!userId) {
        alert("로그인 정보가 유효하지 않습니다.");
        navigate('/login');
        return;
      }
      // 비밀번호 변경 API 호출
      await changePassword(userId, {
        currentpassword: formData.currentpassword,
        newpassword: formData.newpassword
      });
      alert("비밀번호가 성공적으로 변경되었습니다.");
      navigate('/deleteuser');

    } catch (error) {
      // API 실패 시
      const axiosError = error as AxiosError<{ message: string }>;
      const message = axiosError.response?.data?.message || "비밀번호 변경 실패";
      alert(message);
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
              name="currentpassword"
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
              name="newpassword"
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
            
            {/*
            {/* 비밀번호 일치 여부 실시간 안내 메시지 (선택 사항)
            {formData.newpassword && formData.confirmNewPassword && (
              <p className={`text-xs mt-1 ${formData.newpassword === formData.confirmNewPassword ? 'text-green-600' : 'text-red-500'}`}>
                {formData.newpassword === formData.confirmNewPassword ? "비밀번호가 일치합니다." : "비밀번호가 일치하지 않습니다."}
            </p>
            */}

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
            onClick={() => navigate('/deleteuser')}
            className="text-gray-500 hover:text-gray-700 text-sm font-medium underline"
          >
            내 정보로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePw;