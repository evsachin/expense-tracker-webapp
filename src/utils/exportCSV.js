import { saveAs } from "file-saver";
import Papa from "papaparse";

export const saveAsCSV = (transactions, balance) => {
  if (!transactions || transactions.length === 0) {
    return alert("No transactions to export!");
  }

  let previousBalanceAdded = false;

  // Separate Credit and Debit transactions
  const creditTransactions = transactions
    .filter(({ type }) => type === "credit")
    .map(({ amount, person, description, category, date }) => {
      const entry = {
        Date: date || "N/A",
        PreviousBalance: previousBalanceAdded ? "" : balance,
        "Credit Amount": amount,
        "Credit Person": person || "N/A",
        "Credit Description": description || category || "N/A", // Fix here
      };
      previousBalanceAdded = true;
      return entry;
    });

  previousBalanceAdded = false;

  const debitTransactions = transactions
    .filter(({ type }) => type === "debit")
    .map(({ amount, person, description, category, date }) => {
      const entry = {
        Date: date || "N/A",
        PreviousBalance: previousBalanceAdded ? "" : balance,
        "Debit Amount": amount,
        "Debit Person": person || "N/A",
        "Debit Description": description || category || "N/A", // Fix here
      };
      previousBalanceAdded = true;
      return entry;
    });

  // Combine data with headers for separate tables
  const csvData =
    Papa.unparse({
      fields: [
        "Date",
        "PreviousBalance",
        "Credit Amount",
        "Credit Person",
        "Credit Description",
      ],
      data: creditTransactions,
    }) +
    "\n\n" +
    Papa.unparse({
      fields: [
        "Date",
        "PreviousBalance",
        "Debit Amount",
        "Debit Person",
        "Debit Description",
      ],
      data: debitTransactions,
    });

  const fileName = `transactions_${new Date().toISOString().split("T")[0]}.csv`;
  const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
  saveAs(blob, fileName);
};
