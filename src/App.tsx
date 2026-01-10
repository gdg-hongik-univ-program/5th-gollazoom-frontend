import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/Login';
import SignupPage from './pages/Signup';
import DeleteuserPage from './pages/Deleteuser';
import ChangePw from './pages/Changepw';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/deleteuser" element={<DeleteuserPage />} />
      <Route path="/change-password" element={<ChangePw />} />
    </Routes>
  );
}

export default App;