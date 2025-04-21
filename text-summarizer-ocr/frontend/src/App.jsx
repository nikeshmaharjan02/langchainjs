import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SummaryPage from './pages/SummaryPage';
import QAPage from './pages/QAPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Navigate to="/summary" />} />
        <Route path="/summary" element={<SummaryPage />} />
        <Route path="/qa" element={<QAPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
