import React, { useState } from 'react';
import './styles/DebtEntryPage.css';

const DebtEntryPage: React.FC = () => {
    const [debtName, setDebtName] = useState('');
    const [amount, setAmount] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [category, setCategory] = useState('Personal');

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        const debtData = {
            debtName,
            amount: parseFloat(amount),
            dueDate,
            category,
        };

        console.log('Debt Data Submitted:', debtData);
        // Add logic to send data to backend or process it
        alert('Debt entry added successfully!');
        setDebtName('');
        setAmount('');
        setDueDate('');
        setCategory('Personal');
    };

    return (
        <div className="debt-entry-container">
            <h2>Debt Entry Form</h2>
            <form onSubmit={handleSubmit} className="debt-entry-form">
                <label>
                    Debt Name:
                    <input
                        type="text"
                        value={debtName}
                        onChange={(e) => setDebtName(e.target.value)}
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
                    Due Date:
                    <input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        required
                    />
                </label>

                <label>
                    Category:
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="Personal">Personal</option>
                        <option value="Business">Business</option>
                        <option value="Other">Other</option>
                    </select>
                </label>

                <button type="submit" className="submit-button">
                    Add Debt
                </button>
            </form>
        </div>
    );
};

export default DebtEntryPage;
