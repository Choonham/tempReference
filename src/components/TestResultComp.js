import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {getTestResultDetail, getTestResultDetailData} from "../state_modules/testResultState";
import {getSimulatorConnStatus, getSimulatorInfo} from "../state_modules/simulatorInfoState";
import TestResultGraph from "./TestResultGraph";
import InsertEventProcComp from "./InsertEventProcComp";

/* flag - from test result: 1, from controlPanelPage: 0 */
const TestResultComp = ({testID, simulatorName, flag, handleOK, handleRestart, getReport, getReportPdf}) => {
    const [t, i18n] = useTranslation('common');

    const dispatch = useDispatch();

    const resultData = useSelector(state => state.testResultState.resultDetail);

    const [npData, setNpData] = useState({});
    const [gfData, setGfData] = useState({});
    const [bpcData, setBpcData] = useState({});
    const [sccData, setSccData] = useState({});
    const [dfData, setDfData] = useState({});
    const [ccidData, setCcidData] = useState({});

    const [eventData, setEventData] = useState([]);

    const [showGraph, setShowGraph] = useState(false);

    const isTrial = process.env.REACT_APP_IS_TRIAL;

    useEffect(() => {
        dispatch(getTestResultDetail(testID, {
            onSuccess: (data) => {
                setNpData(data.data.result.filter((el) => el.seq === 1)[0]);
                setGfData(data.data.result.filter((el) => el.seq === 2)[0]);
                setBpcData(data.data.result.filter((el) => el.seq === 3)[0]);
                setSccData(data.data.result.filter((el) => el.seq === 4)[0]);
                setDfData(data.data.result.filter((el) => el.seq === 5)[0]);
                setCcidData(data.data.result.filter((el) => el.seq === 6)[0]);

                setEventData(data.data.event);
            },
            onFailure: (error) => {
                console.log(error);
            }
        }));
    }, [testID]);

    useEffect(() => {
        if(resultData.event) {
            setEventData(resultData.event);
        }
    }, [resultData]);

    const [failData, setFailData] = useState();

    const getDetailData = (sequenceID) => {
        setShowGraph(false);
        setFailData('');
        dispatch(getTestResultDetailData(testID, sequenceID, {
            onSuccess: (result) => {
                setFailData(result.data);
                setShowGraph(true);
            },
            onFailure: (error) => {
                console.log(error);
            }
        }))
    };

    const [eventInsertData, setEventInsertData] = useState({});
    const [insertPopupVisible, setInsertPopupVisible] = useState(false);

    const [insertModal, setInsertModal] = useState(null);

    /*useEffect(() => {
        if(insertPopupVisible) {
            setInsertModal(<InsertEventProcComp
                isVisible={insertPopupVisible}
                simulatorName={simulatorName}
                chargerName={resultData.ModelName}
                testMode={resultData.Resistance}
                description={eventInsertData.description}

            />);
        } else {
            setInsertModal(null);
        }
    }, [insertPopupVisible])*/

    return (
        <div className="contents_wrap scrollbar_custom">
            <InsertEventProcComp
                isVisible={insertPopupVisible}
                testID={testID}
                eventID={eventInsertData.eventID}
                simulatorName={simulatorName}
                chargerName={resultData.ModelName}
                testMode={resultData.Resistance}
                description={eventInsertData.description}
                processing={eventInsertData.processing}
                handleClose={() => {setInsertPopupVisible(false)}}
            />
            <div className="simulator_wrap">
                <div className="simulator_title">
                    <h2>{simulatorName}&nbsp;{resultData.ModelName}(S/N&nbsp;{resultData.SerialNo})</h2>
                </div>
                <div className="simulator_contents">
                    <div className="simulator_box_wrap_1">
                        <div className="table_wrap">
                            <div className="table_responsive">
                                <table className="table_2 mt_0">
                                    <colgroup>
                                        <col width="*"/>
                                        <col width="20%"/>
                                        <col width="20%"/>
                                        <col width="20%"/>
                                    </colgroup>
                                    <thead>
                                    <tr>
                                        <th scope="col" className="text-center">Mode</th>
                                        <th scope="col" className="text-center">Low</th>
                                        <th scope="col" className="text-center">Normal</th>
                                        <th scope="col" className="text-center">High</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <td className="text-center">{t('simulator.testSequence.normalOperation')}</td>
                                        <td className="text-center">
                                            <span
                                                className={npData.low === "S" ?  "text_Success" : "text_red"}
                                            >
                                                {
                                                    npData.low === "S" ?
                                                    "Success" :
                                                    npData.low === "F" ?
                                                        (<a onClick={() => {getDetailData(npData.lowSeqID)}}>Fail</a>) :
                                                        "-"
                                                }
                                            </span>
                                        </td>
                                        <td className="text-center">
                                            <span
                                                className={npData.normal === "S" ?  "text_Success" : "text_red"}
                                            >
                                                {
                                                    npData.normal === "S" ?
                                                        "Success" :
                                                        npData.normal === "F" ?
                                                            (<a onClick={() => {getDetailData(npData.normalSeqID)}}>Fail</a>) :
                                                            "-"
                                                }
                                            </span>
                                        </td>
                                        <td className="text-center">
                                           <span
                                               className={npData.high === "S" ?  "text_Success" : "text_red"}
                                           >
                                                {
                                                    npData.high === "S" ?
                                                        "Success" :
                                                        npData.high === "F" ?
                                                            (<a onClick={() => {getDetailData(npData.highSeqID)}}>Fail</a>) :
                                                            "-"
                                                }
                                            </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="text-center">{t('simulator.testSequence.groundFault')}</td>
                                        <td className="text-center">
                                            <span
                                                className={gfData.low === "S" ?  "text_Success" : "text_red"}
                                            >
                                                {
                                                    gfData.low === "S" ?
                                                        "Success" :
                                                        gfData.low === "F" ?
                                                            (<a onClick={() => {getDetailData(gfData.lowSeqID)}}>Fail</a>) :
                                                            "-"
                                                }
                                            </span>
                                        </td>
                                        <td className="text-center">
                                            <span
                                                className={gfData.normal === "S" ?  "text_Success" : "text_red"}
                                            >
                                                {
                                                    gfData.normal === "S" ?
                                                        "Success" :
                                                        gfData.normal === "F" ?
                                                            (<a onClick={() => {getDetailData(gfData.normalSeqID)}}>Fail</a>) :
                                                            "-"
                                                }
                                            </span>
                                        </td>
                                        <td className="text-center">
                                           <span
                                               className={gfData.high === "S" ?  "text_Success" : "text_red"}
                                           >
                                                {
                                                    gfData.high === "S" ?
                                                        "Success" :
                                                        gfData.high === "F" ?
                                                            (<a onClick={() => {getDetailData(gfData.highSeqID)}}>Fail</a>) :
                                                            "-"
                                                }
                                            </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="text-center">{t('simulator.testSequence.blockProtectiveConductor')}</td>
                                        <td className="text-center">
                                            <span
                                                className={bpcData.low === "S" ?  "text_Success" : "text_red"}
                                            >
                                                {
                                                    bpcData.low === "S" ?
                                                        "Success" :
                                                        bpcData.low === "F" ?
                                                            (<a onClick={() => {getDetailData(bpcData.lowSeqID)}}>Fail</a>) :
                                                            "-"
                                                }
                                            </span>
                                        </td>
                                        <td className="text-center">
                                            <span
                                                className={bpcData.normal === "S" ?  "text_Success" : "text_red"}
                                            >
                                                {
                                                    bpcData.normal === "S" ?
                                                        "Success" :
                                                        bpcData.normal === "F" ?
                                                            (<a onClick={() => {getDetailData(bpcData.normalSeqID)}}>Fail</a>) :
                                                            "-"
                                                }
                                            </span>
                                        </td>
                                        <td className="text-center">
                                           <span
                                               className={bpcData.high === "S" ?  "text_Success" : "text_red"}
                                           >
                                                {
                                                    bpcData.high === "S" ?
                                                        "Success" :
                                                        bpcData.high === "F" ?
                                                            (<a onClick={() => {getDetailData(bpcData.highSeqID)}}>Fail</a>) :
                                                            "-"
                                                }
                                            </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="text-center">{t('simulator.testSequence.ShortControlCircuit')}</td>
                                        <td className="text-center">
                                            <span
                                                className={sccData.low === "S" ?  "text_Success" : "text_red"}
                                            >
                                                {
                                                    sccData.low === "S" ?
                                                        "Success" :
                                                        sccData.low === "F" ?
                                                            (<a onClick={() => {getDetailData(sccData.lowSeqID)}}>Fail</a>) :
                                                            "-"
                                                }
                                            </span>
                                        </td>
                                        <td className="text-center">
                                            <span
                                                className={sccData.normal === "S" ?  "text_Success" : "text_red"}
                                            >
                                                {
                                                    sccData.normal === "S" ?
                                                        "Success" :
                                                        sccData.normal === "F" ?
                                                            (<a onClick={() => {getDetailData(sccData.normalSeqID)}}>Fail</a>) :
                                                            "-"
                                                }
                                            </span>
                                        </td>
                                        <td className="text-center">
                                           <span
                                               className={sccData.high === "S" ?  "text_Success" : "text_red"}
                                           >
                                                {
                                                    sccData.high === "S" ?
                                                        "Success" :
                                                        sccData.high === "F" ?
                                                            (<a onClick={() => {getDetailData(sccData.highSeqID)}}>Fail</a>) :
                                                            "-"
                                                }
                                            </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="text-center">{t('simulator.testSequence.CCID20')}</td>
                                        <td className="text-center">-</td>
                                        <td className="text-center">
                                           <span
                                               className={ccidData.normal === "S" ?  "text_Success" : "text_red"}
                                           >
                                                {
                                                    ccidData.normal === "S" ?
                                                        "Success" :
                                                        ccidData.normal === "F" ?
                                                            (<a onClick={() => {getDetailData(ccidData.normalSeqID)}}>Fail</a>) :
                                                            "-"
                                                }
                                            </span>
                                        </td>
                                        <td className="text-center">-</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div style={{margin: '30px',}}></div>
                            <div className="table_responsive">
                                <table className="table_2 mt_0">
                                    <colgroup>
                                        <col width="*"/>
                                        <col width="20%"/>
                                        <col width="20%"/>
                                        <col width="20%"/>
                                    </colgroup>
                                    <thead>
                                    <tr>
                                        <th scope="col" className="text-center">Mode</th>
                                        <th scope="col" className="text-center">Short</th>
                                        <th scope="col" className="text-center">-</th>
                                        <th scope="col" className="text-center">Open</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="text-center">{t('simulator.testSequence.diodeFault')}</td>
                                            <td className="text-center">
                                                <span
                                                    className={dfData.low === "S" ?  "text_Success" : "text_red"}
                                                >
                                                    {
                                                        dfData.low === "S" ?
                                                            "Success" :
                                                            dfData.low === "F" ?
                                                                (<a onClick={() => {getDetailData(dfData.lowSeqID)}}>Fail</a>) :
                                                                "-"
                                                    }
                                                </span>
                                            </td>
                                            <td className="text-center">-</td>
                                            <td className="text-center">
                                               <span
                                                   className={dfData.high === "S" ?  "text_Success" : "text_red"}
                                               >
                                                    {
                                                        dfData.high === "S" ?
                                                            "Success" :
                                                            dfData.high === "F" ?
                                                                (<a onClick={() => {getDetailData(dfData.highSeqID)}}>Fail</a>) :
                                                                "-"
                                                    }
                                                </span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="table_wrap mt_30">
                            <div className="simulator_testresult_title">Event Log</div>
                            <div className="table_responsive">
                                <table className="table">
                                    <caption>이벤트 로그 목록보기</caption>
                                    <colgroup>
                                        <col width="4%"/>
                                        <col width="15%"/>
                                        <col width="18%"/>
                                        <col width="25%"/>
                                        <col width="*"/>
                                        <col width="4%"/>
                                    </colgroup>
                                    <thead>
                                    <tr>
                                        <th scope="col" className="text-center">No</th>
                                        <th scope="col" className="text-center">Date</th>
                                        <th scope="col" className="text-center">Mode</th>
                                        <th scope="col" className="text-center">Description</th>
                                        <th scope="col" className="text-center">Content</th>
                                        <th scope="col" className="text-center"></th>
                                    </tr>
                                    </thead>
                                </table>
                            </div>
                            <div className="table_responsive tbody_scroll scrollbar_custom">
                                <table className="table mt_0">
                                    <caption>이벤트 로그 목록보기</caption>
                                    <colgroup>
                                        <col width="4%"/>
                                        <col width="15%"/>
                                        <col width="18%"/>
                                        <col width="25%"/>
                                        <col width="*"/>
                                        <col width="4%"/>
                                    </colgroup>
                                    <tbody>
                                    {
                                        eventData && (
                                            eventData.length === 0 ? (
                                            <tr>
                                                <td colSpan={6} className="text-center">{t("view.nothingToDisplay")}</td>
                                            </tr>
                                            ) : (eventData.map((el, i) => {
                                            const desSplit = el.description.split(':');

                                            return (
                                                <tr>
                                                    <td className="text-center"></td>
                                                    <td className="text-center">{el.regDate}</td>
                                                    <td className="text-center">{desSplit[0]}</td>
                                                    <td className="text-center"><span className="text_red">{desSplit[1]}</span></td>
                                                    <td className="text-center">{el.processing}</td>
                                                    <td className="text-center btn_popup">
                                                        <button
                                                            type="button"
                                                            className="btn"
                                                            onClick={() => {
                                                                setEventInsertData(el);
                                                                setInsertPopupVisible(true);
                                                            }}
                                                        >
                                                            <img src="style/img/sub/img_files.png" alt="팝업"/>
                                                        </button>
                                                    </td>
                                                </tr>
                                            )
                                        }))
                                        )
                                    }
                                    {/*<tr>
                                        <td className="text-center"></td>
                                        <td>2023-08-01 11:22:33</td>
                                        <td>Normal operation (L)</td>
                                        <td>Test Start</td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td className="text-center">9</td>
                                        <td>2023-08-01 11:22:33</td>
                                        <td>Normal operation (L)</td>
                                        <td><span className="text_red">Ground fault Operation Fault</span></td>
                                        <td><span
                                            className="text_red">A1 Status not detected - B2 Status Indicate.</span> I
                                            did this and that.
                                        </td>
                                        <td className="text-center btn_popup">
                                            <button type="button" className="btn">
                                                <img src="style/img/sub/img_files.png" alt="팝업"/>
                                            </button>
                                        </td>
                                    </tr>*/}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="simulator_box_wrap_2">
                        <div className="simulator_set_wrap">
                            <div className="simulator_set_box">
                                <div className="simulator_set_box_title">{t('simulator.chargeTime')}</div>
                                <div className="simulator_set_box_body">
                                    {resultData.ChargingTime}min
                                </div>
                            </div>
                            <div className="simulator_set_box">
                                <div className="simulator_set_box_title">{t('simulator.intervalTime')}</div>
                                <div className="simulator_set_box_body">
                                    {resultData.IntervalTime}sec
                                </div>
                            </div>
                            <div className="simulator_set_box">
                                <div className="simulator_set_box_title">{t('simulator.permanentResistance')}</div>
                                <div className="simulator_set_box_body">
                                    {resultData.PowerRate}kW
                                </div>
                            </div>
                        </div>
                        <div className="simulator_glaph_wrap">
                            <div className="simulator_testresult_title mt_5">Voltage</div>
                            <div className="simulator_glaph_box">
                                <div className="simulator_guage">
                                    <div className="simulator_text_box">
                                        <div className="simulator_text_box_title">Max</div>
                                        <div className="simulator_text_box_con">{failData ? failData.MaxVolt + 'V' : 'No Data'}</div>
                                    </div>
                                    <div className="simulator_text_box">
                                        <div className="simulator_text_box_title">Min</div>
                                        <div className="simulator_text_box_con">{failData ? failData.MinVolt + 'V' : 'No Data'}</div>
                                    </div>
                                </div>
                                <div className="simulator_graph">
                                    <div className="scrollbar_custom">
                                        {
                                            failData ?
                                                <TestResultGraph startTime={resultData.StartDate} endTime={resultData.EndDate} data={failData.Volt} dataFlag={0} show={showGraph}/> :
                                                ''
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="simulator_testresult_title mt_5">Current</div>
                            <div className="simulator_glaph_box">
                                <div className="simulator_guage">
                                    <div className="simulator_text_box">
                                        <div className="simulator_text_box_title">Max</div>
                                        <div className="simulator_text_box_con">{failData ? failData.MaxAmp + 'A' : 'No Data'}</div>
                                    </div>
                                    <div className="simulator_text_box">
                                        <div className="simulator_text_box_title">Min</div>
                                        <div className="simulator_text_box_con">{failData ? failData.MinAmp + 'A' : 'No Data'}</div>
                                    </div>
                                </div>
                                <div className="simulator_graph">
                                    <div className="scrollbar_custom">
                                        {
                                            failData ?
                                                <TestResultGraph startTime={resultData.StartDate} endTime={resultData.EndDate} data={failData.Amp} dataFlag={1} show={showGraph}/> :
                                                ''
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="simulator_testresult_title mt_5">PWM</div>
                            <div className="simulator_glaph_box">
                                <div className="simulator_guage">
                                    <div className="simulator_text_box">
                                        <div className="simulator_text_box_title">Max</div>
                                        <div className="simulator_text_box_con">{failData ? failData.MaxPwm + 'V' : 'No Data'}</div>
                                    </div>
                                    <div className="simulator_text_box">
                                        <div className="simulator_text_box_title">Min</div>
                                        <div className="simulator_text_box_con">{failData ? failData.MinPwm + 'V' : 'No Data'}</div>
                                    </div>
                                </div>
                                <div className="simulator_graph">
                                    <div className="scrollbar_custom">
                                        {
                                            failData ?
                                                <TestResultGraph startTime={resultData.StartDate} endTime={resultData.EndDate} data={{max: failData.PWM_Max, min: failData.PWM_Min}} dataFlag={2} show={showGraph}/> :
                                                ''
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="simulator_test_result_btn">
                <button
                    type="button"
                    className="btn btn_blue ml_4"
                    onClick={() => {
                        handleOK();
                    }}>OK</button>
                {
                    flag === 0 ? (
                        <button type="button" className="btn btn_red ml_4" onClick={() => {
                            handleRestart();
                        }}>Retest</button>
                    ) : ''
                }
                {
                    isTrial ==='0' ? (
                        <div style={{width: 'auto'}}>
                            <button
                                type="button"
                                className="btn btn_black ml_auto"
                                style={{marginRight: 10}}
                                onClick={() => {
                                    getReport({
                                        testID: testID,
                                        simulatorName: simulatorName,
                                        testDate: resultData.EndDate,
                                        serialNo: resultData.SerialNo,
                                        modelName: resultData.ModelName,
                                        technician: resultData.Technician,
                                        result: resultData.result,
                                    });
                                }}
                            >Download Excel
                            </button>
                            <button
                                type="button"
                                className="btn btn_black ml_auto"
                                onClick={() => {
                                    getReportPdf({
                                        testID: testID,
                                        simulatorName: simulatorName,
                                        testDate: resultData.EndDate,
                                        serialNo: resultData.SerialNo,
                                        modelName: resultData.ModelName,
                                        technician: resultData.Technician,
                                        result: resultData.result,
                                    });
                                }}
                            >Report
                            </button>
                        </div>
                    ) : null
                }
            </div>
        </div>
    )
}

export default TestResultComp;
