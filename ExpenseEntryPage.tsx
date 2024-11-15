import React, { useState } from 'react';
import './styles/ExpenseEntryPage.css';

const ExpenseEntryPage: React.FC = () => {
    const [expenseName, setExpenseName] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState('');
    const [category, setCategory] = useState('Food');

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        const expenseData = {
            expenseName,
            amount: parseFloat(amount),
            date,
            category,
        };

        console.log('Expense Data Submitted:', expenseData);
        alert('Expense added successfully!');
        setExpenseName('');
        setAmount('');
        setDate('');
        setCategory('Food');
    };

    return (
        <div className="expense-entry-container">
            <h2>Add Expense</h2>
            <form onSubmit={handleSubmit} className="expense-entry-form">
                <label>
                    Expense Name:
                    <input
                        type="text"
                        value={expenseName}
                        onChange={(e) => setExpenseName(e.target.value)}
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
                    Category:
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="Food">Food</option>
                        <option value="Transportation">Transportation</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Other">Other</option>
                    </select>
                </label>

                <button type="submit" className="submit-button">
                    Add Expense
                </button>
            </form>
        </div>
    );
};

export default ExpenseEntryPage;
