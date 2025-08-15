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
  const navigate = useNavigate();
  const getUser = async() =>{
    try {
      const storedToken=sessionStorage.getItem('token');
      if(!storedToken){
        setUser(null);
        return;
      }
        const response=await api.get('/api/user/me');
        setUser(response.data.user)
    } catch (error) {
      setUser( null );
    }

  }

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
        <PrivateRoute user={user}>
          <TodoPage user={user} onLogout={logout} />  {/* ⭐ 추가: onLogout prop 전달 */}
        </PrivateRoute>        
      }
      />
      <Route path="/register" element={<RegisterPage />} />

      <Route path="/login" element={<LoginPage user={user} setUser={setUser} />} />
    </Routes> 
  );
}

export default App;
