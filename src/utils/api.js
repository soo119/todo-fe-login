import axios from "axios";

const api = axios.create({
  // baseURL: `${process.env.REACT_APP_API_BASE_URL}/api`,
  baseURL: `${(process.env.REACT_APP_API_BASE_URL || "").replace(/\/+$/, "")}/api`, //  변경
  headers: {
    "Content-Type": "application/json",
    // authorization: "Bearer " + sessionStorage.getItem("token"),
  },
});
/**
 * console.log all requests and responses
 */
// ⭐ 추가: 요청 인터셉터에서 "매 요청마다" 최신 토큰을 붙임
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // 대소문자 정확히
    } else if (config.headers && "Authorization" in config.headers) {
      delete config.headers.Authorization;
    }
    console.log("Starting Request", config);
    return config;
  },
  (error) => {
    console.log("REQUEST ERROR", error);
    return Promise.reject(error); // ⭐ 추가: 반드시 reject 반환
  }
);

// ✏️ 변경: 응답 인터셉터에서 error shape 안전하게 유지
api.interceptors.response.use(
  (response) => {
    console.log("Response:", response);
    return response;
  },
  (error) => {
    const status = error?.response?.status;
    const data = error?.response?.data;
    console.log("RESPONSE ERROR", status, data || error?.message);
    return Promise.reject(error); // ❗ 기존처럼 error를 data로 바꿔치기하지 않음
  }
);

export default api;