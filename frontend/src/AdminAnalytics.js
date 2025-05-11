import React, { useState, useEffect } from 'react';

function AdminAnalytics() {
  const [loanStats, setLoanStats] = useState({ approved: 0, pending: 0, rejected: 0 });
  const [userStats, setUserStats] = useState(0);

  useEffect(() => {
    fetch('http://localhost:5000/api/statistics')
      .then(res => res.json())
      .then(data => setLoanStats(data));

    fetch('http://localhost:5000/api/users/count')
      .then(res => res.json())
      .then(data => setUserStats(data.count));
  }, []);

  return (
    <div className="container mt-5">
      <h2>Admin Analytics</h2>
      <h4>Loan Statistics</h4>
      <ul className="list-group">
        <li className="list-group-item">Approved Loans: {loanStats.approved}</li>
        <li className="list-group-item">Pending Loans: {loanStats.pending}</li>
        <li className="list-group-item">Rejected Loans: {loanStats.rejected}</li>
      </ul>

      <h4>User Statistics</h4>
      <ul className="list-group">
        <li className="list-group-item">Total Users: {userStats}</li>
      </ul>
    </div>
  );
}

export default AdminAnalytics;
