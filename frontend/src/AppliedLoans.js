import React, { useState, useEffect } from 'react';

const AppliedLoans = () => {
  const [loans, setLoans] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const userId = localStorage.getItem('userId'); // Get user ID from localStorage

    if (!userId) {
      setError('User not logged in');
      return;
    }

    fetch(`http://localhost:5000/api/loans/${userId}`) // Use dynamic user ID
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch loans');
        }
        return response.json();
      })
      .then((data) => {
        setLoans(data);
      })
      .catch((err) => {
        console.error('Error fetching loans:', err);
        setError('Failed to fetch loans');
      });
  }, []);

  return (
    <div>
      <h2>Your Applied Loans</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loans.length === 0 ? (
        <p>No loans applied yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Loan Name</th>
              <th>Loan Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {loans.map((loan) => (
              <tr key={loan.id}>
                <td>{loan.name}</td>
                <td>{loan.loanAmount}</td>
                <td>{loan.status || 'Pending'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AppliedLoans;
