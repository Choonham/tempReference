import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {applyMiddleware, createStore} from 'redux';
import rootReducer, {rootSaga} from "./state_modules";
import {Provider} from "react-redux";
import i18next from "i18next";
import {I18nextProvider} from "react-i18next";
import common_ko from "./translations/korean/common.json";
import common_en from "./translations/english/common.json";
import {composeWithDevTools} from "redux-devtools-extension";
import createSagaMiddleware from "redux-saga";
import {sampleSaga} from "./state_modules/sampleApiRequestState";
import { BrowserRouter } from "react-router-dom";
import {setWebSocketActions} from "./state_modules/webSocketState";
import {setSimulatorActions} from "./state_modules/simulatorInfoState";

const sagaMiddleware = createSagaMiddleware();

const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(sagaMiddleware)));

setWebSocketActions(store.dispatch);
setSimulatorActions(store.dispatch);

sagaMiddleware.run(rootSaga);

i18next.init({
    interpolation: { escapeValue: false },  // React already does escaping
    lng: 'en',                              // language to use
    resources: {
        en: {
            common: common_en               // 'common' is our custom namespace
        },
        ko: {
            common: common_ko
        },
    },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <I18nextProvider i18n={i18next}>
            <Provider store={store}>
                <App/>
            </Provider>
        </I18nextProvider>
    </BrowserRouter>
);

