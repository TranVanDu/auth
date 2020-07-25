import {
    REGISTER_USER,
    LOGIN_USER,
    GET_AUTH_USER,
    LOGOUT_USER,
    UPDATE_AVATAR,
} from "./types";
import api from "../api";
import { API_URL } from "../config/index";
import { toast } from "react-toastify";
import { setCookie, removeCookie } from "../helpers/session";

export const resgisterUser = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        return api
            .post(`${API_URL}/signup`, data)
            .then((res) => {
                dispatch({ type: REGISTER_USER, payload: res.data });
                toast.success("Đăng ký tài khoản thành công");
                resolve(res.data);
            })
            .catch((err) => {
                console.log("error", err);
                toast.error(err.response.data.message);
                reject(err.response);
            });
    });
};

export const loginUser = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        return api
            .post(`${API_URL}/login`, data)
            .then((res) => {
                // if (data.remember)
                //     setCookie("insta_token", res.data.data.token, 7);
                // else setCookie("insta_token", res.data.data.token, 1 / 24);
                setCookie("insta_token", res.data.data.token, 1 / 24);
                dispatch({ type: LOGIN_USER, payload: res.data.data });
                toast.success("Đăng nhập thành công");
                resolve(res.data);
            })
            .catch((err) => {
                console.log("error", err);
                toast.error(err.response.data.message);
                reject(err);
            });
    });
};
export const loginFacebook = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        return api
            .post(`${API_URL}/login-facebook`, data)
            .then((res) => {
                setCookie("insta_token", res.data.data.token, 1 / 24);
                dispatch({ type: LOGIN_USER, payload: res.data.data });
                toast.success("Đăng nhập thành công");
                resolve(res.data);
            })
            .catch((err) => {
                console.log("error", err);
                if (err.response.data.status_code !== 401) {
                    toast.error("Đã có lỗi xảy ra");
                }
                reject(err);
            });
    });
};
export const loginGoogle = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        return api
            .post(`${API_URL}/login-google`, data)
            .then((res) => {
                setCookie("insta_token", res.data.data.token, 1 / 24);
                dispatch({ type: LOGIN_USER, payload: res.data.data });
                toast.success("Đăng nhập thành công");
                resolve(res.data);
            })
            .catch((err) => {
                console.log("error", err);
                if (err.response.data.status_code !== 401) {
                    toast.error("Đã có lỗi xảy ra");
                }

                reject(err);
            });
    });
};

export const logOut = () => (dispatch) => {
    return new Promise((resolve, reject) => {
        removeCookie("insta_token");
        dispatch({ type: LOGOUT_USER });
        toast.info("Logout success");
        resolve(true);
    });
};

export const getAuthUser = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        return api
            .get(`${API_URL}/users/auth`)
            .then((res) => {
                dispatch({ type: GET_AUTH_USER, payload: res.data.data });
                resolve(res.data);
            })
            .catch((err) => {
                console.log("error", err);
                toast.error(err.response.data.message);
                reject(err);
            });
    });
};

export const updateAvatar = (data, headers) => (dispatch) => {
    return new Promise((resolve, reject) => {
        return api
            .put(`${API_URL}/users/updateAvatar`, data, headers)
            .then((res) => {
                dispatch({ type: UPDATE_AVATAR, payload: res.data.data });
                toast.success("Cập nhật avatar thành công");
                resolve(res.data);
            })
            .catch((err) => {
                console.log("error", err);
                toast.error(err.response.data.message);
                reject(err);
            });
    });
};
