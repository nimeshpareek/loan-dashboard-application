import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LoanApplication = () => {
  const [loanAmount, setLoanAmount] = useState('');
  const [loanPurpose, setLoanPurpose] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loans, setLoans] = useState([]);

  // Fetch user's loan applications on component mount
  const fetchLoans = async () => {
    const userId = localStorage.getItem('userId'); // Get userId from localStorage

    if (userId) {
      try {
        const response = await axios.get(`http://localhost:5000/api/loans/${userId}`);
        setLoans(response.data);
      } catch (err) {
        console.error('Failed to fetch loans:', err);
      }
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const handleLoanSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    const userId = localStorage.getItem('userId'); // Get userId from localStorage

    if (!userId) {
      setError('You must be logged in to apply for a loan.');
      return;
    }

    if (!loanAmount || !loanPurpose) {
      setError('Please provide both loan amount and purpose.');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/loans', {
        userId, // Send userId from localStorage
        loanAmount,
        name: loanPurpose,
      });

      setMessage('Loan application submitted successfully!');
      setLoanAmount('');
      setLoanPurpose('');
      fetchLoans(); // Fetch updated loans after submission
    } catch (err) {
      console.error('Error submitting loan application:', err);
      setError('Failed to apply for loan');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Loan Application</h2>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleLoanSubmit}>
        <div className="mb-3">
          <label className="form-label">Loan Amount</label>
          <input
            type="number"
            className="form-control"
            value={loanAmount}
            onChange={(e) => setLoanAmount(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Loan Purpose</label>
          <input
            type="text"
            className="form-control"
            value={loanPurpose}
            onChange={(e) => setLoanPurpose(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Apply for Loan
        </button>
      </form>

      <h3>Your Previous Loan Applications</h3>
      {loans.length > 0 ? (
        <ul>
          {loans.map((loan) => (
            <li key={loan.id}>
              Loan Amount: {loan.loanAmount} | Purpose: {loan.name} | Status: {loan.status}
            </li>
          ))}
        </ul>
      ) : (
        <p>No previous loan applications.</p>
      )}
    </div>
  );
};

export default LoanApplication;
