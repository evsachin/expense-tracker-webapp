import { useState } from "react";

const InitialBalanceModal = ({ onSetBalance }) => {
  const [initialBalance, setInitialBalance] = useState("");

  const handleSubmit = () => {
    if (!initialBalance || isNaN(initialBalance)) {
      alert("Please enter a valid amount");
      return;
    }
    onSetBalance(parseFloat(initialBalance));
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-lg font-bold mb-4">Set Initial Balance</h2>
        <input
          type="number"
          placeholder="Enter initial balance"
          className="w-full p-2 border rounded mb-2"
          value={initialBalance}
          onChange={(e) => setInitialBalance(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white p-2 rounded w-full"
          onClick={handleSubmit}
        >
          Set Balance
        </button>
      </div>
    </div>
  );
};

export default InitialBalanceModal;
