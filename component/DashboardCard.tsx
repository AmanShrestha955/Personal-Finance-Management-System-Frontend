export default function DashboardCard({
  title,
  amount,
  change,
  percentage,
}: {
  title: string;
  amount: string;
  change: string;
  percentage: string;
}) {
  return (
    <div
      className={`flex-1 flex flex-col gap-md bg-card-100 rounded-md p-lg shadow-effect-2 border border-card-200`}
    >
      <div className={`flex flex-row justify-between`}>
        <h2 className={`leading-[130%] text-heading3 text-text-1000`}>
          {title}
        </h2>
        <p
          className={`text-body ${percentage.includes("-") ? "text-red-600" : "text-green-600"}`}
        >
          {percentage}
        </p>
      </div>
      <div className={`flex flex-col gap-xs`}>
        <h1 className={`text-heading2 font-semibold text-text-1000`}>
          {amount}
        </h1>
        <h2
          className={`text-heading3 font-semibold ${change.includes("-") ? "text-red-600" : "text-green-600"}`}
        >
          {change}
        </h2>
      </div>
    </div>
  );
}
