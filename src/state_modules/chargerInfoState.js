import {createAction, handleActions} from "redux-actions";
import {RESULTS} from "./simulatorInfoState";
import createRequestSaga, {createRequestAction, createRequestActionTypes} from "../saga/createRequestSaga";
import * as api from "../apis/api";
import {takeLatest, takeEvery} from 'redux-saga/effects';

const ADD_CHARGER = 'chargerInfoState/ADD_CHARGER';
const REMOVE_CHARGER = 'chargerInfoState/REMOVE_CHARGER';
const GET_CHARGER_INFO = 'chargerInfoState/GET_CHARGER_INFO';
const UPDATE_CHARGER_INFO = 'chargerInfoState/UPDATE_CHARGER_INFO';
const [GET_CHARGER_LIST, GET_CHARGER_LIST_SUCCESS, GET_CHARGER_LIST_FAILURE] = createRequestActionTypes('chargerInfoState/GET_CHARGER_LIST');
const [GET_CHARGER_LIST_ONLY, GET_CHARGER_LIST_ONLY_SUCCESS, GET_CHARGER_LIST_ONLY_FAILURE] = createRequestActionTypes('chargerInfoState/GET_CHARGER_LIST_ONLY');
const [GET_CHARGER_INFO_DETAIL, GET_CHARGER_INFO_DETAIL_SUCCESS, GET_CHARGER_INFO_DETAIL_FAILURE] = createRequestActionTypes('chargerInfoState/GET_CHARGER_INFO_DETAIL');
const [SET_CHARGER_INFO, SET_CHARGER_INFO_SUCCESS, SET_CHARGER_INFO_FAILURE] = createRequestActionTypes('chargerInfoState/SET_CHARGER_INFO');
const [DELETE_CHARGER_PROPERTY, DELETE_CHARGER_PROPERTY_SUCCESS, DELETE_CHARGER_PROPERTY_FAILURE] = createRequestActionTypes('chargerInfoState/DELETE_CHARGER_PROPERTY');
const [DELETE_CHARGER, DELETE_CHARGER_SUCCESS, DELETE_CHARGER_FAILURE] = createRequestActionTypes('chargerInfoState/DELETE_CHARGER');

export const addCharger = createAction(ADD_CHARGER);
export const removeCharger = createAction(REMOVE_CHARGER);
export const getChargerInfo = createAction(GET_CHARGER_INFO);
export const updateChargerInfo = createAction(UPDATE_CHARGER_INFO);
export const getChargerList = createAction(GET_CHARGER_LIST);

export const getChargerListOnly = (callbacks) => {
    return createRequestAction(GET_CHARGER_LIST_ONLY, {}, callbacks);
};

export const setChargerInfo = (param, callbacks) => {
    return createRequestAction(SET_CHARGER_INFO, param, callbacks);
}

export const deleteChargerProperty = (param, callbacks) => {
    return createRequestAction(DELETE_CHARGER_PROPERTY, param, callbacks);
};

export const deleteCharger = (id, callbacks) => {
    return createRequestAction(DELETE_CHARGER, id, callbacks);
}

export const getChargerInfoDetail = (id, callbacks) => {
    return createRequestAction(GET_CHARGER_INFO_DETAIL, id, callbacks);
}

const getChargerListSaga = createRequestSaga(GET_CHARGER_LIST, api.getMainChargerList);
const getChargerListOnlySaga = createRequestSaga(GET_CHARGER_LIST_ONLY, api.getChargerListOnly);
const getChargerInfoDetailSaga = createRequestSaga(GET_CHARGER_INFO_DETAIL, api.getChargerInfo);
const setChargerInfoSaga = createRequestSaga(SET_CHARGER_INFO, api.setChargerInfo);
const deleteChargerPropertySaga = createRequestSaga(DELETE_CHARGER_PROPERTY, api.deleteChargerProperty);
const deleteChargerSaga = createRequestSaga(DELETE_CHARGER, api.deleteCharger);

export function* chargerSaga() {
    yield takeEvery(GET_CHARGER_LIST, getChargerListSaga);
    yield takeEvery(GET_CHARGER_LIST_ONLY, getChargerListOnlySaga);
    yield takeEvery(GET_CHARGER_INFO_DETAIL, getChargerInfoDetailSaga);
    yield takeEvery(SET_CHARGER_INFO, setChargerInfoSaga);
    yield takeEvery(DELETE_CHARGER_PROPERTY, deleteChargerPropertySaga);
    yield takeEvery(DELETE_CHARGER, deleteChargerSaga);
}

export const TEST_MODE = {
    full: 0,
    normal: 1
}

Object.freeze(TEST_MODE);

const initState = {
    chargers: [
    ],
    index: 0
};

const chargerInfoState = handleActions(
    {
        [GET_CHARGER_LIST_SUCCESS]: (state, {payload}) => {
           return {
               chargers: payload.list,
               index: payload.totalCount
           }
        },
        [GET_CHARGER_LIST_FAILURE]: (state, {payload}) => {
            return {
               ...state
           }
        },
        [GET_CHARGER_LIST_ONLY_SUCCESS]: (state, {payload}) => {
            return {
                chargers: payload.list,
                index: payload.totalCount
            }
        },
        [GET_CHARGER_LIST_ONLY_FAILURE]: (state, {payload}) => {
            return {
                ...state
            }
        },
        [GET_CHARGER_INFO_DETAIL_SUCCESS]: (state, {payload, requestPayload}) => {
            let newData = {};
            const result = payload.result;
            result.forEach((e, i) => {
                newData[e.item] = {id: e.itemID, content: e.content};
            });

            return {
                chargers: state.chargers.map((charger, i) => (
                        charger.ChargerID === requestPayload ? {
                            ...charger,
                            ...newData
                        } : charger
                    )
                ),
            }
        },
        [GET_CHARGER_INFO_DETAIL_FAILURE]: (state, {payload}) => {
            return {
                ...state
            }
        },
        [addCharger]: (state, action) => {
            state.index++;

            const data = {
                ...action.payload,
            }

            return {
                ...state,
                chargers: state.chargers.concat(data)
            }
        },
        [removeCharger]: (state, action) => {
            state.chargers.map((charger, i) => {
                if(charger.id === action.payload.id) {
                    state.chargers.slice(i, 1);

                    return true;
                }
            });

            return false;
        },
        [updateChargerInfo]: (state, action) => {
            return {
                ...state,
                chargers: state.chargers.map((charger, i) => (
                    charger.ChargerID === action.payload.ChargerID ? action.payload : charger
                ))
            }
        },
        [SET_CHARGER_INFO_SUCCESS]: (state, {payload, requestPayload}) => {
            return {
                ...state,
                chargers: state.chargers.map((charger, i) => (
                    charger.ChargerID === requestPayload.ChargerID ? requestPayload : charger
                ))
            }
        },
        [SET_CHARGER_INFO_FAILURE]: (state, {payload}) => {
            return {
                ...state
            }
        },
        [DELETE_CHARGER_PROPERTY_SUCCESS]: (state, {payload, requestPayload}) => {

            state.chargers.forEach((e, i) => {
                if(e.ChargerID === requestPayload.ChargerID) {
                    let keys = Object.keys(e);

                    keys.forEach((e2) => {
                        if(e[e2].id === e.itemId) {
                            delete e[e2];
                    }
                    });
                }
            });

            return {
                ...state,
            }
        },
        [DELETE_CHARGER_PROPERTY_FAILURE]: (state, {payload}) => {
            return {
                ...state
            }
        },
    },
    initState
);

export default chargerInfoState;