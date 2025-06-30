import { useContext } from 'react';
import { ToastContainer } from 'react-toastify';
import { Route, Routes, Navigate } from 'react-router-dom';

import { HabitContext } from './context/HabitContext';
import NavBar from './components/NavBar';
import Habits from './pages/Habits';
import LandingPage from './pages/LandingPage';
import SignIn from './pages/SignIn';
import Register from './pages/Register';

const App = () => {
  const { token } = useContext(HabitContext);

  return (
    <>
      {/* Global Toast Notifications */}
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />

      {/* Navigation */}
      <NavBar />

      {/* Main Routes */}
      <Routes>
        {token ? (
          <>
            <Route path="/habits" element={<Habits />} />
            <Route path="*" element={<Navigate to="/habits" replace />} />
          </>
        ) : (
          <>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<SignIn />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
    </>
  );
};

export default App;
