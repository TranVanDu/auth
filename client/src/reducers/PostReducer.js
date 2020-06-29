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
    GET_POST,
    GET_MY_POSTS,
    LIKE_MY_POST,
    UN_LIKE_MY_POST,
    COMMENT_MY_POST,
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
    currentPost: {},
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

            let mytemp = state.myPosts.posts.filter((item) => {
                return item._id.toString() !== action.payload.toString();
            });

            return {
                ...state,
                allPosts: {
                    ...state.allPosts,
                    posts: temp,
                },
                myPosts: {
                    ...state.myPosts,
                    posts: mytemp,
                },
                currentPost:
                    state.currentPost._id === action.payload
                        ? {}
                        : state.currentPost,
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
                currentPost:
                    state.currentPost._id === action.payload._id
                        ? action.payload
                        : state.currentPost,
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
                currentPost:
                    state.currentPost._id === action.payload._id
                        ? action.payload
                        : state.currentPost,
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
                currentPost:
                    state.currentPost._id === action.payload._id
                        ? action.payload
                        : state.currentPost,
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
                currentPost:
                    state.currentPost._id === action.payload._id
                        ? action.payload
                        : state.currentPost,
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
                currentPost:
                    state.currentPost._id === action.payload._id
                        ? action.payload
                        : state.currentPost,
            };
        }
        case COMMENT_ALL_POST: {
            let index = state.allPosts.posts.findIndex((item) => {
                return item._id.toString() === action.payload._id.toString();
            });
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
                currentPost:
                    state.currentPost._id === action.payload._id
                        ? action.payload
                        : state.currentPost,
            };
        }
        case GET_POST: {
            return {
                ...state,
                currentPost: action.payload.data,
            };
        }
        case GET_MY_POSTS: {
            return {
                ...state,
                myPosts: {
                    ...state.myPosts,
                    posts: action.payload.data,
                    pagination: {
                        ...state.allPosts.pagination,
                        total: parseInt(action.payload.total),
                    },
                },
            };
        }
        case LIKE_MY_POST: {
            let index = state.myPosts.posts.findIndex((item) => {
                return item._id.toString() === action.payload._id.toString();
            });
            let like_post = [...state.myPosts.posts];
            like_post[index] = {
                ...like_post[index],
                likes: [...action.payload.likes],
            };
            return {
                ...state,
                myPosts: {
                    ...state.myPosts,
                    posts: like_post,
                },
                currentPost:
                    state.currentPost._id === action.payload._id
                        ? action.payload
                        : state.currentPost,
            };
        }
        case COMMENT_MY_POST: {
            let index = state.myPosts.posts.findIndex((item) => {
                return item._id.toString() === action.payload._id.toString();
            });
            let post = [...state.myPosts.posts];
            post[index] = {
                ...post[index],
                comments: [...action.payload.comments],
            };
            return {
                ...state,
                myPosts: {
                    ...state.myPosts,
                    posts: post,
                },
                currentPost:
                    state.currentPost._id === action.payload._id
                        ? action.payload
                        : state.currentPost,
            };
        }
        case UN_LIKE_MY_POST: {
            let index = state.myPosts.posts.findIndex((item) => {
                return item._id.toString() === action.payload._id.toString();
            });
            let unlike_post = [...state.myPosts.posts];
            unlike_post[index] = {
                ...unlike_post[index],
                likes: [...action.payload.likes],
            };
            return {
                ...state,
                myPosts: {
                    ...state.myPosts,
                    posts: unlike_post,
                },
                currentPost:
                    state.currentPost._id === action.payload._id
                        ? action.payload
                        : state.currentPost,
            };
        }

        default:
            return state;
    }
}
