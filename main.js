function linearRegression(x, y) {
    const n = x.length;
    const sumX = x.reduce((sum, xi) => sum + xi, 0);
    const sumY = y.reduce((sum, yi) => sum + yi, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    return { slope, intercept };
}

let chart;
let linearizedChart;

document.getElementById('dataForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const xValues = document.getElementById('xValues').value.split(',').map(Number);
    const yValues = document.getElementById('yValues').value.split(',').map(Number);

    if (xValues.length !== yValues.length) {
        alert('X and Y values must have the same length.');
        return;
    }

    // Transform the data
    const transformedX = xValues.map(x => 1 / x);
    const transformedY = yValues.map(y => 1 / y);

    // Perform linear regression on the transformed data
    const result = linearRegression(transformedX, transformedY);
    console.log(`1/y = ${result.intercept} + ${result.slope} * (1/x)`);

    const equationElement = document.getElementById('equation');
    equationElement.textContent = `Equation: 1/y = ${result.intercept} + ${result.slope} * (1/x)`;

    // Generate the fitted line in the original scale
    const fittedY = xValues.map(x => 1 / (result.intercept + result.slope * (1 / x)));

    const scatterData = xValues.map((xi, i) => ({ x: xi, y: yValues[i] }));
    const fittedData = xValues.map((xi, i) => ({ x: xi, y: fittedY[i] }));

    const ctx = document.getElementById('scatterPlot').getContext('2d');
    const linearizedCtx = document.getElementById('linearizedPlot').getContext('2d');

    if (chart) {
        chart.destroy();
    }

    chart = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [
                {
                    label: 'Scatter Dataset',
                    data: scatterData,
                    backgroundColor: 'rgba(75, 192, 192, 1)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    pointBackgroundColor: 'rgba(255, 99, 132, 1)',
                    pointBorderColor: 'rgba(255, 99, 132, 1)',
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    pointStyle: 'circle'
                },
                {
                    label: 'Fitted Line',
                    data: fittedData,
                    type: 'line',
                    fill: false,
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 2,
                    pointRadius: 0,
                    borderDash: [5, 5]
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: `Linearized Regression: 1/y = ${result.intercept} + ${result.slope} * (1/x)`,
                    font: {
                        size: 18,
                        weight: 'bold'
                    },
                    color: '#333'
                }
            },
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    title: {
                        display: true,
                        text: 'X Axis',
                        font: {
                            size: 14,
                            weight: 'bold'
                        },
                        color: '#333'
                    },
                    grid: {
                        color: 'rgba(200, 200, 200, 0.2)'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Y Axis',
                        font: {
                            size: 14,
                            weight: 'bold'
                        },
                        color: '#333'
                    },
                    grid: {
                        color: 'rgba(200, 200, 200, 0.2)'
                    }
                }
            }
        }
    });

    if (linearizedChart) {
        linearizedChart.destroy();
    }

    linearizedChart = new Chart(linearizedCtx, {
        type: 'scatter',
        data: {
            datasets: [
                {
                    label: 'Linearized Data',
                    data: transformedX.map((xi, i) => ({ x: xi, y: transformedY[i] })),
                    backgroundColor: 'rgba(75, 192, 192, 1)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    pointBackgroundColor: 'rgba(255, 99, 132, 1)',
                    pointBorderColor: 'rgba(255, 99, 132, 1)',
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    pointStyle: 'circle'
                },
                {
                    label: 'Fitted Line',
                    data: transformedX.map(xi => ({ x: xi, y: result.intercept + result.slope * xi })),
                    type: 'line',
                    fill: false,
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 2,
                    pointRadius: 0,
                    borderDash: [5, 5]
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: `Linearized Data: 1/y vs 1/x`,
                    font: {
                        size: 18,
                        weight: 'bold'
                    },
                    color: '#333'
                }
            },
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    title: {
                        display: true,
                        text: '1/X Axis',
                        font: {
                            size: 14,
                            weight: 'bold'
                        },
                        color: '#333'
                    },
                    grid: {
                        color: 'rgba(200, 200, 200, 0.2)'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: '1/Y Axis',
                        font: {
                            size: 14,
                            weight: 'bold'
                        },
                        color: '#333'
                    },
                    grid: {
                        color: 'rgba(200, 200, 200, 0.2)'
                    }
                }
            }
        }
    });
});