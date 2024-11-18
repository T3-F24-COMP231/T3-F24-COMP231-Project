// EditOrDeleteIncomePage.tsx
import React, { useState } from 'react';
import './styles/EditIncomePage.css';

interface Income {
    incomeSource: string;
    amount: number;
    date: string;
    type: string;
}

interface EditOrDeleteIncomePageProps {
    income: Income;
    onSave: (updatedIncome: Income) => void;
    onDelete: () => void;
}

const EditOrDeleteIncomePage: React.FC<EditOrDeleteIncomePageProps> = ({ income, onSave, onDelete }) => {
    const [incomeSource, setIncomeSource] = useState(income.incomeSource);
    const [amount, setAmount] = useState(income.amount.toString());
    const [date, setDate] = useState(income.date);
    const [type, setType] = useState(income.type);

    const handleSave = (event: React.FormEvent) => {
        event.preventDefault();

        const updatedIncome = {
            incomeSource,
            amount: parseFloat(amount),
            date,
            type,
        };

        onSave(updatedIncome);
        alert('Income updated successfully!');
    };

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this income?')) {
            onDelete();
        }
    };

    return (
        <div className="edit-income-container">
            <h2>Edit or Delete Income</h2>
            <form onSubmit={handleSave} className="edit-income-form">
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

                <button type="submit" className="save-button">
                    Save Changes
                </button>
                <button type="button" onClick={handleDelete} className="delete-button">
                    Delete
                </button>
            </form>
        </div>
    );
};

export default EditOrDeleteIncomePage;
