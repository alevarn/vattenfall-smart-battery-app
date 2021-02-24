const socGraph = new Chart(document.querySelector('.soc-graph').getContext('2d'), {
    type: 'line',
    data: {
        datasets: [{
            label: 'state of charge',
            borderColor: [
                '#464646'
            ],
            backgroundColor: [
                '#f1f1f1'
            ],
            borderWidth: 1
        }],
    },
    options: {
        legend: {
            display: false
        },
        maintainAspectRatio: false,
        scales: {
            xAxes: [{
                type: 'time',
                time: {
                    unit: 'hour',
                    stepSize: 8,
                    displayFormats: {
                        hour: 'MMM DD HH:mm'
                    }
                }
            }],
            yAxes: [{
                ticks: {
                    callback: function (value, index, values) {
                        return `${value} %`;
                    },
                    min: 0,
                    max: 100
                }
            }]
        }
    }
});

const powerGraph = new Chart(document.querySelector('.power-graph').getContext('2d'), {
    type: 'line',
    data: {
        datasets: [{
            label: 'power',
            borderColor: [
                '#464646'
            ],
            backgroundColor: [
                '#f1f1f1'
            ],
            borderWidth: 1
        }],
    },
    options: {
        legend: {
            display: false
        },
        maintainAspectRatio: false,
        scales: {
            xAxes: [{
                type: 'time',
                time: {
                    unit: 'hour',
                    stepSize: 8,
                    displayFormats: {
                        hour: 'MMM DD HH:mm'
                    }
                }
            }],
            yAxes: [{
                ticks: {
                    callback: function (value, index, values) {
                        return `${value} kW`;
                    },
                    min: -BatteryInfo.MAX_POWER / KILO,
                    max: BatteryInfo.MAX_POWER / KILO
                }
            }]
        }
    }
});