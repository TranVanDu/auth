import { combineReducers } from "redux";
import user from "../reducers/AuthReducer";

const reducers = combineReducers({
    user,
});

export default reducers;
