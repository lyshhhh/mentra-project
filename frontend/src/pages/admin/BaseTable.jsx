export default function BaseTable({ title, subtitle, actions, head, rows }) {
  return (
    <section className="bg-card border border-borderSoft rounded-2xl p-6 mt-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold">{title}</h3>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
        <div className="flex gap-3">{actions}</div>
      </div>

      <table className="w-full text-sm">
        <thead className="border-b text-gray-500">
          <tr>{head.map(h => <th key={h} className="text-left py-2">{h}</th>)}</tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </section>
  );
}
