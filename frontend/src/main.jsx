import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import HabitContextProvider from './context/HabitContext.jsx';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <BrowserRouter>
    <HabitContextProvider>
      <App />
    </HabitContextProvider>
  </BrowserRouter>
);
