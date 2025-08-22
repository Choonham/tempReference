import {createAction, handleActions} from "redux-actions";
import createRequestSaga, {createRequestActionTypes} from "../saga/createRequestSaga";
import * as api from "../apis/api";
import {takeLatest, takeEvery} from 'redux-saga/effects';

const [SEND_CONN_TEST, SEND_CONN_TEST_SUCCESS, SEND_CONN_TEST_FAILURE] = createRequestActionTypes('connTestState/SEND_CONN_TEST');
const [SEND_CONN_TEST_COMP, SEND_CONN_TEST_COMP_SUCCESS, SEND_CONN_TEST_COMP_FAILURE] = createRequestActionTypes('connTestState/SEND_CONN_TEST_COMP');
const INIT_CONN_TEST = 'connTestState/INIT_CONN_TEST';

let index = 0;

export const sendConnTest = createAction(SEND_CONN_TEST, (ip, port, i) => {
    index = i;
    return {
        ip,
        port
    }
});

export const sendConnTest4Comp = createAction(SEND_CONN_TEST_COMP, (ip, port) => {
    return {
        ip,
        port
    }
});

export const initConnTest = createAction(INIT_CONN_TEST);

const sendConnTestSaga = createRequestSaga(SEND_CONN_TEST, api.sendConnectTest);
const sendConnTestSaga4Comp = createRequestSaga(SEND_CONN_TEST_COMP, api.sendConnectTest);

export function* connTestSaga() {
    yield takeEvery(SEND_CONN_TEST, sendConnTestSaga);
    yield takeEvery(SEND_CONN_TEST_COMP, sendConnTestSaga4Comp);
}

const initialState = {
    connTestList: [false, false, false, false, false, false],
    connTest: -1
};

const connTestState = handleActions(
    {
        [INIT_CONN_TEST]: () => {
            return {
                connTestList: [false, false, false, false, false, false],
                connTest: -1
            }
        },
        [SEND_CONN_TEST_SUCCESS]: (state, {payload}) => {
            return {
                ...state,
                connTestList: state.connTestList.map((e, i) => i === index ? payload.success : e
                )
            }
        },
        [SEND_CONN_TEST_FAILURE]: (state, {payload}) => {
            return {
                ...state,
                connTestList: state.connTestList.map((e, i) => i === index ? false : e
                )
            }
        },
        [SEND_CONN_TEST_COMP_SUCCESS]: (state, {payload}) => {
            return {
                ...state,
                connTest: payload.success ? 1 : 0
            }
        },
        [SEND_CONN_TEST_COMP_FAILURE]: (state, {payload}) => {
            return {
                ...state,
                connTest: false
            }
        }
    },
    initialState
)

export default connTestState;