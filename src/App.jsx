import { useState, useEffect } from "react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";

import TransactionModal from "./components/TransactionModal";
import { saveAsCSV } from "./utils/exportCSV";
import EditBalanceModal from "./components/EditBalanceModal";
import EditTransactionModal from "./components/EditTransactionModal";

export default function App() {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditBalanceModalOpen, setIsEditBalanceModalOpen] = useState(false);
  const [transactionType, setTransactionType] = useState("credit");
  const [filterType, setFilterType] = useState("all");
  const [filterDate, setFilterDate] = useState("");
  const [editTransaction, setEditTransaction] = useState(null);

  useEffect(() => {
    const storedBalance = localStorage.getItem("balance");
    const storedTransactions = localStorage.getItem("transactions");

    setBalance(storedBalance !== null ? JSON.parse(storedBalance) : 0);
    setTransactions(storedTransactions ? JSON.parse(storedTransactions) : []);
  }, []);

  useEffect(() => {
    localStorage.setItem("balance", JSON.stringify(balance));
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [balance, transactions]);

  const handleTransaction = (transaction) => {
    const newTransaction = {
      ...transaction,
      date: new Date().toISOString().split("T")[0],
    };
    const updatedTransactions = [...transactions, newTransaction];
    localStorage.setItem("transactions", JSON.stringify(updatedTransactions));
    const updatedBalance =
      transaction.type === "credit"
        ? balance + parseFloat(transaction.amount)
        : balance - parseFloat(transaction.amount);

    setTransactions(updatedTransactions);
    setBalance(updatedBalance);
  };

  const handleEditTransaction = (updatedTransaction) => {
    const updatedTransactions = transactions.map((txn) =>
      txn.date === editTransaction.date && txn.amount === editTransaction.amount
        ? updatedTransaction
        : txn
    );
    setTransactions(updatedTransactions);
    localStorage.setItem("transactions", JSON.stringify(updatedTransactions));
    setEditTransaction(null);
  };

  const handleDeleteTransaction = (txnToDelete) => {
    const updatedTransactions = transactions.filter(
      (txn) => txn !== txnToDelete
    );
    const updatedBalance =
      txnToDelete.type === "credit"
        ? balance - parseFloat(txnToDelete.amount)
        : balance + parseFloat(txnToDelete.amount);

    setTransactions(updatedTransactions);
    setBalance(updatedBalance);
    localStorage.setItem("transactions", JSON.stringify(updatedTransactions));
    localStorage.setItem("balance", JSON.stringify(updatedBalance));
  };

  const handleUpdateBalance = (amount) => {
    setBalance(amount);
    setIsEditBalanceModalOpen(false);
    localStorage.setItem("balance", JSON.stringify(amount));
  };

  const filteredTransactions = transactions.filter((txn) => {
    if (filterType !== "all" && txn.type !== filterType) return false;
    if (filterDate && txn.date !== filterDate) return false;
    return true;
  });

  return (
    <div className="p-4 min-h-screen bg-gray-100">
      <header className="text-xl font-bold text-center mb-4">
        Expense Tracker
      </header>
      <div className="bg-white p-4 rounded shadow-md text-lg font-semibold flex justify-between items-center">
        <span>Balance: ₹{balance}</span>
        <button
          className="bg-yellow-500 text-white p-2 rounded"
          onClick={() => setIsEditBalanceModalOpen(true)}
        >
          Reset Balance
        </button>
      </div>

      <div className="mt-4 flex gap-2">
        <select
          className="p-2 border rounded w-1/2"
          onChange={(e) => setFilterType(e.target.value)}
          value={filterType}
        >
          <option value="all">All Transactions</option>
          <option value="credit">Credits</option>
          <option value="debit">Debits</option>
        </select>
        <input
          type="date"
          className="p-2 border rounded w-1/2"
          onChange={(e) => setFilterDate(e.target.value)}
          value={filterDate}
        />
      </div>

      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleTransaction}
        type={transactionType}
      />
      <EditBalanceModal
        isOpen={isEditBalanceModalOpen}
        onClose={() => setIsEditBalanceModalOpen(false)}
        onUpdateBalance={handleUpdateBalance}
        currentBalance={balance}
      />
      <EditTransactionModal
        transaction={editTransaction}
        onClose={() => setEditTransaction(null)}
        onSubmit={handleEditTransaction}
      />

      <div className="mt-4">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((txn, index) => (
            <div
              key={index}
              className="grid grid-cols-4 gap-4 p-2 border-b items-center"
            >
              <span>
                {txn.date} - {txn.person || "Unknown"} ({txn.description})
              </span>
              <span
                className={`text-right ${
                  txn.type === "credit" ? "text-green-600" : "text-red-600"
                }`}
              >
                {txn.type === "credit" ? "+" : "-"}₹{txn.amount}
              </span>
              <PencilIcon
                className="h-5 w-5 text-blue-500 cursor-pointer"
                onClick={() => setEditTransaction(txn)}
              />
              <TrashIcon
                className="h-5 w-5 text-red-500 cursor-pointer"
                onClick={() => handleDeleteTransaction(txn)}
              />
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No transactions found</p>
        )}
      </div>

      <button
        className="mt-4 w-full bg-blue-500 text-white p-2 rounded"
        onClick={() => saveAsCSV(transactions, balance)}
      >
        Export Transactions (CSV)
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

      <button
        className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg"
        onClick={() => {
          setTransactionType("credit");
          setIsModalOpen(true);
        }}
      >
        + Credit
      </button>
    </div>
  );
}
