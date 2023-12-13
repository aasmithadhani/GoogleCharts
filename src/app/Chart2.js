'use client'
import React, { useEffect, useState,Profiler } from 'react';
import Papa from 'papaparse';
import { Chart } from 'react-google-charts';

const PieChartComponent = () => {
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
        dynamicTyping: true,
        complete: (parsedData) => {
          const propertyTypeDistribution = calculatePropertyTypeDistribution(parsedData.data);
          setData(propertyTypeDistribution);
          const endTime = performance.now();
          const timeTaken = endTime - startTime;
          console.log(`Time taken to render the chart: ${timeTaken} milliseconds`);
        },
      });
    };

    fetchData();
  }, []);

  const calculatePropertyTypeDistribution = (originalData) => {
    const propertyTypeCount = {};

    originalData.forEach((entry) => {
      const propertyType = entry['Property Type'];

      if (propertyTypeCount[propertyType]) {
        propertyTypeCount[propertyType]++;
      } else {
        propertyTypeCount[propertyType] = 1;
      }
    });

    // Convert data to the format expected by react-google-charts
    const chartData = [['Property Type', 'Count']];
    Object.entries(propertyTypeCount).forEach(([propertyType, count]) => {
      chartData.push([propertyType, count]);
    });

    return chartData;
  };

  return (
    <div>
      <h2>Property Type Distribution</h2> 
      <Profiler id="GooglePieChart" onRender={(id, phase, actualDuration) => console.log(id, phase, actualDuration)}>
      

      <Chart
        width={'500px'}
        height={'300px'}
        chartType="PieChart"
        loader={<div>Loading Chart</div>}
        data={data}
        options={{
          title: 'Property Type Distribution',
        }}
       
    
      />
      </Profiler>
    </div>
  );
};

export default PieChartComponent;
