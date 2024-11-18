// App.tsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from '../screens/NavBar';
import RegisterPage from '../screens/RegisterScreen';
import LoginPage from '../screens/LoginScreen';
import LogoutPage from '../screens/LogoutScreen';
import ResetPasswordPage from '../screens/ResetPasswordScreen';
import SummaryPage from '../screens/SummaryScreen';
import DebtEntryPage from '../screens/DebtEntryPage';
import ExpenseEntryPage from '../screens/ExpenseEntryPage';
import IncomeEntryPage from '../screens/IncomeEntryPage';
import EditDebtPage from '../screens/EditDebtPage';
import EditIncomePage from '../screens/EditIncomePage';
import EditExpensePage from '../screens/EditExpensePage';
import ActivityLogPage from '../screens/ActivityLogPage';
import RoleManagementPage from '../screens/RoleManagementPage';
import RoleCreationPage from '../screens/RoleCreationPage';
import HistoryViewPage from '../screens/HistoryViewPage';
import InvestmentsVisualizationPage from '../screens/InvestmentsVisualizationPage';
import ChartsAndGraphsPage from '../screens/ChartsAndGraphsPage';
interface Income {
    incomeSource: string;
    amount: number;
    date: string;
    type: string;
}

// Sample income for demonstration purposes
const initialIncome: Income = {
    incomeSource: "Freelancing",
    amount: 2000,
    date: "2023-12-01",
    type: "Business",
};

interface Expense {
    expenseName: string;
    amount: number;
    date: string;
    category: string;
}

// Sample expense for demonstration purposes
const initialExpense: Expense = {
    expenseName: "Expense 1",
    amount: 200,
    date: "2024-10-02",
    category: "Entertainment",
};

interface Debt {
    debtName: string;
    amount: number;
    dueDate: string;
    category: string;
}

// Mock debt data for demonstration purposes
const initialDebt: Debt = {
    debtName: "Example Debt",
    amount: 1000,
    dueDate: "2023-12-31",
    category: "Personal",
};

const App: React.FC = () => {
    const [income, setIncome] = useState<Income>(initialIncome);
    const [expense, setExpense] = useState<Expense>(initialExpense);
    const [debt, setDebt] = useState<Debt>(initialDebt);

    const handleSaveIncome = (updatedIncome: Income) => {
        setIncome(updatedIncome);
        alert("Income updated successfully!");
    };

    const handleDeleteIncome = () => {
        alert("Income deleted successfully!");
        setIncome({
            incomeSource: "",
            amount: 0,
            date: "",
            type: "",
        });
    };

    const handleSaveExpense = (updatedExpense: Expense) => {
        setExpense(updatedExpense);
        console.log("Expense updated successfully:", updatedExpense);
    };

    const handleDeleteExpense = () => {
        alert("Expense deleted successfully!");
        setExpense({
            expenseName: "",
            amount: 0,
            date: "",
            category: "",
        });
    };

    const handleSaveDebt = (updatedDebt: Debt) => {
        setDebt(updatedDebt);
        console.log("Debt updated successfully:", updatedDebt);
    };

    return (
        <Router>
            <NavBar />
            <Routes>
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/logout" element={<LogoutPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route path="/summary" element={<SummaryPage />} />
                <Route path="/debt-entry" element={<DebtEntryPage />} />
                <Route path="/add-expense" element={<ExpenseEntryPage />} />
                <Route path="/add-income" element={<IncomeEntryPage />} />
                <Route
                    path="/edit-income"
                    element={
                        <EditIncomePage
                            income={income}
                            onSave={handleSaveIncome}
                            onDelete={handleDeleteIncome}
                        />
                    }
                />
                <Route
                    path="/edit-expense"
                    element={
                        <EditExpensePage
                            expense={expense}
                            onSave={handleSaveExpense}
                            onDelete={handleDeleteExpense}
                        />
                    }
                />
                <Route
                    path="/edit-debt"
                    element={
                        <EditDebtPage
                            debt={debt}
                            onSave={handleSaveDebt}
                        />
                    }
                />
                <Route path="/activity-log" element={<ActivityLogPage />} />
                <Route path="/role-management" element={<RoleManagementPage />} />
                <Route path="/create-role" element={<RoleCreationPage />} />
                <Route path="/history-view" element={<HistoryViewPage />} />
                <Route path="/investments-visualization" element={<InvestmentsVisualizationPage />} />
                <Route path="/charts-and-graphs" element={<ChartsAndGraphsPage />} />
            </Routes>
        </Router>
    );
};

export default App;
