import { useState } from "react";
import { signup } from "../api/auth";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
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
            const data = await signup(formData);
            console.log("Signup successful:", data);
            localStorage.setItem('id', data.id);
            localStorage.setItem('username', data.username);
            localStorage.setItem('name', data.name);
            navigate("/login");
        } catch (error) {
            console.error("Signup failed:", error);
            alert("회원가입에 실패하였습니다. 다시 시도해주세요.");
        }
    };
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">회원가입</h2>
        
          <form onSubmit={handleSubmit}>
            <label className="block text-sm font-medium text-gray-700 mb-1">아이디</label>
            <div className="flex gap-2 mb-5">
              <input
                name="username"
                type="text"
                required
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                placeholder="사용할 아이디"
                onChange={handleChange}
                
              />
              <button 
              className="text-sm border border-gray-300 text-blue-600 hover:text-blue-800 font-semibold px-3 py-1 rounded-md hover:bg-blue-50 transition"
              onClick={() => alert('추후 구현 예정 기능입니다.')}
              >
              중복확인
              </button>
              
            </div>

            <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
            <div className="flex gap-4 mb-5">
              <input
                name="password"
                type="password"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                placeholder="사용할 비밀번호"
                onChange={handleChange}
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">닉네임</label>
              <input
                name="name"
                type="text"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                placeholder="닉네임 (이름)"
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition duration-200"
            >
              가입하기
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            이미 계정이 있으신가요?{' '}
            <span 
              onClick={() => navigate('/login')} 
              className="text-green-600 hover:text-green-800 font-semibold cursor-pointer"
            >
              로그인 하러가기
            </span>
          </div>
        </div>
      </div>
  );
}
export default SignupPage;