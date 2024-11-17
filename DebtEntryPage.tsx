import React, { useState } from 'react';
import './styles/DebtEntryPage.css';

const DebtEntryPage: React.FC = () => {
    const [debtName, setDebtName] = useState('');
    const [amount, setAmount] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [category, setCategory] = useState('Personal');

    // START: Error handling for incorrect inputs
    const validateInputs = (): boolean => {
        if (!debtName.trim()) {
            alert('Error: Debt Name is required.');
            return false;
        }

        const amountValue = parseFloat(amount);
        if (!amount || isNaN(amountValue) || amountValue <= 0) {
            alert('Error: Amount must be a positive number.');
            return false;
        }

        // Regex for validating date in YYYY-MM-DD format
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dueDate || !dateRegex.test(dueDate)) {
            alert('Error: Due Date must be in YYYY-MM-DD format.');
            return false;
        }

        // Check if the date is in the past
        const today = new Date();
        const inputDate = new Date(dueDate);
        if (inputDate < today) {
            alert('Error: Due Date cannot be in the past.');
            return false;
        }

        if (!['Personal', 'Business', 'Other'].includes(category)) {
            alert('Error: Category must be Personal, Business, or Other.');
            return false;
        }

        return true;
    };
    // END: Error handling for incorrect inputs

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        // Check if inputs are valid
        if (!validateInputs()) {
            return;
        }

        const debtData = {
            debtName,
            amount: parseFloat(amount),
            dueDate,
            category,
        };

        console.log('Debt Data Submitted:', debtData);
        alert('Debt entry added successfully!');

        // Reset form fields
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
