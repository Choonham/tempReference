import {createAction, handleActions} from "redux-actions";

const ADD_EVENT_LOG = 'eventLogState/ADD_EVENT_LOG';
const GET_ALL_EVENT_LOGS = 'eventLogState/GET_ALL_EVENT_LOGS';
const GET_EVENT_LOGS = 'eventLogState/GET_EVENT_LOGS';
const SET_EVENT_LOGS_PAGE = 'eventLogState/SET_EVENT_LOGS_PAGE';

export const addEventLog = createAction(ADD_EVENT_LOG);
export const getAllEventLogs = createAction(GET_ALL_EVENT_LOGS);
export const getEventLogs = createAction(GET_EVENT_LOGS);
export const setEventLogCurrPage = createAction(SET_EVENT_LOGS_PAGE);

const initialState = {
    eventLogs: [
        /*{
            index: 0,
            id: 0,
            date: '2023-08-01',
            simulatorID: 0,
            simulatorName: 'Simulator1',
            chargerName: 'TestCharger',
            mode: '100',
            description: 'this is test description',
            eventCode: '101',
            detail: 'this is test detail'
        }*/
    ],
    filteredData: [

    ],
    currentPage: 0,
    itemsPerPage: 10,
    index: 0,
    totalPage: 0,
};

const eventLogState = handleActions(
    {
        [addEventLog]: (state, action) => {
            state.index++;
            const data = {
                ...action.payload,
                index: state.index,
            }
            return {
                ...state,
                eventLogState: state.eventLogs.push(data),
                totalPage: parseInt(state.eventLogs.length / state.itemsPerPage) + 1
            }
        },
        [getAllEventLogs]: (state, action) => {
            return {
                ...state,
                filteredData: state.eventLogs.slice(state.itemsPerPage * state.currentPage, state.itemsPerPage * state.currentPage + (state.itemsPerPage))
            };
        },
        [getEventLogs]: (state, action) => {

        },
        [setEventLogCurrPage]: (state, action) => {
            return {
                ...state,
                currentPage: action.payload
            }
        }
    },
    initialState
);

export default eventLogState;