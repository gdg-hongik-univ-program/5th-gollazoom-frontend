import { useState } from "react";
import { login } from "../api/auth";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        name: "",
    });
    const navigate = useNavigate();
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }
    const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const data = await login(formData);
            console.log("Login successful:", data);
            localStorage.setItem('id', data.id);
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken);
            alert("로그인 성공");
            navigate("/deleteuser");
            } catch (error) {
            console.error("Login failed:", error);
            alert("아이디 비밀번호를 다시 확인하세요");
        }
    };
    return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">로그인</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">아이디</label>
            <input
              name="username"
              type="text"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="아이디를 입력하세요"
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
            <input
              name="password"
              type="password"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="비밀번호를 입력하세요"
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition duration-200"
          >
            로그인 하기
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          계정이 없으신가요?{' '}
          <span 
            onClick={() => navigate('/signup')} 
            className="text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
          >
            회원가입 하러가기
          </span>
        </div>
      </div>
    </div>
  );
}
export default LoginPage;