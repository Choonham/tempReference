import {createAction, handleActions} from 'redux-actions';
import createRequestSaga, {createRequestAction, createRequestActionTypes} from "../saga/createRequestSaga";
import * as api from "../apis/api";
import {takeLatest, takeEvery} from 'redux-saga/effects';
let dispatch;

export const setSimulatorActions = (storeDispatch) => {
    dispatch = storeDispatch;
};

const UPDATE_SIMULATOR_INFO = 'simulatorInfoState/UPDATE_SIMULATOR_INFO';
const UPDATE_SIMULATOR_VOLTAGE = 'simulatorInfoState/UPDATE_SIMULATOR_VOLTAGE';
const UPDATE_SIMULATOR_CURRENT = 'simulatorInfoState/UPDATE_SIMULATOR_CURRENT';
const UPDATE_SIMULATOR_DATA = 'simulatorInfoState/UPDATE_SIMULATOR_DATA';
const GET_TEST_START_TOGGLE = 'simulatorInfoState/GET_TEST_START_TOGGLE';
const READ_DATA_START_TOGGLE = 'simulatorInfoState/READ_DATA_START_TOGGLE';
const MOVE_TO_NEXT_SEQUENCE = 'simulatorInfoState/MOVE_TO_NEXT_SEQUENCE';
const UPDATE_CHARGER_INFO = 'simulatorInfoState/UPDATE_CHARGER_INFO';
const UPDATE_TEST_INFO = 'simulatorInfoState/UPDATE_TEST_INFO';
const UPDATE_CONN_STATUS_DONE = 'simulatorInfoState/UPDATE_CONN_STATUS_DONE';
const RECONFIG_CHARGER = 'simulatorInfoState/RECONFIG_CHARGER';
const SET_SIMULATOR_INPUT_PARAM = 'simulatorInfoState/SET_SIMULATOR_INPUT_PARAM';
const DISCONNECT_SIMULATOR = 'simulatorInfoState/DISCONNECT_SIMULATOR';
const SET_STANDBY_FROM_DONE = 'simulatorInfoState/SET_STANDBY_FROM_DONE';
const TRIG_START_END_FROM_WS = 'simulatorInfoState/TRIG_START_END_FROM_WS';
const TRIG_SET_TEST_READY = 'simulatorInfoState/TRIG_SET_TEST_READY';
const TRIG_INIT_STATE = 'simulatorInfoState/TRIG_INIT_STATE';
const TRIG_TEST_DONE = 'simulatorInfoState/TRIG_TEST_DONE';

const [GET_SIMULATOR_LIST, GET_SIMULATOR_LIST_SUCCESS, GET_SIMULATOR_LIST_FAILURE] = createRequestActionTypes('simulatorInfoState/GET_SIMULATOR_LIST');
const [GET_SIMULATOR_INFO, GET_SIMULATOR_INFO_SUCCESS, GET_SIMULATOR_INFO_FAILURE] = createRequestActionTypes('simulatorInfoState/GET_SIMULATOR_INFO');
const [GET_SIMULATOR_CONN_STATUS, GET_SIMULATOR_CONN_STATUS_SUCCESS, GET_SIMULATOR_CONN_STATUS_FAILURE] = createRequestActionTypes('simulatorInfoState/GET_SIMULATOR_CONN_STATUS');
const [MODIFY_SIMULATOR_INFO, MODIFY_SIMULATOR_INFO_SUCCESS, MODIFY_SIMULATOR_INFO_FAILURE] = createRequestActionTypes('simulatorInfoState/MODIFY_SIMULATOR_INFO');
const [SET_TEST_READY, SET_TEST_READY_SUCCESS, SET_TEST_READY_FAILURE] = createRequestActionTypes('simulatorInfoState/SET_TEST_READY');
const [SET_SIMUL_CONTROL, SET_SIMUL_CONTROL_SUCCESS, SET_SIMUL_CONTROL_FAILURE] = createRequestActionTypes('simulatorInfoState/SET_SIMUL_CONTROL');
const [GET_LASTEST_TEST_INFO, GET_LASTEST_TEST_INFO_SUCCESS, GET_LASTEST_TEST_INFO_FAILURE] = createRequestActionTypes('simulatorInfoState/GET_LASTEST_TEST_INFO');

export const getSimulatorList = createAction(GET_SIMULATOR_LIST, (userNo, userID, userGrade) => {
    return {
        userNo,
        userID,
        userGrade
    }
});

export const modifySimulatorInfo = (id, ip, port, loginID, loginPW, note, callbacks) => {
    return createRequestAction(MODIFY_SIMULATOR_INFO, {
        id, ip, port, loginID, loginPW, note
    }, callbacks);
};

export const setTestReady = createAction(SET_TEST_READY, (id, deviceId, chargerId, modelNo, modelName, serialNo, technician, resistance, note, uuid) => {
    return {
        id,
        deviceId,
        chargerId,
        modelNo,
        modelName,
        serialNo,
        technician,
        resistance,
        note,
        uuid
    }
});

export const setSimulControl = createAction(SET_SIMUL_CONTROL, (id, sequence, resistor, chargingTime, loadValue, intervalTime, testID, eventCheck, finEnd, doneFlag, uuid) => {
    return {
        id,
        sequence,
        resistor,
        chargingTime,
        loadValue,
        intervalTime,
        testID,
        eventCheck,
        finEnd,
        doneFlag,
        uuid
    }
});

export const setSimulatorInputParam = createAction(SET_SIMULATOR_INPUT_PARAM);

export const reconfigCharger = createAction(RECONFIG_CHARGER, (id, restart) => {
    return {
        id,
        restart
    }
});

export const updateConnStatusDone = createAction(UPDATE_CONN_STATUS_DONE, flag => flag);

export const getLastestTestInfo = (id, callback) => {
    return createRequestAction(GET_LASTEST_TEST_INFO, id, callback);
}

export const getSimulatorInfo = (id, callback) => createRequestAction(GET_SIMULATOR_INFO, id, callback);
export const getSimulatorConnStatus = (id, callback) => createRequestAction(GET_SIMULATOR_CONN_STATUS, id, callback);

export const updateSimulatorInfo = createAction(UPDATE_SIMULATOR_INFO);
export const updateSimulatorVoltage = createAction(UPDATE_SIMULATOR_VOLTAGE);
export const updateSimulatorCurrent = createAction(UPDATE_SIMULATOR_CURRENT);
export const updateSimulatorData = createAction(UPDATE_SIMULATOR_DATA);
export const getTestStartToggle = createAction(GET_TEST_START_TOGGLE);
export const readDataStartToggle = createAction(READ_DATA_START_TOGGLE);
export const moveToNextSequence = createAction(MOVE_TO_NEXT_SEQUENCE);
export const updateChargerInfo = createAction(UPDATE_CHARGER_INFO);
export const updateTestInfo = createAction(UPDATE_TEST_INFO);
export const disconnectSimulator = createAction(DISCONNECT_SIMULATOR, simulatorID => simulatorID);
export const setStandbyFromDone =  (simulatorID, restart, chargingTime, intervalTime, loadSet, callback) => createRequestAction(SET_STANDBY_FROM_DONE, {
    simulatorID, restart, chargingTime,
    intervalTime, loadSet}, callback);
export const trigStartEndFromWs = createAction(TRIG_START_END_FROM_WS, params => params);
export const trigSetTestReady = createAction(TRIG_SET_TEST_READY, params => params);
export const trigInitState = createAction(TRIG_INIT_STATE, params => params);
export const trigTestDone = createAction(TRIG_TEST_DONE, params => params);

const getSimulatorListSaga = createRequestSaga(GET_SIMULATOR_LIST, api.getSimulatorList);
const getSimulatorInfoSaga = createRequestSaga(GET_SIMULATOR_INFO, api.getSimulatorInfo);
const getSimulatorConnStatusSaga = createRequestSaga(GET_SIMULATOR_CONN_STATUS, api.getSimulatorConnStatus);
const modifySimulatorInfoSaga = createRequestSaga(MODIFY_SIMULATOR_INFO, api.modifySimulatorInfo);
const setTestReadySaga = createRequestSaga(SET_TEST_READY, api.setTestReady);
const setSimulControlSaga = createRequestSaga(SET_SIMUL_CONTROL, api.setSimulControl);
const getLastestTestInfoSaga = createRequestSaga(GET_LASTEST_TEST_INFO, api.getLastestTestInfo);
const setStandbyFromDoneSaga = createRequestSaga(SET_STANDBY_FROM_DONE, api.setStandbyFromDone);

export function* simulatorInfoSaga() {
    yield takeEvery(GET_SIMULATOR_LIST, getSimulatorListSaga);
    yield takeEvery(GET_SIMULATOR_INFO, getSimulatorInfoSaga);
    yield takeEvery(GET_SIMULATOR_CONN_STATUS, getSimulatorConnStatusSaga);
    yield takeEvery(MODIFY_SIMULATOR_INFO, modifySimulatorInfoSaga);
    yield takeEvery(SET_TEST_READY, setTestReadySaga);
    yield takeEvery(SET_SIMUL_CONTROL, setSimulControlSaga);
    yield takeEvery(GET_LASTEST_TEST_INFO, getLastestTestInfoSaga);
    yield takeEvery(SET_STANDBY_FROM_DONE, setStandbyFromDoneSaga);
};

export const SIMULATOR_CONNECTION_STATE = {
    noInfo: -1,
    disconnected: 0,
    connected: 1,
    fail: 2,
    success: 3,
    inProgress: 4,
};

export const SIMULATOR_TEST = {
    standby: '0',
    normalOperation_low: '100',
    normalOperation_normal: '110',
    normalOperation_high: '140',
    groundFault_low: '200',
    groundFault_normal: '210',
    groundFault_high: '220',
    blockProtectionConductor_low: '300',
    blockProtectionConductor_normal: '320',
    blockProtectionConductor_high: '340',
    shortControlCircuit_low: '400',
    shortControlCircuit_normal: '420',
    shortControlCircuit_high: '440',
    diodeFault_low: '500',
    diodeFault_normal: '520',
    diodeFault_high: '540',
    ccid_low: '600',
    ccid_normal: '620',
    ccid_high: '640',
    done: '9999',
};

export const RESISTANCE_POINT = {
    noUse: '',
    low: 'low',
    normal: 'normal',
    high: 'high'
};

export const RESULTS = {
    fail: -1,
    standBy: 0,
    processing: 1,
    success: 2,
    noUse: 3
};

export const START = {
    withPrevInfo: 1,
    withNewInfo: 2,
};

export const DONE_FLAG = {
    notDone: 0,
    done: 1,
    restartWithPrevInfo: 2,
    restartWithNewInfo: 3,
};

Object.freeze(SIMULATOR_CONNECTION_STATE);
Object.freeze(SIMULATOR_TEST);
Object.freeze(RESISTANCE_POINT);
Object.freeze(RESULTS);
Object.freeze(START);

const initialResult = [
    RESULTS.noUse,
    RESULTS.standBy,
    RESULTS.standBy,
    RESULTS.standBy,
    RESULTS.standBy,
    RESULTS.standBy,
    RESULTS.standBy,
    RESULTS.standBy,
    RESULTS.standBy,
    RESULTS.standBy,
    RESULTS.standBy,
    RESULTS.standBy,
    RESULTS.standBy,

    RESULTS.noUse,
    RESULTS.standBy,
    RESULTS.noUse,

    RESULTS.noUse,
    RESULTS.standBy,
    RESULTS.noUse
];

let reqIdx = 0;

const initialSimulatorState = {
    simulators: [],
    totalCnt: 0,
    connStatusDone: false,
    latestLoadingDone: false
};

const simulatorInfoState = handleActions(
    {
        [reconfigCharger]: (state, {payload}) => {
            return {
                ...state,
                simulators: state.simulators.map((simulator) => (
                    simulator.id == payload.id ? {
                        ...simulator,
                        restart: payload.restart
                    } : simulator
                ))
            }
        },
        [GET_SIMULATOR_LIST_SUCCESS]: (state, {payload}) => {
            state.simulators = [];
            payload.list.forEach((e, i) => {
                state.simulators.push(
                    {
                        id: e.simulatorID,
                        chargerId: -1,
                        chargerTestMode: 0,
                        chargingTime: 1,
                        loadSet: 5.0,
                        intervalTime: 30,
                        simulatorName: e.simulatorName,
                        state: SIMULATOR_CONNECTION_STATE.disconnected,
                        test: SIMULATOR_TEST.standby,
                        resistancePoint: RESISTANCE_POINT.noUse,
                        connectionInfo: {
                            status: 0,
                            ipAddress: '',
                            port: '',
                            loginId: '',
                            loginPw: '',
                            comment: ''
                        },
                        testInfo: {
                            modelName: '',
                            testID: 0,
                            technician: '',
                            modelNo: '',
                            deviceID: '',
                            serialNo: '',
                            note: '',
                        },
                        testResults: initialResult,
                        currTestSeq: 0,
                        sequence: 0,
                        failPoint: '99',
                        gettingData: false,
                        voltage: 0,
                        current: 0,
                        pwmMax: 0,
                        pwmMin: 0,
                        permanentResistanceValue: 0,
                        failSequence: '',
                        storedData: [],
                        restart: 0,
                        eventDes: '',
                        diodeState: 0,
                    }
                );
            })
            return {
                ...state,
                totalCnt: payload.totalCount
            };
        },
        [GET_SIMULATOR_LIST_FAILURE]: (state, {payload}) => {
            return {
                ...state,
            };
        },
        [GET_SIMULATOR_INFO]: (state, {payload}) => {
            return {
                ...state,
            };
        },
        [GET_SIMULATOR_INFO_SUCCESS]: (state, {payload}) => {
            const data = payload.data[0];
            return {
                ...state,
                simulators: state.simulators.map(simulator =>
                    simulator.id == data.SimulatorID ? {
                        ...simulator,
                        simulatorName: data.SimulatorName,
                        connectionInfo: {
                            ...simulator.connectionInfo,
                            ipAddress: data.IP,
                            port: data.Port,
                            loginId: data.LoginID,
                            loginPw: data.LoginPW
                        }
                    }:simulator)
            };
        },
        [GET_SIMULATOR_INFO_FAILURE]: (state, {payload}) => {
            return {
                ...state,
            };
        },
        [GET_SIMULATOR_CONN_STATUS]: (state, {payload}) => {
            return {
                ...state,
            };
        },
        [GET_SIMULATOR_CONN_STATUS_SUCCESS]: (state, {payload}) => {
            let connStatus = SIMULATOR_CONNECTION_STATE.disconnected;
            let connStatusDoneF = state.connStatusDone;
            if(payload.success) {
                connStatus = SIMULATOR_CONNECTION_STATE.noInfo;
            }

            //if(payload.simulatorID == state.simulators[state.simulators.length - 1].id) {
            if(reqIdx === state.totalCnt - 1) {
                connStatusDoneF = true;
                reqIdx = 0;
            } else {
                reqIdx ++;
            }

            return {
                ...state,
                connStatusDone: connStatusDoneF,
                simulators: state.simulators.map((simulator, i) => {
                    let rtnSimul = {};

                    if(simulator.id == payload.simulatorID) {
                        rtnSimul = {
                            ...simulator,
                            state: connStatus,
                            connectionInfo: {
                                ...simulator.connectionInfo,
                            },
                            testInfo: {
                                ...simulator.testInfo,
                                deviceID: payload.deviceID
                            },
                        };
                    } else {
                        rtnSimul = simulator;
                    }

                    return rtnSimul;
                })
            };
        },
        [GET_SIMULATOR_CONN_STATUS_FAILURE]: (state, {payload}) => {
            return {
                ...state,
                simulators: state.simulators.map(simulator =>
                    simulator.id == payload.simulatorID ? {
                        ...simulator,
                        connectionInfo: {
                            ...simulator.connectionInfo,
                            status: 0,
                        }
                    }:simulator)
            };
        },
        [MODIFY_SIMULATOR_INFO_SUCCESS]: (state, {payload}) => {
            return {
                ...state
            }
        },
        [MODIFY_SIMULATOR_INFO_FAILURE]: (state, {payload}) => {
            return {
                ...state
            }
        },
        [SET_TEST_READY]: (state, {payload}) => {
            return {
                ...state
            }
        },
        [SET_TEST_READY_SUCCESS]: (state, {payload}) => {
            let data = (payload.result).split(":");
            if(data[0] == "ERROR") {
                if(data[1] == "Test in progress") {
                    return {
                        ...state,
                        simulators: state.simulators.map(simulator =>
                            simulator.id === payload.simulatorID ? {
                                ...simulator,
                                state: SIMULATOR_CONNECTION_STATE.inProgress
                            }:simulator)
                    };
                }
            }
            return {
                ...state,
                simulators: state.simulators.map(simulator =>
                    simulator.id == payload.simulatorID ? {
                        ...simulator,
                        testInfo: {
                            ...simulator.testInfo,
                            testID: data[0] == "OK" ? Number(data[1]) : 0
                        },
                        state: data[0] == "OK" ? SIMULATOR_CONNECTION_STATE.connected : SIMULATOR_CONNECTION_STATE.noInfo
                    }:simulator)
            };
        },
        [SET_TEST_READY_FAILURE]: (state, {payload}) => {
            return {
                ...state
            }
        },
        [TRIG_SET_TEST_READY]: (state, {payload}) => {
            let data = (payload.result).split(":");
            if(data[0] == "ERROR") {
                if(data[1] == "Test in progress") {
                    return {
                        ...state,
                        simulators: state.simulators.map(simulator =>
                            simulator.id === payload.SimulatorID ? {
                                ...simulator,
                                state: SIMULATOR_CONNECTION_STATE.inProgress
                            }:simulator)
                    };
                }
            }
            return {
                ...state,
                simulators: state.simulators.map(simulator =>
                    simulator.id == payload.SimulatorID ? {
                        ...simulator,
                        chargerTestMode: payload.Resistance === "N" ? 1 : 0,
                        chargerId: parseInt(payload.ChargerID),
                        testResults: initialResult,
                        testInfo: {
                            ...simulator.testInfo,
                            modelName: payload.ModelName,
                            technician: payload.Technician,
                            modelNo: payload.ModelNo,
                            note: payload.Note,
                            deviceID: payload.DeviceID,
                            serialNo: payload.SerialNo,
                            testID: data[0] == "OK" ? Number(data[1]) : 0
                        },
                        test: data[0] == "OK" ? SIMULATOR_TEST.standby : simulator.test,
                        state: data[0] == "OK" ? SIMULATOR_CONNECTION_STATE.connected : SIMULATOR_CONNECTION_STATE.noInfo
                    }:simulator)
            };
        },
        [TRIG_START_END_FROM_WS]: (state, {payload}) => {
            let tempResult = null;
            const doneFlag = parseInt(payload.doneFlag);
            if(doneFlag === DONE_FLAG.done) {
                if(payload.eventCheck == -1) {
                    tempResult = SIMULATOR_CONNECTION_STATE.fail
                } else {
                    tempResult = SIMULATOR_CONNECTION_STATE.success
                }
            }

            return {
                ...state,
                simulators: state.simulators.map(simulator => {
                    if(simulator.id == payload.SimulatorID) {
                        if(payload.DataType == "testEnd") {
                            return {
                                ...simulator,
                                voltage: 0,
                                current: 0,
                                pwmMax: 0,
                                pwmMin: 0,
                                testResults: initialResult,
                                sequence: 0,
                                currTestSeq: 0,
                                test: doneFlag === DONE_FLAG.done ?
                                    SIMULATOR_TEST.done : SIMULATOR_TEST.standby,
                                resistancePoint: RESISTANCE_POINT.noUse,
                                state: doneFlag === DONE_FLAG.done ?
                                    tempResult : doneFlag === DONE_FLAG.restartWithNewInfo ?
                                        SIMULATOR_CONNECTION_STATE.noInfo : doneFlag === DONE_FLAG.restartWithPrevInfo ?
                                            SIMULATOR_CONNECTION_STATE.connected : SIMULATOR_CONNECTION_STATE.disconnected,
                                eventDes: '',
                                diodeState: 0,
                                chargingTime: parseInt(payload.charge_time),
                                intervalTime: parseInt(payload.interval_time),
                                loadSet: parseInt(payload.load_value),
                            }
                        } else {
                            return {
                                ...simulator,
                                state: SIMULATOR_CONNECTION_STATE.inProgress,
                                voltage: 0,
                                current: 0,
                                pwmMax: 0,
                                pwmMin: 0,
                                sequence: 0,
                                currTestSeq: 0,
                                chargingTime: parseInt(payload.charge_time),
                                intervalTime: parseInt(payload.interval_time),
                                loadSet: parseInt(payload.load_value),
                            }
                        }
                    } else {
                        return simulator;
                    }
                })
            }
        },
        [SET_SIMUL_CONTROL]: (state, {payload}) => {
            return {
                ...state,
            }
        },
        [SET_SIMUL_CONTROL_SUCCESS]: (state, {payload, requestPayload}) => {
            let tempResult = null;

            if(requestPayload.doneFlag === DONE_FLAG.done) {
                if(requestPayload.eventCheck === -1) {
                    tempResult = SIMULATOR_CONNECTION_STATE.fail
                } else {
                    tempResult = SIMULATOR_CONNECTION_STATE.success
                }
            }

            return {
                ...state,
                simulators: state.simulators.map(simulator => {
                    if(simulator.id == payload.simulatorID) {
                        if(payload.controlType === "F") {
                            return {
                                ...simulator,
                                voltage: 0,
                                current: 0,
                                pwmMax: 0,
                                pwmMin: 0,
                                testResults: initialResult,
                                sequence: 0,
                                currTestSeq: 0,
                                test: requestPayload.doneFlag === DONE_FLAG.done ? SIMULATOR_TEST.done : SIMULATOR_TEST.standby,
                                resistancePoint: RESISTANCE_POINT.noUse,
                                state: requestPayload.doneFlag === DONE_FLAG.done ?
                                    tempResult : simulator.restart === START.withNewInfo ?
                                        SIMULATOR_CONNECTION_STATE.noInfo : SIMULATOR_CONNECTION_STATE.connected,
                                restart: simulator.restart === START.withPrevInfo ? 7 : simulator.restart,
                                eventDes: '',
                                diodeState: 0,
                                chargingTime: parseInt(requestPayload.chargingTime),
                                intervalTime: parseInt(requestPayload.intervalTime),
                                loadSet: parseInt(requestPayload.loadValue)
                            }
                        } else {
                            return {
                                ...simulator,
                                chargingTime: parseInt(requestPayload.chargingTime),
                                intervalTime: parseInt(requestPayload.intervalTime),
                                loadSet: parseInt(requestPayload.loadValue),
                                state: SIMULATOR_CONNECTION_STATE.inProgress
                            }
                        }
                    } else {
                        return simulator;
                    }
                })
            }
        },
        [SET_SIMUL_CONTROL_FAILURE]: (state, {payload}) => {
            return {
                ...state
            }
        },

        [GET_LASTEST_TEST_INFO_SUCCESS]: (state, {payload}) => {
            let isDone = false;

            if(reqIdx === state.totalCnt - 1) {
                isDone = true;
                reqIdx = 0;
            } else {
                reqIdx++;
            }

            if(payload.testInfo == null) {
                return {
                    ...state,
                    latestLoadingDone: isDone
                }
            }

            return {
                ...state,
                latestLoadingDone: isDone,
                simulators: state.simulators.map(simulator => {
                    if (simulator.id == payload.testInfo.simulatorID) {
                        let newTestResults = [...simulator.testResults];
                        let lastProcStep = 0;
                        let finalResistorNum = 0;

                        const testSeqDatas = payload.testSequence;
                        testSeqDatas.forEach((e, i) => {
                            const seqNum = e.sequence === "N" ?
                                0 : e.sequence === "S" ?
                                    1 : e.sequence === "P" ?
                                        2 : e.sequence === "C" ?
                                            3 : e.sequence === "D" ?
                                                4 : e.sequence === "I" ? 5 : 6;

                            const resistorNum = e.resistor === "L" ?
                                1 : e.resistor === "N" ?
                                    2 : e.resistor === "H" ?
                                        3 : 0;

                            let cts = 3 * seqNum + resistorNum;
                            finalResistorNum =resistorNum;
                            if(seqNum === 6) {
                                cts = 0;
                            } else {
                                if(e.result == "S") {
                                    newTestResults[cts] = RESULTS.success;

                                    if(seqNum === 4) {
                                        if(e.diodeState == 1) {
                                            newTestResults[cts - 1] = RESULTS.success;
                                        }
                                        if(e.diodeState == 2) {
                                            newTestResults[cts + 1] = RESULTS.success;
                                        }
                                    }
                                } else if(e.result == "F") {
                                    newTestResults[cts] = RESULTS.fail;
                                    if(seqNum === 4) {
                                        if(e.diodeState == 1) {
                                            newTestResults[cts - 1] = RESULTS.fail;
                                        }
                                        if(e.diodeState == 2) {
                                            newTestResults[cts + 1] = RESULTS.fail;
                                        }
                                    }
                                } else {
                                    newTestResults[cts] = RESULTS.processing;
                                    if(seqNum === 4) {
                                        if(e.diodeState == 1) {
                                            newTestResults[cts - 1] = RESULTS.processing;
                                        }
                                        if(e.diodeState == 2) {
                                            newTestResults[cts + 1] = RESULTS.processing;
                                        }
                                    }
                                    lastProcStep = e.state;
                                }
                            }

                        });
                        return {
                            ...simulator,
                            chargerId: payload.testInfo.chargerID,
                            chargerTestMode: payload.testInfo.resistance == "F" ? 0 : 1,
                            testInfo: {
                                ...simulator.testInfo,
                                modelName: payload.testInfo.modelName,
                                testID: payload.testInfo.testID,
                                technician: payload.testInfo.technician,
                                modelNo: payload.testInfo.modelNo,
                                deviceID: payload.testInfo.deviceID,
                                serialNo: payload.testInfo.serialNo
                            },
                            chargingTime: typeof payload.testInfo.chargingTime !== 'undefined' ? parseInt(payload.testInfo.chargingTime) : parseInt(simulator.chargingTime),
                            intervalTime: typeof payload.testInfo.intervalTime !== 'undefined' ? parseInt(payload.testInfo.intervalTime) : parseInt(simulator.intervalTime),
                            loadSet: typeof payload.testInfo.powerRate !== 'undefined' ? parseInt(payload.testInfo.powerRate) : parseInt(simulator.loadSet),
                            testResults: newTestResults,
                            sequence: lastProcStep,
                            resistancePoint: Object.entries(RESISTANCE_POINT)[finalResistorNum][1],
                            state: payload.testSequence.length === 0 ? SIMULATOR_CONNECTION_STATE.connected : SIMULATOR_CONNECTION_STATE.inProgress,
                            storedData: payload.testData ? [
                                payload.testData.Volt,
                                payload.testData.Amp,
                                payload.testData.PWM_Max,
                                payload.testData.PWM_Min,
                            ] : []
                        }
                    } else {
                        return simulator;
                    }
                })
            }
        },
        [GET_LASTEST_TEST_INFO_FAILURE]: (state, {payload}) => {
            return {
                ...state
            }
        },
        [updateSimulatorVoltage]: (state, action) => {
            return {
                ...state,
                simulators: state.simulators.map(simulator =>
                    simulator.id === action.payload.id ?
                        {...simulator,
                            voltage: typeof action.payload.voltage === "undefined" ? 0 : action.payload.voltage,
                        } : simulator
                )
            }
        },
        [updateSimulatorCurrent]: (state, action) => {
            return {
                ...state,
                simulators: state.simulators.map(simulator =>
                    simulator.id === action.payload.id ?
                        {...simulator,
                            current:  typeof action.payload.current === "undefined" ? 0 : action.payload.current,
                        } : simulator
                )
            }
        },
        [updateSimulatorData]: (state, {payload}) => {
            const seqNum = payload.sequence === "N" ?
                0 : payload.sequence === "S" ?
                    1 : payload.sequence === "P" ?
                        2 : payload.sequence === "C" ?
                            3 : payload.sequence === "D" ?
                                4 : payload.sequence === "I" ? 5 : 6;

            const lastStep = payload.sequence === "N" ?
                6 : payload.sequence === "S" ?
                    4 : payload.sequence === "P" ?
                        5 : payload.sequence === "C" ?
                            5 : payload.sequence === "D" ?
                                4: payload.sequence === "I" ? 6 : 5;

            const stateNum = Number(payload.state);

            const resistorNum = payload.resistor === "L" ?
                1 : payload.resistor === "N" ?
                    2 : payload.resistor === "H" ?
                        3 : 0;

            let cts = 3 * seqNum + resistorNum;

            if(seqNum === 6) cts = 0;

            return {
                ...state,
                simulators: state.simulators.map(simulator => {
                    if (simulator.id === Number(payload.simulatorID)) {
                        let rtnData = {};
                        let newTestResults = [...simulator.testResults];

                        if(payload.DataType === "event") {
                            if(Number(payload.state) == lastStep) {
                                if(payload.eventCode == "00") {
                                    newTestResults[cts] = RESULTS.success;

                                    if(seqNum === 4) {
                                        if(payload.diodeState == 1) {
                                            newTestResults[cts - 1] = RESULTS.success;
                                        }
                                        if(payload.diodeState == 2) {
                                            if(newTestResults[cts - 1] === RESULTS.fail) newTestResults[cts] = RESULTS.fail;
                                            newTestResults[cts + 1] = RESULTS.success;
                                        }
                                    }
                                } else {
                                    newTestResults[cts] = RESULTS.fail;

                                    if(seqNum === 4) {
                                        if(payload.diodeState == 1) {
                                            newTestResults[cts - 1] = RESULTS.fail;
                                        }
                                        if(payload.diodeState == 2) {
                                            newTestResults[cts + 1] = RESULTS.fail;
                                        }
                                    }
                                }
                            } else {
                                if(seqNum !== 6) {
                                    newTestResults[cts] = RESULTS.processing;
                                    if(seqNum === 4) {
                                        if(payload.diodeState == 1) {
                                            newTestResults[cts - 1] = RESULTS.processing;
                                        }
                                        if(payload.diodeState == 2) {
                                            newTestResults[cts + 1] = RESULTS.processing;
                                        }
                                    }
                                }

                                if(stateNum === 9) {
                                    newTestResults[cts] = RESULTS.processing;
                                }
                            }

                            rtnData = {
                                ...simulator,
                                sequence: stateNum,
                                currTestSeq: cts,
                                test: Object.entries(SIMULATOR_TEST)[cts][1],
                                resistancePoint: Object.entries(RESISTANCE_POINT)[resistorNum][1],
                                testResults: newTestResults,
                                eventDes:payload.event,
                                diodeState: payload.diodeState
                            }
                        } else {
                            if(payload.alarm_data != "00") {
                                newTestResults[cts] = RESULTS.fail;
                            }

                            rtnData = {
                                ...simulator,
                                sequence: stateNum,
                                currTestSeq: cts,
                                test: Object.entries(SIMULATOR_TEST)[cts][1],
                                resistancePoint: Object.entries(RESISTANCE_POINT)[resistorNum][1],
                                voltage: Math.round(Number(payload.volt) * 100) / 100,
                                current: Math.round(Number(payload.amp) * 100) / 100,
                                pwmMax: Math.round(Number(payload.pwm_max) * 100) / 100,
                                pwmMin: Math.round(Number(payload.pwm_min) * 100) / 100,
                                testResults: newTestResults,
                                diodeState: payload.diodeState
                            }
                        }

                        return rtnData;
                    } else {
                        return simulator;
                    }
                })
            }
        },
        [updateSimulatorInfo]: (state, action) => {
            return {
                ...state,
                simulators: state.simulators.map(simulator =>
                    simulator.id === action.payload.id ?
                        {
                            ...simulator,
                            simulatorName: action.payload.simulatorName,
                            state: action.payload.state,
                            connectionInfo:  action.payload.connectionInfo,
                        } : simulator
                )
            }
        },
        [setSimulatorInputParam]: (state, action) => {
            return {
                ...state,
                simulators: state.simulators.map(simulator =>
                    simulator.id === action.payload.id ?
                        {
                            ...simulator,
                            chargingTime: parseInt(action.payload.chargingTime),
                            loadSet: parseInt(action.payload.loadValue),
                            intervalTime: parseInt(action.payload.intervalTime)
                        } : simulator
                )
            }
        },
        [getTestStartToggle]: (state, action) => {
            return {
                ...state,
                simulators: state.simulators.map(simulator =>
                    simulator.id === action.payload.id ?
                        action.payload.start ?
                            {...simulator, state: SIMULATOR_CONNECTION_STATE.inProgress} : {...simulator, state: SIMULATOR_CONNECTION_STATE.connected}
                        : simulator
                )
            }
        },
        [readDataStartToggle]: (state, action) => {
            return {
                ...state,
                simulators: state.simulators.map(simulator =>
                    simulator.id === action.payload.id ?
                        {...simulator, gettingData: action.payload.gettingData} : simulator
                )
            }
        },
        [moveToNextSequence]: (state, action) => {
            return {
                ...state,
                simulators: state.simulators.map(simulator =>
                    simulator.id === action.payload.id ?
                        {
                            ...simulator,
                            test: action.payload.test,
                            testResults: action.payload.testResults,
                            sequence: action.payload.sequence,
                            currTestSeq: action.payload.currTestSeq
                        } : simulator
                )
            }
        },
        [updateChargerInfo]: (state, action) => {
            return {
                ...state,
                simulators: state.simulators.map(simulator =>
                    simulator.id === action.payload.id ?
                        {
                            ...simulator,
                            chargerId: action.payload.chargerId,
                            chargerTestMode: action.payload.chargerTestMode
                        } : simulator
                )
            }
        },
        [updateTestInfo]: (state, {payload}) => {
            return {
                ...state,
                simulators: state.simulators.map(simulator =>
                    simulator.id === payload.id ?
                        {
                            ...simulator,
                            chargerId: payload.chargerId,
                            chargerTestMode: payload.chargerTestMode,
                            state: SIMULATOR_CONNECTION_STATE.connected,
                            testInfo: {
                                ...simulator.testInfo,
                                modelName: payload.modelName,
                                modelNo: payload.modelNo,
                                technician: payload.technician,
                                serialNo: payload.serialNo,
                                note: payload.note,
                            }
                        } : simulator
                )
            }
        },
        [disconnectSimulator]: (state, {payload}) => {
            return {
                ...state,
                simulators: state.simulators.map(simulator =>
                    simulator.id == payload ?
                        {
                            ...simulator,
                            voltage: 0,
                            current: 0,
                            pwmMax: 0,
                            pwmMin: 0,
                            testResults: initialResult,
                            sequence: 0,
                            currTestSeq: 0,
                            test: SIMULATOR_TEST.standby,
                            resistancePoint: RESISTANCE_POINT.noUse,
                            state: SIMULATOR_CONNECTION_STATE.disconnected,
                            eventDes: '',
                            diodeState: 0,
                        } : simulator
                )
            }
        },
        [SET_STANDBY_FROM_DONE]: (state, {payload}) => {
            return {
                ...state,
                simulators: state.simulators.map(simulator => {
                    return simulator.id == payload.simulatorID ? {
                            ...simulator,
                            voltage: 0,
                            current: 0,
                            pwmMax: 0,
                            pwmMin: 0,
                            testResults: initialResult,
                            sequence: 0,
                            currTestSeq: 0,
                            test: SIMULATOR_TEST.standby,
                            state: payload.restart === START.withPrevInfo ? SIMULATOR_CONNECTION_STATE.connected : SIMULATOR_CONNECTION_STATE.noInfo,
                            restart: simulator.restart == START.withPrevInfo ? 7 : simulator.restart,
                            chargingTime: parseInt(payload.chargingTime),
                            intervalTime: parseInt(payload.intervalTime),
                            loadSet: parseInt(payload.loadSet)
                        } : simulator
                    }
                )
            }
        },
        [TRIG_INIT_STATE]: (state, {payload}) => {
            return {
                ...state,
                simulators: state.simulators.map(simulator => {
                        return simulator.id == payload.simulatorID ? {
                            ...simulator,
                            state: SIMULATOR_CONNECTION_STATE.noInfo,
                        } : simulator
                    }
                )
            }
        },
        [TRIG_TEST_DONE]: (state, {payload}) => {
            let tempResult = null;

            if(payload.testSuccess === "Y") {
                tempResult = SIMULATOR_CONNECTION_STATE.success
            } else {
                tempResult = SIMULATOR_CONNECTION_STATE.fail
            }

            return {
                ...state,
                simulators: state.simulators.map(simulator => {
                    if(simulator.id == payload.simulatorID) {
                        return {
                            ...simulator,
                            voltage: 0,
                            current: 0,
                            pwmMax: 0,
                            pwmMin: 0,
                            testResults: initialResult,
                            sequence: 0,
                            currTestSeq: 0,
                            test: SIMULATOR_TEST.done,
                            resistancePoint: RESISTANCE_POINT.noUse,
                            state: tempResult,
                            eventDes: '',
                            diodeState: 0,
                        }
                    } else {
                        return simulator;
                    }
                }),
            };
        },
    },
    initialSimulatorState
);

export default simulatorInfoState;
