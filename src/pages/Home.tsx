import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sun, Sparkles, ChevronRight, Shirt, Calendar } from 'lucide-react';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const recommendations = [
    { id: 1, name: '네이비 코트', category: '아우터', img: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=200&h=200&fit=crop' },
    { id: 2, name: '화이트 셔츠', category: '상의', img: 'https://images.unsplash.com/photo-1621072156002-e2fccdc0b176?w=200&h=200&fit=crop' },
    { id: 3, name: '베이지 슬랙스', category: '하의', img: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=200&h=200&fit=crop' },
    { id: 4, name: '브라운 로퍼', category: '신발', img: 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=200&h=200&fit=crop' },
  ];

  return (
    <div className="flex flex-col gap-8 p-6 bg-white">
      
      {/* 헤더 & 날씨 섹션 */}
      <header className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 leading-tight">오늘의 추천 스타일</h1>
          <p className="text-sm font-medium text-gray-500 mt-1">겨울 시즌</p>
        </div>
        <div className="flex flex-col items-center bg-yellow-50 px-3 py-2 rounded-xl">
          <Sun className="text-yellow-500 fill-yellow-500" size={24} />
          <span className="text-xs font-bold text-gray-700 mt-1">5°C</span>
        </div>
      </header>

      {/* 추천 스타일 슬라이더 */}
      <section>
        <div className="flex gap-3 overflow-x-auto pb-4 -mx-6 px-6 scrollbar-hide snap-x">
          {recommendations.map((item) => (
            <div key={item.id} className="snap-center min-w-[140px] flex flex-col gap-2">
              <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 border border-gray-100 shadow-sm relative group">
                <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{item.category}</span>
                <p className="text-sm font-bold text-gray-800">{item.name}</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* 날씨 코멘트 배너 */}
        <div className="mt-2 bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-center justify-center gap-2 text-blue-600 shadow-sm">
          <Sparkles size={16} className="fill-blue-200" />
          <span className="text-xs font-bold">맑은 날씨에 적합한 조합입니다</span>
        </div>
      </section>

      {/* 퀵 메뉴 (옷장 / 캘린더) */}
      <section className="grid grid-cols-2 gap-4">
        {/* 옷장 바로가기 */}
        <button 
          onClick={() => navigate('/closet')}
          className="bg-white p-5 rounded-[24px] border border-gray-100 shadow-sm text-left group hover:border-blue-200 transition-all relative overflow-hidden"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center text-white mb-3 shadow-md group-hover:scale-110 transition-transform">
            <Shirt size={20} fill="currentColor" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">옷장</h3>
          <p className="text-xs text-gray-400 mt-1">내 옷들을 관리하세요</p>
          <div className="mt-4 flex items-center text-xs font-bold text-gray-300 group-hover:text-pink-500 transition-colors">
            바로가기 <ChevronRight size={14} />
          </div>
        </button>

        {/* 캘린더 바로가기 */}
        <button 
          onClick={() => navigate('/calendar')} // 추후 캘린더 페이지 생성 필요
          className="bg-white p-5 rounded-[24px] border border-gray-100 shadow-sm text-left group hover:border-green-200 transition-all relative overflow-hidden"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-green-500 rounded-2xl flex items-center justify-center text-white mb-3 shadow-md group-hover:scale-110 transition-transform">
            <Calendar size={20} fill="currentColor" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">캘린더</h3>
          <p className="text-xs text-gray-400 mt-1">스타일 일정을 확인하세요</p>
          <div className="mt-4 flex items-center text-xs font-bold text-gray-300 group-hover:text-green-500 transition-colors">
            바로가기 <ChevronRight size={14} />
          </div>
        </button>
      </section>

      {/* 통계 */}
      <section className="border border-gray-100 rounded-[24px] p-6 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-6">이번 주 통계</h3>
        <div className="flex justify-between items-center">
          <StatItem value={18} label="깨끗한 옷" color="text-green-500" />
          <div className="w-[1px] h-8 bg-gray-100"></div>
          <StatItem value={6} label="빨래중인 옷" color="text-orange-500" />
          <div className="w-[1px] h-8 bg-gray-100"></div>
          <StatItem value={5} label="이번 주 착용" color="text-purple-500" />
        </div>
      </section>

      {/* 최근 활동 */}
      <section className="border border-gray-100 rounded-[24px] p-6 shadow-sm mb-4">
        <h3 className="text-lg font-bold text-gray-900 mb-6">최근 활동</h3>
        <div className="flex flex-col gap-0">
          <ActivityItem 
            text="네이비 코트 착용" date="오늘" 
            dotColor="bg-blue-500" isLast={false} 
          />
          <ActivityItem 
            text="그레이 가디건 세탁 완료" date="어제" 
            dotColor="bg-green-500" isLast={false} 
          />
          <ActivityItem 
            text="새 옷 3벌 추가" date="3일 전" 
            dotColor="bg-purple-500" isLast={true} 
          />
        </div>
      </section>
    </div>
  );
};

const StatItem = ({ value, label, color }: { value: number, label: string, color: string }) => (
  <div className="flex flex-col items-center gap-1 flex-1">
    <span className={`text-2xl font-black ${color}`}>{value}</span>
    <span className="text-[11px] font-bold text-gray-400">{label}</span>
  </div>
);

const ActivityItem = ({ text, date, dotColor, isLast }: { text: string, date: string, dotColor: string, isLast: boolean }) => (
  <div className="flex gap-4 relative pb-8 last:pb-0">
    {/* 타임라인 라인 */}
    {!isLast && <div className="absolute left-[5px] top-2 bottom-0 w-[2px] bg-gray-100"></div>}
    
    {/* 도트 */}
    <div className={`relative z-10 w-3 h-3 rounded-full border-2 border-white shadow-sm shrink-0 ${dotColor}`}></div>
    
    {/* 텍스트 */}
    <div className="-mt-1.5">
      <p className="text-sm font-bold text-gray-800">{text}</p>
      <span className="text-xs font-medium text-gray-400">{date}</span>
    </div>
  </div>
);

export default Home;