import {createAction, handleActions} from "redux-actions";
import createRequestSaga, {createRequestActionTypes} from "../saga/createRequestSaga";
import {takeLatest} from 'redux-saga/effects';
import * as api from '../apis/api';

const CHANGE_FIELD = 'authState/CHANGE_FIELD';
const LOGOUT = 'authState/LOGOUT';
const [LOGIN, LOGIN_SUCCESS, LOGIN_FAILURE] = createRequestActionTypes('authState/LOGIN');

export const logout = createAction(LOGOUT);

const initialState = {
    login: {
        name: '',
        password: ''
    },
    auth: null,
    authError: null,
    success: false
};

export const changeField = createAction(
    CHANGE_FIELD,
    ({key, value}) => ({
        key,
        value,
    }),
);

export const login = createAction(LOGIN, (name, password, uuid) => {
    return {
        name,
        password,
        uuid,
    }
});

const loginSaga = createRequestSaga(LOGIN, api.login);

export function* authSaga() {
    yield takeLatest(LOGIN, loginSaga);
}

const authState = handleActions(
    {
        [CHANGE_FIELD]: (state, {payload: {key, value}}) => {
            return {
                ...state,
                login: {
                    ...state.login,
                    [key]: value,
                },
            }
        },
        [LOGIN_SUCCESS]: (state, {payload: auth}) => {
            localStorage.setItem('accessToken', auth.accessToken);

            return {
                ...state,
                authError: null,
                auth: auth,
                success: auth.success
            }
        },
        [LOGIN_FAILURE]: (state, {payload: error}) => {
            return {
                ...state,
                auth: null,
                authError: error,
                success: false
            }
        },
        [LOGOUT]: (state, action) => {
            return {
                ...state,
                auth: null,
                authError: null,
                success: false
            }
        }
    },
    initialState
)

export default authState;
