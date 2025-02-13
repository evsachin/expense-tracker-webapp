import { useState } from "react";

export default function InitialBalanceModal({ onSetBalance }) {
  const [amount, setAmount] = useState("");

  const handleSubmit = () => {
    if (!amount || isNaN(amount) || amount <= 0) {
      alert("Please enter a valid initial balance.");
      return;
    }
    onSetBalance(parseFloat(amount));
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-lg w-80">
        <h2 className="text-lg font-semibold mb-4">Set Initial Balance</h2>
        <input
          type="number"
          className="p-2 border w-full rounded mb-2"
          placeholder="Enter Initial Balance"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button
          className="w-full bg-green-500 text-white p-2 rounded"
          onClick={handleSubmit}
        >
          Save Balance
        </button>
      </div>
    </div>
  );
}
