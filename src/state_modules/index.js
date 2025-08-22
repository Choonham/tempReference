import {combineReducers} from "redux";
import menuState from "./menuState";
import simulatorInfoState, {simulatorInfoSaga} from "./simulatorInfoState";
import eventLogState from "./eventLogState";
import testResultState, {testResultSaga} from "./testResultState";
import chargerInfoState, {chargerSaga} from "./chargerInfoState";
import loadingState from "./loadingState";
import {all} from "redux-saga/effects";
import sampleApiRequestState, {sampleSaga} from "./sampleApiRequestState";
import authState, {authSaga} from "./authState";
import connTestState, {connTestSaga} from "./connTestState";
import webSocketState from "./webSocketState";
import alertState from "./alertState";

const rootReducer = combineReducers({
    menuState,
    simulatorInfoState,
    eventLogState,
    testResultState,
    chargerInfoState,
    loadingState,
    sampleApiRequestState,
    authState,
    connTestState,
    webSocketState,
    alertState,
});

export function* rootSaga() {
    yield all([sampleSaga(), authSaga(), simulatorInfoSaga(), connTestSaga(), chargerSaga(), testResultSaga()]);
}

export default rootReducer;