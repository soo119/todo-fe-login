import { useEffect, useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { Routes, Route, useNavigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import TodoPage from "./pages/TodoPage";
import RegisterPage from "./pages/RegisterPage";
import PrivateRoute from "./route/PrivateRoute";
import api from './utils/api';

function App() {
  const [user, setUser] = useState( null );
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const getUser = async() =>{
    try {
      const storedToken=sessionStorage.getItem('token');
      if(!storedToken){
        setUser(null);
        setLoading(false);                              // ⭐ 추가
        return;
      }
        const response=await api.get('/user/me');
        setUser(response.data.user)
    } catch (error) {
      setUser( null );
    } finally {
      setLoading(false);                                // ⭐ 추가
    }
  };


  useEffect(() => {
    getUser();
  }, []);

  const logout = () => {                        
    sessionStorage.removeItem("token");
    if (api?.defaults?.headers?.common) {
      delete api.defaults.headers.common.Authorization;
    }
    setUser(null);
    navigate("/login", { replace: true });
  };                                             



  return (
    <Routes>
      <Route path="/" element={
        <PrivateRoute user={user} loading={loading}>   {/* ⭐ 추가: loading 전달 */}
            <TodoPage user={user} onLogout={logout} />
          </PrivateRoute>
      }
      />
      <Route path="/register" element={<RegisterPage />} />

      <Route path="/login" element={<LoginPage user={user} setUser={setUser} />} />
    </Routes> 
  );
}

export default App;
