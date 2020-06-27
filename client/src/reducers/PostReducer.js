import {
    GET_ALL_POSTS,
    CREATE_POST,
    DELETE_POST,
    GET_SUB_POSTS,
    LIKE_POST,
    UN_LIKE_POST,
    LIKE_SUB_POST,
    UN_LIKE_SUB_POST,
    COMMENT_ALL_POST,
    COMMENT_SUB_POST,
} from "../actions/types";
const INIT_STATE = {
    allPosts: {
        posts: [],
        pagination: {
            currentPage: 1,
            total: 0,
            perPage: 10,
        },
    },
    myPosts: {
        posts: [],
        pagination: {
            currentPage: 1,
            total: 0,
            perPage: 10,
        },
    },
    subPosts: {
        posts: [],
        pagination: {
            currentPage: 1,
            total: 0,
            perPage: 10,
        },
    },
};

export default function (state = INIT_STATE, action) {
    switch (action.type) {
        case GET_ALL_POSTS: {
            return {
                ...state,
                allPosts: {
                    ...state.allPosts,
                    posts: action.payload.data,
                    pagination: {
                        ...state.allPosts.pagination,
                        total: parseInt(action.payload.total),
                    },
                },
            };
        }
        case GET_SUB_POSTS: {
            return {
                ...state,
                subPosts: {
                    ...state.subPosts,
                    posts: action.payload.data,
                    pagination: {
                        ...state.subPosts.pagination,
                        total: parseInt(action.payload.total),
                    },
                },
            };
        }
        case CREATE_POST: {
            return {
                ...state,
                allPosts: {
                    ...state.allPosts,
                    posts: [action.payload.post, ...state.allPosts.posts],
                    pagination: {
                        ...state.allPosts.pagination,
                        total: state.allPosts.pagination.total + 1,
                    },
                },
            };
        }
        case DELETE_POST: {
            let temp = state.allPosts.posts.filter((item) => {
                return item._id.toString() !== action.payload.toString();
            });
            return {
                ...state,
                allPosts: {
                    ...state.allPosts,
                    posts: temp,
                },
            };
        }
        case LIKE_POST: {
            let index = state.allPosts.posts.findIndex((item) => {
                return item._id.toString() === action.payload._id.toString();
            });
            let like_post = [...state.allPosts.posts];
            like_post[index] = {
                ...like_post[index],
                likes: [...action.payload.likes],
            };
            return {
                ...state,
                allPosts: {
                    ...state.allPosts,
                    posts: like_post,
                },
            };
        }
        case UN_LIKE_POST: {
            let index = state.allPosts.posts.findIndex((item) => {
                return item._id.toString() === action.payload._id.toString();
            });
            let unlike_post = [...state.allPosts.posts];
            unlike_post[index] = {
                ...unlike_post[index],
                likes: [...action.payload.likes],
            };
            return {
                ...state,
                allPosts: {
                    ...state.allPosts,
                    posts: unlike_post,
                },
            };
        }
        case LIKE_SUB_POST: {
            let index = state.subPosts.posts.findIndex((item) => {
                return item._id.toString() === action.payload._id.toString();
            });
            let like_post = [...state.subPosts.posts];
            like_post[index] = {
                ...like_post[index],
                likes: [...action.payload.likes],
            };
            return {
                ...state,
                subPosts: {
                    ...state.subPosts,
                    posts: like_post,
                },
            };
        }
        case UN_LIKE_SUB_POST: {
            let index = state.subPosts.posts.findIndex((item) => {
                return item._id.toString() === action.payload._id.toString();
            });
            let unlike_post = [...state.subPosts.posts];
            unlike_post[index] = {
                ...unlike_post[index],
                likes: [...action.payload.likes],
            };
            return {
                ...state,
                subPosts: {
                    ...state.subPosts,
                    posts: unlike_post,
                },
            };
        }
        case COMMENT_SUB_POST: {
            let index = state.subPosts.posts.findIndex((item) => {
                return item._id.toString() === action.payload._id.toString();
            });
            let post = [...state.subPosts.posts];
            post[index] = {
                ...post[index],
                comments: [...action.payload.comments],
            };
            return {
                ...state,
                subPosts: {
                    ...state.subPosts,
                    posts: post,
                },
            };
        }
        case COMMENT_ALL_POST: {
            let index = state.allPosts.posts.findIndex((item) => {
                return item._id.toString() === action.payload._id.toString();
            });
            console.log(index);
            let post = [...state.allPosts.posts];
            post[index] = {
                ...post[index],
                comments: [...action.payload.comments],
            };
            return {
                ...state,
                allPosts: {
                    ...state.allPosts,
                    posts: post,
                },
            };
        }
        default:
            return state;
    }
}
