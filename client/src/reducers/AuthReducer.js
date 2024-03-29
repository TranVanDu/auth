import {
    LOGIN_USER,
    REGISTER_USER,
    GET_AUTH_USER,
    LOGOUT_USER,
    UPDATE_AVATAR,
    USER_UN_FOLLOW,
    USER_FOLLOW,
    UPDATE_PROFILE,
    CHANGE_PASSWORD,
} from "../actions/types";
const INIT_STATE = {
    user: {},
    isAuth: false,
};

export default function (state = INIT_STATE, action) {
    switch (action.type) {
        case REGISTER_USER:
            return { ...state, register: action.payload };
        case LOGIN_USER:
            return {
                ...state,
                user: action.payload.user,
                isAuth: action.payload.isAuth,
            };
        case GET_AUTH_USER:
            return {
                ...state,
                user: action.payload.user,
                isAuth: action.payload.isAuth,
            };
        case UPDATE_AVATAR:
            return {
                ...state,
                user: action.payload.user,
                isAuth: action.payload.isAuth,
            };
        case USER_FOLLOW:
            return {
                ...state,
                user: action.payload.user,
            };
        case USER_UN_FOLLOW:
            return {
                ...state,
                user: action.payload.user,
            };
        case LOGOUT_USER:
            return { user: {}, isAuth: false };
        case UPDATE_PROFILE: {
            return {
                ...state,
                user: action.payload.user,
            };
        }
        case CHANGE_PASSWORD: {
            return state;
        }
        default:
            return state;
    }
}
