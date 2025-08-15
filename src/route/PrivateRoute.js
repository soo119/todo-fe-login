// import React from 'react'
// import { Navigate } from 'react-router-dom';

// const PrivateRoute = ({ user,children }) => {
//   return user ? children : <Navigate to="/login" />;
// };

// export default PrivateRoute;


import { Navigate } from "react-router-dom";

export default function PrivateRoute({ user, loading, children }) {
  if (loading) return null;   // 혹은 로딩 스피너 표시
  if (!user) return <Navigate to="/login" replace />; // ⭐ 로그인 안 되어 있으면 이동
  return children;
}