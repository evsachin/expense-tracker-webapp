import { saveAs } from "file-saver";
import Papa from "papaparse";

export const saveAsCSV = (transactions) => {
  if (!transactions || transactions.length === 0) {
    return alert("No transactions to export!");
  }

  // Ensure all fields are present in every row
  const formattedTransactions = transactions.map(
    ({ amount, person, category, type, date }) => ({
      Date: date || "N/A",
      Type: type || "N/A",
      Amount: amount || 0,
      Person: person || "N/A",
      Category: category || "N/A",
    })
  );

  const csvData = Papa.unparse(formattedTransactions);

  const fileName = `transactions_${new Date().toISOString().split("T")[0]}.csv`;
  const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
  saveAs(blob, fileName);
};
