import React from 'react';
import Chart from 'react-apexcharts';

const PieGraphComp = ({options, series, key}) => {
    return (
        <Chart options={options} series={series} type="pie" width="100%" height="100%" key={key}/>
    );
}

export default PieGraphComp;
