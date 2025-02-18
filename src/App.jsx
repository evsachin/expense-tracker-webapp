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
      date: transaction.date || new Date().toISOString().split("T")[0], // Use the selected date or default to today
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

  // Calculate total credit and debit balances
  const totalCredit = transactions
    .filter((txn) => txn.type === "credit")
    .reduce((sum, txn) => sum + parseFloat(txn.amount), 0);

  const totalDebit = transactions
    .filter((txn) => txn.type === "debit")
    .reduce((sum, txn) => sum + parseFloat(txn.amount), 0);

  const filteredTransactions = transactions
    .filter((txn) => {
      if (filterType !== "all" && txn.type !== filterType) return false;
      if (filterDate && txn.date !== filterDate) return false;
      return true;
    })
    .reverse(); // Reverse the array to show the last transaction first

  return (
    <div className="p-1 min-h-screen bg-gray-100">
      <header className="text-xl font-bold text-center mb-4">
        Expense Tracker
      </header>

      {/* Display total credit, debit, and balance in a grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
        <div className="bg-white p-2 rounded-lg shadow-md border border-green-100">
          <h3 className="text-sm font-semibold text-gray-500">Total Credit</h3>
          <p className="text-2xl font-bold text-green-600">
            ₹{totalCredit.toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md border border-red-100">
          <h3 className="text-sm font-semibold text-gray-500">Total Debit</h3>
          <p className="text-2xl font-bold text-red-600">
            ₹{totalDebit.toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md border border-blue-100">
          <h3 className="text-sm font-semibold text-gray-500">Balance</h3>
          <p className="text-2xl font-bold text-blue-600">
            ₹{balance.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Filter and transaction list section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex gap-4 mb-6">
          <select
            className="p-2 border rounded w-1/2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setFilterType(e.target.value)}
            value={filterType}
          >
            <option value="all">All Transactions</option>
            <option value="credit">Credits</option>
            <option value="debit">Debits</option>
          </select>
          <input
            type="date"
            className="p-2 border rounded w-1/2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setFilterDate(e.target.value)}
            value={filterDate}
          />
        </div>

        <div className="mt-4">
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((txn, index) => (
              <div
                key={index}
                className="grid grid-cols-6 gap-4 p-2 border-b hover:bg-gray-50 transition-colors"
              >
                <div className="col-span-3">
                  <div className="flex space-x-1.5">
                    <span className="font-semibold">
                      {txn.person || "Unknown"}
                    </span>
                    <p className="text-gray-500 text-sm">({txn.description})</p>
                  </div>
                  <p className="text-xs text-gray-400">{txn.date}</p>
                </div>
                <span
                  className={`col-span-2 text-right ${
                    txn.type === "credit" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {txn.type === "credit" ? "+" : "-"}₹{txn.amount}
                </span>
                <div className="flex gap-2 justify-end">
                  <PencilIcon
                    className="h-5 w-5 text-blue-500 cursor-pointer hover:text-blue-600"
                    onClick={() => setEditTransaction(txn)}
                  />
                  <TrashIcon
                    className="h-5 w-5 text-red-500 cursor-pointer hover:text-red-600"
                    onClick={() => handleDeleteTransaction(txn)}
                  />
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-4">
              No transactions found
            </p>
          )}
        </div>
      </div>

      {/* Export button */}
      <button
        className="mt-6 w-full bg-blue-500 text-white p-3 rounded-lg shadow-md hover:bg-blue-600 transition-colors"
        onClick={() => saveAsCSV(transactions, balance)}
      >
        Export Transactions (CSV)
      </button>

      {/* Floating action buttons for adding transactions */}
      <button
        className="fixed bottom-6 left-6 bg-red-500 text-white p-4 rounded-full shadow-lg hover:bg-red-600 transition-colors"
        onClick={() => {
          setTransactionType("debit");
          setIsModalOpen(true);
        }}
      >
        - Debit
      </button>

      <button
        className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-colors"
        onClick={() => {
          setTransactionType("credit");
          setIsModalOpen(true);
        }}
      >
        + Credit
      </button>

      {/* Modals */}
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
    </div>
  );
}
