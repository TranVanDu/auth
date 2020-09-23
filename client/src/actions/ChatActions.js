import {
    CREATE_MESSAGE,
    GET_CONVERSATIONS,
    GET_CONVERSATION_DETAIL,
} from './types';
import { toast } from 'react-toastify';
import api from '../api/index';
import { getSocket } from '../socket';
import { API_URL } from '../config/index';

export const createMessage = (id, data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        return api
            .post(`${API_URL}/chat/${id}`, data)
            .then((res) => {
                dispatch({ type: CREATE_MESSAGE, payload: res.data });
                getSocket().emit(
                    'send-message',
                    res.data.data.conversation.message
                );
                resolve(res.data);
            })
            .catch((err) => {
                console.log('error', err);
                toast.error(err.response.data.message);
                reject(err);
            });
    });
};

export const getConversations = () => (dispatch) => {
    return new Promise((resolve, reject) => {
        return api
            .get(`${API_URL}/chat`)
            .then((res) => {
                dispatch({ type: GET_CONVERSATIONS, payload: res.data });
                resolve(res.data);
            })
            .catch((err) => {
                console.log('error', err);
                toast.error(err.response.data.message);
                reject(err);
            });
    });
};

export const getConversationDetails = (id, data) => (dispatch) => {
    return new Promise((reslove, reject) => {
        return api
            .get(`${API_URL}/chat/${id}`, { params: data })
            .then((res) => {
                dispatch({ type: GET_CONVERSATION_DETAIL, payload: res.data });
                reslove(res.data);
            })
            .catch((error) => {
                console.log('error', error);
                toast.error(error.response.data.message);
                reject(error);
            });
    });
};
