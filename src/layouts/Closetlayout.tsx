import { Outlet } from 'react-router-dom';
import BottomNav from '../components/Home/Bottomnav';

const ClosetLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-start font-sans">
      <div className="w-full max-w-[430px] min-h-screen bg-white shadow-2xl flex flex-col relative">        
        <main className="flex-1 pb-[90px] overflow-y-auto scrollbar-hide">
          <Outlet />
        </main>        
        <BottomNav />
      </div>
    </div>
  );
};

export default ClosetLayout;