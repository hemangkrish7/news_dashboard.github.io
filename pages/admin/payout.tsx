// FILE: pages/admin/payout.tsx
import { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useRouter } from "next/router";

interface PayoutRow {
  author: string;
  article: string;
  views: number;
  rate: number; // per view
}

const initialData: PayoutRow[] = [
  {
    author: "Alice Johnson",
    article: "React Hooks Deep Dive",
    views: 3200,
    rate: 0.05,
  },
  {
    author: "Bob Smith",
    article: "Tailwind for Beginners",
    views: 4100,
    rate: 0.04,
  },
  {
    author: "Clara Adams",
    article: "Advanced Next.js Patterns",
    views: 2800,
    rate: 0.06,
  },
];

export default function PayoutPage() {
  const user = useSelector((state: RootState) => state.auth.user);
  const [data, setData] = useState(initialData);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const tableRef = useRef(null);
  const router = useRouter();

  const handleRateChange = (index: number, newRate: number) => {
    try {
      const updated = [...data];
      updated[index].rate = newRate;
      setData(updated);
    } catch (err) {
      setError("Failed to update rate.");
    }
  };

  const handleExportPDF = async () => {
    if (!tableRef.current) return;
    const canvas = await html2canvas(tableRef.current);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("payouts.pdf");
  };

  if (user === null) {
    return <p className="text-center mt-10 text-gray-600">Loading user...</p>;
  }

  const filteredData = data.filter(
    (row) =>
      row.author.toLowerCase().includes(search.toLowerCase()) ||
      row.article.toLowerCase().includes(search.toLowerCase())
  );

  const csvData = filteredData.map((row) => ({
    Author: row.author,
    Article: row.article,
    Views: row.views,
    Rate: row.rate,
    Payout: (row.views * row.rate).toFixed(2),
  }));

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Payout Dashboard</h1>
      {error && <p className="text-red-600 mb-4">{error}</p>}

      <input
        type="text"
        placeholder="Search by author or article..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 px-3 py-2 border rounded w-full md:w-1/2"
      />

      <div className="flex gap-4 mb-4">
        <CSVLink
          data={csvData}
          filename="payouts.csv"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          Export CSV
        </CSVLink>
        <button
          onClick={handleExportPDF}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
        >
          Export PDF
        </button>
        <button
          onClick={() => router.push("/admin/analytics")}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
        >
          View Analytics
        </button>
      </div>

      <div className="overflow-x-auto" ref={tableRef}>
        <table className="min-w-full bg-white border rounded-xl shadow-md">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-4 py-2">Author</th>
              <th className="px-4 py-2">Article</th>
              <th className="px-4 py-2">Views</th>
              <th className="px-4 py-2">Rate (₹/view)</th>
              <th className="px-4 py-2">Payout (₹)</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, index) => (
              <tr key={index} className="border-t">
                <td className="px-4 py-2">{row.author}</td>
                <td className="px-4 py-2">{row.article}</td>
                <td className="px-4 py-2">{row.views}</td>
                <td className="px-4 py-2">
                  <input
                    type="number"
                    step="0.01"
                    className="border rounded p-1 w-20 text-right"
                    value={row.rate}
                    onChange={(e) => handleRateChange(index, parseFloat(e.target.value))}
                  />
                </td>
                <td className="px-4 py-2 font-semibold">₹{(row.views * row.rate).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
