import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import './styles/DataVisualizationPage.css';

interface VisualizationData {
    income: number;
    expenses: number;
    savings: number;
}

const DataVisualizationPage: React.FC = () => {
    const [data, setData] = useState<VisualizationData | null>(null);

    useEffect(() => {
        // Mocked data
        const mockData = {
            income: 8000,
            expenses: 3000,
            savings: 5000,
        };
        setData(mockData);
    }, []);

    const chartData = data
        ? {
              labels: ['Income', 'Expenses', 'Savings'],
              datasets: [
                  {
                      data: [data.income, data.expenses, data.savings],
                      backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56'],
                  },
              ],
          }
        : null;

    return (
        <div>
            <h2>Financial Data Visualization</h2>
            {chartData && <Pie data={chartData} />}
        </div>
    );
};

export default DataVisualizationPage;
