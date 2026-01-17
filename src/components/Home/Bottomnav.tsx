import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Shirt, Calendar, User } from 'lucide-react';

const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 탭 메뉴 정의 (MyPage는 현재 Deleteuser 페이지를 사용 중이므로 경로 연결)
  const navItems = [
    { id: 'home', label: '홈', path: '/', icon: Home },
    { id: 'closet', label: '옷장', path: '/closet', icon: Shirt },
    { id: 'calendar', label: '캘린더', path: '/calendar', icon: Calendar },
    { id: 'mypage', label: '나의 정보', path: '/deleteuser', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 w-full max-w-[430px] bg-white border-t border-gray-100 z-50 rounded-t-[20px] shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      <div className="flex justify-between items-center px-8 py-4">
        {navItems.map((item) => {
          const isActive = 
            item.path === '/' 
              ? location.pathname === '/' 
              : location.pathname.startsWith(item.path);

          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-1.5 transition-colors ${
                isActive ? 'text-blue-600' : 'text-gray-300'
              }`}
            >
              <item.icon 
                size={24} 
                strokeWidth={isActive ? 2.5 : 2}
                fill={isActive ? "currentColor" : "none"} // 활성화 시 아이콘 채우기 효과 (선택 사항)
                className={isActive ? "scale-110 transition-transform" : ""}
              />
              <span className="text-[10px] font-bold tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;