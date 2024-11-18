import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import './styles/InvestmentVisualizationPage.css';

interface Investment {
    id: number;
    name: string;
    amount: number;
    growth: number;
}

const InvestmentsVisualizationPage: React.FC = () => {
    const [investments, setInvestments] = useState<Investment[]>([]);

    useEffect(() => {
        // Mocked data
        const mockInvestments = [
            { id: 1, name: "Stock A", amount: 1000, growth: 15 },
            { id: 2, name: "Stock B", amount: 2000, growth: 10 },
            { id: 3, name: "Real Estate", amount: 5000, growth: 5 },
        ];
        setInvestments(mockInvestments);
    }, []);

    const data = {
        labels: investments.map((inv) => inv.name),
        datasets: [
            {
                label: 'Investment Amount',
                data: investments.map((inv) => inv.amount),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
            {
                label: 'Growth (%)',
                data: investments.map((inv) => inv.growth),
                backgroundColor: 'rgba(153, 102, 255, 0.6)',
            },
        ],
    };

    return (
        <div>
            <h2>Investment Data Visualization</h2>
            <Bar data={data} />
        </div>
    );
};

export default InvestmentsVisualizationPage;
