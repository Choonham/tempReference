import {createAction, handleActions} from "redux-actions";

const SHOW_DISCONN_ALERT = 'alertState/SHOW_DISCONN_ALERT';

export const show_disconn_alert = createAction(SHOW_DISCONN_ALERT, flag => flag);

const initialState = {
    disconShow: false
};

const alertState = handleActions(
    {
        [SHOW_DISCONN_ALERT]: (state, {payload}) => {
            return {
                disconShow: payload
            }
        },
    },
    initialState
)

export default alertState;