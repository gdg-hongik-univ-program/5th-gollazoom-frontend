import { deleteUser, getUserInfo, getWashsetting, changeWashsetting } from "../../api/users";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import AlertModal from "../../components/modal/Alert";
import ConfirmModal from "../../components/common/ConfirmModal";

const UserInfo = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        username: "",
        nickname: "",
        worktime: "",
    });

    const [isUsingWash, setIsUsingWash] = useState(false);

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

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const data = await getUserInfo();
                setUser(data);
                const settingData = await getWashsetting();
                if (settingData && settingData.data) {
                    setIsUsingWash(settingData.data.isUsingWashUpTech);
                }
            } catch (error) {
                console.error("내 정보 로딩 실패:", error);
            }
        };
        fetchUserInfo();
    }, []);

    {/* 세탁 여부 변경 핸들러 */}
    const handleToggleWash = async (newState: boolean) => {
        setIsUsingWash(newState);
        try {
            await changeWashsetting(newState);
            localStorage.setItem('isUsingWashUpTech', String(newState));
        } catch (error) {
            console.error("설정 변경 실패:", error);
            setIsUsingWash(!newState); 
            showAlert("설정 변경에 실패했습니다.", "error");
        }
    };

    {/* 로그아웃 */}
    const handleLogout = () => {
        localStorage.clear(); 
        showAlert("로그아웃 되었습니다.", "success", () => {
            navigate("/login"); 
        });
    };

    const executeDelete = async () => {
        setIsConfirmOpen(false); // 실행 전 모달 닫기
        try {
            await deleteUser();
            localStorage.clear();
            showAlert("회원탈퇴가 완료되었습니다.", "success", () => {
                navigate("/login");
            });
        } catch (error) {
            console.error("Delete user failed:", error);
            showAlert("회원탈퇴에 실패하였습니다.\n다시 시도해주세요.", "error");
        }
    };

    return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 relative overflow-hidden">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden relative z-10">
        
        {/* 상단 헤더 영역 */}
        <div className="bg-blue-600 px-6 py-4">
          <h2 className="text-xl font-bold text-white text-center">내 정보</h2>
        </div>

        {/* 정보 표시 영역 */}
        <div className="p-8 space-y-6">
          
          {/* 아이디 */}
          <div className="border-b border-gray-100 pb-4">
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
              아이디
            </label>
            <div className="text-lg font-medium text-gray-800">
              {user?.username}
            </div>
          </div>

          {/* 닉네임 */}
          <div className="border-b border-gray-100 pb-4 flex justify-between items-center">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                닉네임
              </label>
              <div className="text-lg font-medium text-gray-800 tracking-widest">
                {user?.nickname}
              </div>
            </div>

            {/* 닉네임 변경 버튼 */}
            <button 
              className="text-sm text-blue-600 hover:text-blue-800 font-semibold px-3 py-1 rounded-md hover:bg-blue-50 transition"
              onClick={() => navigate('/change-nickname')}
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
                *******
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

          {/* 출근 시간 */}
          <div className="border-b border-gray-100 pb-4 flex justify-between items-center">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                출근 시간
              </label>
              <div className="text-lg font-medium text-gray-800 tracking-widest">
                {user?.worktime}
              </div>
            </div>
            {/* 출근 시간 변경 버튼 */}
            <button 
              className="text-sm text-blue-600 hover:text-blue-800 font-semibold px-3 py-1 rounded-md hover:bg-blue-50 transition"
              onClick={() => navigate('/change-worktime')}
            >
              변경
            </button>
          </div>

          {/* 세탁 기능 사용 여부 */}
          <div className="border-b border-gray-100 pb-4 flex justify-between items-center">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                세탁 기능
              </label>
              <div className={`text-lg font-medium tracking-widest ${isUsingWash ? 'text-blue-600' : 'text-gray-400'}`}>
              </div>
            </div>
            
            {/* 세탁 기능 스위치 */}
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={isUsingWash}
                onChange={(e) => handleToggleWash(e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>

        {/* 하단 버튼 영역 */}
        <div className="bg-gray-50 px-6 py-4 flex flex-col gap-3">
          <button
            onClick={() => setIsConfirmOpen(true)}
            className="w-full py-2.5 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 font-medium transition text-sm"
          >
            회원 탈퇴하기
          </button>
          <button
            onClick={handleLogout}
            className="w-full py-2.5 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-100 font-medium transition text-sm"
          >
            로그아웃
          </button>
        </div>
      </div>

      <ConfirmModal 
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={executeDelete}
        message={"정말로 회원탈퇴하시겠습니까? \n 탈퇴 시 모든 데이터가 삭제되며 \n 복구할 수 없습니다."}
      />

      <AlertModal 
        isOpen={alertState.isOpen}
        onClose={alertState.onConfirm}
        message={alertState.message}
        type={alertState.type}
      />
    </div>
  )
}

export default UserInfo;