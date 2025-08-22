import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import menuState, {MENUS} from "../state_modules/menuState";
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {login, logout} from "../state_modules/authState";
import {useNavigate} from "react-router";
import {
    getLastestTestInfo,
    getSimulatorConnStatus,
    getSimulatorInfo,
    getSimulatorList
} from "../state_modules/simulatorInfoState";
import {getChargerInfoDetail, getChargerListOnly} from "../state_modules/chargerInfoState";
import {setSimulConnInfo} from "../App";
import Swal from "sweetalert2";

const SideMenuCompo = ({onChangeMenuSelected}) =>  {
    const [t, i18n] = useTranslation('common');
    const [lan, setLan] = useState("");
    const [lanSelected, setLanSelected] = useState(false);

    const dispatch = useDispatch();
    const menu = useSelector(state => state.menuState).menu;

    const navigator = useNavigate();

    const authState = JSON.parse(localStorage.getItem('user'));
    const userGrade = authState === null ? "M" : authState.Grade;

    const isTrial = process.env.REACT_APP_IS_TRIAL;

    const simulators = useSelector(state => state.simulatorInfoState.simulators);

    const changeToEng = () => {
        i18n.changeLanguage('en');
    };

    const changeToKo = () => {
        i18n.changeLanguage('ko');
    };

    useEffect(() => {
        if(i18n.language === "ko") {
            setLan("한국어");
        } else {
            setLan("English");
        }
    }, [t]);

    const [loadingCnt, setLoadingCnt] = useState();
    const [tot, setTot] = useState(0);
    const [loadingShow, setLoadingShow] = useState(false);

    const onRefresh = () => {
        const tempInfo = JSON.parse(localStorage.getItem('user'));

        dispatch(getSimulatorList(tempInfo.UserNo, tempInfo.UserID, tempInfo.Grade));
        //dispatch(getChargerList());
        dispatch(getChargerListOnly({
            onSuccess: (data) => {
                if(data) {
                    (data.list).forEach((e) => {
                        dispatch(getChargerInfoDetail(e.ChargerID));
                    })
                    let cnt = 0;
                    if(simulators.length > 0) {
                        setTot(simulators.length);
                        setLoadingShow(true);
                        setLoadingCnt(0);
                        simulators.forEach((e, i) => {
                            dispatch(getSimulatorInfo(e.id, {
                                onSuccess: (data) => {
                                    console.log(e.id);
                                    dispatch(getSimulatorConnStatus(e.id, {
                                        onSuccess: (connData) => {
                                            if(connData.success) {
                                                dispatch(getLastestTestInfo(e.id, {
                                                    onSuccess: () => {
                                                        cnt += 1;
                                                        setLoadingCnt(cnt);
                                                    },
                                                    onFailure: (error) => {
                                                        console.log(error);
                                                    }
                                                }));
                                            } else {
                                                cnt += 1;
                                                setLoadingCnt(cnt);
                                            }
                                        },
                                        onFailure: (error) => {
                                            console.log(error);
                                        }
                                    }));
                                },
                                onFailure: (error) => {
                                    console.log(error);
                                }
                            }));
                        });
                    }
                }
            },
            onFailure: (error) => {
                console.log(error);
            }
        }));
    };

    useEffect(() => {
        if(loadingShow) {
            let timerInterval;

            const handleTimer = () => {
                if (loadingCnt >= tot) {
                    setLoadingShow(false);
                    //clearInterval(timerInterval);
                    Swal.close()
                }
            };

            Swal.fire({
                title: "Loading...",
                html: t('alert.loadingMsg'),
                allowOutsideClick: false,
                timer: 10000,
                timerProgressBar: true,
                didOpen: () => {
                    Swal.showLoading();
                    timerInterval = setInterval(() => {
                        handleTimer();
                    }, 500);
                },
                willClose: () => {
                    clearInterval(timerInterval);
                }
            }).then((result) => {
                /* Read more about handling dismissals below */
                if (result.dismiss === Swal.DismissReason.timer) {
                    console.log("I was closed by the timer");
                }
            });

            // useEffect의 클린업 함수에서 setInterval을 정리합니다.
            return () => {
                clearInterval(timerInterval);
            };
        }
    }, [loadingCnt]);

    return (
        <div className="header_wrap">
            <div className="header">
                <h1><img src="style/img/img_logo_w.png" alt="로고"/></h1>
                <div className="gnb_wrap">
                    <ul className="gnb">
                        <li className={ menu === MENUS.Main ? "gnb_item active" : "gnb_item"} >
                            <a className="gnb_main" onClick={() => {
                                onChangeMenuSelected(MENUS.Main);
                            }} title="메인">{t('sideBar.main')}</a>
                        </li>
                        {
                            isTrial === '0' ? (
                                <li className={ menu === MENUS.TestResult ? "gnb_item active" : "gnb_item"} >
                                    <a className="gnb_eventLog" onClick={() => {
                                        onChangeMenuSelected(MENUS.TestResult);
                                    }} title="시험결과">{t('sideBar.testResult')}</a>
                                </li>
                            ) : null
                        }
                        {
                            userGrade === "S" && isTrial === '0' ? (
                                <li className={ menu === MENUS.Statistics ? "gnb_item active" : "gnb_item"} >
                                    <a className="gnb_eventLog" onClick={() => {
                                        onChangeMenuSelected(MENUS.Statistics);
                                    }} title="Statistics">{t('sideBar.Statistics')}</a>
                                </li>
                            ) : null
                        }
                        <li className={ menu === MENUS.SimulatorConfig || menu === MENUS.ManageCharger ? "gnb_item active" : "gnb_item"} >
                            <a title="환경설정" className="gnb_setting">{t('sideBar.Config')}</a>
                            <ul className="gnb_sub">
                                <li className="gnb_sub_item">
                                    <a onClick={() => {
                                        onChangeMenuSelected(MENUS.SimulatorConfig);
                                    }} title="시뮬레이터 설정">{t('sideBar.SimulatorConfig')}</a>
                                    <a onClick={() => {
                                        onChangeMenuSelected(MENUS.ManageCharger);
                                    }} title="충전기 관리">{t('sideBar.ManageCharger')}</a>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
                <div className="top_wrap">
                    <button type="button" className="btn btn_refresh" title="Refresh" onClick={onRefresh}>Refresh</button>
                    <button type="button" className={lanSelected ? "btn on btn_global" : "btn btn_global"}
                        onMouseOver={() => {
                            setLanSelected(true);
                         }}
                        onMouseOut={() => {
                            setLanSelected(false);
                        }}
                        title="한국어"
                    >
                        {lan}
                        <ul className="global_sub">
                            <li className="global_sub_item" >
                                <a title="한국어" onClick={() => changeToKo()}>한국어</a>
                            </li>
                            <li className="global_sub_item">
                                <a title="ENGLISH" onClick={() => changeToEng()}>ENGLISH</a>
                            </li>
                        </ul>
                    </button>
                    <button type="button" className="btn btn_logout" title="로그아웃" onClick={() => {
                        localStorage.clear();
                        dispatch(logout());
                        navigator('/login');
                        window.location.reload();
                    }
                    }>LOGOUT</button>
                </div>
            </div>
        </div>
    )
}

export default SideMenuCompo;
