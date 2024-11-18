import React, { useEffect, useState } from 'react';
import './styles/HistoryViewPage.css';

interface HistoryEntry {
    id: number;
    type: string;
    details: string;
    amount: number;
    date: string;
}

const HistoryViewPage: React.FC = () => {
    const [history, setHistory] = useState<HistoryEntry[]>([]);

    useEffect(() => {
        fetch('/api/history')
            .then((response) => response.json())
            .then((data) => setHistory(data))
            .catch((error) => console.error("Error fetching history:", error));
    }, []);

    return (
        <div className="history-container">
            <h2>Transaction History</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Type</th>
                        <th>Details</th>
                        <th>Amount</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {history.map((entry) => (
                        <tr key={entry.id}>
                            <td>{entry.id}</td>
                            <td>{entry.type}</td>
                            <td>{entry.details}</td>
                            <td>${entry.amount.toFixed(2)}</td>
                            <td>{new Date(entry.date).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default HistoryViewPage;
