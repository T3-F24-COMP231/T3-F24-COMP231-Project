import React, { useState } from 'react';
import './styles/IncomeEntryPage.css';

const IncomeEntryPage: React.FC = () => {
    const [incomeSource, setIncomeSource] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState('');
    const [type, setType] = useState('Salary');

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        const incomeData = {
            incomeSource,
            amount: parseFloat(amount),
            date,
            type,
        };

        console.log('Income Data Submitted:', incomeData);
        alert('Income added successfully!');
        setIncomeSource('');
        setAmount('');
        setDate('');
        setType('Salary');
    };

    return (
        <div className="income-entry-container">
            <h2>Add Income</h2>
            <form onSubmit={handleSubmit} className="income-entry-form">
                <label>
                    Income Source:
                    <input
                        type="text"
                        value={incomeSource}
                        onChange={(e) => setIncomeSource(e.target.value)}
                        required
                    />
                </label>

                <label>
                    Amount:
                    <input
                        type="number"
                        step="0.01"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                    />
                </label>

                <label>
                    Date:
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                    />
                </label>

                <label>
                    Type:
                    <select value={type} onChange={(e) => setType(e.target.value)}>
                        <option value="Salary">Salary</option>
                        <option value="Business">Business</option>
                        <option value="Investments">Investments</option>
                        <option value="Other">Other</option>
                    </select>
                </label>

                <button type="submit" className="submit-button">
                    Add Income
                </button>
            </form>
        </div>
    );
};

export default IncomeEntryPage;
