import { useState, useEffect } from "react";
import TransactionModal from "./components/TransactionModal";
 
export default function App() {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionType, setTransactionType] = useState("credit");

  useEffect(() => {
    const storedBalance = localStorage.getItem("balance");
    const storedTransactions = localStorage.getItem("transactions");

    if (storedBalance) setBalance(JSON.parse(storedBalance));
    if (storedTransactions) setTransactions(JSON.parse(storedTransactions));
  }, []);

  useEffect(() => {
    localStorage.setItem("balance", JSON.stringify(balance));
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [balance, transactions]);

  const handleTransaction = (transaction) => {
    const updatedTransactions = [...transactions, transaction];
    const updatedBalance =
      transaction.type === "credit"
        ? balance + parseFloat(transaction.amount)
        : balance - parseFloat(transaction.amount);

    setTransactions(updatedTransactions);
    setBalance(updatedBalance);
  };

  return (
    <div className="p-4 min-h-screen bg-gray-100">
      <header className="text-xl font-bold text-center mb-4">
        Expense Tracker
      </header>

      <div className="bg-white p-4 rounded shadow-md text-lg font-semibold">
        Balance: ₹{balance}
      </div>

      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleTransaction}
        type={transactionType}
      />

      <div className="mt-4">
        {transactions.map((txn, index) => (
          <div key={index} className="flex justify-between p-2 border-b">
            <span>{txn.person || "Credit"}</span>
            <span
              className={
                txn.type === "credit" ? "text-green-600" : "text-red-600"
              }
            >
              {txn.type === "credit" ? "+" : "-"}₹{txn.amount}
            </span>
          </div>
        ))}
      </div>

      <button
        className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg"
        onClick={() => {
          setTransactionType("credit");
          setIsModalOpen(true);
        }}
      >
        + Credit
      </button>

      <button
        className="fixed bottom-6 left-6 bg-red-500 text-white p-4 rounded-full shadow-lg"
        onClick={() => {
          setTransactionType("debit");
          setIsModalOpen(true);
        }}
      >
        - Debit
      </button>
    </div>
  );
}
