import { combineReducers } from "redux";
import user from "../reducers/AuthReducer";
import post from "../reducers/PostReducer";
import profile from "../reducers/UserReducer";

const reducers = combineReducers({
    user,
    post,
    profile,
});

export default reducers;
