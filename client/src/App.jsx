import './App.css';
import { Routes, Route } from 'react-router';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import SummaryPage from './pages/SummaryPage';
import ChangelogPage from './pages/ChangelogPage';

const App = () => {
  return (
    <Routes>
      <Route index element={<HomePage />} />
      <Route path="/summary" element={<SummaryPage />} />
      <Route path="/changelog" element={<ChangelogPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;
