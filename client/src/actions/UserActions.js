import { GET_USER, USER_FOLLOW, USER_UN_FOLLOW } from "./types";
import { toast } from "react-toastify";
import api from "../api/index";
import { API_URL } from "../config/index";

export const getCurrentUser = (id) => (dispatch) => {
    return new Promise((resolve, reject) => {
        return api
            .get(`${API_URL}/users/user/${id}`)
            .then((res) => {
                dispatch({ type: GET_USER, payload: res.data });
                resolve(res.data);
            })
            .catch((err) => {
                console.log("error", err);
                toast.error(err.response.data.message);
                reject(err);
            });
    });
};

export const follow = (data) => (dispatch) => {
    return new Promise((reslove, reject) => {
        return api
            .put(`${API_URL}/users/follow`, data)
            .then((res) => {
                dispatch({
                    type: USER_FOLLOW,
                    payload: res.data.data,
                });
                reslove(res.data.data);
            })
            .catch((err) => {
                console.log(err);
                if (err.response.data.status_code !== 401) {
                    toast.error("Đã có lỗi xảy ra");
                }
                // toast("Đã có lỗi");
                reject(err);
            });
    });
};

export const unfollow = (data) => (dispatch) => {
    return new Promise((reslove, reject) => {
        return api
            .put(`${API_URL}/users/unfollow`, data)
            .then((res) => {
                dispatch({
                    type: USER_UN_FOLLOW,
                    payload: res.data.data,
                });
                reslove(res.data.data);
            })
            .catch((err) => {
                console.log(err);
                if (err.response.data.status_code !== 401) {
                    toast.error("Đã có lỗi xảy ra");
                }
                // toast("Đã có lỗi");
                reject(err);
            });
    });
};
