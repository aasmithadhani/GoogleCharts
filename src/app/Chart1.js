// components/ChartComponent.js
'use client'
import React, { useEffect, useState,Profiler } from 'react';
import Papa from 'papaparse';
import { Chart } from 'react-google-charts';


const BarChartComponent = () => {
  const [data, setData] = useState([]);
  const [startTime, setStartTime] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
        setStartTime(performance.now()); // Record start time
      const response = await fetch('/sales.csv'); // Replace with the actual path to your CSV file
      const result = await response.text();

      // Parse CSV data
      Papa.parse(result, {
        header: true,
        dynamicTyping: true, // Ensure that numeric values are treated as numbers
        complete: (parsedData) => {
          const salesByYear = calculateTotalSalesByYear(parsedData.data);
          setData(salesByYear);
          const endTime = performance.now();
          const timeTaken = endTime - startTime;
          console.log(`Time taken to render the chart: ${timeTaken} milliseconds`);
        
        },
      });
    };

    fetchData();
  }, []);

  const calculateTotalSalesByYear = (originalData) => {
    const salesByYear = {};
  
    originalData.forEach((entry) => {
      const year = entry['List Year'];
      const salesAmount = entry['Sale Amount'];
  
      if (salesByYear[year]) {
        salesByYear[year] += salesAmount;
      } else {
        salesByYear[year] = salesAmount;
      }
    });
  
    // Convert data to the format expected by react-google-charts
    const chartData = [['Year', 'Total Sales']];
    Object.entries(salesByYear).forEach(([year, totalSales]) => {
      chartData.push([parseInt(year, 10), totalSales]); // Ensure 'year' is treated as a number
    });
  
    return chartData;
  };

  return (
    <div>
      <h2>Total Sales by Year</h2>
      <Profiler id="GoogleBarChart" onRender={(id, phase, actualDuration) => console.log(id, phase, actualDuration)}>
      <Chart
        width={'1000px'}
        height={'700px'}
        chartType="BarChart"
        loader={<div>Loading Chart</div>}
        data={data}
        options={{
          title: 'Total Sales by Year',
          hAxis: { title: 'Year', format: '####', gridlines: { count: 5 } }, // Set the format and gridlines for the axis
          vAxis: { title: 'Total Sales' },
        }}
      />
      </Profiler>
    </div>
  );
};

export default BarChartComponent;
