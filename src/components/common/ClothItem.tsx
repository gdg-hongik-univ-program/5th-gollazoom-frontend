import { COLOR_OPTIONS } from '../../data/constants';

interface ClothItemProps {
  item: {
    imageUrl: string;  
    category?: string;     
    subCategory?: string;  
    color?: string;  
    colorCode?: string;
    hasWashing?: boolean; 
  };
  className?: string;      
}

const QUICK_PREFIX = "https://quickupload/";

const ClothItem = ({ item, className = "w-full h-full" }: ClothItemProps) => {
  const url = (item.imageUrl || "").trim();

  // ✅ quick 판단은 startsWith로 고정
  const isQuickAdd = !url || url.startsWith(QUICK_PREFIX) || 
                     url.includes("quickupload");

  // ✅ 기본값
  let category = (item.category || 'TOP').toUpperCase();
  let subCategory = (item.subCategory || 'T_SHIRT').toUpperCase();

  // ✅ quickupload URL이면 prefix 제거 후 안전 파싱
  if (url.startsWith(QUICK_PREFIX)) {
    const path = url.slice(QUICK_PREFIX.length); // TOP/T_SHIRT/145abc.png
    const [c, s] = path.split('/');
    if (c) category = c.toUpperCase();
    if (s) subCategory = s.toUpperCase();
  }

  // ✅ 색상 보정
  const colorOption = COLOR_OPTIONS.find(opt => opt.value === item.color);
  const rawColor = item.colorCode || colorOption?.hex || 'F3F4F6';
  const finalColor = rawColor.startsWith('#') ? rawColor : `#${rawColor}`;

  if (isQuickAdd) {
    const iconUrl = new URL(
      `../../assets/icons/${category}/${subCategory}.png`,
      import.meta.url
    ).href;

    return (
      <div className={`relative flex items-center justify-center bg-gray-50 rounded-xl overflow-hidden ${className}`}>
        <div 
          className="absolute inset-0 w-full h-full" 
          style={{
            backgroundColor: finalColor,
            maskImage: `url("${iconUrl}")`,
            WebkitMaskImage: `url("${iconUrl}")`,
            maskSize: '70%',
            maskRepeat: 'no-repeat',
            maskPosition: 'center',
            backgroundSize: '70%',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
          }}
        />
      </div>
    );
  }

  // 사진 등록(S3 URL)
  return (
    <div className={`relative w-full h-full ${className} bg-gray-100 rounded-xl`}>
      <img 
        src={url} 
        className="w-full h-full object-cover rounded-xl" 
        alt="의상" 
        onError={(e) => { e.currentTarget.style.opacity = '0'; }}
      />
    </div>
  );
};

export default ClothItem;