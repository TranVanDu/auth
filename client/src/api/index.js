import axios from "axios";
import { getCookie, removeCookie } from "../helpers/session";
import { toast } from "react-toastify";
import { BASE_URL } from "../config/index";

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 15000,
    crossDomain: true,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
    },
});

api.interceptors.request.use(
    function (config) {
        let accessToken = getCookie("insta_token");
        // Do something before request is sent
        if (accessToken) {
            config.headers.common["Authorization"] = "Bearer " + accessToken;
        }
        return config;
    },
    function (error) {
        // Do something with request error
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.status_code === 401) {
            removeCookie("insta_token");
            toast.error("Phiên đã hết hạn. Vui lòng đăng nhập lại!");
            if (window.location.pathname !== "/login") {
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            }
        }
        // else if (error.response.status === 403) {
        //    NotificationManager.error("Bạn không được cấp quyền thực hiện thao tác này!");
        // }
        return Promise.reject(error);
    }
);
export default api;
