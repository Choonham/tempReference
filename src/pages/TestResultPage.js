import {useDispatch, useSelector} from "react-redux";
import { fas } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import {useEffect, useState} from "react";
import {
    deleteTestInfo,
    getAllTestResults,
    getTestReport,
    getTestResult,
    setTestResultPage
} from "../state_modules/testResultState";
import {useTranslation} from "react-i18next";
import DatePickerComp from "../components/DatePickerComp";
import Swal from "sweetalert2";
import ResultDetailModal from "../components/ResultDetailModal";
import {API_REQUEST_URL} from "../apis/Common";
import {getAxiosConfigWithAuthHeaders} from "../apis/api";
import {getChargerInfoDetail} from "../state_modules/chargerInfoState";

const TestResultPage = () => {
    const testResults = useSelector(state => state.testResultState.testResults);

    const testResultLoading = useSelector(state => state.loadingState)["testResultState/GET_TEST_RESULT"];

    const totalCnt = useSelector(state => state.testResultState.totalCnt);
    const simulators = useSelector(state => state.simulatorInfoState.simulators);
    const chargers = useSelector(state => state.chargerInfoState.chargers);

    const [curPage, setCurPage] = useState(0);

    const [t, i18n] = useTranslation('common');

    const dispatch = useDispatch();

    const [showModal, setShowModal] = useState(false);

    const [today, setToday] = useState();

    const formatDate = (dateString) => {
        let date = null;

        if(dateString === '') {
            date = new Date();
        } else {
            date = new Date(dateString);
        }

        let month = '' + (date.getMonth() + 1);
        let day = '' + date.getDate();
        const year = date.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [year, month, day].join('-');
    }

    const resultSearch = (page) => {
        dispatch(getTestResult(
            searchParam.simulatorID,
            searchParam.deviceID,
            searchParam.chargerID,
            searchParam.serialNo,
            formatDate(searchParam.startDate),
            formatDate(searchParam.endDate),
            page
        ));
        setCurPage(page);
    };

    useEffect(() => {
        const date = new Date();

        setToday(date);
    }, []);

    library.add(fas);

    const toggleModal = () => {
        setShowModal(!showModal);
    };

    const getResultBtn = (result) => {
        if(result === "F") return (<div className={"failBtn"}>Fail</div>);
        if(result === "S") return (<div className={"successBtn"}>Sussess</div>);
        return (<div>-</div>);
    };

    const [chargerList, setChargerList] = useState([]);
    const [simulatorList, setSimulatorList] = useState([]);

    const scrollUp = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    useEffect(() => {
        setSimulatorList(simulators);
        setChargerList(chargers);
    }, [simulators, chargers]);

    const itemsPerPage = 10;
    const pageNum = 5;

    const [totalPages, setTotalPages] = useState(1);
    const [currPageCnt, setCurrPageCnt] = useState(1);

    useEffect(() => {
        setTotalPages(Math.ceil(totalCnt / (itemsPerPage * pageNum)));
        setCurrPageCnt(1);
    }, [totalCnt]);

    const [searchParam, setSearchParam] = useState({
        simulatorID: '',
        deviceID: '',
        chargerID: '',
        serialNo: '',
        startDate: '',
        endDate: '',
    });

    useEffect(() => {
        if(testResultLoading) {
            Swal.fire({
                title: "Loading...",
                html: t('alert.searchingTestResult'),
                didOpen: () => {
                    Swal.showLoading();
                },
                allowOutsideClick: false
            }).then((result) => {
                /* Read more about handling dismissals below */
                if (result.dismiss === Swal.DismissReason.timer) {
                    console.log("I was closed by the timer");
                }
            });
        } else {
            Swal.close();
            setTimeout(scrollUp, 200); // Delay scrolling by 300ms
        }
    }, [testResultLoading]);

    const [passToDetail, setPassToDetail] = useState({
        testID: 0,
        simulatorName: '',
        testDate: '',
        serialNo: '',
        modelName: '',
        technician: '',
        result: [],
    });

    const numOfRows = 6;

    /*const getReport = (testID) => {
        dispatch(getTestReport(testID, {
            onSuccess: (data) => {
                const url = window.URL.createObjectURL(new Blob([data], {
                    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                }));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'modified_file.xlsx');
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            },
            onFailure: (e) => {
                console.error(e);
            },
        }));
    };
*/
    const getReport = async (dataProps) => {
        try {
            const headers = getAxiosConfigWithAuthHeaders().headers;

            headers['Content-Type'] = 'application/json';

            const response = await fetch(`${API_REQUEST_URL}downloadExcel/testResultExcel`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(dataProps)
            });

            if (!response.ok) {
                throw new Error('Server responded with an error!');
            }

            const contentDisposition = response.headers.get('Content-Disposition');
            let fileName = 'download.xlsx';
            if (contentDisposition) {
                const fileNameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
                if (fileNameMatch && fileNameMatch[1]) {
                    fileName = fileNameMatch[1].replace(/['"]/g, ''); // Remove any surrounding quotes
                }
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download error:', error);
        }
    };

    const getPdfReport = async (dataProps) => {
        try {
            Swal.fire({
                title: "Loading...",
                html: t('Open Report...'),
                didOpen: () => {
                    Swal.showLoading();
                },
                allowOutsideClick: false
            });
            const headers = getAxiosConfigWithAuthHeaders().headers;
            headers['Content-Type'] = 'application/json';

            const response = await fetch(`${API_REQUEST_URL}downloadExcel/testResultPdf`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(dataProps),
            });

            if (!response.ok) {
                throw new Error('Server responded with an error!');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            window.open(url, '_blank');

        } catch (error) {
            console.error('PDF 열기 실패:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'PDF를 열 수 없습니다.',
            });
        } finally {
            Swal.close();
        }
    };

    const [deleteConfirm, setDeleteConfirm] = useState(false);
    const [deleteID, setDeleteID] = useState(0);
    useEffect(() => {
        if(deleteConfirm) {
            Swal.fire({
                title:" Are you sure?",
                text: t('config.deleteTestResultConfirmMsg'),
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes",
                allowOutsideClick: false
            }).then((result) => {
                if (result.isConfirmed) {
                    dispatch(deleteTestInfo(deleteID, {
                        onSuccess: (data) => {
                            Swal.fire({
                                title: "Deleted!",
                                text: t("config.deleteTestResultSuccessMsg"),
                                icon: "success",
                                allowOutsideClick: false
                            });
                        },
                        onFailure: (error) => {
                            Swal.fire({
                                title: "Something's Wrong!",
                                text: t("config.deleteTestResultFailureMsg"),
                                icon: "failure"
                            });
                            console.log(error);
                        }
                    }))
                }
            });
            setDeleteConfirm(false);
        }
    }, [deleteConfirm]);


    return (
        <div className="contents_wrap_2">
            <ResultDetailModal
                show={showModal}
                onClose={() => {toggleModal()}}
                passToDetail={passToDetail}
                getReport={getReport}
                getReportPdf={getPdfReport}
            />
            <div className={"contents"}>
                <div className="contents_box">
                    <div className="table_search_wrap">
                        <div className="table_input_title">
                            <h4> {t('view.testResult')}</h4>
                        </div>
                        <div className="table_input_contents">
                            <div className="table_input ti_1_3">
                                <div className="table_input_th">{t('view.simulator')}</div>
                                <div className="table_input_td">
                                    <select
                                        className="form-select"
                                        title={t('view.selectSimulator')}
                                        value={searchParam.simulatorID}
                                        key={'simulatorID'}
                                        onChange={(e) => {
                                            let simul = null;

                                            if(e.target.value === "") {
                                                setSearchParam({
                                                    ...searchParam,
                                                    simulatorID: '',
                                                    deviceID: ''
                                                });

                                                return;
                                            };

                                            simulatorList.forEach((el, i) => {
                                                if(el.id == e.target.value) {
                                                    simul = el;
                                                    return;
                                                }
                                            });

                                            setSearchParam({
                                                ...searchParam,
                                                deviceID: simul.testInfo ? simul.testInfo.deviceID : '',
                                                simulatorID: simul ? simul.id : '',
                                            });

                                        }
                                    }>
                                        <option value="">{t('view.all')}</option>
                                        {
                                            simulatorList.map((e, i) => (
                                                <option value={e.id}>{e.simulatorName}</option>
                                            ))
                                        }
                                    </select>
                                </div>
                            </div>
                            <div className="table_input ti_1_3">
                                <div className="table_input_th">{t('view.simulatorNo')}</div>
                                <div className="table_input_td">
                                    <input
                                        type="text"
                                        className="form-control"
                                        defaultValue={searchParam.deviceID}
                                        key={'deviceID'}
                                        placeholder={t('view.enterSimulatorNo')}
                                        title={t('view.enterSimulatorNo')}
                                        onChange={(e) => {
                                            setSearchParam({
                                                ...searchParam,
                                                deviceID: e.target.value
                                            });
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="table_input ti_1_3">
                                <div className="table_input_th">{t('view.chargerModel')}</div>
                                <div className="table_input_td">
                                    <select
                                        className="form-select"
                                        title={t('view.selectChargerModel')}
                                        defaultValue={searchParam.chargerID}
                                        key={'chargerID'}
                                        onChange={(e) => {
                                            if(e.target.value === "") {
                                                setSearchParam({
                                                    ...searchParam,
                                                    chargerID: '',
                                                    serialNo: ''
                                                });
                                                return;
                                            }
                                            let charger = null;

                                            chargerList.forEach((el, i) => {
                                                if(el.ChargerID == e.target.value) charger = el;
                                            });

                                            setSearchParam({
                                                ...searchParam,
                                                chargerID: charger ? charger.ChargerID : '',
                                                serialNo: charger.SerialNo ? charger.SerialNo.content : ''
                                            });
                                        }}
                                    >
                                        <option value="">{t('view.all')}</option>
                                        {
                                            chargerList.map((e, i) => (
                                                <option value={e.ChargerID}>{e.ModelName.content}</option>
                                            ))
                                        }
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="table_input_contents">
                            <div className="table_input ti_1_3">
                                <div className="table_input_th">{t('view.chargerSN')}</div>
                                <div className="table_input_td">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder={t('view.enterChargerSN')}
                                        title={t('view.enterChargerSN')}
                                        defaultValue={searchParam.serialNo}
                                        key={'serialNo'}
                                        onChange={(e) => {
                                            setSearchParam({
                                                ...searchParam,
                                                serialNo: e.target.value
                                            });
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="table_input ti_2_3">
                                <div className="table_input_th">{t('view.testDate')}</div>
                                <div className="table_input_td table_input_datepicker">
                                    <DatePickerComp
                                        className="form-control datepicker"
                                        id="datepicker_input_1"
                                        handleChange={(e)=>{
                                            setSearchParam({
                                                ...searchParam,
                                                startDate: e
                                            });
                                        }}
                                        dateSet={searchParam.startDate}
                                        disabledKeyboardNavigation placeholderText={t('view.startDate')}
                                    />
                                        &nbsp;~&nbsp;
                                        <DatePickerComp
                                            className="form-control datepicker"
                                            id="datepicker_input_2"
                                            handleChange={(e)=>{
                                                setSearchParam({
                                                    ...searchParam,
                                                    endDate: e
                                                })
                                            }}
                                            dateSet={searchParam.endDate}
                                            disabledKeyboardNavigation placeholderText={t('view.endDate')}
                                        />
                                            <div className="dp_btn">
                                                <button
                                                    type="button"
                                                    className="btn btn_grey"
                                                    title="1W"
                                                    onClick={() => {
                                                        let oneWeekAgo = new Date(today);
                                                        oneWeekAgo.setDate(today.getDate() - 7);

                                                        setSearchParam({
                                                            ...searchParam,
                                                            startDate: new Date(oneWeekAgo),
                                                            endDate: today
                                                        });
                                                    }}
                                                >1W</button>
                                                <button
                                                    type="button"
                                                    className="btn btn_grey"
                                                    title="1M"
                                                    onClick={() => {
                                                        let oneMonthAgo  = new Date(today);
                                                        oneMonthAgo.setDate(today.getDate() - 31);

                                                        setSearchParam({
                                                            ...searchParam,
                                                            startDate: new Date(oneMonthAgo),
                                                            endDate: today
                                                        });
                                                    }}
                                                >1M</button>
                                                <button
                                                    type="button"
                                                    className="btn btn_grey"
                                                    title="3M"
                                                    onClick={() => {
                                                        let threeMonthsAgo = new Date(today);
                                                        threeMonthsAgo.setDate(today.getDate() - 91);

                                                        setSearchParam({
                                                            ...searchParam,
                                                            startDate: new Date(threeMonthsAgo),
                                                            endDate: today
                                                        });
                                                    }}
                                                >3M</button>
                                                <button
                                                    type="button"
                                                    className="btn btn_grey"
                                                    title="6M"
                                                    onClick={() => {
                                                        let sixMonthsAgo = new Date(today);
                                                        sixMonthsAgo.setDate(today.getDate() - 183);

                                                        setSearchParam({
                                                            ...searchParam,
                                                            startDate: new Date(sixMonthsAgo),
                                                            endDate: today
                                                        });
                                                    }}
                                                >6M</button>
                                            </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="contents_btn">
                        <button type="button" className="btn btn_blue ml_auto" title={t('view.search')} onClick={() => {resultSearch(1)}}>{t('view.search')}</button>
                    </div>
                    <div className="table_wrap">
                        <div className="table_responsive">
                            <table className="table table_bordered table_testResult">
                                <caption>{t('view.viewTestResult')}</caption>
                                <colgroup>
                                    <col width="4%"/>
                                    <col width="*"/>
                                    <col width="13%"/>
                                    <col width="9%"/>
                                    <col width="9%"/>
                                    <col width="9%"/>
                                    <col width="13%"/>
                                    <col width="13%"/>
                                </colgroup>
                                <thead>
                                <tr>
                                    <th scope="col" rowSpan="2" className="text-center">{t('view.no')}</th>
                                    <th scope="col" rowSpan="2" className="text-center">{t('view.simulator')}</th>
                                    <th scope="col" colSpan="4" className="text-center">{t('sideBar.testResult')}</th>
                                    <th scope="col" rowSpan="2" className="text-center">{t('view.testDateTime')}</th>
                                    <th scope="col" rowSpan="2" className="text-center">view</th>
                                </tr>
                                <tr>
                                    <th scope="col" className="text-center">Mode</th>
                                    <th scope="col" className="text-center">Low</th>
                                    <th scope="col" className="text-center">Normal</th>
                                    <th scope="col" className="text-center">High</th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    testResults && ( testResults.length === 0 ?
                                        <tr>
                                            <td colSpan={8} className="text-center">{t("view.nothingToDisplay")}</td>
                                        </tr> :
                                        testResults.map((testResult, index) => {
                                            const i = index + 1;

                                            const seqNormal = testResult.result.filter((el) => el.seq === 1)[0];
                                            const seqGF = testResult.result.filter((el) => el.seq === 2)[0];
                                            const seqBPC = testResult.result.filter((el) => el.seq === 3)[0];
                                            const seqSCC = testResult.result.filter((el) => el.seq === 4)[0];
                                            const seqDF = testResult.result.filter((el) => el.seq === 5)[0];
                                            const seqCCID = testResult.result.filter((el) => el.seq === 6)[0];

                                            return (
                                                <>
                                                    <tr>
                                                        <td rowSpan={numOfRows} className="text-center">{testResult.rowNo}</td>
                                                        <td rowSpan={numOfRows}>
                                                            <a
                                                                onClick={() => {
                                                                    setPassToDetail({
                                                                        testID: testResult.testID,
                                                                        simulatorName: testResult.simulatorName,
                                                                        testDate: testResult.testDate,
                                                                        serialNo: testResult.serialNo,
                                                                        modelName: testResult.modelName,
                                                                        technician: testResult.technician,
                                                                        result: [
                                                                            seqNormal,
                                                                            seqGF,
                                                                            seqBPC,
                                                                            seqSCC,
                                                                            seqDF,
                                                                            seqCCID
                                                                        ],
                                                                    });
                                                                    toggleModal();
                                                                }}
                                                            >
                                                                {testResult.simulatorName}&nbsp;{testResult.modelNo}&nbsp;S/N:&nbsp;{testResult.serialNo}
                                                            </a>
                                                        </td>
                                                        <td>{t("simulator.testSequence.normalOperation")}</td>
                                                        {
                                                            seqNormal ? (
                                                                <td className="text-center">
                                                                    <span className={seqNormal.low === "S" ? "text_Success" : seqNormal.low === "F" ? "text_red" : ""}>
                                                                        {getResultBtn(seqNormal.low)}
                                                                    </span>
                                                                </td>
                                                            ) : (
                                                                <td className="text-center">
                                                                    <span>-</span>
                                                                </td>
                                                            )
                                                        }
                                                        {
                                                            seqNormal ? (
                                                                <td className="text-center">
                                                                    <span className={seqNormal.normal === "S" ? "text_Success" : seqNormal.normal === "F" ? "text_red" : ""}>
                                                                        {getResultBtn(seqNormal.normal)}
                                                                    </span>
                                                                </td>
                                                            ) : (
                                                                <td className="text-center">
                                                                    <span>-</span>
                                                                </td>
                                                            )
                                                        }
                                                        {
                                                            seqNormal ? (
                                                                <td className="text-center">
                                                                    <span className={seqNormal.high === "S" ? "text_Success" : seqNormal.high === "F" ? "text_red" : ""}>
                                                                        {getResultBtn(seqNormal.high)}
                                                                    </span>
                                                                </td>
                                                            ) : (
                                                                <td className="text-center">
                                                                    <span>-</span>
                                                                </td>
                                                            )
                                                        }
                                                        <td rowSpan={numOfRows}>{testResult.testDate}</td>
                                                        <td rowSpan={numOfRows} className="text-center">
                                                            <button type="button" className="btn btn-info"
                                                                    style={{padding: '5px', marginRight: '10px'}}
                                                                    title="Excel"
                                                                    onClick={() => {
                                                                        getReport({
                                                                            testID: testResult.testID,
                                                                            testDate: testResult.testDate,
                                                                            serialNo: testResult.serialNo,
                                                                            modelName: testResult.modelName,
                                                                            technician: testResult.technician,
                                                                            result: [
                                                                                seqNormal,
                                                                                seqGF,
                                                                                seqBPC,
                                                                                seqSCC,
                                                                                seqDF,
                                                                                seqCCID
                                                                            ],
                                                                        })
                                                                    }}
                                                            >Excel
                                                            </button>
                                                            <button type="button" className="btn btn-info"
                                                                    style={{padding: '5px', marginRight: '10px'}}
                                                                    title="Report"
                                                                    onClick={() => {
                                                                        getPdfReport({
                                                                            testID: testResult.testID,
                                                                            testDate: testResult.testDate,
                                                                            serialNo: testResult.serialNo,
                                                                            modelName: testResult.modelName,
                                                                            technician: testResult.technician,
                                                                            result: [
                                                                                seqNormal,
                                                                                seqGF,
                                                                                seqBPC,
                                                                                seqSCC,
                                                                                seqDF,
                                                                                seqCCID
                                                                            ],
                                                                        })
                                                                    }}
                                                            >Report
                                                            </button>
                                                            <button type="button" className="btn btn-danger"
                                                                    style={{padding: '5px'}} title="Delete"
                                                                    onClick={() => {
                                                                        setDeleteID(testResult.testID);
                                                                        setDeleteConfirm(true);

                                                                    }}
                                                            >
                                                                <img src="style/img/sub/img_trash.png"
                                                                     style={{width: '1rem', height: '1rem'}}
                                                                     alt={t("config.delete")}/>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                    {
                                                        seqGF ? (
                                                            <tr>
                                                                <td>{t("simulator.testSequence.groundFault")}</td>
                                                                <td className="text-center">
                                                                    <span
                                                                        className={seqGF.low === "S" ? "text_Success" : seqGF.low === "F" ? "text_red" : ""}>
                                                                        {getResultBtn(seqGF.low)}
                                                                    </span>
                                                                </td>
                                                                <td className="text-center">
                                                                    <span
                                                                        className={seqGF.normal === "S" ? "text_Success" : seqGF.normal === "F" ? "text_red" : ""}>
                                                                        {getResultBtn(seqGF.normal)}
                                                                    </span>
                                                                </td>
                                                                <td className="text-center">
                                                                    <span className={seqGF.high === "S" ? "text_Success" : seqGF.high === "F" ? "text_red" : ""}>
                                                                        {getResultBtn(seqGF.high)}
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        ) : (
                                                            <tr>
                                                                <td>{t("simulator.testSequence.groundFault")}</td>
                                                                <td className="text-center">
                                                                    <span>-</span>
                                                                </td>
                                                                <td className="text-center">
                                                                    <span>-</span>
                                                                </td>
                                                                <td className="text-center">
                                                                    <span>-</span>
                                                                </td>
                                                            </tr>
                                                        )
                                                    }
                                                    {
                                                        seqBPC ? (
                                                            <tr>
                                                                <td>{t("simulator.testSequence.blockProtectiveConductor")}</td>
                                                                <td className="text-center">
                                                                    <span className={seqBPC.low === "S" ? "text_Success" : seqBPC.low === "F" ? "text_red" : ""}>
                                                                        {getResultBtn(seqBPC.low)}
                                                                    </span>
                                                                </td>
                                                                <td className="text-center">
                                                                    <span className={seqBPC.normal === "S" ? "text_Success" : seqBPC.normal === "F" ? "text_red" : ""}>
                                                                        {getResultBtn(seqBPC.normal)}
                                                                    </span>
                                                                </td>
                                                                <td className="text-center">
                                                                    <span className={seqBPC.high === "S" ? "text_Success" : seqBPC.high === "F" ? "text_red" : ""}>
                                                                        {getResultBtn(seqBPC.high)}
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        ) : (
                                                            <tr>
                                                                <td>{t("simulator.testSequence.blockProtectiveConductor")}</td>
                                                                <td className="text-center">
                                                                    <span>-</span>
                                                                </td>
                                                                <td className="text-center">
                                                                    <span>-</span>
                                                                </td>
                                                                <td className="text-center">
                                                                    <span>-</span>
                                                                </td>
                                                            </tr>
                                                        )
                                                    }
                                                    {
                                                        seqSCC ? (
                                                            <tr>
                                                                <td>{t("simulator.testSequence.shortCircuit")}</td>
                                                                <td className="text-center">
                                                                    <span className={seqSCC.low === "S" ? "text_Success" : seqSCC.low === "F" ? "text_red" : ""}>
                                                                        {getResultBtn(seqSCC.low)}
                                                                    </span>
                                                                </td>
                                                                <td className="text-center">
                                                                    <span className={seqSCC.normal === "S" ? "text_Success" : seqSCC.normal === "F" ? "text_red" : ""}>
                                                                        {getResultBtn(seqSCC.normal)}
                                                                    </span>
                                                                </td>
                                                                <td className="text-center">
                                                                    <span className={seqSCC.high === "S" ? "text_Success" : seqSCC.high === "F" ? "text_red" : ""}>
                                                                        {getResultBtn(seqSCC.high)}
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        ) : (
                                                            <tr>
                                                                <td>{t("simulator.testSequence.shortCircuit")}</td>
                                                                <td className="text-center">
                                                                    <span>-</span>
                                                                </td>
                                                                <td className="text-center">
                                                                    <span>-</span>
                                                                </td>
                                                                <td className="text-center">
                                                                    <span>-</span>
                                                                </td>
                                                            </tr>
                                                        )
                                                    }
                                                    {
                                                        seqCCID ? (
                                                            <tr>
                                                                <td>{t("simulator.testSequence.CCID20")}</td>
                                                                <td className="text-center">
                                                                    <span>
                                                                        -
                                                                    </span>
                                                                </td>
                                                                <td className="text-center">
                                                                    <span className={seqCCID.normal === "S" ? "text_Success" : seqCCID.normal === "F" ? "text_red" : ""}>
                                                                        {getResultBtn(seqCCID.normal)}
                                                                    </span>
                                                                </td>
                                                                <td className="text-center">
                                                                    <span>
                                                                        -
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        ) : (
                                                            <tr>
                                                                <td>{t("simulator.testSequence.CCID20")}</td>
                                                                <td className="text-center">
                                                                    <span>-</span>
                                                                </td>
                                                                <td className="text-center">
                                                                    <span>-</span>
                                                                </td>
                                                                <td className="text-center">
                                                                    <span>-</span>
                                                                </td>
                                                            </tr>
                                                        )
                                                    }
                                                    {
                                                        seqDF ? (
                                                            <tr>
                                                                <td>{t("simulator.testSequence.diodeFault")}</td>
                                                                <td className="text-center">
                                                                    <span className={seqDF.low === "S" ? "text_Success" : seqDF.low === "F" ? "text_red" : ""}>
                                                                        Short {getResultBtn(seqDF.low)}
                                                                    </span>
                                                                </td>
                                                                <td className="text-center">
                                                                    <span>
                                                                        -
                                                                    </span>
                                                                </td>
                                                                <td className="text-center">
                                                                    <span className={seqDF.high === "S" ? "text_Success" : seqDF.high === "F" ? "text_red" : ""}>
                                                                        Open {getResultBtn(seqDF.high)}
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        ) : (
                                                            <tr>
                                                                <td>{t("simulator.testSequence.diodeFault")}</td>
                                                                <td className="text-center">
                                                                    <span>-</span>
                                                                </td>
                                                                <td className="text-center">
                                                                    <span>-</span>
                                                                </td>
                                                                <td className="text-center">
                                                                    <span>-</span>
                                                                </td>
                                                            </tr>
                                                        )
                                                    }
                                                </>
                                            )
                                        })
                                    )
                                }
                                </tbody>
                            </table>
                        </div>
                        {
                            totalCnt === 0 ?
                                (<div className="pagination_wrap"></div>) :
                                (<div className="pagination_wrap">
                                    <ul className="pagination">
                                        <li className={currPageCnt === 1 ? "disabled" : ""}>
                                            <a
                                                className="prev"
                                                aria-label="Previous"
                                                onClick={(e) => {
                                                    //e.preventDefault();
                                                    if (currPageCnt > 1) setCurrPageCnt(currPageCnt - 1);
                                                }}
                                            >
                                                <span><img src="style/img/sub/img_prev_arrow.png" alt={t("view.previous")}/></span>
                                            </a>
                                        </li>
                                        {
                                            Array.from(
                                                { length: currPageCnt === totalPages ? Math.ceil((totalCnt -  (currPageCnt -1) * itemsPerPage * pageNum)/itemsPerPage) : pageNum},
                                                (_, index) => {
                                                const temp = (currPageCnt -1) * pageNum;
                                                const i = index + temp + 1;

                                                return (
                                                    <li key={i}
                                                        className={`${i === curPage ? 'on' : ''}`}>
                                                        <a
                                                            onClick={(e) => {
                                                                //e.preventDefault();
                                                                resultSearch(Number(e.target.text));
                                                            }}
                                                        >
                                                            {i}
                                                        </a>
                                                    </li>
                                                    )
                                            })
                                        }
                                        <li className={currPageCnt >= totalPages ? "disabled" : ""}>
                                            <a
                                                className="next"
                                                aria-label="Next"
                                                onClick={(e) => {
                                                    //e.preventDefault();
                                                    if (currPageCnt < totalPages) {
                                                        setCurrPageCnt(currPageCnt + 1);
                                                    }
                                                }}
                                            >
                                                <span><img src="style/img/sub/img_next_arrow.png" alt={t("view.next")}/></span>
                                            </a>
                                        </li>
                                    </ul>
                                </div>)
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TestResultPage;
