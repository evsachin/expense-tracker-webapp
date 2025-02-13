import { useState, useEffect } from "react";
import TransactionModal from "./components/TransactionModal";
import { saveAsCSV } from "./utils/exportCSV";
import InitialBalanceModal from "./components/InitialBalanceModal";

export default function App() {
  const [balance, setBalance] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInitialModalOpen, setIsInitialModalOpen] = useState(false);
  const [transactionType, setTransactionType] = useState("credit");
  const [filterType, setFilterType] = useState("all");
  const [filterDate, setFilterDate] = useState("");

  // ✅ Load transactions & balance from localStorage properly
  useEffect(() => {
    const storedBalance = localStorage.getItem("balance");
    const storedTransactions = localStorage.getItem("transactions");

    if (storedBalance !== null) setBalance(JSON.parse(storedBalance));

    // ⚠️ Ensure transactions are parsed as an array, not null
    setTransactions(storedTransactions ? JSON.parse(storedTransactions) : []);

    if (!storedBalance) setIsInitialModalOpen(true);
  }, []);

  // ✅ Save transactions & balance to localStorage when they change
  useEffect(() => {
    if (balance !== null)
      localStorage.setItem("balance", JSON.stringify(balance));
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [balance, transactions]);

  const handleTransaction = (transaction) => {
    const newTransaction = {
      ...transaction,
      date: new Date().toISOString().split("T")[0], // Auto-add today's date
    };

    const updatedTransactions = [...transactions, newTransaction];

    // ✅ Save transactions to localStorage
    localStorage.setItem("transactions", JSON.stringify(updatedTransactions));

    const updatedBalance =
      transaction.type === "credit"
        ? balance + parseFloat(transaction.amount)
        : balance - parseFloat(transaction.amount);

    setTransactions(updatedTransactions);
    setBalance(updatedBalance);
  };

  const handleSetInitialBalance = (amount) => {
    setBalance(amount);
    setIsInitialModalOpen(false);
    localStorage.setItem("balance", JSON.stringify(amount));
  };

  const handleEditBalance = (newAmount) => {
    setBalance(newAmount);
    localStorage.setItem("balance", JSON.stringify(newAmount));
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

      {/* Open modal only if balance is not set */}
      {isInitialModalOpen && (
        <InitialBalanceModal onSetBalance={handleSetInitialBalance} />
      )}

      {balance !== null && (
        <>
          <div className="bg-white p-4 rounded shadow-md text-lg font-semibold flex justify-between items-center">
            <span>Balance: ₹{balance}</span>
            <button
              className="bg-yellow-500 text-white p-2 rounded"
              onClick={() => setIsInitialModalOpen(true)}
            >
              Edit Balance
            </button>
          </div>

          {/* Filter Section */}
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

          <div className="mt-4">
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((txn, index) => (
                <div key={index} className="flex justify-between p-2 border-b">
                  <span>
                    {txn.date} -{" "}
                    {txn.type === "credit"
                      ? `From: ${txn.person || "Unknown"}`
                      : `To: ${txn.person}`}{" "}
                    ({txn.category})
                  </span>
                  <span
                    className={
                      txn.type === "credit" ? "text-green-600" : "text-red-600"
                    }
                  >
                    {txn.type === "credit" ? "+" : "-"}₹{txn.amount}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No transactions found</p>
            )}
          </div>

          {/* Export CSV Button */}
          <button
            className="mt-4 w-full bg-blue-500 text-white p-2 rounded"
            onClick={() => saveAsCSV(transactions)}
          >
            Export Transactions (CSV)
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

          <button
            className="fixed bottom-6 left-6 bg-red-500 text-white p-4 rounded-full shadow-lg"
            onClick={() => {
              setTransactionType("debit");
              setIsModalOpen(true);
            }}
          >
            - Debit
          </button>
        </>
      )}
    </div>
  );
}
