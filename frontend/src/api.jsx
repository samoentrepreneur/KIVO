import axios from "axios";


const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

api.interceptors.request.use(
    (config) => {
        if (!navigator.onLine) {
            return Promise.reject(new Error("No internet connection"));
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
