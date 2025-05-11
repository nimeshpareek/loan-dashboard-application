import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Container, Row, Col, Card } from 'react-bootstrap';

function VerifierDashboard() {
  const [loans, setLoans] = useState([]);

  useEffect(() => {
    // Fetch all loan applications
    axios.get('http://localhost:5000/api/loans')
      .then((response) => setLoans(response.data))
      .catch((error) => console.error('Error fetching loans:', error));
  }, []);

  const updateLoanStatus = (id, status) => {
    axios.post(`http://localhost:5000/api/loans/${id}/status`, { status })
      .then(() => {
        // Update the loan status in the state
        setLoans(loans.map(loan => loan.id === id ? { ...loan, status } : loan));
      })
      .catch((error) => console.error('Error updating loan status:', error));
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={10}>
          <Card className="p-4 shadow-sm">
            <Card.Body>
              <h2 className="mb-4">Verifier Dashboard</h2>

              {loans.length === 0 ? (
                <p>No pending loan applications.</p>
              ) : (
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Username</th> {/* Updated column header */}
                      <th>Name</th>
                      <th>Loan Amount</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loans.map((loan) => (
                      <tr key={loan.id}>
                        <td>{loan.id}</td>
                        <td>{loan.username}</td> {/* Display username */}
                        <td>{loan.name}</td>
                        <td>${loan.loanAmount}</td>
                        <td>{loan.status || 'Pending'}</td>
                        <td>
                          <Button
                            variant="success"
                            onClick={() => updateLoanStatus(loan.id, 'approved')}
                            disabled={loan.status === 'approved' || loan.status === 'rejected'}
                            className="me-2"
                          >
                            Approve
                          </Button>
                          <Button
                            variant="danger"
                            onClick={() => updateLoanStatus(loan.id, 'rejected')}
                            disabled={loan.status === 'approved' || loan.status === 'rejected'}
                          >
                            Reject
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default VerifierDashboard;
