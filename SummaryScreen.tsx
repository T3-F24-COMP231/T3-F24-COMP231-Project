// screens/SummaryPage.tsx
import React, { useState } from 'react';
import './styles/SummaryPage.css';

const SummaryPage: React.FC = () => {
    const [dateRange, setDateRange] = useState('Weekly');
    const [income, setIncome] = useState(0);
    const [expense, setExpense] = useState(0);
    const balance = income - expense;

    const handleDateRangeChange = (range: string) => {
        setDateRange(range);
        // Fetch income and expense data based on range here
    };

    return (
        <div className="summary-container">
            <h2>Financial Summary</h2>
            <div className="date-range-buttons">
                <button 
                    className={dateRange === 'Weekly' ? 'active' : ''} 
                    onClick={() => handleDateRangeChange('Weekly')}
                >
                    Weekly
                </button>
                <button 
                    className={dateRange === 'Monthly' ? 'active' : ''} 
                    onClick={() => handleDateRangeChange('Monthly')}
                >
                    Monthly
                </button>
            </div>
            <div className="summary-details">
                <p>Income: ${income}</p>
                <p>Expense: ${expense}</p>
                <p>Balance: ${balance}</p>
            </div>
        </div>
    );
};

export default SummaryPage;
