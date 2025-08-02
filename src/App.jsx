import './App.css';
import { Routes, Route } from 'react-router-dom';

import SplashPage from './pages/SplashPage/SplashPage';
import LoginPage from './pages/LoginPage/LoginPage';
import HomePage from './pages/HomePage/HomePage';
// import HomePage from './pages/HomePage/HomePage';
// import DetailPage from './pages/DetailPage/index';

function App() {

  return (
    <>
      <div className='app'>
        <Routes>
          <Route path='/' element={<SplashPage />}></Route>
          <Route path='/login' element={<LoginPage />}></Route>
          <Route path='/home' element={<HomePage />}></Route>
        </Routes>
      </div>
    </>
  );
};

export default App;
