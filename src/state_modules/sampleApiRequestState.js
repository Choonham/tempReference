import createRequestSaga from "../saga/createRequestSaga";
import {createAction, handleActions} from "redux-actions";
import * as api from '../apis/api';
import {takeLatest} from 'redux-saga/effects';

const GET_POST = 'sampleApiRequestState/GET_POST';
const GET_POST_SUCCESS = 'sampleApiRequestState/GET_POST_SUCCESS';

const GET_USERS = 'sampleApiRequestState/GET_USERS';
const GET_USERS_SUCCESS = 'sampleApiRequestState/GET_USERS_SUCCESS';

export const getPost = createAction(GET_POST, id => id);
export const getUsers = createAction(GET_USERS);

const getPostSaga = createRequestSaga(GET_POST, api.getPost);
const getUsersSaga = createRequestSaga(GET_USERS, api.getUsers);

export function* sampleSaga() {
    yield takeLatest(GET_POST, getPostSaga);
    yield takeLatest(GET_USERS, getUsersSaga);
}

const initialState = {
    post: null,
    users: null
};

const sampleApiRequestState = handleActions(
    {
        [GET_POST_SUCCESS]: (state, action) => {
            return {
                ...state,
                post: action.payload
            }
        },
        [GET_USERS_SUCCESS]: (state, action) => ({
            ...state,
            users: action.payload
        })
    },
    initialState
);

export default sampleApiRequestState;