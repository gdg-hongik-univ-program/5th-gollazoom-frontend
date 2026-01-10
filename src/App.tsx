import { useState } from 'react'
import './App.css'
import './index.css'
import Closet from './pages/closet/Closet';
import AddClothes from './pages/closet/AddClothes';
import AllClothes from './pages/closet/AllClothes';
import CoordiSave from './pages/closet/CoordiSave';
import AllCoordi from './pages/closet/AllCoordi';

function App() {
  const [view, setView] = useState<string>('main'); 

return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-start">
      <div className="w-full max-w-[430px] min-h-screen bg-white shadow-md flex flex-col">
        
        {/* 메인 메뉴 (Closet) */}
        {view === 'main' && (
          <Closet onNavigate={(id: string) => setView(id)} />
        )}
        
        {/* 모든 의상 페이지 */}
        {view === 'all-clothes' && (
          <AllClothes onBack={() => setView('main')} />
        )}

        {/* 의상 등록 페이지 */}
        {view === 'add-clothes' && (
          <AddClothes onBack={() => setView('main')} />
        )}

        {/* 코디 저장 페이지 */}
        {view === 'coordi-save' && (
          <CoordiSave onBack={() => setView('main')} />
        )}

        {/* 모든 코디 페이지 */}
        {view === 'all-coordi' && (
          <AllCoordi onBack={() => setView('main')} />
        )}

      </div>
    </div>
  );
}

export default App
