import React, { useEffect, useState } from 'react'
import numeral from 'numeral';

import { Line } from 'react-chartjs-2';

//Settings for Line component
const options = {
    legend: {
        display: false,
    },
    elements: {
        point: {
            radius: 0,
        }
    },
    maintainAspectRatio: false,
    tooltips: {
        mode: 'index',
        intersect: false,
        callbacks: {
            label: function (tooltipItem, data) {
                return numeral(tooltipItem.value).format("+0, 0");
            }
        }
    },
    scales: {
        xAxes: [
            {
                type: "time",
                time: {
                    format: "MM/DD/YY",
                    tooltipFormat: "ll"
                }
            }
        ],
        yAxes: [
            {
                gridLines: {
                    display: false
                },
                ticks: {
                    //include dollar sign in the ticks
                    callback: function (value, index, values) {
                        return numeral(value).format("0a");
                    }
                }
            }
        ]
    }
}

function LineGraph({ casesType, ...props }) {
    const [data, setData] = useState({});

    const buildChartData = (data, casesType) => {
        const chartData = [];
        let lastDataPoint;

        //creating charData into 
        for (let date in data.cases) {
            if (lastDataPoint) {
                let newDataPoint = {
                    x: date,
                    //new date cases - last date cases
                    y: data[casesType][date] - lastDataPoint
                }
                chartData.push(newDataPoint);
            }
            lastDataPoint = data[casesType][date]
        }
        return chartData;
    };

    useEffect(() => {
        const fetchData = async () => {
            await fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=120')
                .then(response => response.json())
                .then(data => {
                    // console.log(data);
                    let chartData = buildChartData(data, casesType);
                    console.log(chartData);
                    setData(chartData);
                });
        }

        fetchData();
    }, [casesType]);

    return (
        <div>
            {data?.length > 0 && (
                <Line
                    options={options}
                    data={{
                        datasets: [
                            {
                                backgroundColor: 'rgba(204, 16, 52, 0.5)',
                                borderColor: '#CC1034',
                                data: data
                            }
                        ]
                    }} />
            )}

        </div>
    )
}

export default LineGraph
