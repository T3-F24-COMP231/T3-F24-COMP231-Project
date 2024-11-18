import React, { useState } from 'react';

interface EditDebtPageProps {
  debt: {
    debtName: string;
    amount: number;
    dueDate: string;
    category: string;
  };
  onSave: (updatedDebt: EditDebtPageProps['debt']) => void;
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

    onSave(updatedDebt);
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Edit Debt Form</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <label>
          Debt Name:
          <input
            type="text"
            value={debtName}
            onChange={(e) => setDebtName(e.target.value)}
            style={{ display: 'block', marginBottom: '10px' }}
          />
        </label>
        <label>
          Amount:
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{ display: 'block', marginBottom: '10px' }}
          />
        </label>
        <label>
          Due Date:
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            style={{ display: 'block', marginBottom: '10px' }}
          />
        </label>
        <label>
          Category:
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{ display: 'block', marginBottom: '10px' }}
          >
            <option value="Personal">Personal</option>
            <option value="Business">Business</option>
            <option value="Other">Other</option>
          </select>
        </label>
        <button type="submit" style={{ marginTop: '10px' }}>
          Save Changes
        </button>
      </form>

      {showSuccessMessage && <p style={{ color: 'green' }}>Changes saved successfully!</p>}

      <div style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
        <h3>Updated Debt Details</h3>
        <p>
          <strong>Debt Name:</strong> {debt.debtName}
        </p>
        <p>
          <strong>Amount:</strong> ${debt.amount.toFixed(2)}
        </p>
        <p>
          <strong>Due Date:</strong> {debt.dueDate}
        </p>
        <p>
          <strong>Category:</strong> {debt.category}
        </p>
      </div>
    </div>
  );
};

export default EditDebtPage;
