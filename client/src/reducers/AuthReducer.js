import {
    LOGIN_USER,
    REGISTER_USER,
    GET_AUTH_USER,
    LOGOUT_USER,
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
        case LOGOUT_USER:
            return { user: {}, isAuth: false };
        default:
            return state;
    }
}
