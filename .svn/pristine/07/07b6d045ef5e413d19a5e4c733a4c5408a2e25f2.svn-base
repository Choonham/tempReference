import React, {useState, useEffect, useRef, useMemo} from 'react';
import Chart from "react-apexcharts";

const TestResultGraph = ({startTime, endTime, data, dataFlag, show}) => {
    /*const [firstData, setFirstData] = useState([]);
    const [secondData, setSecondData] = useState([]);*/

    const [showGraph, setShowGraph] = useState(false);
    const [loadDone, setLoadDone] = useState(false);

    const formatDate = (dateString) => {
        let date = dateString === '' ? new Date() : new Date(dateString);
        let month = ('0' + (date.getMonth() + 1)).slice(-2);
        let day = ('0' + date.getDate()).slice(-2);
        let hour = ('0' + date.getHours()).slice(-2);
        let min = ('0' + date.getMinutes()).slice(-2);
        let sec = ('0' + date.getSeconds()).slice(-2);
        return `${date.getFullYear()}-${month}-${day} </br>${hour}:${min}:${sec}`;
    };

    const {firstData, secondData} = useMemo(() => {
        let tempArray = [];
        let tempMax = [];
        let tempMin = [];
        let currentDate = new Date(startTime);
        if (dataFlag === 2) {
            const maxArray = data.max.split(',');
            const minArray = data.min.split(',');

            maxArray.forEach((e, i) => {
                const time = currentDate.getTime() + i * 1000
                tempMax.push({ x: time, y: Number(e) });
                tempMin.push({ x: time, y: Number(minArray[i]) });
            });
            setLoadDone(true);

            return { firstData: tempMax, secondData: tempMin };
        } else {
            const dataArray = data.split(',');

            dataArray.forEach((e, i) => {
                const time = currentDate.getTime() + i * 1000
                tempArray.push({ x: time, y: Number(e) });
            });
            setLoadDone(true);
            return { firstData: tempArray, secondData: [] }; // secondData는 여기서 사용하지 않는 경우에 대비해 빈 배열 반환
        }
    }, [data, dataFlag, startTime]);

    useEffect(() => {
        setShowGraph(show);
    }, [show]);

    const chartOptions = useMemo(() => {
        if(loadDone) {
            if(dataFlag === 0) {
                return {
                    stroke: {
                        width: 2,
                        curve: 'smooth',
                        colors: ['#ffdd00']
                    },
                    tooltip: {
                        enabled: true,
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
                        id: 'voltage-chart',
                        type: 'line',
                        toolbar: {
                            show: false,
                        },
                        zoom: {
                            enabled: true,
                            type: 'x',
                            autoScaleYaxis: false,
                            zoomedArea: {
                                fill: {
                                    color: '#90CAF9',
                                    opacity: 0.4
                                },
                                stroke: {
                                    color: '#0D47A1',
                                    opacity: 0.4,
                                    width: 1
                                }
                            }
                        },
                    },
                    xaxis: {
                        type: 'time',
                        range: firstData.length * 1000,
                        labels: {
                            show: false,
                        },
                        tickAmount: 10,
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
                }
            } else if(dataFlag === 1) {
                return {
                    series: [
                        {
                            name: 'Current',
                            type: 'line',
                            data: firstData,
                        }
                    ],
                    stroke: {
                        width: 2,
                        curve: 'smooth',
                        colors: ['#ffdd00']
                    },
                    tooltip: {
                        enabled: true,
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
                        id: 'voltage-chart',
                        type: 'line',
                        toolbar: {
                            show: false,
                        },
                        zoom: {
                            enabled: true,
                            type: 'x',
                            autoScaleYaxis: false,
                            zoomedArea: {
                                fill: {
                                    color: '#90CAF9',
                                    opacity: 0.4
                                },
                                stroke: {
                                    color: '#0D47A1',
                                    opacity: 0.4,
                                    width: 1
                                }
                            }
                        },
                    },
                    xaxis: {
                        type: 'time',
                        range: firstData.length * 1000,
                        labels: {
                            show: false,
                        },
                        tickAmount: 10,
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
                }
            } else {
                return {
                    series: [
                        {
                            name: 'pwmMax',
                            type: 'line',
                            data: firstData,
                        }, {
                            name: 'pwmMin',
                            type: 'line',
                            data: secondData,
                        }
                    ],
                    stroke: {
                        width: 2,
                        curve: 'smooth',
                        colors: ['#ffdd00', '#ff0000']
                    },
                    tooltip: {
                        enabled: true,
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
                    legend: {
                        show: false
                    },
                    chart: {
                        id: 'pwm-chart',
                        type: 'line',
                        toolbar: {
                            show: false,
                        },
                        zoom: {
                            enabled: true,
                            type: 'x',
                            autoScaleYaxis: false,
                            zoomedArea: {
                                fill: {
                                    color: '#90CAF9',
                                    opacity: 0.4
                                },
                                stroke: {
                                    color: '#0D47A1',
                                    opacity: 0.4,
                                    width: 1
                                }
                            }
                        },
                    },
                    xaxis: {
                        type: 'time',
                        range: firstData.length * 1000,
                        labels: {
                            show: false,
                        },
                        tickAmount: 10,
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
                }
            }
        }
    }, [loadDone, dataFlag])

    const chartSeries = useMemo(() => {
        if (loadDone) {
            if(dataFlag === 0) {
                return [{
                    name: 'Voltage',
                    type: 'line',
                    data: firstData,
                }];
            } else if(dataFlag === 1) {
                return [{
                    name: 'Current',
                    type: 'line',
                    data: firstData,
                }]
            } else {
                return [{
                    name: 'pwmMax',
                    type: 'line',
                    data: firstData,
                }, {
                    name: 'pwmMin',
                    type: 'line',
                    data: secondData,
                }]
            }
        }
    }, [loadDone, dataFlag])

    return (
        <div>
            <Chart
                options={chartOptions}
                series={chartSeries}
                type="line"
                height={'100%'}
                width={'100%'}
            />
        </div>
    );
};

export default TestResultGraph;
