import { GET_CONVERSATIONS } from '../actions/types';
const INIT_STATE = {
    conversations: [],
    pagination: {
        currentPage: 1,
        total: 0,
        perPage: 15,
    },
};

export default function (state = INIT_STATE, action) {
    switch (action.type) {
        case GET_CONVERSATIONS:
            return {
                ...state,
                conversations: action.payload.data.conversations,
                pagination: {
                    ...state.pagination,
                    total: parseInt(action.payload.total),
                },
            };

        default:
            return state;
    }
}
