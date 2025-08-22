import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import React from "react";
import {useDispatch} from "react-redux";
import {insertProcessResult} from "../state_modules/testResultState";
import Swal from 'sweetalert2';

const InsertEventProcComp = (param) => {
    const [proc, setProc] = useState('');
    const [t, i18n] = useTranslation('common');
    const dispatch = useDispatch();

    const [paramState, setParamState] = useState({});

    const handleConfirm = () => {
        dispatch(insertProcessResult(param.testID, param.eventID, paramState.processing, {
            onSuccess: () => {
                Swal.fire({
                    title: 'Confirm!',
                    text: t("config.insertProcessConfirm"),
                    icon: 'success',
                    confirmButtonText: 'Okay',
                    allowOutsideClick: false
                });
                paramState.handleClose();
            },
            onFailure: (e) => {
                console.log(e);
                Swal.fire({
                    title: 'Error',
                    text: t("config.insertProcessError"),
                    icon: 'error',
                    confirmButtonText: 'Okay',
                    allowOutsideClick: false
                });
            }
        }));
    };

    useEffect(() => {
        setParamState(param);
    }, [param]);

    return paramState.isVisible ? (
        <div className="modal-overlay">
            <div className="modalCls">
                <button className="close-button" onClick={paramState.handleClose}>
                    &times;
                </button>
                <div className="contents_box">
                    <div className="table_input_wrap">
                        <div className="table_input_title">
                            <h4 className={"side_bar_title_comp"}>{t("config.eventActionDescription")}</h4>
                        </div>
                        <div className="table_input_contents">
                            <div className="table_input">
                                <div className="table_input_th">{t("config.simulator")}</div>
                                <div className="table_input_td">{paramState.simulatorName}</div>
                            </div>
                        </div>
                        <div className="table_input_contents">
                            <div className="table_input">
                                <div className="table_input_th">{t("config.charger")}</div>
                                <div className="table_input_td">{paramState.chargerName}</div>
                            </div>
                        </div>
                        <div className="table_input_contents">
                            <div className="table_input">
                                <div className="table_input_th">{t("config.testMode")}</div>
                                <div className="table_input_td">{paramState.testMode}</div>
                            </div>
                        </div>
                        <div className="table_input_contents">
                            <div className="table_input">
                                <div className="table_input_th">{t("config.description")}</div>
                                <div className="table_input_td">{paramState.description}</div>
                            </div>
                        </div>
                        <div className="table_input_contents">
                            <div className="table_input">
                                <div className="table_input_th">{t("config.content")}</div>
                                <div className="table_input_td">
                                    <textarea className="form-control" rows="5" placeholder={t("config.enterComment")}
                                              title={t("config.enterComment")} value={paramState.processing}
                                              onChange={(e) => {
                                                  setParamState(
                                                      {
                                                          ...paramState,
                                                          processing: e.target.value
                                                      }
                                                  );
                                              }}
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="contents_btn2">
                        <button type="button" className="btn btn_blue ml_center" title={t("config.connectionTest")}
                                onClick={() => {
                                    if(paramState.processing === '') {
                                        Swal.fire({
                                            title: 'Error',
                                            text: t("config.insertProcessError"),
                                            icon: 'error',
                                            confirmButtonText: 'Okay',
                                            allowOutsideClick: false
                                        });

                                        return;
                                    }

                                    handleConfirm();
                                }}>{t("config.confirm")}</button>
                    </div>
                </div>
            </div>
        </div>
    ) : null;
};

export default InsertEventProcComp;
