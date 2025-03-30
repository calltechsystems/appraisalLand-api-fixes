import Chart from 'chart.js/auto';
import React, { useRef, useEffect } from 'react';

export default function StatisticsPieChart() {
  const canvas = useRef();

  useEffect(() => {
    const ctx = canvas.current;

    let chartStatus = Chart.getChart('myChart');
    if (chartStatus != undefined) {
      chartStatus.destroy();
    }

    const chart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Lite Plan', 'Pro Plan', 'Ultimate Plan'],
        datasets: [
          {
            label: '',
            data: [17, 16, 13],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
             
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Number of Active Plans by Appraisers',
          },
        },
      },
    });
  }, []);

  return (
    <div className='container pt-1 pb-2'>
      <canvas id='myChart' ref={canvas}></canvas>
    </div>
  );
}