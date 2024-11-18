import React, { useState } from 'react';
import './styles/DebtEntryPage.css';

interface Debt {
    debtName: string;
    amount: number;
    dueDate: string;
    category: string;
}

interface EditDebtPageProps {
    debt: Debt;
    onSave: (updatedDebt: Debt) => void;
}

const EditDebtPage: React.FC<EditDebtPageProps> = ({ debt, onSave }) => {
    const [debtName, setDebtName] = useState(debt.debtName);
    const [amount, setAmount] = useState(debt.amount.toString());
    const [dueDate, setDueDate] = useState(debt.dueDate);
    const [category, setCategory] = useState(debt.category);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        const updatedDebt = {
            debtName,
            amount: parseFloat(amount),
            dueDate,
            category,
        };

        console.log('Debt Data Updated:', updatedDebt);
        onSave(updatedDebt);

        // Show success message
        setShowSuccessMessage(true);

        // Hide the message after 3 seconds
        setTimeout(() => setShowSuccessMessage(false), 3000);
    };

    return (
        <div className="debt-entry-container">
            <h2>Edit Debt Form</h2>
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
                    Save Changes
                </button>
            </form>

            {showSuccessMessage && (
                <div className="success-message">
                    Changes saved successfully!
                </div>
            )}
        </div>
    );
};

export default EditDebtPage;
