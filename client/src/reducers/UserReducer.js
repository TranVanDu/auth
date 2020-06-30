import { GET_USER, USER_FOLLOW, USER_UN_FOLLOW } from "../actions/types";
const INIT_STATE = {
    user: {},
    posts: [],
    pagination: {
        currentPage: 1,
        total: 0,
        perPage: 10,
    },
};

export default function (state = INIT_STATE, action) {
    switch (action.type) {
        case GET_USER:
            return {
                ...state,
                user: action.payload.data.user,
                posts: action.payload.data.posts,
                pagination: {
                    ...state.pagination,
                    total: parseInt(action.payload.total),
                },
            };
        case USER_FOLLOW: {
            return {
                ...state,
                user: action.payload.userfollow,
                pagination: {
                    ...state.pagination,
                    total: parseInt(action.payload.total),
                },
            };
        }
        case USER_UN_FOLLOW: {
            return {
                ...state,
                user: action.payload.userfollow,
                pagination: {
                    ...state.pagination,
                    total: parseInt(action.payload.total),
                },
            };
        }
        default:
            return state;
    }
}
