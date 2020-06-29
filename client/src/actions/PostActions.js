import {
    CREATE_POST,
    DELETE_POST,
    GET_ALL_POSTS,
    GET_SUB_POSTS,
    LIKE_POST,
    LIKE_SUB_POST,
    UN_LIKE_SUB_POST,
    UN_LIKE_POST,
    COMMENT_ALL_POST,
    COMMENT_SUB_POST,
    GET_POST,
    GET_MY_POSTS,
    LIKE_MY_POST,
    COMMENT_MY_POST,
    UN_LIKE_MY_POST,
} from "./types";
import api from "../api";
import { API_URL } from "../config/index";
import { toast } from "react-toastify";

export const getAllPosts = (filter) => (dispatch) => {
    return new Promise((resolve, reject) => {
        return api
            .get(`${API_URL}/posts/allposts`, { params: filter })
            .then((res) => {
                dispatch({ type: GET_ALL_POSTS, payload: res.data });
                resolve(res.data);
            })
            .catch((err) => {
                console.log("error", err);
                toast.error(err.response.data.message);
                reject(err.response);
            });
    });
};

export const getPost = (id) => (dispatch) => {
    return new Promise((resolve, reject) => {
        return api
            .get(`${API_URL}/posts/post/${id}`)
            .then((res) => {
                dispatch({ type: GET_POST, payload: res.data });
                resolve(res.data);
            })
            .catch((err) => {
                console.log("error", err);
                toast.error(err.response.data.message);
                reject(err.response);
            });
    });
};

export const createPost = (data, headers) => (dispatch) => {
    return new Promise((resolve, reject) => {
        return api
            .post(`${API_URL}/posts/createpost`, data, headers)
            .then((res) => {
                dispatch({ type: CREATE_POST, payload: res.data.data });
                toast.success("Tạo bài viết thành công");
                resolve(res.data);
            })
            .catch((err) => {
                console.log("error", err);
                toast.error(err.response.data.message);
                reject(err);
            });
    });
};
export const deletePost = (id) => (dispatch) => {
    return new Promise((resolve, reject) => {
        return api
            .delete(`${API_URL}/posts/deletepost/${id}`)
            .then((res) => {
                dispatch({ type: DELETE_POST, payload: id });
                toast.success("Xóa bài viết thành công");
                resolve(true);
            })
            .catch((err) => {
                console.log("error", err);
                toast.error("Đã có lỗi xảy ra");
                reject(err);
            });
    });
};
export const getSubPost = (filter) => (dispatch) => {
    return new Promise((resolve, reject) => {
        return api
            .get(`${API_URL}/posts/getsubposts`, { params: filter })
            .then((res) => {
                dispatch({ type: GET_SUB_POSTS, payload: res.data });
                resolve(res.data);
            })
            .catch((err) => {
                console.log("error", err);
                toast.error("Đã có lỗi xảy ra");
                reject(err.response);
            });
    });
};

export const likePost = (data, flag) => (dispatch) => {
    return new Promise((resolve, reject) => {
        return api
            .put(`${API_URL}/posts/like`, data)
            .then((res) => {
                if (flag === "all") {
                    dispatch({ type: LIKE_POST, payload: res.data.data });
                } else if (flag === "sub") {
                    dispatch({ type: LIKE_SUB_POST, payload: res.data.data });
                } else {
                    dispatch({ type: LIKE_MY_POST, payload: res.data.data });
                }
                resolve(res.data.data);
            })
            .catch((err) => {
                console.log("error", err);
                toast.error("Đã có lỗi xảy ra");
                reject(err);
            });
    });
};

export const unlikePost = (data, flag) => (dispatch) => {
    return new Promise((resolve, reject) => {
        return api
            .put(`${API_URL}/posts/unlike`, data)
            .then((res) => {
                if (flag === "all") {
                    dispatch({ type: UN_LIKE_POST, payload: res.data.data });
                } else if (flag === "sub") {
                    dispatch({
                        type: UN_LIKE_SUB_POST,
                        payload: res.data.data,
                    });
                } else {
                    dispatch({ type: UN_LIKE_MY_POST, payload: res.data.data });
                }
                resolve(res.data.data);
            })
            .catch((err) => {
                console.log("error", err);
                toast.error("Đã có lỗi xảy ra");
                reject(err);
            });
    });
};
export const commentPost = (data, flag) => (dispatch) => {
    return new Promise((resolve, reject) => {
        return api
            .put(`${API_URL}/posts/comments`, data)
            .then((res) => {
                if (flag === "all") {
                    dispatch({
                        type: COMMENT_ALL_POST,
                        payload: res.data.data,
                    });
                } else if (flag === "sub") {
                    dispatch({
                        type: COMMENT_SUB_POST,
                        payload: res.data.data,
                    });
                } else {
                    dispatch({ type: COMMENT_MY_POST, payload: res.data.data });
                }
                resolve(res.data.data);
            })
            .catch((err) => {
                console.log("error", err);
                toast.error("Đã có lỗi xảy ra");
                reject(err);
            });
    });
};
export const getMyPosts = (filter) => (dispatch) => {
    return new Promise((resolve, reject) => {
        return api
            .get(`${API_URL}/posts/myposts`, { params: filter })
            .then((res) => {
                dispatch({
                    type: GET_MY_POSTS,
                    payload: res.data,
                });

                resolve(res.data);
            })
            .catch((err) => {
                console.log("error", err);
                toast.error("Đã có lỗi xảy ra");
                reject(err.response);
            });
    });
};
