import React, { useState } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const MostBookedResources = ({ data }) => {
  const [chartType, setChartType] = useState('pie');

  const chartData = {
    labels: data.map(resource => resource.resource.name),
    datasets: [
      {
        label: 'Bookings',
        data: data.map(resource => resource.count),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
        ],
        hoverBackgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
        ],
      },
    ],
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">Most Booked Resources</h2>
      <div className="flex justify-center mb-4">
        <button
          className={`px-4 py-2 mr-2 ${chartType === 'pie' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setChartType('pie')}
        >
          Pie Chart
        </button>
        <button
          className={`px-4 py-2 ${chartType === 'bar' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setChartType('bar')}
        >
          Bar Graph
        </button>
      </div>
      <div style={{ width: '60%', height: '60%', margin: '0 auto' }}>
        {chartType === 'pie' ? (
          <div style={{ width: '40%', height: '40%', margin: '0 auto' }}>
          <Pie data={chartData} />
        </div>
        ) : (
          <Bar data={chartData} options={{ maintainAspectRatio: false }} />
        )}
      </div>
    </div>
  );
};

export default MostBookedResources;