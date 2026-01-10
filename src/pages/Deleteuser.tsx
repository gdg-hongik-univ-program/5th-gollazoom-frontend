import { deleteUser } from "../api/members";
import { useNavigate } from "react-router-dom";

const DeleteUserPage = () => {
    const navigate = useNavigate();
    const handleDelete = async () => {
        if (!window.confirm("정말로 회원탈퇴를 진행하시겠습니까?")) return;
        try {
            const id = localStorage.getItem('id');
            if (!id) {
                alert("존재하지 않는 아이디입니다.");
                return;
            }
            await deleteUser(Number(id));
            localStorage.clear();
            alert("회원탈퇴가 완료되었습니다.");
            navigate("/login");
        } catch (error) {
            console.error("Delete user failed:", error);
            alert("회원탈퇴에 실패하였습니다. 다시 시도해주세요.");
        }
    };
    return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden">
        
        {/* 상단 헤더 영역 */}
        <div className="bg-blue-600 px-6 py-4">
          <h2 className="text-xl font-bold text-white text-center">내 정보 (My Page)</h2>
        </div>

        {/* 정보 표시 영역 */}
        <div className="p-8 space-y-6">
          
          {/* 아이디 */}
          <div className="border-b border-gray-100 pb-4">
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
              아이디
            </label>
            <div className="text-lg font-medium text-gray-800">
              test
            </div>
          </div>

          {/* 닉네임 */}
          <div className="border-b border-gray-100 pb-4 flex justify-between items-center">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                닉네임
              </label>
              <div className="text-lg font-medium text-gray-800 tracking-widest">
                hongik
              </div>
            </div>
            {/* 닉네임 변경 버튼 */}
            <button 
              className="text-sm text-blue-600 hover:text-blue-800 font-semibold px-3 py-1 rounded-md hover:bg-blue-50 transition"
              onClick={() => alert('추후 구현 예정 기능입니다.')}
            >
              변경
            </button>
          </div>

          {/* 비밀번호 (마스킹 처리) */}
          <div className="border-b border-gray-100 pb-4 flex justify-between items-center">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                비밀번호
              </label>
              <div className="text-lg font-medium text-gray-800 tracking-widest">
                ********
              </div>
            </div>
            {/* 비밀번호 변경 버튼 */}
            <button 
              className="text-sm text-blue-600 hover:text-blue-800 font-semibold px-3 py-1 rounded-md hover:bg-blue-50 transition"
              onClick={() => navigate('/change-password')}
            >
              변경
            </button>
          </div>

        </div>

        {/* 하단 버튼 영역 */}
        <div className="bg-gray-50 px-6 py-4 flex flex-col gap-3">
          <button
            onClick={() => navigate('/')}
            className="w-full py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition shadow-sm"
          >
            홈으로 돌아가기
          </button>
          
          <button
            onClick={handleDelete}
            className="w-full py-2.5 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 font-medium transition text-sm"
          >
            회원 탈퇴하기
          </button>
        </div>

      </div>
    </div>
  )
}

export default DeleteUserPage;