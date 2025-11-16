import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ReportsPage from './pages/ReportsPage';
import BlacklistPage from './pages/BlackListPage';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoutes';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<ReportsPage />} /> 
        <Route path="reports" element={<ReportsPage />} />
        <Route path="blacklist" element={<BlacklistPage />} />
      </Route>
    </Routes>
  );
}

export default App;