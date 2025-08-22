import React, { useState, useEffect, useRef } from 'react';
import Chart from "react-apexcharts";
import {useSelector} from "react-redux";
import {SIMULATOR_CONNECTION_STATE} from "../state_modules/simulatorInfoState";

/*dataFlag = 0: voltage, 1: current, 2: pwm*/
const RealtimeGraph = ({i, dataFlag}) => {
    const MAX_DATA_LENGTH = 40;
    const [chartOptions, setChartOptions] = useState({});
    const [chartSeries, setChartSeries] = useState([]);

    const intervalRef = useRef(null);

    const [pwmFlag, setPwmFlag] = useState(false);

    const simulatorRef = useRef(null);
    const pwmFlagRef = useRef(false);

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
        let hour = '' + date.getHours();
        let min = '' + date.getMinutes();
        let sec = '' + date.getSeconds();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;
        if(hour.length < 2)
            hour = '0' + hour;
        if(min.length < 2)
            min = '0' + min;
        if(sec.length < 2)
            sec = '0' + sec;

        const time = hour + ':' + min + ':' + sec;

        const rtnDate = [year, month, day].join('-');

        return time;
    };

    simulatorRef.current = useSelector(state => state.simulatorInfoState.simulators)[i];

    useEffect(() => {
        if(dataFlag === 0) {
            setChartOptions({
                series: [
                    {
                        name: 'Voltage',
                        type: 'line',
                        data: [],
                    }
                ],
                stroke: {
                    width: 2,
                    curve: 'smooth',
                    colors: ['#ffdd00']
                },
                chart: {
                    id: 'voltage-chart',
                    type: 'line',
                    animations: {
                        enabled: true,
                        easing: 'easeinout',
                        speed: 100,
                        animateGradually: {
                            enabled: true,
                            delay: 100
                        },
                        dynamicAnimation: {
                            enabled: true,
                            speed: 50
                        }
                    },
                    toolbar: {
                        show: false,
                    },
                    zoom: {
                        enabled: false,
                    },
                },
                tooltip: {
                    enabled: false,
                    followCursor: true,
                    style: {
                        fontSize: '14px',
                    },
                    fillSeriesColor: false,
                    onDatasetHover: {
                        highlightDataSeries: true,
                    },
                    x: {
                        show: false,
                        formatter: (value) => {
                            return formatDate(value);
                        }
                    },
                    y: {
                        title: 'Voltage',
                        formatter: (value) => (value)
                    }
                },
                xaxis: {
                    type: 'datetime',
                    range: 10 * 1000,
                    labels: {
                        show: false,
                    }
                },
                yaxis: [
                    {
                        title: {
                            text: 'Voltage',
                            style: {
                                color: '#ffffff'
                            }
                        },
                        labels: {
                            style: {
                                colors: ['#ffffff'],
                            },
                        },
                        min: 0.0,
                        max: 260.0,
                        tickAmount: 5
                    },
                ],
            });
            setChartSeries([{
                name: 'Voltage',
                type: 'line',
                data: [],
            }]);
        } else if(dataFlag === 1) {
            setChartOptions({
                series: [
                    {
                        name: 'Current',
                        type: 'line',
                        data: [],
                    }
                ],
                stroke: {
                    width: 2,
                    curve: 'smooth',
                    colors: ['#ffdd00']
                },
                chart: {
                    id: 'current-chart',
                    type: 'line',
                    animations: {
                        enabled: true,
                        easing: 'easeinout',
                        speed: 100,
                        animateGradually: {
                            enabled: true,
                            delay: 100
                        },
                        dynamicAnimation: {
                            enabled: true,
                            speed: 50
                        }
                    },
                    toolbar: {
                        show: false,
                    },
                    zoom: {
                        enabled: false,
                    },
                },
                tooltip: {
                    enabled: false,
                    style: {
                        fontSize: '14px',
                    },
                    fillSeriesColor: false,
                    onDatasetHover: {
                        highlightDataSeries: true,
                    },
                    x: {
                        show: false,
                        formatter: (value) => {
                            return formatDate(value);
                        }
                    },
                    y: {
                        title: 'Voltage',
                        formatter: (value) => (value)
                    }
                },
                xaxis: {
                    type: 'datetime',
                    range: 10 * 1000,
                    labels: {
                        show: false,
                    }
                },
                yaxis: [
                    {
                        title: {
                            text: 'Current',
                            style: {
                                color: '#ffffff' // Change to your desired color
                            }
                        },
                        labels: {
                            style: {
                                colors: ['#ffffff'], // Set your desired color here
                            },
                        },
                        min: 0.0,
                        max: 100.0,
                        tickAmount: 5.0
                    },
                ]
            });
            setChartSeries([{
                name: 'Current',
                type: 'line',
                data: [],
            }]);
        } else {
            setChartOptions({
                series: [
                    {
                        name: 'pwmMax',
                        type: 'line',
                        data: [],
                    }, {
                        name: 'pwmMin',
                        type: 'line',
                        data: [],
                    }
                ],
                stroke: {
                    width: 2,
                    curve: 'smooth',
                    colors: ['#ffdd00', '#ff0000']
                },
                legend: {
                    show: false
                },
                tooltip: {
                    enabled: false,
                    style: {
                        fontSize: '14px',
                    },
                    fillSeriesColor: false,
                    onDatasetHover: {
                        highlightDataSeries: true,
                    },
                    x: {
                        show: false,
                        formatter: (value) => {
                            return formatDate(value);
                        }
                    },
                    y: {
                        title: 'Voltage',
                        formatter: (value) => (value)
                    }
                },
                chart: {
                    id: 'pwm-chart',
                    type: 'line',
                    animations: {
                        enabled: true,
                        easing: 'easeinout',
                        speed: 100,
                        animateGradually: {
                            enabled: true,
                            delay: 100
                        },
                        dynamicAnimation: {
                            enabled: true,
                            speed: 50
                        }
                    },
                    toolbar: {
                        show: false,
                    },
                    zoom: {
                        enabled: false,
                    },
                },
                xaxis: {
                    type: 'datetime',
                    range: 10 * 1000,
                    labels: {
                        show: false,
                    }
                },
                yaxis: [
                    {
                        title: {
                            text: 'PWM',
                            style: {
                                color: '#ffffff' // Change to your desired color
                            }
                        },
                        labels: {
                            style: {
                                colors: ['#ffffff'], // Set your desired color here
                            },
                        },
                        min: -15.0,
                        max: 15.0,
                        tickAmount: 5
                    },
                ]
            });
            setChartSeries([{
                name: 'pwmMax',
                type: 'line',
                data: [],
            }, {
                name: 'pwmMin',
                type: 'line',
                data: [],
            }]);
        }
    }, []);

    useEffect(() => {
        if(typeof simulatorRef.current.storedData[dataFlag] !== 'undefined') {
            if(dataFlag === 2) {
                const maxPrevData = simulatorRef.current.storedData[2].split(',');
                const minPrevData = simulatorRef.current.storedData[3].split(',');

                if(simulatorRef.current.storedData[dataFlag].length > 0) {
                    const now = new Date().getTime();

                    maxPrevData.forEach((e, i) => {
                        setChartSeries((prevState) => {
                            const dataMax = {x: now - (30-i)*300, y: maxPrevData[i]};
                            const dataMin = {x: now - (30-i)*300, y: minPrevData[i]};

                            const updatedDataMax = [...prevState[0].data, dataMax];
                            const updatedDataMin = [...prevState[1].data, dataMin];

                            return [
                                {
                                    ...prevState[0],
                                    data: updatedDataMax
                                },
                                {
                                    ...prevState[1],
                                    data: updatedDataMin
                                }
                            ];
                        });
                    });
                    simulatorRef.current.storedData[2] = undefined;
                    simulatorRef.current.storedData[3] = undefined;
                }
            } else {
                const prevData = simulatorRef.current.storedData[dataFlag].split(',');

                if(simulatorRef.current.storedData[dataFlag].length > 0) {
                    const now = new Date().getTime();

                    prevData.forEach((e, i) => {
                        setChartSeries((prevState) => {
                            const data1 = {x: now - (30-i)*300, y: e};
                            const updatedData = [...prevState[0].data, data1];
                            return [
                                {
                                    ...prevState[0],
                                    data: updatedData
                                }
                            ];
                        });
                    });
                    simulatorRef.current.storedData[dataFlag] = undefined;
                }
            }
        }
    }, [dataFlag])

    const chart1Ref = useRef(null);

    const startInterval = () => {
        stopInterval();
        intervalRef.current = setInterval(() => {
            const now = new Date().getTime();
            const currentSimulator = simulatorRef.current;

            if (dataFlag === 0) {
                setChartSeries((prevState) => {
                    const data1 = {x: now, y: currentSimulator.voltage};
                    const updatedData = [...prevState[0].data, data1];
                    if (updatedData.length > MAX_DATA_LENGTH) {
                        updatedData.shift();
                    }
                    return [
                        {
                            ...prevState[0],
                            data: updatedData
                        }
                    ];
                });
            } else if (dataFlag === 1) {
                setChartSeries((prevState) => {
                    const data2 = {x: now, y: currentSimulator.current};
                    const updatedData = [...prevState[0].data, data2];
                    if (updatedData.length > MAX_DATA_LENGTH) {
                        updatedData.shift();
                    }
                    return [
                        {
                            ...prevState[0],
                            data: updatedData
                        }
                    ];
                });
            } else {
                setChartSeries((prevState) => {
                    const dataMax = {
                        x: now, y: currentSimulator.pwmMax
                    };

                    const dataMin = {
                        x: now, y: currentSimulator.pwmMin
                    }

                    //pwmFlagRef.current = !pwmFlagRef.current ;
                    const updatedDataMax = [...prevState[0].data, dataMax];
                    const updatedDataMin = [...prevState[1].data, dataMin];

                    if (updatedDataMax.length > MAX_DATA_LENGTH) {
                        updatedDataMax.shift();
                        updatedDataMin.shift();
                    }
                    return [
                        {
                            ...prevState[0],
                            data: updatedDataMax
                        },
                        {
                            ...prevState[1],
                            data: updatedDataMin
                        }
                    ];
                });
            }
        }, 1000);
    };

    const stopInterval = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    useEffect(() => {
        if(simulatorRef.current.state === SIMULATOR_CONNECTION_STATE.inProgress) {
            startInterval();
        } else {
            stopInterval();
        }
        return () => {
            stopInterval();
        };
    }, [simulatorRef.current.state]);

    return (
        <div>
            <Chart
                options={chartOptions}
                series={chartSeries}
                type="line"
                height={'100%'}
                width={'100%'}
                ref={chart1Ref}
            />
        </div>
    );
};

export default RealtimeGraph;
