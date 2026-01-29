import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true, // Cookieleri gönder
});

// Request interceptor: Token ekle
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor: 403/401 hatalarında refresh token dene
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Eğer hata 403 ise (Token süresi dolmuş veya geçersiz) ve henüz tekrar denenmediyse
    if (
      (error.response.status === 403 || error.response.status === 401) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        // Refresh token endpoint'ine istek at
        const response = await axios.post(
          "http://localhost:3000/api/auth/refresh-token",
          {},
          {
            withCredentials: true,
          },
        );

        if (response.data.success) {
          const { accessToken } = response.data;
          localStorage.setItem("accessToken", accessToken);

          // Yeni token ile orijinal isteği tekrarla
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh token da geçersizse kullanıcıyı logout yap
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
