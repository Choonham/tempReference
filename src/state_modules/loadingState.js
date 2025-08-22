import {createAction, handleActions} from "redux-actions";

const START_LOADING = 'loadingState/START_LOADING';
const FINISH_LOADING = 'loadingState/FINISH_LOADING';

export const startLoading = createAction(
    START_LOADING,
    requestType => requestType
);

export const finishLoading = createAction(
    FINISH_LOADING,
    requestType => requestType
);

const initialState = {};

const loadingState = handleActions(
    {
        [START_LOADING]: (state, action) => {
            return {
                ...state,
                [action.payload]: true
            }
        },
        [FINISH_LOADING]: (state, action) => ({
            ...state,
            [action.payload]: false
        })
    },
    initialState
);

export default loadingState;