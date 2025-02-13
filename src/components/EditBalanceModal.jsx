import { useState } from "react";

export default function EditBalanceModal({
  isOpen,
  onClose,
  onUpdateBalance,
  currentBalance,
}) {
  const [newBalance, setNewBalance] = useState(currentBalance);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateBalance(parseFloat(newBalance));
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-md w-80">
        <h2 className="text-lg font-semibold mb-4">Edit Balance</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="number"
            className="w-full p-2 border rounded mb-4"
            value={newBalance}
            onChange={(e) => setNewBalance(e.target.value)}
          />
          <div className="flex justify-between">
            <button
              type="button"
              className="bg-gray-500 text-white px-4 py-2 rounded"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
