import { Outlet } from 'react-router-dom';

const MobileLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-start">
      <div className="w-full max-w-[430px] min-h-screen bg-white shadow-md flex flex-col relative">
        <Outlet />
      </div>
    </div>
  );
};

export default MobileLayout;