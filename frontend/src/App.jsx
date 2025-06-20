import { useContext } from 'react';
import { ToastContainer } from 'react-toastify';
import { HabitContext } from './context/HabitContext';
import { Route, Routes, Navigate } from 'react-router-dom';
import NavBar from './components/NavBar';
import Habits from "./pages/Habits";
import LandingPage from './pages/LandingPage';
import SignIn from './pages/SignIn';
import Register from './pages/Register';

const App = () => {
  const { token } = useContext(HabitContext);

  return (
    <>
      <ToastContainer />
      <NavBar />
      <Routes>
        {token ? (
          <Route path='/Habits' element={<Habits />} />
        ) : (
          <>
            <Route path='/' element={<LandingPage />} />
            <Route path='/login' element={<SignIn />} />
            <Route path='/register' element={<Register />} />
          </>
        )}
        <Route path='*' element={<Navigate to={token ? '/Habits' : '/'} />} />
      </Routes>
    </>
  );
};

export default App;
