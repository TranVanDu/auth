import { combineReducers } from "redux";
import user from "../reducers/AuthReducer";
import post from "../reducers/PostReducer";

const reducers = combineReducers({
    user,
    post,
});

export default reducers;
