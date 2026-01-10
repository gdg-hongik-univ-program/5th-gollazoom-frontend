import clothes from '../../assets/icons/clothes.png'; // 경로가 맞는지 꼭 확인!
import allClothes from '../../assets/icons/all-clothes.png';
import coordi from '../../assets/icons/coordi.png';
import allCoordi from '../../assets/icons/all-coordi.png';

interface ClosetProps {
  onNavigate: (id: string) => void;
}

function Closet({ onNavigate }: ClosetProps) {
  const categories = [
    { id: 'add-clothes', name: '의상 등록하기', icon: clothes },
    { id: 'coordi-save', name: '코디 저장하기', icon: coordi },
    { id: 'all-clothes', name: '모든 의상', icon: allClothes },
    { id: 'all-coordi', name: '모든 코디', icon: allCoordi },
  ];

  return (
    // 전체 컨테이너: 세로 정렬, 간격 12px, 패딩 20px
    <div className="flex flex-col gap-3 p-5">
      {categories.map((category) => (
        <button 
          key={category.id} 
          onClick={() => onNavigate(category.id)}
          // 버튼 스타일: 가로 정렬, 아이템 중앙, 간격 15px, 패딩, 흰 배경, 테두리, 둥근 모서리
          className="flex items-center gap-[15px] px-5 py-[15px] bg-white border border-[#eee] rounded-[15px] shadow-sm active:bg-gray-50 transition-colors"
        >
          <img 
            src={category.icon} 
            alt={category.name} 
            style={{ width: '40px', height: '40px' }} // Tailwind가 안 먹힐 경우를 대비한 강제 고정
            className="w-10 h-10 object-contain" 
            /><span className="text-base font-medium text-[#333]">{category.name}</span>
        </button>
      ))}
    </div>
  );
}

export default Closet;