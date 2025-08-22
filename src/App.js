import IndexPage from "./pages/IndexPage";
import './App.scss';
import {useEffect, useState} from "react";
import '../src/resources/css/bootstrap.min.css';
import '../src/resources/css/style.css';
import {useDispatch, useSelector} from "react-redux";
import { Navigate, Route, Routes} from 'react-router-dom';
import LoginPage from "./pages/LoginPage";
import {useNavigate} from "react-router";
import {v4 as uuidv4} from 'uuid';

import {
    getLastestTestInfo,
    getSimulatorConnStatus,
    getSimulatorInfo,
    getSimulatorList, updateConnStatusDone
} from "./state_modules/simulatorInfoState";
import {getChargerInfoDetail, getChargerList, getChargerListOnly} from "./state_modules/chargerInfoState";
import {openWebsocket, sendRequest} from "./state_modules/webSocketState";
import Swal from "sweetalert2";
import {useTranslation} from "react-i18next";
import {logout} from "./state_modules/authState";

function App() {
    const [screenSize, setScreenSize] = useState(getCurrentDimension());
    const authState = useSelector(state => state.authState);
    const simulators = useSelector(state => state.simulatorInfoState.simulators);
    const connStatusDone = useSelector(state => state.simulatorInfoState.connStatusDone);
    const webSocketState = useSelector(state => state.webSocketState);
    const loading = useSelector(state => state.loadingState);
    const dispatch = useDispatch();

    const navigate = useNavigate();
    const [t, i18n] = useTranslation('common');

    useEffect(() => {
        if(!localStorage.getItem('uuid')) {
            const uuid = uuidv4();
            localStorage.setItem('uuid', uuid);
        }
        if(localStorage.getItem('user')) {
            navigate("/");
        } else {
            navigate("/login");
        }

        const handleBeforeUnload = (event) => {
            localStorage.clear();
            /*event.preventDefault();
            // Chrome에서는 returnValue 설정이 필요
            event.returnValue = '';*/
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        // 컴포넌트가 언마운트 될 때 이벤트 리스너를 정리합니다.
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    useEffect(() => {
        if(!localStorage.getItem('user')) {
            dispatch(logout());
            navigate('/login');
        }
    }, [loading]);

    function getCurrentDimension(){
        return {
            width: window.innerWidth,
            height: window.innerHeight
        }
    }

    useEffect(() => {
        const updateDimension = () => {
            setScreenSize(getCurrentDimension())
        }
        window.addEventListener('resize', updateDimension);

        return(() => {
            window.removeEventListener('resize', updateDimension);
        })
    }, [screenSize])

    useEffect(() => {
        if(localStorage.getItem('user')) {
            const tempInfo = JSON.parse(localStorage.getItem('user'));

            dispatch(getSimulatorList(tempInfo.UserNo, tempInfo.UserID, tempInfo.Grade));
            //dispatch(getChargerList());
            dispatch(getChargerListOnly({
                onSuccess: (data) => {
                    if(data) {
                        (data.list).forEach((e) => {
                            dispatch(getChargerInfoDetail(e.ChargerID));
                        })
                    }
                },
                onFailure: (error) => {
                    console.log(error);
                }
            }));
            dispatch(openWebsocket());
        }
    }, []);

    useEffect(() => {
        if(authState.success) {
            try {
                navigate("/");
                const userInfo = authState.auth.userInfo;
                localStorage.setItem('user', JSON.stringify(userInfo));
                dispatch(getSimulatorList(userInfo.UserNo, userInfo.UserID, userInfo.Grade));
                //dispatch(getChargerList());
                dispatch(getChargerListOnly({
                    onSuccess: (data) => {
                        if(data) {
                            (data.list).forEach((e) => {
                                dispatch(getChargerInfoDetail(e.ChargerID));
                            })
                        }
                    },
                    onFailure: (error) => {
                        console.log(error);
                    }
                }));
                dispatch(openWebsocket());
            } catch (e) {
                console.log(e);
                console.log('localStorage is not working');
            }
        }
    }, [authState.success]);

    const [loadingCnt, setLoadingCnt] = useState();
    const [tot, setTot] = useState(0);
    const [loadingShow, setLoadingShow] = useState(false);

    /*useEffect(() => {
        if(loadingCnt===simulators.length) {
            setLoadingShow(false);
        }
    }, [loadingCnt]);*/

    useEffect(() => {
        let cnt = 0;
        if(simulators.length > 0) {
            setTot(simulators.length);
            setLoadingShow(true);
            setLoadingCnt(0);
            simulators.forEach((e, i) => {
                dispatch(getSimulatorInfo(e.id, {
                    onSuccess: (data) => {
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
    }, [simulators.length]);

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

   /* useEffect(() => {
        if(connStatusDone) {
            if(simulators.length > 0) {
                simulators.forEach((e, i) => {
                    dispatch(getLastestTestInfo(e.id));
                });
            }
        }
    }, [connStatusDone]);*/


    useEffect(() => {
        if(webSocketState.isOpen && simulators.length > 0) {
            let data = {};
            const tempInfo = JSON.parse(localStorage.getItem('user'));
            if(tempInfo.Grade === "M") {
                data = {UserGrade : "M", SimulatorID : simulators[0].id};
            } else if(tempInfo.Grade === "S") {
                data = {UserGrade : "S", SimulatorID : ""};
            }
            const dataString =  JSON.stringify(data);
            dispatch(sendRequest("open:" + dataString));
        }

        if(!webSocketState.isOpen && webSocketState.isReset) {
            dispatch(openWebsocket());
        }
    }, [webSocketState.isOpen, simulators.length]);

    return (
        <Routes>
            <Route path="/login" element={<LoginPage/>}/>
            <Route path="/" element={
                <div className="App">
                    <IndexPage style={{
                        width: screenSize.width,
                        height: screenSize.height
                    }}/>
                    {/*<LoadingComp cnt={loadingCnt} isShow={loadingShow} tot={tot} />*/}
                </div>
            }/>
        </Routes>
  );
}
export default App;
