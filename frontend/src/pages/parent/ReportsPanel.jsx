export default function ReportsPanel({ parentId }) {
  return (
    <div className="bg-white border rounded-2xl p-6">
      <h3 className="font-semibold mb-4">Download Reports</h3>

      <div className="flex gap-4">
        <a
          href={`/api/parent/${parentId}/report/pdf`}
          className="bg-primary text-white px-4 py-2 rounded"
        >
          Download PDF
        </a>

        <a
          href={`/api/parent/${parentId}/report/excel`}
          className="border px-4 py-2 rounded"
        >
          Download Excel
        </a>
      </div>
    </div>
  );
}
