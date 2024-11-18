// EditExpensePage.tsx
import React, { useState } from 'react';
import './styles/EditExpensePage.css';

interface Expense {
    expenseName: string;
    amount: number;
    date: string;
    category: string;
}

interface EditOrDeleteExpensePageProps {
    expense: Expense;
    onSave: (updatedExpense: Expense) => void;
    onDelete: () => void;
}

const EditOrDeleteExpensePageProps: React.FC<EditOrDeleteExpensePageProps> = ({ expense, onSave, onDelete }) => {
    const [expenseName, setExpenseName] = useState(expense.expenseName);
    const [amount, setAmount] = useState(expense.amount.toString());
    const [date, setDate] = useState(expense.date);
    const [category, setCategory] = useState(expense.category);

    const handleSave = (event: React.FormEvent) => {
        event.preventDefault();

        const updatedExpense = {
            expenseName,
            amount: parseFloat(amount),
            date,
            category,
        };

        onSave(updatedExpense);
        alert('Expense updated successfully!');
    };

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this expense?')) {
            onDelete();
        }
    };

    return (
        <div className="edit-expense-container">
            <h2>Edit or Delete Expense</h2>
            <form onSubmit={handleSave} className="edit-expense-form">
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
                    <select value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option value="Food">Food</option>
                        <option value="Transportation">Transportation</option>
                        <option value="Entertainment">Entertainment</option>
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

export default EditOrDeleteExpensePageProps;