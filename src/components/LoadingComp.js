import React from "react";
import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {useTranslation} from "react-i18next";

const LoadingComp = ({cnt, isShow, tot}) => {
    const [showAlert, setShowAlert] = useState(false);
    const [msg, setMsg] = useState('Getting simulator & connection info...');
    const [t, i18n] = useTranslation('common');

    /*const latestLoadingDone = useSelector(state => state.simulatorInfoState.latestLoadingDone);
    const connStatusDone = useSelector(state => state.simulatorInfoState.connStatusDone);*/

    useEffect( () => {
        setShowAlert(isShow);
    }, [isShow]);

    useEffect(() => {
        console.log(cnt);
    }, [cnt]);

    return showAlert ? (
        <div className="loading-overlay">
            <div className="alert">
                {/*<img src="style/img/loading.gif" alt="Loading"/>*/}
                {msg + cnt + '/' + tot}
            </div>
        </div>
    ) : null;
};

export default LoadingComp;