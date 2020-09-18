import { combineReducers } from 'redux';
import user from '../reducers/AuthReducer';
import post from '../reducers/PostReducer';
import profile from '../reducers/UserReducer';
import chat from './ChatReducer';

const reducers = combineReducers({
    user,
    post,
    profile,
    chat,
});

export default reducers;
