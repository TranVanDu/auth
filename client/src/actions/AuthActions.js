import { REGISTER_USER, LOGIN_USER, GET_AUTH_USER, LOGOUT_USER } from "./types";
import api from "../api";
import { API_URL } from "../config/index";
import { toast } from "react-toastify";
import { setCookie, removeCookie } from "../helpers/session";

export const resgisterUser = (data) => (dispatch) => {
    return new Promise((reslove, reject) => {
        return api
            .post(`${API_URL}/signup`, data)
            .then((res) => {
                dispatch({ type: REGISTER_USER, payload: res.data });
                toast.success("Đăng ký tài khoản thành công");
                reslove(res.data);
            })
            .catch((err) => {
                console.log("error", err);
                toast.error(err.response.data.message);
                reject(err.response);
            });
    });
};

export const loginUser = (data) => (dispatch) => {
    return new Promise((reslove, reject) => {
        return api
            .post(`${API_URL}/login`, data)
            .then((res) => {
                // if (data.remember)
                //     setCookie("insta_token", res.data.data.token, 7);
                // else setCookie("insta_token", res.data.data.token, 1 / 24);
                setCookie("insta_token", res.data.data.token, 1 / 24);
                dispatch({ type: LOGIN_USER, payload: res.data.data });
                reslove(res.data);
            })
            .catch((err) => {
                console.log("error", err);
                toast.error(err.response.data.message);
                reject(err);
            });
    });
};
export const loginFacebook = (data) => (dispatch) => {
    return new Promise((reslove, reject) => {
        return api
            .post(`${API_URL}/login-facebook`, data)
            .then((res) => {
                setCookie("insta_token", res.data.data.token, 1 / 24);
                dispatch({ type: LOGIN_USER, payload: res.data.data });
                reslove(res.data);
            })
            .catch((err) => {
                console.log("error", err);
                toast.error(err.response.data.message);
                reject(err);
            });
    });
};
export const loginGoogle = (data) => (dispatch) => {
    return new Promise((reslove, reject) => {
        return api
            .post(`${API_URL}/login-google`, data)
            .then((res) => {
                setCookie("insta_token", res.data.data.token, 1 / 24);
                dispatch({ type: LOGIN_USER, payload: res.data.data });
                reslove(res.data);
            })
            .catch((err) => {
                console.log("error", err);
                toast.error(err.response.data.message);
                reject(err);
            });
    });
};

export const logOut = () => (dispatch) => {
    return new Promise((reslove, reject) => {
        removeCookie("insta_token");
        dispatch({ type: LOGOUT_USER });
        toast.info("Logout success");
        reslove(true);
    });
};

export const getAuthUser = (data) => (dispatch) => {
    return new Promise((reslove, reject) => {
        return api
            .get(`${API_URL}/users/auth`)
            .then((res) => {
                dispatch({ type: GET_AUTH_USER, payload: res.data.data });
                reslove(res.data);
            })
            .catch((err) => {
                console.log("error", err);
                toast.error(err.response.data.message);
                reject(err);
            });
    });
};
