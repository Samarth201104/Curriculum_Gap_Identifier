export default function ResultCard({ label, value, color }) {
  return (
    <div className={`${color} p-4 rounded shadow text-center`}>
      <p className="text-sm">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
