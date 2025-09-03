import React, { useState } from 'react';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';

// Placeholder for Stripe (uncomment and install @stripe/stripe-js and @stripe/react-stripe-js for real use)
// import { loadStripe } from '@stripe/stripe-js';
// import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
// const stripePromise = loadStripe('your-publishable-key-here');

interface Transaction {
  id: string;
  amount: number;
  sender: string;
  receiver: string;
  status: 'Completed' | 'Pending' | 'Failed';
  date: string;
}

const mockTransactions: Transaction[] = [
  { id: '1', amount: 500, sender: 'Investor1', receiver: 'Entrepreneur1', status: 'Completed', date: '2025-09-01' },
  { id: '2', amount: 300, sender: 'Investor2', receiver: 'Entrepreneur2', status: 'Pending', date: '2025-09-02' },
];

const PaymentsPage: React.FC = () => {
  const [walletBalance, setWalletBalance] = useState(1000);
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [fundingAmount, setFundingAmount] = useState('');
  const [cardAmount, setCardAmount] = useState(''); // For Stripe mock
  const [transactions, setTransactions] = useState(mockTransactions);
  // const stripe = useStripe();
  // const elements = useElements();

  const handleDeposit = () => {
    const amount = parseFloat(depositAmount);
    if (amount > 0) {
      setWalletBalance(walletBalance + amount);
      setTransactions([...transactions, {
        id: Date.now().toString(),
        amount,
        sender: 'User',
        receiver: 'Wallet',
        status: 'Completed',
        date: new Date().toLocaleDateString(),
      }]);
      setDepositAmount('');
      alert('Deposit successful (mock)');
    } else {
      alert('Please enter a valid amount');
    }
  };

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    if (amount > 0 && amount <= walletBalance) {
      setWalletBalance(walletBalance - amount);
      setTransactions([...transactions, {
        id: Date.now().toString(),
        amount: -amount,
        sender: 'Wallet',
        receiver: 'User',
        status: 'Completed',
        date: new Date().toLocaleDateString(),
      }]);
      setWithdrawAmount('');
      alert('Withdraw successful (mock)');
    } else {
      alert('Insufficient balance or invalid amount');
    }
  };

  const handleTransfer = () => {
    const amount = parseFloat(transferAmount);
    if (amount > 0 && amount <= walletBalance) {
      setWalletBalance(walletBalance - amount);
      setTransactions([...transactions, {
        id: Date.now().toString(),
        amount: -amount,
        sender: 'Wallet',
        receiver: 'Recipient',
        status: 'Completed',
        date: new Date().toLocaleDateString(),
      }]);
      setTransferAmount('');
      alert('Transfer successful (mock)');
    } else {
      alert('Insufficient balance or invalid amount');
    }
  };

  const handleFunding = () => {
    const amount = parseFloat(fundingAmount);
    if (amount > 0 && amount <= walletBalance) {
      setWalletBalance(walletBalance - amount);
      setTransactions([...transactions, {
        id: Date.now().toString(),
        amount: -amount,
        sender: 'Investor',
        receiver: 'Entrepreneur',
        status: 'Completed',
        date: new Date().toLocaleDateString(),
      }]);
      setFundingAmount('');
      alert('Funding successful (mock)');
    } else {
      alert('Insufficient balance or invalid amount');
    }
  };

  // Mock Stripe payment handler (replace with real logic)
  const handleCardPayment = () => {
    const amount = parseFloat(cardAmount);
    if (amount > 0) {
      // Mock Stripe payment
      // if (stripe && elements) {
      //   // Real Stripe logic here
      //   const cardElement = elements.getElement(CardElement);
      //   // Call stripe.createPaymentMethod or stripe.confirmCardPayment
      //   alert('Payment processed with Stripe (mock)');
      // } else {
      setWalletBalance(walletBalance + amount);
      setTransactions([...transactions, {
        id: Date.now().toString(),
        amount,
        sender: 'Card Payment',
        receiver: 'Wallet',
        status: 'Completed',
        date: new Date().toLocaleDateString(),
      }]);
      setCardAmount('');
      alert('Card payment successful (mock)');
      // }
    } else {
      alert('Please enter a valid amount');
    }
  };

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">Payments</h1>
      <Card>
        <CardHeader>
          <h2 className="text-lg">Wallet Balance: ${walletBalance.toFixed(2)}</h2>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="flex space-x-4">
            <Input type="number" placeholder="Deposit Amount" value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} />
            <Button onClick={handleDeposit}>Deposit</Button>
          </div>
          <div className="flex space-x-4">
            <Input type="number" placeholder="Withdraw Amount" value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)} />
            <Button onClick={handleWithdraw}>Withdraw</Button>
          </div>
          <div className="flex space-x-4">
            <Input type="number" placeholder="Transfer Amount" value={transferAmount} onChange={(e) => setTransferAmount(e.target.value)} />
            <Button onClick={handleTransfer}>Transfer</Button>
          </div>
          <div className="flex space-x-4">
            <Input type="number" placeholder="Fund Deal Amount" value={fundingAmount} onChange={(e) => setFundingAmount(e.target.value)} />
            <Button onClick={handleFunding}>Fund Deal</Button>
          </div>
          <div className="flex space-x-4">
            <Input type="number" placeholder="Card Payment Amount" value={cardAmount} onChange={(e) => setCardAmount(e.target.value)} />
            <Button onClick={handleCardPayment}>Pay with Card (Mock)</Button>
          </div>
          {/* Uncomment for Stripe
          <Elements stripe={stripePromise}>
            <form onSubmit={handleCardPayment}>
              <CardElement options={{ hidePostalCode: true }} />
              <Button type="submit" disabled={!stripe}>Pay with Card</Button>
            </form>
          </Elements> */}
        </CardBody>
      </Card>
      <Card>
        <CardHeader>
          <h2 className="text-lg">Transaction History</h2>
        </CardHeader>
        <CardBody>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border">
                <th className="p-2 border">Amount</th>
                <th className="p-2 border">Sender</th>
                <th className="p-2 border">Receiver</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id} className="border">
                  <td className="p-2 border">${tx.amount.toFixed(2)}</td>
                  <td className="p-2 border">{tx.sender}</td>
                  <td className="p-2 border">{tx.receiver}</td>
                  <td className="p-2 border">
                    <Badge variant={tx.status === 'Completed' ? 'success' : 'secondary'}>{tx.status}</Badge>
                  </td>
                  <td className="p-2 border">{tx.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
};

export default PaymentsPage;