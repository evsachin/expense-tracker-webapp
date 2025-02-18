import { useState } from "react";

const TransactionModal = ({ isOpen, onClose, onSubmit, type }) => {
  const [amount, setAmount] = useState("");
  const [person, setPerson] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]); // Default to today

  const handleSubmit = () => {
    if (!amount) return alert("Amount is required");
    if (!description) return alert("Description is required");

    const transaction = {
      amount: parseFloat(amount),
      person,
      description,
      type,
      date, // Use the selected date
    };

    onSubmit(transaction);
    setAmount("");
    setPerson("");
    setDescription("");
    setDate(new Date().toISOString().split("T")[0]); // Reset to today after submission
    onClose();
  };

  return isOpen ? (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-lg font-bold mb-4">
          {type === "credit" ? "Add Credit" : "Add Debit"}
        </h2>
        <input
          type="number"
          placeholder="Enter amount"
          className="w-full p-2 border rounded mb-2"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <input
          type="text"
          placeholder={type === "credit" ? "From whom?" : "To whom?"}
          className="w-full p-2 border rounded mb-2"
          value={person}
          onChange={(e) => setPerson(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter description"
          className="w-full p-2 border rounded mb-2"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="date"
          className="w-full p-2 border rounded mb-2"
          value={date}
          onChange={(e) => setDate(e.target.value)} // Allow user to select a date
        />
        <div className="flex justify-end">
          <button className="mr-2 bg-gray-300 p-2 rounded" onClick={onClose}>
            Cancel
          </button>
          <button
            className="bg-blue-500 text-white p-2 rounded"
            onClick={handleSubmit}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default TransactionModal;
