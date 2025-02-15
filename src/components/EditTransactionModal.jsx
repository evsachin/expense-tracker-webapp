import { useState, useEffect } from "react";

export default function EditTransactionModal({
  transaction,
  onClose,
  onSubmit,
}) {
  const [amount, setAmount] = useState("");
  const [person, setPerson] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    if (transaction) {
      setAmount(transaction.amount);
      setPerson(transaction.person);
      setCategory(transaction.category);
    }
  }, [transaction]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || !person || !category) return;

    onSubmit({ ...transaction, amount: parseFloat(amount), person, category });
    onClose();
  };

  if (!transaction) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded shadow-lg w-96">
        <h2 className="text-lg font-bold mb-4">Edit Transaction</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="number"
            className="w-full p-2 border rounded mb-2"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
          />
          <input
            type="text"
            className="w-full p-2 border rounded mb-2"
            value={person}
            onChange={(e) => setPerson(e.target.value)}
            placeholder="Person"
          />
          <input
            type="text"
            className="w-full p-2 border rounded mb-2"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Category"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="bg-gray-300 px-4 py-2 rounded"
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
