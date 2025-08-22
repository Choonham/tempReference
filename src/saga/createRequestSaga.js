import {call, put} from 'redux-saga/effects';
import {finishLoading, startLoading} from "../state_modules/loadingState";
import Swal from "sweetalert2";

export const createRequestAction = (type, payload, callbacks) => ({
    type,
    payload,
    callbacks,
});

export const createRequestActionTypes = type => {
    const SUCCESS = `${type}_SUCCESS`;
    const FAILURE = `${type}_FAILURE`;
    return [type, SUCCESS, FAILURE];
}

export default function createRequestSaga(type, request) {
    const SUCCESS = `${type}_SUCCESS`;
    const FAILURE = `${type}_FAILURE`;
    return function* (action) {
        yield put(startLoading(type));
        const token = localStorage.getItem('accessToken');

        if(type !== 'authState/LOGIN') {
            if(!token ) {
                Swal.fire({
                    title: 'Error!',
                    text: "The Authorization token has been expired.",
                    icon: 'error',
                    confirmButtonText: 'Okay',
                    allowOutsideClick: false
                });
                localStorage.clear();
                return put(finishLoading(type));
            }
        }

        try{
            const response = yield call(request, action.payload);
            yield put({
                type: SUCCESS,
                payload: response.data,
                requestPayload: action.payload
            });
            action.callbacks?.onSuccess(response.data);
        } catch(e) {
            yield put({
                type: FAILURE,
                payload: e,
                error: true
            });
            action.callbacks?.onFailure(e);

            /*localStorage.clear();
            window.location.reload();*/

            Swal.fire({
                title: 'Error!',
                text: "There is no response from the server, please contact your administrator.",
                icon: 'error',
                confirmButtonText: 'Okay',
                allowOutsideClick: false
            }).then((result) => {
                if (result.value) {
                    localStorage.clear();
                    window.location.reload();
                }
            });
        }
        yield put(finishLoading(type));
    }
}
