import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/Login';
import SignupPage from './pages/Signup';
import DeleteuserPage from './pages/Deleteuser';
import ChangePw from './pages/Changepw';
import Home from './pages/Home';
import Closet from './pages/closet/Closet';
import AddClothes from './pages/closet/AddClothes';
import AllClothes from './pages/closet/AllClothes';
import CoordiSave from './pages/closet/CoordiSave';
import AllCoordi from './pages/closet/AllCoordi';
import ClosetLayout from './layouts/Closetlayout';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/change-password" element={<ChangePw />} />

      <Route element={<ClosetLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/deleteuser" element={<DeleteuserPage />} />
        <Route path="/calendar" element={<div className="p-6 font-bold">캘린더 준비중</div>} />
        <Route path="/closet" element={<Closet />} />
        <Route path="/closet/all" element={<AllClothes />} />
        <Route path="/closet/add" element={<AddClothes />} />
        <Route path="/coordi/save" element={<CoordiSave />} />
        <Route path="/coordi/all" element={<AllCoordi />} />
      </Route>
    </Routes>
  );
}

export default App;